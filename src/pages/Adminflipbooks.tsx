import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import { Plus, Edit, Trash, Eye, EyeOff } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

interface Flipbook {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  pdf_url: string;
  page_images: string[]; // Array of image URLs
  page_location: string;
  display_order: number;
  published: boolean;
  created_at: string;
}

export default function AdminFlipbooksEnhanced() {
  const [flipbooks, setFlipbooks] = useState<Flipbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [converting, setConverting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    thumbnail_url: string;
    pdf_url: string;
    page_images: string[];
    page_location: string;
    display_order: number;
    published: boolean;
  }>({
    title: '',
    description: '',
    thumbnail_url: '',
    pdf_url: '',
    page_images: [],
    page_location: 'membership',
    display_order: 0,
    published: true,
  });

  useEffect(() => {
    checkAuth();
    fetchFlipbooks();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/admin/login');
    }
  };

  const fetchFlipbooks = async () => {
    try {
      const { data, error } = await supabase
        .from('flipbooks')
        .select('*')
        .order('page_location', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) throw error;
      setFlipbooks(data || []);
    } catch (error: any) {
      toast({
        title: 'Error loading flipbooks',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, type: 'pdf' | 'image'): Promise<string> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${type === 'pdf' ? 'pdfs' : 'images'}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('flipbooks')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('flipbooks')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const convertPDFToImages = async (pdfUrl: string): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        // Load PDF.js
        if (!(window as any)['pdfjs-dist/build/pdf']) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          await new Promise((res, rej) => {
            script.onload = () => res(true);
            script.onerror = () => rej(new Error('Failed to load PDF.js'));
            document.head.appendChild(script);
          });
          
          // Wait a bit for PDF.js to initialize
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        const pdfjsLib = (window as any)['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        const imageUrls: string[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2.0 });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          if (context) {
            await page.render({
              canvasContext: context,
              viewport: viewport
            }).promise;

            // Convert canvas to blob
            const blob = await new Promise<Blob>((resolve) => {
              canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.85);
            });

            // Upload to Supabase
            const fileName = `${Date.now()}_page_${i}.jpg`;
            const filePath = `page-images/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from('flipbooks')
              .upload(filePath, blob);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
              .from('flipbooks')
              .getPublicUrl(filePath);

            imageUrls.push(data.publicUrl);
          }
        }

        resolve(imageUrls);
      } catch (error: any) {
        reject(error);
      }
    });
  };

  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF file',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    setConverting(false);
    
    try {
      // Upload PDF
      const pdfUrl = await handleFileUpload(file, 'pdf');
      setFormData({ ...formData, pdf_url: pdfUrl });
      
      toast({
        title: 'PDF uploaded successfully',
        description: 'Now converting to images...',
      });

      // Convert to images
      setConverting(true);
      const imageUrls = await convertPDFToImages(pdfUrl);
      
      setFormData({ 
        ...formData, 
        pdf_url: pdfUrl,
        page_images: imageUrls 
      });

      toast({
        title: 'Conversion complete!',
        description: `Created ${imageUrls.length} page images`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setConverting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const url = await handleFileUpload(file, 'image');
      setFormData({ ...formData, thumbnail_url: url });
      toast({
        title: 'Thumbnail uploaded successfully',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.pdf_url || !formData.thumbnail_url || formData.page_images.length === 0) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields and ensure PDF is converted',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('flipbooks')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: 'Flipbook updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('flipbooks')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: 'Flipbook created successfully',
        });
      }

      resetForm();
      fetchFlipbooks();
    } catch (error: any) {
      toast({
        title: 'Error saving flipbook',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (flipbook: Flipbook) => {
    setFormData({
      title: flipbook.title,
      description: flipbook.description,
      thumbnail_url: flipbook.thumbnail_url,
      pdf_url: flipbook.pdf_url,
      page_images: flipbook.page_images || [],
      page_location: flipbook.page_location,
      display_order: flipbook.display_order,
      published: flipbook.published,
    });
    setEditingId(flipbook.id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('flipbooks')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      toast({
        title: 'Flipbook deleted successfully',
      });

      fetchFlipbooks();
    } catch (error: any) {
      toast({
        title: 'Error deleting flipbook',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('flipbooks')
        .update({ published: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: currentStatus ? 'Flipbook unpublished' : 'Flipbook published',
      });

      fetchFlipbooks();
    } catch (error: any) {
      toast({
        title: 'Error updating flipbook',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      thumbnail_url: '',
      pdf_url: '',
      page_images: [],
      page_location: 'membership',
      display_order: 0,
      published: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Flipbooks (Enhanced)</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? 'Cancel' : 'Add Flipbook'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Flipbook' : 'Create New Flipbook'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title*</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description*</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="page_location">Page Location*</Label>
                <select
                  id="page_location"
                  value={formData.page_location}
                  onChange={(e) => setFormData({ ...formData, page_location: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="membership">Membership</option>
                  <option value="archway">Archway</option>
                  <option value="mentoring">Mentoring</option>
                  <option value="about">About</option>
                </select>
              </div>

              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <Label htmlFor="pdf">PDF File*</Label>
                <div className="space-y-2">
                  <Input
                    id="pdf"
                    type="file"
                    accept="application/pdf"
                    onChange={handlePDFUpload}
                    disabled={uploading || converting}
                  />
                  {(uploading || converting) && (
                    <div className="text-sm text-blue-600">
                      {uploading && 'Uploading PDF...'}
                      {converting && 'Converting to images... This may take a minute.'}
                    </div>
                  )}
                  {formData.page_images.length > 0 && (
                    <div className="text-sm text-green-600">
                      ✓ Converted to {formData.page_images.length} page images
                    </div>
                  )}
                  {formData.pdf_url && (
                    <a href={formData.pdf_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                      View PDF
                    </a>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="thumbnail">Thumbnail Image*</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {formData.thumbnail_url && (
                    <img src={formData.thumbnail_url} alt="Thumbnail preview" className="w-20 h-20 object-cover rounded" />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="published"
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="published">Published</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={uploading || converting || formData.page_images.length === 0}>
                  {uploading || converting ? 'Processing...' : editingId ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {flipbooks.map((flipbook) => (
          <Card key={flipbook.id}>
            <CardContent className="flex items-center gap-4 p-4">
              <img
                src={flipbook.thumbnail_url}
                alt={flipbook.title}
                className="w-24 h-32 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{flipbook.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{flipbook.description}</p>
                <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                  <span className="bg-muted px-2 py-1 rounded">{flipbook.page_location}</span>
                  <span className="bg-muted px-2 py-1 rounded">Order: {flipbook.display_order}</span>
                  <span className="bg-muted px-2 py-1 rounded">{flipbook.page_images?.length || 0} pages</span>
                  <span className={`px-2 py-1 rounded ${flipbook.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {flipbook.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => togglePublished(flipbook.id, flipbook.published)}>
                  {flipbook.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleEdit(flipbook)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setDeleteId(flipbook.id)}>
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the flipbook and all its page images.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
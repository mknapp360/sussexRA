import { useState } from 'react';
import { RichTextEditor } from '../components/RichTextEditor';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { supabase } from '../lib/supabase';
import { useToast } from '../hooks/use-toast';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreatePostPage() {
  //HOOKS
  const { toast } = useToast();
  const navigate = useNavigate();

  //STATE
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [coverImage, setCoverImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle image file upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPEG, PNG, WebP, or GIF image',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Image must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploadingImage(true);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `blog-covers/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('blog-images') // Make sure this bucket exists in your Supabase project
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Failed to upload image');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);

      // Update state with the uploaded image URL
      setCoverImage(publicUrl);
      setImagePreview(publicUrl);

      toast({
        title: 'Image uploaded',
        description: 'Cover image uploaded successfully',
      });

    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setCoverImage('');
    setImagePreview(null);
  };

  const handleSave = async () => {
    // Validation checks
    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please add a title to your post',
        variant: 'destructive',
      });
      return;
    }

    if (!content.trim() || content === '<p></p>') {
      toast({
        title: 'Content required',
        description: 'Please add content to your post',
        variant: 'destructive',
      });
      return;
    }

    // CRITICAL: Don't allow save while image is uploading
    if (uploadingImage) {
      toast({
        title: 'Please wait',
        description: 'Image is still uploading. Please wait...',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Not authenticated',
          description: 'Please log in to create posts',
          variant: 'destructive',
        });
        return;
      }

      // Save to your posts table - adjust table name/columns as needed
      const { error } = await supabase
        .from('posts')
        .insert({
          title,
          content, // This is now rich HTML
          cover_image: coverImage || null, // This will now have the uploaded image URL
          author_id: user.id,
          published: false, // Draft by default
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Post saved!',
        description: 'Your post has been saved as a draft',
      });

      // Navigate to posts list or edit page
      navigate('/admin/posts');

    } catch (error: any) {
      console.error('Error saving post:', error);
      toast({
        title: 'Failed to save',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border sticky top-0 z-40 bg-background">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Create Post</h1>
                <p className="text-sm text-muted-foreground">Write your blog post or article</p>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <div className="flex items-center gap-2">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Cover preview" 
                        className="h-20 w-32 object-cover rounded border"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={handleRemoveImage}
                        disabled={uploadingImage}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border border-dashed rounded-md hover:bg-accent transition-colors">
                        {uploadingImage ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            <span className="text-sm">Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span className="text-sm">Upload Image</span>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  )}
                  
                  {/* Optional: Still allow URL input as alternative */}
                  <div className="text-sm text-muted-foreground">or</div>
                  <Input
                    value={coverImage}
                    onChange={(e) => {
                      setCoverImage(e.target.value);
                      if (e.target.value) {
                        setImagePreview(e.target.value);
                      }
                    }}
                    placeholder="Paste image URL"
                    className="w-64"
                    disabled={uploadingImage}
                  />
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleSave} 
              disabled={saving || uploadingImage}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : uploadingImage ? 'Uploading...' : 'Save Draft'}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <Input
              placeholder="Add Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-3xl font-bold border-none px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
            />
          </CardHeader>
          <CardContent>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing or type / for plugins"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Plus, Pencil, Trash2, FileText, FolderOpen, Upload, Link, Eye, EyeOff } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface DocCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  slug: string;
  display_order: number;
  published: boolean;
  created_at: string;
}

interface DocFile {
  id: string;
  category_id: string;
  code: string | null;
  title: string;
  description: string;
  download_url: string;
  display_order: number;
  published: boolean;
  created_at: string;
}

type Tab = 'categories' | 'documents';
type UploadMode = 'url' | 'upload';

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminDocForms() {
  const [activeTab, setActiveTab] = useState<Tab>('categories');

  // ── Category state ──────────────────────────────────────────────────────
  const [categories, setCategories] = useState<DocCategory[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [showCatForm, setShowCatForm] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catForm, setCatForm] = useState({
    title: '',
    description: '',
    icon: '📄',
    slug: '',
    display_order: '0',
    published: true,
  });

  // ── Document state ──────────────────────────────────────────────────────
  const [documents, setDocuments] = useState<DocFile[]>([]);
  const [docLoading, setDocLoading] = useState(true);
  const [showDocForm, setShowDocForm] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [filterCatId, setFilterCatId] = useState<string>('all');
  const [uploadMode, setUploadMode] = useState<UploadMode>('url');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [docForm, setDocForm] = useState({
    category_id: '',
    code: '',
    title: '',
    description: '',
    download_url: '',
    display_order: '0',
    published: true,
  });

  // ── Load data ────────────────────────────────────────────────────────────

  useEffect(() => {
    loadCategories();
    loadDocuments();
  }, []);

  async function loadCategories() {
    setCatLoading(true);
    try {
      const { data, error } = await supabase
        .from('doc_categories')
        .select('*')
        .order('display_order');
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setCatLoading(false);
    }
  }

  async function loadDocuments() {
    setDocLoading(true);
    try {
      const { data, error } = await supabase
        .from('doc_files')
        .select('*')
        .order('display_order');
      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      console.error('Error loading documents:', err);
    } finally {
      setDocLoading(false);
    }
  }

  // ── Category CRUD ────────────────────────────────────────────────────────

  async function handleCatSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        title: catForm.title,
        description: catForm.description,
        icon: catForm.icon,
        slug: catForm.slug,
        display_order: parseInt(catForm.display_order) || 0,
        published: catForm.published,
        updated_at: new Date().toISOString(),
      };

      if (editingCatId) {
        const { error } = await supabase.from('doc_categories').update(payload).eq('id', editingCatId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('doc_categories').insert([payload]);
        if (error) throw error;
      }
      resetCatForm();
      loadCategories();
    } catch (err: any) {
      console.error('Error saving category:', err);
      if (err.code === '23505') {
        alert('A category with this slug already exists.');
      } else {
        alert('Failed to save category.');
      }
    }
  }

  function editCategory(cat: DocCategory) {
    setCatForm({
      title: cat.title,
      description: cat.description,
      icon: cat.icon,
      slug: cat.slug,
      display_order: String(cat.display_order),
      published: cat.published,
    });
    setEditingCatId(cat.id);
    setShowCatForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteCategory(id: string) {
    if (!confirm('Delete this category? All documents within it will also be deleted.')) return;
    try {
      const { error } = await supabase.from('doc_categories').delete().eq('id', id);
      if (error) throw error;
      setCategories(prev => prev.filter(c => c.id !== id));
      setDocuments(prev => prev.filter(d => d.category_id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Failed to delete category.');
    }
  }

  async function toggleCatPublished(cat: DocCategory) {
    try {
      const { error } = await supabase
        .from('doc_categories')
        .update({ published: !cat.published, updated_at: new Date().toISOString() })
        .eq('id', cat.id);
      if (error) throw error;
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, published: !c.published } : c));
    } catch (err) {
      console.error('Error toggling category:', err);
    }
  }

  function resetCatForm() {
    setCatForm({ title: '', description: '', icon: '📄', slug: '', display_order: '0', published: true });
    setEditingCatId(null);
    setShowCatForm(false);
  }

  // Auto-generate slug from title
  function handleCatTitleChange(val: string) {
    setCatForm(prev => ({
      ...prev,
      title: val,
      slug: editingCatId ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    }));
  }

  // ── Document CRUD ────────────────────────────────────────────────────────

  async function handleDocSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!docForm.download_url) {
      alert('Please provide a download URL or upload a file.');
      return;
    }
    try {
      const payload = {
        category_id: docForm.category_id,
        code: docForm.code || null,
        title: docForm.title,
        description: docForm.description,
        download_url: docForm.download_url,
        display_order: parseInt(docForm.display_order) || 0,
        published: docForm.published,
        updated_at: new Date().toISOString(),
      };

      if (editingDocId) {
        const { error } = await supabase.from('doc_files').update(payload).eq('id', editingDocId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('doc_files').insert([payload]);
        if (error) throw error;
      }
      resetDocForm();
      loadDocuments();
    } catch (err) {
      console.error('Error saving document:', err);
      alert('Failed to save document.');
    }
  }

  function editDocument(doc: DocFile) {
    setDocForm({
      category_id: doc.category_id,
      code: doc.code || '',
      title: doc.title,
      description: doc.description,
      download_url: doc.download_url,
      display_order: String(doc.display_order),
      published: doc.published,
    });
    setEditingDocId(doc.id);
    setUploadMode('url');
    setShowDocForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteDocument(id: string) {
    if (!confirm('Delete this document?')) return;
    try {
      const { error } = await supabase.from('doc_files').delete().eq('id', id);
      if (error) throw error;
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error('Error deleting document:', err);
      alert('Failed to delete document.');
    }
  }

  async function toggleDocPublished(doc: DocFile) {
    try {
      const { error } = await supabase
        .from('doc_files')
        .update({ published: !doc.published, updated_at: new Date().toISOString() })
        .eq('id', doc.id);
      if (error) throw error;
      setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, published: !d.published } : d));
    } catch (err) {
      console.error('Error toggling document:', err);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const safeFilename = file.name.replace(/[^a-zA-Z0-9._%-]/g, '_');
      const filePath = `${Date.now()}_${safeFilename}`;

      const { error: uploadError } = await supabase.storage
        .from('docs')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('docs').getPublicUrl(filePath);
      setDocForm(prev => ({ ...prev, download_url: data.publicUrl }));
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload file.');
    } finally {
      setUploading(false);
    }
  }

  function resetDocForm() {
    setDocForm({
      category_id: categories[0]?.id || '',
      code: '',
      title: '',
      description: '',
      download_url: '',
      display_order: '0',
      published: true,
    });
    setEditingDocId(null);
    setShowDocForm(false);
    setUploadMode('url');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  // ── Derived data ─────────────────────────────────────────────────────────

  const filteredDocs = filterCatId === 'all'
    ? documents
    : documents.filter(d => d.category_id === filterCatId);

  function getCategoryName(id: string) {
    return categories.find(c => c.id === id)?.title || '—';
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border sticky top-0 z-30 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Doc Forms</h1>
              <p className="text-muted-foreground mt-1">Manage document categories and files</p>
            </div>
            <Button onClick={() => {
              if (activeTab === 'categories') {
                resetCatForm();
                setShowCatForm(true);
              } else {
                resetDocForm();
                setDocForm(prev => ({ ...prev, category_id: categories[0]?.id || '' }));
                setShowDocForm(true);
              }
            }}>
              <Plus className="w-4 h-4 mr-2" />
              {activeTab === 'categories' ? 'Add Category' : 'Add Document'}
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'categories'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              Categories ({categories.length})
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'documents'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <FileText className="w-4 h-4" />
              Documents ({documents.length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ═══════════════════ CATEGORIES TAB ═══════════════════ */}
        {activeTab === 'categories' && (
          <>
            {/* Category Form */}
            {showCatForm && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">
                      {editingCatId ? 'Edit Category' : 'Add New Category'}
                    </h2>
                    <Button variant="ghost" size="sm" onClick={resetCatForm}>Cancel</Button>
                  </div>
                  <form onSubmit={handleCatSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Title *</label>
                        <input
                          type="text"
                          value={catForm.title}
                          onChange={e => handleCatTitleChange(e.target.value)}
                          required
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="e.g., Almoner"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Icon (emoji) *</label>
                        <input
                          type="text"
                          value={catForm.icon}
                          onChange={e => setCatForm(p => ({ ...p, icon: e.target.value }))}
                          required
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="e.g., 🤝"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Description *</label>
                      <textarea
                        value={catForm.description}
                        onChange={e => setCatForm(p => ({ ...p, description: e.target.value }))}
                        required
                        rows={2}
                        className="w-full px-3 py-2 border rounded-md resize-none"
                        placeholder="Brief description shown on the card"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">
                          URL Slug * <span className="text-xs text-muted-foreground">(auto-generated from title)</span>
                        </label>
                        <input
                          type="text"
                          value={catForm.slug}
                          onChange={e => setCatForm(p => ({ ...p, slug: e.target.value }))}
                          required
                          className="w-full px-3 py-2 border rounded-md font-mono text-sm"
                          placeholder="e.g., almoner-docs"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Public URL will be: /docs-forms/{catForm.slug || '...'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Display Order</label>
                        <input
                          type="number"
                          value={catForm.display_order}
                          onChange={e => setCatForm(p => ({ ...p, display_order: e.target.value }))}
                          min="0"
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="cat-published"
                        checked={catForm.published}
                        onChange={e => setCatForm(p => ({ ...p, published: e.target.checked }))}
                        className="w-4 h-4"
                      />
                      <label htmlFor="cat-published" className="text-sm font-medium">Published (visible to public)</label>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button type="submit">{editingCatId ? 'Update Category' : 'Add Category'}</Button>
                      <Button type="button" variant="outline" onClick={resetCatForm}>Cancel</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Categories List */}
            {catLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading categories...</div>
            ) : categories.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">No categories yet</p>
                  <Button onClick={() => setShowCatForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />Add First Category
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(cat => (
                  <Card key={cat.id} className={!cat.published ? 'opacity-60' : ''}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <span className="text-3xl flex-shrink-0">{cat.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-lg">{cat.title}</h3>
                              {!cat.published && (
                                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">Draft</span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{cat.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                /docs-forms/{cat.slug}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {documents.filter(d => d.category_id === cat.id).length} docs
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button size="sm" variant="ghost" onClick={() => toggleCatPublished(cat)} title={cat.published ? 'Unpublish' : 'Publish'}>
                            {cat.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => editCategory(cat)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteCategory(cat.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* ═══════════════════ DOCUMENTS TAB ═══════════════════ */}
        {activeTab === 'documents' && (
          <>
            {/* Document Form */}
            {showDocForm && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">
                      {editingDocId ? 'Edit Document' : 'Add New Document'}
                    </h2>
                    <Button variant="ghost" size="sm" onClick={resetDocForm}>Cancel</Button>
                  </div>
                  <form onSubmit={handleDocSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <select
                        value={docForm.category_id}
                        onChange={e => setDocForm(p => ({ ...p, category_id: e.target.value }))}
                        required
                        className="w-full px-3 py-2 border rounded-md bg-background"
                      >
                        <option value="">— Select a category —</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.icon} {cat.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Document Code</label>
                        <input
                          type="text"
                          value={docForm.code}
                          onChange={e => setDocForm(p => ({ ...p, code: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="e.g., RA-6a"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Title *</label>
                        <input
                          type="text"
                          value={docForm.title}
                          onChange={e => setDocForm(p => ({ ...p, title: e.target.value }))}
                          required
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="e.g., Almoners Duties"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Description *</label>
                      <textarea
                        value={docForm.description}
                        onChange={e => setDocForm(p => ({ ...p, description: e.target.value }))}
                        required
                        rows={2}
                        className="w-full px-3 py-2 border rounded-md resize-none"
                        placeholder="Brief description of this document"
                      />
                    </div>

                    {/* File / URL */}
                    <div>
                      <label className="block text-sm font-medium mb-2">File *</label>
                      <div className="flex gap-2 mb-3">
                        <button
                          type="button"
                          onClick={() => setUploadMode('url')}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm border transition-colors ${
                            uploadMode === 'url' ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'
                          }`}
                        >
                          <Link className="w-3.5 h-3.5" /> Paste URL
                        </button>
                        <button
                          type="button"
                          onClick={() => setUploadMode('upload')}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm border transition-colors ${
                            uploadMode === 'upload' ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5" /> Upload File
                        </button>
                      </div>

                      {uploadMode === 'url' ? (
                        <input
                          type="url"
                          value={docForm.download_url}
                          onChange={e => setDocForm(p => ({ ...p, download_url: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-md font-mono text-sm"
                          placeholder="https://..."
                        />
                      ) : (
                        <div className="space-y-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            disabled={uploading}
                          />
                          {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
                          {docForm.download_url && (
                            <p className="text-xs text-green-600 break-all">
                              ✓ Uploaded: {docForm.download_url}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Display Order</label>
                        <input
                          type="number"
                          value={docForm.display_order}
                          onChange={e => setDocForm(p => ({ ...p, display_order: e.target.value }))}
                          min="0"
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div className="flex items-end pb-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="doc-published"
                            checked={docForm.published}
                            onChange={e => setDocForm(p => ({ ...p, published: e.target.checked }))}
                            className="w-4 h-4"
                          />
                          <label htmlFor="doc-published" className="text-sm font-medium">Published</label>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button type="submit" disabled={uploading}>
                        {editingDocId ? 'Update Document' : 'Add Document'}
                      </Button>
                      <Button type="button" variant="outline" onClick={resetDocForm}>Cancel</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Filter by category */}
            <div className="flex items-center gap-3 mb-4">
              <label className="text-sm font-medium text-muted-foreground">Filter:</label>
              <select
                value={filterCatId}
                onChange={e => setFilterCatId(e.target.value)}
                className="px-3 py-1.5 border rounded-md text-sm bg-background"
              >
                <option value="all">All categories ({documents.length})</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.title} ({documents.filter(d => d.category_id === cat.id).length})
                  </option>
                ))}
              </select>
            </div>

            {/* Documents List */}
            {docLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading documents...</div>
            ) : filteredDocs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">No documents found</p>
                  <Button onClick={() => setShowDocForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />Add First Document
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredDocs.map(doc => (
                  <Card key={doc.id} className={!doc.published ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="bg-gradient-to-br from-tpblue to-tpgold rounded p-2 flex-shrink-0">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              {doc.code && (
                                <span className="text-xs font-mono font-semibold bg-muted px-2 py-0.5 rounded">
                                  {doc.code}
                                </span>
                              )}
                              <span className="font-medium">{doc.title}</span>
                              {!doc.published && (
                                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">Draft</span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{doc.description}</p>
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              <span className="text-xs text-muted-foreground">
                                {getCategoryName(doc.category_id)}
                              </span>
                              <a
                                href={doc.download_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-tpblue hover:underline truncate max-w-xs"
                                onClick={e => e.stopPropagation()}
                              >
                                {doc.download_url.split('/').pop()?.substring(0, 50)}
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button size="sm" variant="ghost" onClick={() => toggleDocPublished(doc)} title={doc.published ? 'Unpublish' : 'Publish'}>
                            {doc.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => editDocument(doc)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteDocument(doc.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

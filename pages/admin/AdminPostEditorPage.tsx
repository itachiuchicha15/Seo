
import React, { useState, FormEvent, useEffect, useCallback } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { ArrowLeft, UploadCloud, Link as LinkIcon, Loader, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { BlogPost } from '../../types';
import Skeleton from '../../components/Skeleton';

const AdminPostEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { slug: postSlug } = useParams<{ slug: string }>();
  const isEditing = !!postSlug;

  const [initialState, setInitialState] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // Post fields state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAltText, setImageAltText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [categories, setCategories] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoMetaDescription, setSeoMetaDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const saveInitialState = useCallback((data: BlogPost) => {
    const state = {
      title: data.title || '',
      slug: data.slug || '',
      excerpt: data.excerpt || '',
      imageUrl: data.image?.url || '',
      imageAltText: data.image?.alt_text || '',
      content: data.content || '',
      tags: data.tags?.join(', ') || '',
      categories: data.categories?.join(', ') || '',
      date: data.date || '',
      seoTitle: data.seo?.title || '',
      seoMetaDescription: data.seo?.meta_description || '',
    };
    setInitialState(state);
  }, []);
  
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      const fetchPost = async () => {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', postSlug)
          .single();
        
        if (error) {
          setError('Failed to fetch post data.');
          console.error(error);
        } else if (data) {
          const postData = data as BlogPost;
          setTitle(postData.title);
          setSlug(postData.slug);
          setExcerpt(postData.excerpt);
          setImageUrl(postData.image?.url || '');
          setImagePreview(postData.image?.url || '');
          setImageAltText(postData.image?.alt_text || '');
          setContent(postData.content);
          setTags(postData.tags?.join(', ') || '');
          setCategories(postData.categories?.join(', ') || '');
          setDate(postData.date);
          setSeoTitle(postData.seo?.title || '');
          setSeoMetaDescription(postData.seo?.meta_description || '');
          saveInitialState(postData);
        }
        setLoading(false);
      };
      fetchPost();
    }
  }, [postSlug, isEditing, saveInitialState]);
  
  // Check for unsaved changes
  useEffect(() => {
    const currentState = { title, slug, excerpt, imageUrl, imageAltText, content, tags, categories, date, seoTitle, seoMetaDescription };
    const dirty = JSON.stringify(currentState) !== JSON.stringify({ ...initialState, imageUrl: (initialState as any).imageUrl || '' });
    setIsDirty(dirty || !!imageFile);
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    
  }, [title, slug, excerpt, imageUrl, imageAltText, content, tags, categories, date, seoTitle, seoMetaDescription, imageFile, initialState, isDirty]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isEditing) {
      setSlug(newTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
    if (!imageAltText) {
      setImageAltText(newTitle); // Auto-fill alt text from title if empty
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setImageFile(file);
        setImageUrl('');
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (slug !== postSlug) {
      const { data } = await supabase.from('posts').select('slug').eq('slug', slug).single();
      if (data) {
          setError('This URL slug is already in use. Please choose another one.');
          setLoading(false);
          return;
      }
    }

    let finalImageUrl = imageUrl;

    if (imageFile) {
        const filePath = `public/${Date.now()}_${imageFile.name.replace(/\s+/g, '_')}`;
        const { error: uploadError } = await supabase.storage.from('blog_images').upload(filePath, imageFile);
        if (uploadError) {
            setError(`Image upload failed: ${uploadError.message}`);
            setLoading(false);
            return;
        }
        const { data } = supabase.storage.from('blog_images').getPublicUrl(filePath);
        finalImageUrl = data.publicUrl;
    }

    if (!finalImageUrl) {
        setError('An image is required. Please upload one or provide a URL.');
        setLoading(false);
        return;
    }

    const commonData = {
        title,
        slug,
        excerpt,
        image: { url: finalImageUrl, alt_text: imageAltText || title },
        content,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        categories: categories.split(',').map(cat => cat.trim()).filter(Boolean),
        date,
        author: 'Eswarapandi V',
        seo: { title: seoTitle || null, meta_description: seoMetaDescription || null },
    };
    
    let response;
    if (isEditing) {
        const updateData = { ...commonData, updated_at: new Date().toISOString() };
        response = await supabase.from('posts').update(updateData).eq('slug', postSlug);
    } else {
        const insertData = { ...commonData, metrics: { rank: 'New', clicks: 0, impressions: 0 } };
        response = await supabase.from('posts').insert([insertData]);
    }

    if (response.error) {
        setError(`Failed to save post: ${response.error.message}`);
    } else {
        setIsDirty(false);
        setTimeout(() => {
             alert(`Post ${isEditing ? 'updated' : 'saved'} successfully!`);
             navigate('/admin/dashboard');
        }, 100);
    }
    setLoading(false);
  };
  
  if (isEditing && loading && !error) {
     return (
        <div className="min-h-screen bg-light">
             <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-6 rounded-md" />
                      <Skeleton className="h-4 w-32" />
                  </div>
                </div>
            </header>
            <main className="py-10">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <Skeleton className="h-10 w-64 mb-8" />
                    <div className="bg-white p-8 rounded-lg shadow border border-gray-200 space-y-8">
                         <div className="space-y-6">
                             <Skeleton className="h-6 w-40 mb-2" />
                             <div>
                                 <Skeleton className="h-4 w-24 mb-1" />
                                 <Skeleton className="h-10 w-full" />
                             </div>
                              <div>
                                 <Skeleton className="h-4 w-24 mb-1" />
                                 <Skeleton className="h-10 w-full" />
                             </div>
                             <div>
                                 <Skeleton className="h-4 w-24 mb-1" />
                                 <Skeleton className="h-10 w-full" />
                             </div>
                         </div>
                          <div className="pt-6 border-t space-y-4">
                             <Skeleton className="h-6 w-40 mb-2" />
                             <Skeleton className="h-40 w-full rounded-lg" />
                          </div>
                         <div className="pt-6 border-t space-y-4">
                             <Skeleton className="h-6 w-40 mb-2" />
                             <div>
                                 <Skeleton className="h-4 w-24 mb-1" />
                                 <Skeleton className="h-24 w-full" />
                             </div>
                              <div>
                                 <Skeleton className="h-4 w-24 mb-1" />
                                 <Skeleton className="h-64 w-full" />
                             </div>
                         </div>
                    </div>
                </div>
            </main>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-light">
       <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-dark font-semibold transition-colors">
              <ArrowLeft size={20} />
              Back to Dashboard
          </Link>
        </div>
      </header>
      <main className="py-10">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-dark mb-8">{isEditing ? 'Edit Post' : 'Add New Post'}</h1>
            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow border border-gray-200">
                <fieldset className="space-y-6">
                  <legend className="text-xl font-semibold text-dark">Core Content</legend>
                  <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                      <input type="text" name="title" id="title" required value={title} onChange={handleTitleChange} className="mt-1 block w-full shadow-sm py-2 px-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                  </div>
                  <div>
                      <label htmlFor="slug" className="block text-sm font-medium text-gray-700">URL Slug</label>
                      <input type="text" name="slug" id="slug" required value={slug} onChange={e => setSlug(e.target.value)} className={`mt-1 block w-full shadow-sm py-2 px-3 border border-gray-300 rounded-md`} />
                  </div>
                  <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">Publish Date</label>
                      <input type="date" name="date" id="date" required value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full shadow-sm py-2 px-3 border border-gray-300 rounded-md" />
                  </div>
                </fieldset>
                
                <fieldset className="space-y-6 pt-6 border-t">
                    <legend className="text-xl font-semibold text-dark">Media</legend>
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Featured Image</label>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="image-upload" className="w-full cursor-pointer bg-light border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors hover:border-primary">
                                        <UploadCloud className="mx-auto h-10 w-10 text-muted"/>
                                        <span className="mt-2 block text-sm font-semibold text-secondary">Click to upload an image</span>
                                        <span className="mt-1 block text-xs text-muted">PNG, JPG, GIF up to 10MB</span>
                                    </label>
                                    <input id="image-upload" name="image-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LinkIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input type="text" value={imageUrl} onChange={e => { setImageUrl(e.target.value); setImageFile(null); setImagePreview(e.target.value); }} placeholder="Or paste an image URL" className="pl-10 block w-full shadow-sm py-2 px-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                                </div>
                            </div>
                             {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-auto object-cover rounded-lg border border-gray-200 shadow-sm" />
                             ) : (
                                <div className="w-full h-48 bg-light rounded-lg flex items-center justify-center border border-gray-200">
                                    <ImageIcon className="h-12 w-12 text-gray-300" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="imageAltText" className="block text-sm font-medium text-gray-700">Image Alt Text</label>
                        <input type="text" name="imageAltText" id="imageAltText" required value={imageAltText} onChange={e => setImageAltText(e.target.value)} className="mt-1 block w-full shadow-sm py-2 px-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="A concise description of the image" />
                    </div>
                </fieldset>

                <fieldset className="space-y-6 pt-6 border-t">
                    <legend className="text-xl font-semibold text-dark">Content & Organization</legend>
                    <div>
                        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">Excerpt</label>
                        <textarea name="excerpt" id="excerpt" required value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3} className="mt-1 block w-full shadow-sm py-2 px-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"></textarea>
                    </div>
                    <div>
                        <label htmlFor="categories" className="block text-sm font-medium text-gray-700">Categories (comma-separated)</label>
                        <input type="text" name="categories" id="categories" value={categories} onChange={e => setCategories(e.target.value)} className="mt-1 block w-full shadow-sm py-2 px-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                        <input type="text" name="tags" id="tags" required value={tags} onChange={e => setTags(e.target.value)} className="mt-1 block w-full shadow-sm py-2 px-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content (HTML)</label>
                        <textarea name="content" id="content" required value={content} onChange={e => setContent(e.target.value)} rows={20} className="mt-1 block w-full shadow-sm py-2 px-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary font-mono text-sm"></textarea>
                    </div>
                </fieldset>

                <fieldset className="space-y-6 pt-6 border-t">
                    <legend className="text-xl font-semibold text-dark">SEO Settings</legend>
                    <p className="text-sm text-muted -mt-4">Leave blank to use the post title and excerpt by default.</p>
                     <div>
                        <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700">SEO Title</label>
                        <input type="text" name="seoTitle" id="seoTitle" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} className="mt-1 block w-full shadow-sm py-2 px-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <label htmlFor="seoMetaDescription" className="block text-sm font-medium text-gray-700">Meta Description</label>
                        <textarea name="seoMetaDescription" id="seoMetaDescription" value={seoMetaDescription} onChange={e => setSeoMetaDescription(e.target.value)} rows={3} className="mt-1 block w-full shadow-sm py-2 px-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"></textarea>
                    </div>
                </fieldset>

                {error && <p className="text-sm text-red-600">{error}</p>}
                
                <div className="flex justify-end pt-5 border-t">
                    <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-primary hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-60">
                        {loading && <Loader className="animate-spin h-5 w-5" />}
                        {loading ? 'Saving...' : 'Save Post'}
                    </button>
                </div>
            </form>
        </div>
      </main>
    </div>
  );
};

export default AdminPostEditorPage;

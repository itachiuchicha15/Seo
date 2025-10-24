import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AdminPostEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    // Auto-generate slug from title
    setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // In a real app, you would save this data to your backend (e.g., Supabase)
    const newPost = {
        title,
        slug,
        excerpt,
        imageUrl,
        content,
        tags: tags.split(',').map(tag => tag.trim()),
        date: new Date().toISOString().split('T')[0], // Set current date
        author: 'Alex Doe', // Hardcoded for now
        metrics: { rank: 'New', clicks: 0, impressions: 0 },
    };
    console.log('New Post Data:', newPost);
    alert('Post has been "saved"! Check the console for the data. This would be sent to a backend in a real application.');
    navigate('/admin/dashboard');
  };

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
            <h1 className="text-3xl font-bold text-dark mb-8">Add New Post</h1>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow border border-gray-200">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" name="title" id="title" required value={title} onChange={handleTitleChange} className="mt-1 block w-full shadow-sm py-2 px-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                </div>
                <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700">URL Slug</label>
                    <input type="text" name="slug" id="slug" required value={slug} onChange={e => setSlug(e.target.value)} className="mt-1 block w-full shadow-sm py-2 px-3 border border-gray-300 rounded-md bg-gray-100" />
                </div>
                 <div>
                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">Excerpt</label>
                    <textarea name="excerpt" id="excerpt" required value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3} className="mt-1 block w-full shadow-sm py-2 px-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"></textarea>
                </div>
                <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input type="text" name="imageUrl" id="imageUrl" required value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="mt-1 block w-full shadow-sm py-2 px-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="https://picsum.photos/seed/example/800/400" />
                </div>
                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                    <input type="text" name="tags" id="tags" required value={tags} onChange={e => setTags(e.target.value)} className="mt-1 block w-full shadow-sm py-2 px-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                </div>
                 <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content (HTML)</label>
                    <textarea name="content" id="content" required value={content} onChange={e => setContent(e.target.value)} rows={15} className="mt-1 block w-full shadow-sm py-2 px-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary font-mono"></textarea>
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-primary hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        Save Post
                    </button>
                </div>
            </form>
        </div>
      </main>
    </div>
  );
};

export default AdminPostEditorPage;

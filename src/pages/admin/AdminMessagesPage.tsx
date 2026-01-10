
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ContactMessage } from '../../types';
import { supabase } from '../../lib/supabaseClient';
import { LogOut, Trash2, Mail, MailOpen, ArrowLeft, MessageSquare } from 'lucide-react';
import Skeleton from '../../components/Skeleton';

const AdminMessagesPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError('Could not fetch messages.');
        console.error(error);
      } else {
        setMessages(data as ContactMessage[]);
      }
      setLoading(false);
    };

    fetchMessages();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) {
        alert('Error deleting message: ' + error.message);
      } else {
        setMessages(messages.filter(m => m.id !== id));
      }
    }
  };
  
  const handleToggleRead = async (id: number, currentStatus: boolean) => {
    const { data, error } = await supabase
        .from('contact_messages')
        .update({ is_read: !currentStatus })
        .eq('id', id)
        .select()
        .single();
    
    if (error) {
        alert('Error updating message status: ' + error.message);
    } else {
        setMessages(messages.map(m => m.id === id ? data as ContactMessage : m));
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-dark">Contact Messages</h1>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="mb-8">
                <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-dark font-semibold transition-colors">
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </Link>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
              {error && <p className="p-6 text-red-500 text-center">{error}</p>}
              
              {!loading && !error && messages.length === 0 && (
                   <div className="p-10 text-center flex flex-col items-center justify-center">
                      <MessageSquare className="h-12 w-12 text-muted mb-4" />
                      <h3 className="text-lg font-medium text-dark">No messages yet</h3>
                      <p className="text-muted mt-1">Messages from the contact form will appear here.</p>
                   </div>
              )}
              
              {(loading || (!error && messages.length > 0)) && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                            Received
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                            Sender
                        </th>
                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                            Message
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                             [...Array(5)].map((_, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Skeleton className="h-4 w-32" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Skeleton className="h-5 w-24 mb-1" />
                                        <Skeleton className="h-3 w-32" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-4 w-full max-w-md mb-1" />
                                        <Skeleton className="h-4 w-2/3 max-w-sm" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-4">
                                            <Skeleton className="h-5 w-5 rounded-md" />
                                            <Skeleton className="h-5 w-5 rounded-md" />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            messages.map((msg) => (
                            <tr key={msg.id} className={`${msg.is_read ? 'bg-white' : 'bg-primary/5'}`}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                                    {new Date(msg.created_at).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`text-sm font-medium ${msg.is_read ? 'text-dark' : 'text-dark font-bold'}`}>{msg.name}</div>
                                    <div className="text-sm text-muted">{msg.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-secondary max-w-lg whitespace-pre-wrap">{msg.message}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end gap-4">
                                    <button onClick={() => handleToggleRead(msg.id, msg.is_read)} title={msg.is_read ? "Mark as unread" : "Mark as read"} className="text-muted hover:text-primary transition-colors">
                                        {msg.is_read ? <MailOpen size={18} /> : <Mail size={18} />}
                                    </button>
                                    <button onClick={() => handleDelete(msg.id)} title="Delete Message" className="text-red-600 hover:text-red-900 transition-colors"><Trash2 size={18} /></button>
                                </div>
                                </td>
                            </tr>
                            ))
                        )}
                    </tbody>
                    </table>
                </div>
              )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default AdminMessagesPage;

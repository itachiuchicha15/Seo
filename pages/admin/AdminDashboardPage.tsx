
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BlogPost, ChallengeMilestone, ChallengePhase } from '../../types';
import { supabase } from '../../lib/supabaseClient';
import { PlusCircle, Edit, Trash2, LogOut, Inbox, FileText, CheckCircle, Circle, Layers } from 'lucide-react';
import Skeleton from '../../components/Skeleton';

const AdminDashboardPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [milestones, setMilestones] = useState<ChallengeMilestone[]>([]);
  const [phases, setPhases] = useState<ChallengePhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
        const postsReq = supabase
            .from('posts')
            .select('*')
            .order('date', { ascending: false });

        const milestonesReq = supabase
            .from('challenge_milestones')
            .select('*')
            .order('display_order', { ascending: true });
            
        const phasesReq = supabase
            .from('challenge_phases')
            .select('*')
            .order('display_order', { ascending: true });

        const [postsRes, milestonesRes, phasesRes] = await Promise.all([postsReq, milestonesReq, phasesReq]);

        if (postsRes.error) {
            setError('Could not fetch posts.');
            console.error(postsRes.error);
        } else {
            setPosts(postsRes.data as BlogPost[]);
        }

        if (milestonesRes.error) {
             // Suppress missing table logs
             if (milestonesRes.error.code !== 'PGRST205' && milestonesRes.error.code !== '42P01') {
                 console.warn("Milestones table fetch error:", milestonesRes.error.message);
             }
        } else {
            setMilestones(milestonesRes.data as ChallengeMilestone[]);
        }
        
        if (phasesRes.error) {
             // Suppress missing table logs
             if (phasesRes.error.code !== 'PGRST205' && phasesRes.error.code !== '42P01') {
                console.warn("Phases table fetch error:", phasesRes.error.message);
             }
        } else {
            setPhases(phasesRes.data as ChallengePhase[]);
        }

        setLoading(false);
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
        const { error } = await supabase.from('posts').delete().eq('id', id);
        if (error) {
            alert('Error deleting post: ' + error.message);
        } else {
            setPosts(posts.filter(p => p.id !== id));
        }
    }
  };

  const handleToggleMilestone = async (id: number, currentStatus: boolean) => {
      const { error } = await supabase
        .from('challenge_milestones')
        .update({ is_completed: !currentStatus })
        .eq('id', id);
      
      if (error) {
          alert('Error updating milestone: ' + error.message);
      } else {
          setMilestones(milestones.map(m => m.id === id ? { ...m, is_completed: !currentStatus } : m));
      }
  };
  
  const handleTogglePhase = async (id: number, currentStatus: boolean) => {
      const { error } = await supabase
        .from('challenge_phases')
        .update({ is_completed: !currentStatus })
        .eq('id', id);
      
      if (error) {
          alert('Error updating phase: ' + error.message);
      } else {
          setPhases(phases.map(p => p.id === id ? { ...p, is_completed: !currentStatus } : p));
      }
  };

  return (
    <div className="min-h-screen bg-light">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-dark">Admin Dashboard</h1>
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
            <div className="mb-8 flex justify-end gap-4">
                <Link
                  to="/admin/messages"
                  className="inline-flex items-center gap-2 justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-secondary bg-white hover:bg-light transition-colors"
                >
                  <Inbox size={20} />
                  View Messages
                </Link>
                <Link
                  to="/admin/new-post"
                  className="inline-flex items-center gap-2 justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:brightness-95"
                >
                  <PlusCircle size={20} />
                  Add New Post
                </Link>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Challenge Milestones Section */}
                <div>
                    <h2 className="text-xl font-bold text-dark mb-4">Milestones (Home Page)</h2>
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200 p-6 h-full">
                        {loading ? <Skeleton className="h-24 w-full" /> : (
                            <div className="space-y-3">
                                {milestones.map((milestone) => (
                                    <div key={milestone.id} className="flex items-center justify-between p-3 bg-light rounded-lg border border-gray-200">
                                        <span className={`font-medium text-sm ${milestone.is_completed ? 'text-green-700' : 'text-secondary'}`}>
                                            {milestone.display_order}. {milestone.title}
                                        </span>
                                        <button 
                                            onClick={() => handleToggleMilestone(milestone.id, milestone.is_completed)}
                                            className={`p-1.5 rounded-full transition-colors ${milestone.is_completed ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-200 text-gray-400 hover:bg-gray-300'}`}
                                            title={milestone.is_completed ? "Mark as incomplete" : "Mark as complete"}
                                        >
                                            {milestone.is_completed ? <CheckCircle size={18} /> : <Circle size={18} />}
                                        </button>
                                    </div>
                                ))}
                                {milestones.length === 0 && <p className="text-muted">No milestones found.</p>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Challenge Phases Section */}
                <div>
                    <h2 className="text-xl font-bold text-dark mb-4">Process Sections (Challenge Page)</h2>
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200 p-6 h-full">
                         {loading ? <Skeleton className="h-24 w-full" /> : (
                            <div className="space-y-3">
                                {phases.map((phase) => (
                                    <div key={phase.id} className="flex items-center justify-between p-3 bg-light rounded-lg border border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <Layers className="h-4 w-4 text-muted" />
                                            <span className={`font-medium text-sm ${phase.is_completed ? 'text-green-700' : 'text-secondary'}`}>
                                                {phase.title}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => handleTogglePhase(phase.id, phase.is_completed)}
                                            className={`p-1.5 rounded-full transition-colors ${phase.is_completed ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-200 text-gray-400 hover:bg-gray-300'}`}
                                            title={phase.is_completed ? "Mark as incomplete" : "Mark as complete"}
                                        >
                                            {phase.is_completed ? <CheckCircle size={18} /> : <Circle size={18} />}
                                        </button>
                                    </div>
                                ))}
                                {phases.length === 0 && <p className="text-muted">No phases found.</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold text-dark mb-4">Blog Posts</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
              {error && <p className="p-6 text-red-500 text-center">{error}</p>}
              
              {!loading && !error && posts.length === 0 && (
                  <div className="p-10 text-center flex flex-col items-center justify-center">
                      <FileText className="h-12 w-12 text-muted mb-4" />
                      <h3 className="text-lg font-medium text-dark">No posts available</h3>
                      <p className="text-muted mt-1">Get started by creating your first blog post.</p>
                  </div>
              )}

              {(loading || (!error && posts.length > 0)) && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                        Slug
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
                                    <Skeleton className="h-5 w-48" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Skeleton className="h-4 w-24" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Skeleton className="h-4 w-32" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-4">
                                        <Skeleton className="h-5 w-5 rounded-md" />
                                        <Skeleton className="h-5 w-5 rounded-md" />
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        posts.map((post) => (
                        <tr key={post.id}>
                            <td className="px-6 py-4 text-sm font-medium text-dark whitespace-normal break-words max-w-xs sm:max-w-md">
                                {post.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-muted">{post.date}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted font-mono">
                            /blog/{post.slug}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-4">
                                <Link to={`/admin/edit/${post.slug}`} className="text-primary hover:text-dark transition-colors"><Edit size={18} /></Link>
                                <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-900 transition-colors"><Trash2 size={18} /></button>
                            </div>
                            </td>
                        </tr>
                        ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;

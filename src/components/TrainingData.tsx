import { useState, useEffect } from 'react';
import { getSupabase } from '../utils/supabaseClient';
import { Trash2, Plus, Sparkles, RefreshCw, FileText, Database } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  created_at: string;
}

interface TrainingDataProps {
  onRegenerateDNA: () => void;
}

export default function TrainingData({ onRegenerateDNA }: TrainingDataProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/posts`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPost = async () => {
    if (!newPostContent.trim()) return;
    setIsAdding(true);
    try {
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ content: newPostContent })
      });

      if (response.ok) {
        const data = await response.json();
        setPosts([data.post, ...posts]);
        setNewPostContent('');
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to add post');
      }
    } catch (error) {
      console.error('Failed to add post:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post from your training data?')) return;
    
    try {
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        setPosts(posts.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-[#00bb7f] animate-spin" />
        <p className="text-[14px] font-bold text-slate-500">Loading your training data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up w-full max-w-[900px] mx-auto pb-20 mt-4">
      {/* Add New Training Data */}
      <div className="bg-white rounded-[24px] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-full bg-[#00bb7f]/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#00bb7f]" />
          </div>
          <div>
            <h2 className="text-[19px] font-extrabold text-slate-900">
              Add New Training Data
            </h2>
            <p className="text-[13px] font-medium text-slate-500 mt-0.5">
              Paste a recent high-performing post to teach the AI your evolving style.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Paste your best LinkedIn post here... (Aim for at least 50 characters)"
            className="w-full min-h-[140px] max-h-[400px] p-5 rounded-[16px] bg-slate-50 border border-slate-200 text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00bb7f]/20 focus:border-[#00bb7f]/50 resize-y transition-all font-medium leading-[1.7]"
          />
        </div>
        
        <div className="flex justify-end mt-5">
          <button
            onClick={handleAddPost}
            disabled={isAdding || newPostContent.trim().length < 50}
            className={`inline-flex items-center px-6 py-3.5 rounded-[14px] text-[14px] font-bold transition-all shadow-sm ${
              isAdding || newPostContent.trim().length < 50
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-[#00bb7f] hover:bg-[#007956] text-white cursor-pointer shadow-[0_4px_15px_rgba(0,187,127,0.25)] hover:-translate-y-0.5'
            }`}
          >
            {isAdding ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Save Post to Database
          </button>
        </div>
      </div>

      {/* Saved Posts & Regeneration */}
      <div className="bg-white rounded-[24px] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 border-b border-slate-100 pb-8">
          <div>
            <h2 className="text-[19px] font-extrabold text-slate-900 flex items-center gap-2">
              Saved Posts ({posts.length})
            </h2>
            <p className="text-[13px] font-medium text-slate-500 mt-1 max-w-lg leading-relaxed">
              The AI uses these posts to construct your DNA. Delete outdated posts and add new ones to improve accuracy, then hit Regenerate!
            </p>
          </div>
          <button
            onClick={onRegenerateDNA}
            disabled={posts.length === 0}
            className={`flex-shrink-0 inline-flex items-center justify-center py-3.5 px-6 rounded-[14px] font-bold text-[14px] transition-all shadow-md cursor-pointer ${
              posts.length === 0
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5'
            }`}
          >
            <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
            Regenerate DNA
          </button>
        </div>

        <div className="space-y-5">
          {posts.map((post, idx) => (
            <div key={post.id} className="p-6 rounded-[16px] bg-white border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative group transition-all hover:border-[#00bb7f]/30 hover:shadow-[0_8px_30px_rgba(0,187,127,0.05)]">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-[#00bb7f] uppercase tracking-widest bg-[#00bb7f]/10 px-2.5 py-1 rounded-md border border-[#00bb7f]/20">
                  Post #{posts.length - idx}
                </span>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Delete this post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[14.5px] text-slate-700 leading-[1.8] font-medium whitespace-pre-wrap">{post.content}</p>
            </div>
          ))}
          
          {posts.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-[16px] border border-dashed border-slate-200">
              <Database className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-[14px] font-bold text-slate-500">No saved posts found.</p>
              <p className="text-[13px] font-medium text-slate-400 mt-1">Add some posts above to train your AI persona!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

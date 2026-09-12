import { useState, useEffect } from 'react';
import { getSupabase } from '../utils/supabaseClient';
import { Trash2, Plus, Sparkles, RefreshCw, FileText } from 'lucide-react';

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
    return <div className="p-8 text-center text-slate-500">Loading training data...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-500" />
          Add New Training Data
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          Paste a recent high-performing post to teach the AI your evolving style.
        </p>
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Paste your LinkedIn post here..."
          className="glass-input w-full min-h-[120px] max-h-[300px] p-3.5 rounded-xl text-sm placeholder-slate-400 focus:outline-none resize-y mb-3"
        />
        <div className="flex justify-end">
          <button
            onClick={handleAddPost}
            disabled={isAdding || newPostContent.trim().length < 50}
            className={`inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
              isAdding || newPostContent.trim().length < 50
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
            }`}
          >
            {isAdding ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Save Post to Database
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Saved Posts ({posts.length})
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              The AI uses these posts to determine your DNA. Delete outdated posts and add new ones to improve accuracy.
            </p>
          </div>
          <button
            onClick={onRegenerateDNA}
            disabled={posts.length === 0}
            className={`inline-flex items-center justify-center py-2.5 px-5 rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer ${
              posts.length === 0
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
            Regenerate DNA
          </button>
        </div>

        <div className="space-y-4">
          {posts.map((post, idx) => (
            <div key={post.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 relative group">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-500/5 px-2 py-0.5 rounded-md border border-indigo-500/10">
                  Post #{posts.length - idx}
                </span>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-md hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Delete this post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{post.content}</p>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No saved posts found. Add some posts above to train your AI persona!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

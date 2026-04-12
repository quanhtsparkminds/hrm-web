import React, { useState } from 'react';
import {
  MessageSquare,
  Heart,
  Share2,
  MoreHorizontal,
  Plus,
  Send,
  Reply,
  Calendar,
  Loader2,
  Paperclip,
  X,
  FileIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { TUserProfile } from '@/services/AuthApi';
import { cn } from '@/lib/utils';
import { FeedApi } from '@/services/FeedApi/FeedApi';
import { TPost } from '@/services/FeedApi/FeedApi.types';

type TeamForumProps = {
  user: TUserProfile;
};

const TeamForum: React.FC<TeamForumProps> = ({ user }) => {
  const [posts, setPosts] = useState<TPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState<{
    title: string;
    content: string;
    category: 'TEAM' | 'COMPANY' | 'ANNOUNCEMENT';
    files: File[];
  }>({
    title: '',
    content: '',
    category: 'TEAM',
    files: [],
  });
  const [commentingOn, setCommentingOn] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [tempComment, setTempComment] = useState('');
  const [tempReply, setTempReply] = useState('');

  const selectedPost = posts.find((p) => p.id === commentingOn) || null;

  const fetchPosts = React.useCallback(async () => {
    try {
      const response = await FeedApi.getAllPosts({ page: 0, size: 20 });
      setPosts(response.data || []);
    } catch (error) {
      toast.error('Failed to load forum feed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const canCreatePost = ['ADMIN', 'HR', 'TEAM_LEADER'].includes(user.role);

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) {
      toast.error('Please fill in both title and content');
      return;
    }

    const formData = new FormData();
    formData.append('title', newPost.title);
    formData.append('content', newPost.content);
    formData.append('category', newPost.category);

    // Multiple files support
    newPost.files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      await FeedApi.createPost(formData);
      setIsCreating(false);
      setNewPost({ title: '', content: '', category: 'TEAM', files: [] });
      toast.success('Your post is now live!');
      fetchPosts();
    } catch (error) {
      toast.error('Something went wrong. Could not create post.');
    }
  };

  const handleAddComment = async (postId: number, parentId: number | null = null) => {
    const content = parentId ? tempReply : tempComment;
    if (!content.trim()) return;

    try {
      await FeedApi.addComment(postId, {
        content,
        parentId,
      });

      if (parentId) {
        setTempReply('');
        setReplyingTo(null);
      } else {
        setTempComment('');
        setCommentingOn(null);
      }

      toast.success('Thanks for your comment!');
      fetchPosts();
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleAddReply = (postId: number, commentId: number) => {
    handleAddComment(postId, commentId);
  };

  const handleLikeToggle = async (postId: number, isLiked: boolean) => {
    try {
      if (isLiked) {
        await FeedApi.unlikePost(postId);
      } else {
        await FeedApi.likePost(postId);
      }
      fetchPosts();
    } catch (error) {
      toast.error('Failed to update like status');
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FA] dark:bg-[#0A0A0B] p-4 sm:p-6">
      <div className=" mb-10 flex flex-col sm:flex-row items-baseline justify-between gap-4 px-2">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Team Forum
          </h2>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500 font-bold uppercase ">
            Community Discussions
          </p>
        </div>
        {canCreatePost && (
          <Button
            onClick={() => setIsCreating(true)}
            className="group px-6 py-5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all duration-300 active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Topic</span>
          </Button>
        )}
      </div>

      {/* New Post Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-2xl border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-white dark:bg-card overflow-hidden rounded-[2rem] p-0 ring-1 ring-black/[0.03]">
          <DialogHeader className="px-8 py-6 border-b border-gray-50 dark:border-white/[0.03">
            <DialogTitle className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
              Create New Post
            </DialogTitle>
          </DialogHeader>

          <div className="px-8 py-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-none">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                  Title
                </label>
                <Input
                  placeholder="Enter a descriptive title..."
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="h-12 rounded-xl bg-gray-50 dark:bg-muted/10 border-none px-5 focus-visible:ring-1 focus-visible:ring-primary/30 text-[15px] font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['TEAM', 'COMPANY', 'ANNOUNCEMENT'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setNewPost({ ...newPost, category: type })}
                      className={cn(
                        'px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all',
                        newPost.category === type
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-muted/10 text-gray-500 hover:bg-gray-200',
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                  Content
                </label>
                <Textarea
                  placeholder="What's on your mind?"
                  rows={5}
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="rounded-2xl bg-gray-50 dark:bg-muted/10 border-none p-5 focus-visible:ring-1 focus-visible:ring-primary/30 text-sm font-medium leading-relaxed resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 flex items-center justify-between">
                  Attachments
                  <span className="text-[9px] lowercase font-medium opacity-60">Optional</span>
                </label>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    {newPost.files.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 rounded-lg px-3 py-2 border border-gray-100 dark:border-white/5 group relative"
                      >
                        <FileIcon className="w-3.5 h-3.5 text-primary/60" />
                        <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400 max-w-[150px] truncate">
                          {file.name}
                        </span>
                        <button
                          onClick={() =>
                            setNewPost((prev) => ({
                              ...prev,
                              files: prev.files.filter((_, i) => i !== idx),
                            }))
                          }
                          className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-gray-200 dark:border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all group">
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const selectedFiles = Array.from(e.target.files || []);
                          setNewPost((prev) => ({
                            ...prev,
                            files: [...prev.files, ...selectedFiles],
                          }));
                        }}
                      />
                      <Paperclip className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                      <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 group-hover:text-primary transition-colors">
                        Attach Files
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="px-8 py-5 bg-gray-50/50 dark:bg-muted/5 flex items-center justify-end gap-3 rounded-b-[2rem]">
            <Button
              variant="ghost"
              onClick={() => setIsCreating(false)}
              className="rounded-lg h-10 px-6 font-black text-[10px] uppercase tracking-widest text-gray-400"
            >
              Discard
            </Button>
            <Button
              onClick={handleCreatePost}
              className="rounded-lg h-10 px-8 font-black text-[10px] uppercase tracking-widest bg-primary hover:bg-primary/90 text-white shadow-lg"
            >
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className=" space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
              Loading Feed
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-card rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
            <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">
              Silence is golden
            </h3>
            <p className="text-xs text-gray-400 font-medium tracking-tight">
              But conversations are better. Start one!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="group border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-500 bg-white dark:bg-card overflow-hidden rounded-2xl ring-1 ring-black/[0.02] dark:ring-white/[0.05]">
                <CardHeader className="flex flex-row items-center gap-4 px-4 py-4">
                  <Avatar className="w-10 h-10 transition-transform group-hover:scale-110">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorName}`}
                    />
                    <AvatarFallback className="bg-primary/5 text-primary text-sm font-black uppercase">
                      {post.authorName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h3 className="text-[15px] font-black text-gray-900 dark:text-white leading-none">
                      {post.authorName}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 font-bold uppercase tracking-widest text-[9px] text-gray-400">
                      <span>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="w-1 h-1 bg-gray-200 rounded-full" />
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-md',
                          post.category === 'ANNOUNCEMENT'
                            ? 'bg-amber-50 text-amber-600'
                            : post.category === 'COMPANY'
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'bg-emerald-50 text-emerald-600',
                        )}
                      >
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-9 h-9 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-xl border-none shadow-2xl p-1"
                    >
                      <DropdownMenuItem className="rounded-lg font-bold py-2 text-[10px] uppercase tracking-widest">
                        Share
                      </DropdownMenuItem>
                      {post.authorName === (user.name || user.username) && (
                        <DropdownMenuItem className="rounded-lg font-bold py-2 text-[10px] uppercase tracking-widest text-red-500">
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>

                <CardContent className="px-8 py-2 pb-6 space-y-3">
                  <h4 className="text-xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                    {post.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed line-clamp-2">
                    {post.content}
                  </p>
                </CardContent>

                <CardFooter className="px-8 py-5 border-t border-gray-50 dark:border-white/[0.03 bg-gray-50/20">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const isLiked = post.likes?.some((l) => l.userId === user.id);
                        return (
                          <button
                            onClick={() => handleLikeToggle(post.id, !!isLiked)}
                            className={cn(
                              'group/btn flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all',
                              isLiked
                                ? 'bg-red-50 text-red-500'
                                : 'bg-gray-100/50 dark:bg-white/5 text-gray-400 hover:text-red-500 hover:bg-red-50',
                            )}
                          >
                            <Heart
                              className={cn(
                                'w-4 h-4 transition-transform group-hover/btn:scale-125',
                                isLiked && 'fill-current',
                              )}
                            />
                            <span>{post.likes?.length || 0}</span>
                          </button>
                        );
                      })()}

                      <button
                        onClick={() => setCommentingOn(post.id)}
                        className="group/btn flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100/50 dark:bg-white/5 text-gray-400 hover:bg-primary/5 hover:text-primary transition-all text-[10px] font-black uppercase tracking-widest"
                      >
                        <MessageSquare className="w-4 h-4 transition-transform group-hover/btn:scale-125" />
                        <span>{post.comments?.length || 0}</span>
                      </button>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Post Details Sheet */}
      <Sheet open={!!commentingOn} onOpenChange={(open) => !open && setCommentingOn(null)}>
        <SheetContent className="sm:max-w-lg w-full border-none p-0 flex flex-col h-full bg-[#F9FAFB] dark:bg-[#0B0B0C] shadow-[-10px_0_40px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-0">
          {selectedPost && (
            <>
              <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#0B0B0C]/90 backdrop-blur-md border-b border-gray-50 dark:border-white/[0.03 px-8 py-6">
                <div className="flex items-center gap-4 mb-5">
                  <Avatar className="w-10 h-10 ring-2 ring-gray-50 dark:ring-white/5">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPost.authorName}`}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-black">
                      {selectedPost.authorName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-[15px] font-black text-gray-900 dark:text-white leading-tight">
                      {selectedPost.authorName}
                    </h4>
                    <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">
                      {new Date(selectedPost.createdAt).toLocaleDateString(undefined, {
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <SheetTitle className="text-xl font-black text-gray-900 dark:text-white leading-[1.3] tracking-tight">
                  {selectedPost.title}
                </SheetTitle>
              </div>

              <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-10 scrollbar-none">
                <div className="bg-white dark:bg-white/[0.02] rounded-2xl p-6 border border-gray-100 dark:border-white/[0.03 shadow-sm mt-4">
                  <p className="text-[14px] text-gray-600 dark:text-gray-300 font-medium leading-[1.6] whitespace-pre-wrap">
                    {selectedPost.content}
                  </p>
                </div>

                {/* Discussions */}
                <div className="space-y-8 px-2">
                  <h3 className="text-[12px] font-black text-gray-700 uppercase tracking-[0.3em] border-b border-gray-50 dark:border-white/[0.03 pb-4">
                    Comments ({selectedPost.comments?.length || 0})
                  </h3>

                  <div className="space-y-8">
                    {selectedPost.comments?.map((comment) => (
                      <div key={comment.id} className="relative">
                        <div className="flex gap-4 group/comment">
                          <Avatar className="w-8 h-8 shrink-0 ring-2 ring-white dark:ring-white/10 shadow-sm relative z-10">
                            <AvatarFallback className="bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 text-[10px] font-black uppercase">
                              {comment.authorName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="bg-white dark:bg-white/[0.04] rounded-2xl rounded-tl-none px-5 py-4 shadow-sm border border-gray-100 dark:border-white/10 hover:border-primary/20 transition-all duration-300">
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-[12px] font-black text-gray-900 dark:text-gray-100">
                                    {comment.authorName}
                                  </span>
                                  <span className="text-[9px] font-bold text-gray-400 opacity-40 uppercase tracking-tighter">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <p className="text-[13px] text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                                {comment.content}
                              </p>
                            </div>

                            <button
                              onClick={() =>
                                setReplyingTo(replyingTo === comment.id ? null : comment.id)
                              }
                              className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-primary ml-1 flex items-center gap-1.5 transition-colors group/reply"
                            >
                              <Reply className="w-3 h-3 group-hover/reply:translate-x-0.5 transition-transform" />
                              <span>Reply</span>
                            </button>

                            {/* Replies Section */}
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-50 dark:border-white/[0.03 ml-2">
                                {comment.replies.map((reply) => (
                                  <div key={reply.id} className="flex gap-3 relative">
                                    <div className="absolute -left-[18px] top-4 w-4 h-[2px] bg-gray-50 dark:bg-white/[0.03]" />
                                    <Avatar className="w-7 h-7 shrink-0 ring-1 ring-white dark:ring-white/10 shadow-sm">
                                      <AvatarFallback className="bg-gray-100 dark:bg-white/5 text-gray-500 text-[9px] font-black uppercase">
                                        {reply.authorName.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 bg-white dark:bg-white/[0.03] rounded-xl px-4 py-2.5 border border-gray-100 dark:border-white/5 shadow-sm">
                                      <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-[11px] font-black text-gray-900 dark:text-gray-100 leading-none">
                                          {reply.authorName}
                                        </span>
                                      </div>
                                      <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                        {reply.content}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            <AnimatePresence>
                              {replyingTo === comment.id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="mt-3 pl-2 overflow-hidden"
                                >
                                  <div className="relative">
                                    <Input
                                      placeholder={`Reply to ${comment.authorName}...`}
                                      autoFocus
                                      value={tempReply}
                                      onChange={(e) => setTempReply(e.target.value)}
                                      onKeyPress={(e) =>
                                        e.key === 'Enter' &&
                                        handleAddReply(selectedPost.id, comment.id)
                                      }
                                      className="h-9 bg-gray-100 dark:bg-white/5 border-none rounded-full pr-10 text-[12px] font-bold focus-visible:ring-1 focus-visible:ring-primary/20"
                                    />
                                    <button
                                      onClick={() => handleAddReply(selectedPost.id, comment.id)}
                                      className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white shadow-sm hover:scale-105 active:scale-90 transition-all"
                                    >
                                      <Send className="w-3 h-3" strokeWidth={3} />
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* More Compact Input Area */}
              <div className="p-5 border-t border-gray-100 dark:border-white/[0.03 bg-white/80 dark:bg-[#0B0B0C]/80 backdrop-blur-md">
                <div className="flex items-center gap-3 max-w-lg mx-auto">
                  <Avatar className="w-8 h-8 hidden sm:flex shrink-0">
                    <AvatarFallback className="bg-primary text-white text-[10px] font-black uppercase">
                      {(user.name || user.username || 'U').charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Join the discussion..."
                      value={tempComment}
                      onChange={(e) => setTempComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(selectedPost.id)}
                      className="h-10 bg-gray-50 dark:bg-white/5 border-none rounded-full px-5 pr-12 text-[13px] font-bold placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-primary/20"
                    />
                    <button
                      onClick={() => handleAddComment(selectedPost.id)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-90 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TeamForum;

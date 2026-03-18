import React, { useState } from 'react';
import {
  MessageSquare,
  Heart,
  Share2,
  MoreHorizontal,
  Plus,
  Send,
  Reply,
  Image as ImageIcon,
  User as UserIcon,
  Calendar,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { TUserProfile } from '@/services/AuthApi';

// interface User {
//   id: string;
//   name?: string;
//   fullName?: string;
//   role: string;
//   email?: string;
//   avatar?: string;
// }

interface ReplyType {
  id: string;
  user: {
    name: string;
    avatar?: string;
    role: string;
  };
  content: string;
  timestamp: string;
}

interface CommentType {
  id: string;
  user: {
    name: string;
    avatar?: string;
    role: string;
  };
  content: string;
  timestamp: string;
  replies: ReplyType[];
}

interface PostType {
  id: string;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  title: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: CommentType[];
  type: 'TEAM' | 'COMPANY' | 'ANNOUNCEMENT';
}

type TeamForumProps = {
  user: TUserProfile;
};

const TeamForum: React.FC<TeamForumProps> = ({ user }) => {
  const [posts, setPosts] = useState<PostType[]>([
    {
      id: '1',
      author: {
        name: 'Admin User',
        role: 'ADMIN',
      },
      title: 'New Benefits Policy 2024',
      content:
        "We're excited to announce updated health benefits and flexible work options starting next month. Check the handbook for more details!",
      timestamp: '2 hours ago',
      likes: 24,
      type: 'ANNOUNCEMENT',
      comments: [
        {
          id: 'c1',
          user: { name: 'Member One', role: 'MEMBER' },
          content: 'This is great news! Looking forward to the flexible hours.',
          timestamp: '1 hour ago',
          replies: [
            {
              id: 'r1',
              user: { name: 'Admin User', role: 'ADMIN' },
              content: 'Glad to hear that!',
              timestamp: '45 mins ago',
            },
          ],
        },
      ],
    },
    {
      id: '2',
      author: {
        name: 'Team Lead Sarah',
        role: 'TEAM_LEADER',
      },
      title: 'Monthly Team Bonding',
      content: "Don't forget our team lunch this Friday at 12 PM. Pizza on the house!",
      timestamp: '5 hours ago',
      likes: 12,
      type: 'TEAM',
      comments: [],
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    type: 'TEAM' as 'TEAM' | 'COMPANY' | 'ANNOUNCEMENT',
  });
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [tempComment, setTempComment] = useState('');
  const [tempReply, setTempReply] = useState('');

  const canCreatePost = ['ADMIN', 'HR', 'TEAM_LEADER'].includes(user.role);

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) {
      toast.error('Please fill in both title and content');
      return;
    }

    const post: PostType = {
      id: Date.now().toString(),
      author: {
        name: user.name || user.email || 'User',
        role: user.role,
      },
      title: newPost.title,
      content: newPost.content,
      type: newPost.type,
      timestamp: 'Just now',
      likes: 0,
      comments: [],
    };

    setPosts([post, ...posts]);
    setIsCreating(false);
    setNewPost({ title: '', content: '', type: 'TEAM' });
    toast.success('Post created successfully!');
  };

  const handleAddComment = (postId: string) => {
    if (!tempComment.trim()) return;

    const newComment: CommentType = {
      id: Date.now().toString(),
      user: {
        name: user.name || user.email || 'User',
        role: user.role,
      },
      content: tempComment,
      timestamp: 'Just now',
      replies: [],
    };

    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post,
      ),
    );
    setTempComment('');
    setCommentingOn(null);
    toast.success('Comment added!');
  };

  const handleAddReply = (postId: string, commentId: string) => {
    if (!tempReply.trim()) return;

    const newReply: ReplyType = {
      id: Date.now().toString(),
      user: {
        name: user.name || user.email || 'User',
        role: user.role,
      },
      content: tempReply,
      timestamp: 'Just now',
    };

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map((comment) =>
              comment.id === commentId
                ? { ...comment, replies: [...comment.replies, newReply] }
                : comment,
            ),
          };
        }
        return post;
      }),
    );
    setTempReply('');
    setReplyingTo(null);
    toast.success('Reply added!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Team Forum</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Stay updated with latest team and company news
          </p>
        </div>
        {canCreatePost && (
          <Button
            onClick={() => setIsCreating(true)}
            className="rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <Plus size={20} />
            Create Post
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-none shadow-xl bg-white dark:bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Create New Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Post Title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="border-gray-100 dark:border-border"
                  />
                </div>
                <div className="flex gap-2">
                  {(['TEAM', 'COMPANY', 'ANNOUNCEMENT'] as const).map((type) => (
                    <Badge
                      key={type}
                      variant={newPost.type === type ? 'default' : 'outline'}
                      className="cursor-pointer px-3 py-1 rounded-full capitalize"
                      onClick={() => setNewPost({ ...newPost, type })}
                    >
                      {type.toLowerCase()}
                    </Badge>
                  ))}
                </div>
                <Textarea
                  placeholder="What's on your mind?"
                  rows={4}
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="border-gray-100 dark:border-border"
                />
              </CardContent>
              <CardFooter className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePost}>Publish Post</Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow dark:bg-card overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="w-12 h-12 border-2 border-primary/10">
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback className="bg-primary/5 text-primary font-bold">
                    {post.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 dark:text-white capitalize">
                      {post.author.name}
                    </h3>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {post.author.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {post.timestamp}
                    </span>
                    <Badge
                      className={`
                        ${post.type === 'ANNOUNCEMENT' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' : ''}
                        ${post.type === 'COMPANY' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : ''}
                        ${post.type === 'TEAM' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
                        border-none text-[10px]
                      `}
                    >
                      {post.type}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-400">
                      <MoreHorizontal size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Report</DropdownMenuItem>
                    {post.author.name === (user.name || user.email) && (
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100">{post.title}</h4>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {post.content}
                </p>
                {post.image && (
                  <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-border">
                    <img src={post.image} alt="Post content" className="w-full h-auto" />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col border-t border-gray-50 dark:border-border/50 px-6 py-3">
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-gray-500 hover:text-red-500 hover:bg-red-50"
                    >
                      <Heart size={18} />
                      <span className="text-xs font-semibold">{post.likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)}
                      className={`gap-2 ${commentingOn === post.id ? 'text-primary bg-primary/5' : 'text-gray-500'}`}
                    >
                      <MessageSquare size={18} />
                      <span className="text-xs font-semibold">{post.comments.length}</span>
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-500 gap-2">
                    <Share2 size={18} />
                    <span className="text-xs font-semibold">Share</span>
                  </Button>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                  {(commentingOn === post.id || post.comments.length > 0) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="w-full overflow-hidden"
                    >
                      <div className="pt-4 space-y-4">
                        {/* New Comment Input */}
                        <div className="flex gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gray-100 text-[10px] font-bold">
                              {(user.name || user.email || 'U').charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 relative">
                            <Input
                              placeholder="Write a comment..."
                              value={tempComment}
                              onChange={(e) => setTempComment(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                              className="bg-gray-50 dark:bg-muted/50 border-none rounded-2xl pr-10 text-sm focus-visible:ring-1"
                            />
                            <button
                              onClick={() => handleAddComment(post.id)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 transition"
                            >
                              <Send size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Existing Comments */}
                        <div className="space-y-4">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="group">
                              <div className="flex gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="bg-blue-50 text-blue-600 text-[10px] font-bold uppercase">
                                    {comment.user.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="bg-gray-50 dark:bg-muted/30 rounded-2xl px-4 py-2 inline-block">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                                        {comment.user.name}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-[8px] px-1 py-0 h-3 leading-none opacity-60"
                                      >
                                        {comment.user.role}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                      {comment.content}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-4 mt-1 ml-2 text-[10px] font-semibold text-gray-500">
                                    <span>{comment.timestamp}</span>
                                    <button
                                      onClick={() =>
                                        setReplyingTo(replyingTo === comment.id ? null : comment.id)
                                      }
                                      className="hover:text-primary transition flex items-center gap-1"
                                    >
                                      <Reply size={12} /> Reply
                                    </button>
                                  </div>

                                  {/* Replies */}
                                  {comment.replies.length > 0 && (
                                    <div className="mt-3 ml-2 space-y-3 border-l-2 border-gray-100 dark:border-border pl-4">
                                      {comment.replies.map((reply) => (
                                        <div key={reply.id} className="flex gap-2">
                                          <Avatar className="w-6 h-6">
                                            <AvatarFallback className="bg-purple-50 text-purple-600 text-[8px] font-bold uppercase">
                                              {reply.user.name.charAt(0)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1">
                                            <div className="bg-gray-100/50 dark:bg-muted/20 rounded-xl px-3 py-1.5 inline-block">
                                              <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-[10px] font-bold text-gray-900 dark:text-gray-100">
                                                  {reply.user.name}
                                                </span>
                                              </div>
                                              <p className="text-xs text-gray-700 dark:text-gray-300">
                                                {reply.content}
                                              </p>
                                            </div>
                                            <div className="text-[9px] text-gray-500 mt-0.5 ml-1">
                                              {reply.timestamp}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Reply Input */}
                                  <AnimatePresence>
                                    {replyingTo === comment.id && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="mt-3 ml-2 overflow-hidden"
                                      >
                                        <div className="flex gap-2 relative">
                                          <Input
                                            placeholder={`Reply to ${comment.user.name.split(' ')[0]}...`}
                                            autoFocus
                                            value={tempReply}
                                            onChange={(e) => setTempReply(e.target.value)}
                                            onKeyPress={(e) =>
                                              e.key === 'Enter' &&
                                              handleAddReply(post.id, comment.id)
                                            }
                                            className="bg-gray-50 dark:bg-muted/50 border-none rounded-xl pr-10 text-xs h-8 focus-visible:ring-1"
                                          />
                                          <button
                                            onClick={() => handleAddReply(post.id, comment.id)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-primary"
                                          >
                                            <Send size={14} />
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TeamForum;

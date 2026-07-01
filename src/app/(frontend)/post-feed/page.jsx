'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Heart, MessageCircle, Share2, Send, Image as ImageIcon, Video, X, Search, User, FileText, Edit3, Bookmark, Settings, HelpCircle, Menu, Loader2, ImagePlus, BookOpenText, Shield, Lock } from 'lucide-react';
import Image from "next/image";
import { Label } from '@/components/ui/label';
import { Progress } from '@radix-ui/react-progress';
import MyPost from '@/components/myPost';
import DraftPost from '@/components/draftPost';
import SavedPost from '@/components/savedPost';
import PrivacyPolicy from '@/components/privacyPolicy';


import { useUserDetailsHooks } from '@/hooks/useUserHooks';
import AllPosts from '@/components/posts';
import Link from 'next/link';
import { PostsRightSidebar } from '@/components/postsRightSidebar';


const Comment = ({ comment, onReply }) => (
  <div className="mt-4">
    <div className="flex items-start space-x-4">
      <Avatar>
        <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
        <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h4 className="font-semibold">{comment.user.name}</h4>
        <p>{comment.content}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReply(comment.id)}
        >
          Reply
        </Button>
      </div>
    </div>
    {comment.replies.map(reply => (
      <div key={reply.id} className="ml-12 mt-2 flex items-start space-x-4">
        <Avatar>
          <AvatarImage src={reply.user.avatar} alt={reply.user.name} />
          <AvatarFallback>{reply.user.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h5 className="font-semibold">{reply.user.name}</h5>
          <p>{reply.content}</p>
        </div>
      </div>
    ))}
  </div>
);

const AutoPlayVideo = ({ src }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      });
    }, { threshold: 0.5 });

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }
    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);




  return (
    <video
      ref={videoRef}
      src={src}
      controls
      className="mt-4 rounded-lg w-full max-h-96"
      loop
      muted
    />
  );
};

const Post = ({ post, onLike, onComment, onShare, onReply }) => (
  <Card key={post.id}>
    <CardHeader>
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={post.user.avatar} alt={post.user.name} />
          <AvatarFallback>{post.user.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{post.user.name}</h3>
          <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p>{post.content}</p>
      {post.image && (
        <Image src={post.image} alt="Post Content" height={400} width={600} className="mt-4 rounded-lg w-full object-cover" />
      )}
      {post.video && (
        <AutoPlayVideo src={post.video} />
      )}
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button variant="ghost" onClick={() => onLike(post.id)}>
        <Heart className="w-4 h-4 mr-2" fill={post.likes > 0 ? 'red' : 'none'} />
        {post.likes}
      </Button>
      <Button variant="ghost">
        <MessageCircle className="w-4 h-4 mr-2" />
        {post.comments.length}
      </Button>
      <Button variant="ghost" onClick={() => onShare(post.id)}>
        <Share2 className="w-4 h-4 mr-2" />
        {post.shares}
      </Button>
    </CardFooter>
    <CardContent>
      {post.comments.map(comment => (
        <Comment key={comment.id} comment={comment} onReply={(commentId) => onReply(post.id, commentId)} />
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.elements.namedItem('comment');
          if (input instanceof HTMLInputElement && input.value.trim()) {
            onComment(post.id, input.value);
            input.value = '';
          }
        }}
        className="mt-4 flex items-center space-x-2"
      >
        <Input name="comment" placeholder="Écrire un commentaire..." className="flex-1" />
        <Button type="submit" size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </CardContent>
  </Card>
);

const ProfileSection = ({ setActiveSection }) => {

  const { userDetails } = useUserDetailsHooks();
  console.log(userDetails)
  return (
    <div className="space-y-4">
      {/* Profile Card with Modern Bubble UI */}
      <Card className="w-full overflow-hidden bg-white rounded-3xl border border-gray-100 shadow-sm relative">
        {/* Decorative Bubble Background */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#5F0EB3]/20 to-[#4B0B8E]/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-tr from-[#FF710B]/20 to-[#FF8832]/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 right-10 w-24 h-24 bg-gradient-to-br from-[#5F0EB3]/15 to-purple-400/10 rounded-full blur-xl"></div>
        </div>
        
        {/* Banner Section with gradient */}
        <div className="relative h-20 bg-gradient-to-r from-[#5F0EB3] via-[#6F1FC3] to-[#4B0B8E] overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          </div>
        </div>
        
        <CardHeader className="pb-4 relative">
          <div className="flex flex-col items-center -mt-12">
            {/* Avatar with bubble ring */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#5F0EB3] to-[#FF710B] p-1 animate-pulse"></div>
              <Avatar className="w-24 h-24 border-4 border-white shadow-md relative z-10">
                <AvatarImage src={userDetails?.image} alt="Profile Picture" />
                <AvatarFallback className="bg-gradient-to-br from-[#5F0EB3] to-[#4B0B8E] text-white text-xl font-semibold">
                  {userDetails?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">{userDetails?.name || "User"}</h2>
            <p className="text-sm text-gray-600 mt-1">{userDetails?.profession || "Member"}</p>
          </div>
        </CardHeader>
        
        <CardContent className="pt-2 pb-6 relative">
          <nav className="flex flex-col space-y-2">
            <Button 
              variant="ghost" 
              className="justify-start hover:bg-gradient-to-r hover:from-[#5F0EB3]/10 hover:to-purple-100 rounded-2xl transition-all duration-300 h-11 group" 
              onClick={() => setActiveSection('posts')}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5F0EB3]/20 to-purple-200/30 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                <FileText className="h-4 w-4 text-[#5F0EB3]" />
              </div>
              <span className="font-medium">Posts</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="justify-start hover:bg-gradient-to-r hover:from-[#5F0EB3]/10 hover:to-purple-100 rounded-2xl transition-all duration-300 h-11 group" 
              onClick={() => setActiveSection('myPosts')}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5F0EB3]/20 to-purple-200/30 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                <BookOpenText className="h-4 w-4 text-[#5F0EB3]" />
              </div>
              <span className="font-medium">My Posts</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="justify-start hover:bg-gradient-to-r hover:from-[#5F0EB3]/10 hover:to-purple-100 rounded-2xl transition-all duration-300 h-11 group" 
              onClick={() => setActiveSection('saved')}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF710B]/20 to-orange-200/30 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                <Bookmark className="h-4 w-4 text-[#FF710B]" />
              </div>
              <span className="font-medium">Saved Posts</span>
            </Button>
            
            <div className="my-3">
              <Separator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            </div>
            
            <Button 
              variant="ghost" 
              className="justify-start hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 rounded-2xl transition-all duration-300 h-11 group" 
              onClick={() => setActiveSection('privacyPolicy')}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                <Lock className="h-4 w-4 text-gray-600" />
              </div>
              <span className="font-medium">Privacy Policy</span>
            </Button>
            
            <Link href='/contact' className="w-full">
              <Button 
                variant="ghost" 
                className="justify-start hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 rounded-2xl transition-all duration-300 h-11 w-full group" 
                onClick={() => setActiveSection('help')}
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <HelpCircle className="h-4 w-4 text-gray-600" />
                </div>
                <span className="font-medium">Help & Support</span>
              </Button>
            </Link>
          </nav>
        </CardContent>
      </Card>
    </div>
  );
}


const ContentSection = ({ activeSection }) => {

  switch (activeSection) {
    case 'posts':
      return <AllPosts />;
    case 'myPosts':
      return <div>
        <MyPost></MyPost>
      </div>;
    case 'drafts':
      return <div><DraftPost></DraftPost></div>;
    case 'saved':
      return <div><SavedPost></SavedPost></div>;
    case 'privacyPolicy':
      return <div><PrivacyPolicy></PrivacyPolicy></div>
    case 'help':
      return <div><h2 className="text-2xl font-bold mb-4">Help & Support</h2><p>How can we help you?</p></div>;
    default:
      return <div><h2 className="text-2xl font-bold mb-4">Welcome</h2><p>Select an option from the menu.</p></div>;
  }
};

const EnhancedPostFeed = () => {
  const [activeSection, setActiveSection] = useState('posts');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 py-4 lg:py-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Left Column - Profile Section */}
          <div className="lg:w-[280px] flex-shrink-0 mb-6 lg:mb-0">
            <div className="hidden lg:block sticky top-24">
              <ProfileSection setActiveSection={setActiveSection} />
            </div>
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full mb-4">
                    <Menu className="mr-2 h-4 w-4" />
                    Menu
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <ProfileSection setActiveSection={setActiveSection} />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Center Column - Main Feed */}
          <div className="flex-1 min-w-0 lg:max-w-[680px]">
            <ContentSection activeSection={activeSection} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:w-[300px] flex-shrink-0">
            <div className="hidden lg:block sticky top-24">
              <PostsRightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPostFeed;

import { PaginationMetadata } from "@/lib/axios";

export type TComment= {
  id: number;
  content: string;
  authorName: string;
  parentId: number | null;
  createdAt: string;
  replies: TComment[] | null;
  
}
export type TUserLike ={
  userName: string;
  userId: number;
  email: string;
}

export type TPost= {
  id: number;
  title: string;
  category: string;
  content: string;
  authorName: string;
  createdAt: string;
  comments?: TComment[] ;
  likes?: TUserLike[];
  
}

export type CreatePostRequest= {
  title: string;
  content: string;
  category: string;
}

export type CreateCommentRequest= {
  content: string;
  parentId?: number | null;
}

export type PostCriteria= {
  page?: number;
  size?: number;
}

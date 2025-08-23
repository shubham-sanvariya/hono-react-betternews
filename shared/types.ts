import z from "zod";
import { insertPostSchema } from "@/db/schema/post.ts";


export type SuccessResponse<T = void> = {
    success: true;
    message: string;
} & ( T extends void ? {} : { data: T } );

// const data : SuccessResponse<{ id: number }> = {
//     success: true,
//     message: "Post created",
//     data: { id : 1}
// }

export type ErrorResponse = {
    success: false;
    error: string;
    isFormError?: boolean;
}

export const loginSchema = z.object({
    username: z.string().min(3).max(31).regex(/^[a-zA-Z0-9_]+$/),
    password: z.string().min(3).max(255)
})

export const createPostSchema = insertPostSchema
  .pick({
  title: true,
  url: true,
  content: true
})
  .refine((data) => data.url || data.content, {
    message: "Either URL or Content must be provided",
    path: ["url", "content"],
  });

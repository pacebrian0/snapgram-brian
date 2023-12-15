import * as z from 'zod';

export const SignupValidation = z.object({
    name: z.string().min(2, {message: 'Too short'}),
    username: z.string().min(2,  {message: 'Too short'}),
    email: z.string().email(),
    password: z.string().min(8,{message: 'Password must be at least 8 characters'})
  })

  export const SigninValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8,{message: 'Password must be at least 8 characters'})
  })

  export const PostValidation = z.object({
    caption: z.string().min(5).max(2200),
    file: z.custom<File[]>(),
    location: z.string().min(2).max(100),
    tags: z.string(),
  })

  export const ProfileValidation = z.object({
    name: z.string().min(5).max(255),
    file: z.custom<File[]>(),
    username: z.string().min(2).max(100),
    bio: z.string(),
  //   password: z.string().min(4),
  //   confirmPassword: z.string().min(4),
  // }).superRefine(({ confirmPassword, password }, ctx) => {
  //   if (confirmPassword !== password) {
  //     ctx.addIssue({
  //       code: "custom",
  //       message: "The passwords did not match",
  //       path: ['confirmPassword']
        
  //     });
  //   }
  });
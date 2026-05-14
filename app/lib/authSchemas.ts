import { z } from 'zod'

/** 与 react `user-auth-form.tsx` 对齐 — Nuxt 使用 zod v3（@vee-validate/zod peer） */
export const signInFormSchema = z.object({
  email: z
    .string()
    .min(1, '请输入邮箱。')
    .email(),
  password: z
    .string()
    .min(1, '请输入密码。')
    .min(7, '密码至少 7 个字符。'),
})

export type SignInFormValues = z.infer<typeof signInFormSchema>

/** 与 react `sign-up-form.tsx` 对齐（字段名 confirmPassword） */
export const signUpFormSchema = z
  .object({
    email: z
      .string()
      .min(1, '请输入邮箱。')
      .email(),
    password: z
      .string()
      .min(1, '请输入密码。')
      .min(7, '密码至少 7 个字符。'),
    confirmPassword: z.string().min(1, '请再次输入密码。'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致。',
    path: ['confirmPassword'],
  })

export type SignUpFormValues = z.infer<typeof signUpFormSchema>

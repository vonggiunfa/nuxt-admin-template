import * as z from 'zod'

export const profileFormSchema = z.object({
  username: z
    .string({ required_error: '请输入用户名' })
    .min(2, '用户名至少 2 个字符')
    .max(30, '用户名不能超过 30 个字符'),
  email: z
    .string({ required_error: '请选择展示邮箱' })
    .min(1, '请选择展示邮箱')
    .email('邮箱格式不正确'),
  bio: z
    .string()
    .min(4, '简介至少 4 个字符')
    .max(160, '简介不能超过 160 个字符'),
  urls: z
    .array(
      z.object({
        value: z.string().url('请输入有效 URL'),
      }),
    )
    .optional(),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>

export const profileDefaultValues: Partial<ProfileFormValues> = {
  username: '',
  bio: '我拥有一台电脑。',
  urls: [{ value: 'https://shadcn.com' }, { value: 'http://twitter.com/shadcn' }],
}

export const LANGUAGE_OPTIONS = [
  { label: '英语', value: 'en' },
  { label: '法语', value: 'fr' },
  { label: '德语', value: 'de' },
  { label: '西班牙语', value: 'es' },
  { label: '葡萄牙语', value: 'pt' },
  { label: '俄语', value: 'ru' },
  { label: '日语', value: 'ja' },
  { label: '韩语', value: 'ko' },
  { label: '中文', value: 'zh' },
] as const

export const accountFormSchema = z.object({
  name: z
    .string({ required_error: '请输入姓名' })
    .min(2, '姓名至少 2 个字符')
    .max(30, '姓名不能超过 30 个字符'),
  dob: z.date({
    required_error: '请选择出生日期',
    invalid_type_error: '请选择出生日期',
  }),
  language: z.string({ required_error: '请选择语言' }).min(1, '请选择语言'),
})

export type AccountFormValues = z.infer<typeof accountFormSchema>

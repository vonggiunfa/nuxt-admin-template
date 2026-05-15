<script setup lang="ts">
import { FieldArray, type SubmissionHandler } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
  profileDefaultValues,
  profileFormSchema,
  type ProfileFormValues,
} from '@/lib/settingsSchemas'
import { showSubmittedData } from '@/lib/showSubmittedData'

const typedSchema = toTypedSchema(profileFormSchema)

const onSubmit: SubmissionHandler<ProfileFormValues> = (values) => {
  showSubmittedData(values)
}
</script>

<template>
  <Form
    :validation-schema="typedSchema"
    :initial-values="profileDefaultValues"
    class="space-y-8"
    :on-submit="onSubmit"
  >
    <FormField v-slot="{ componentField }" name="username">
      <FormItem>
        <FormLabel>用户名</FormLabel>
        <FormControl>
          <Input placeholder="shadcn" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          这是对外展示的昵称，可使用真实姓名或化名。每 30 天仅可修改一次。
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ value, handleChange }" name="email">
      <FormItem>
        <FormLabel>邮箱</FormLabel>
        <Select :model-value="value" @update:model-value="handleChange">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="选择用于展示的已验证邮箱" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="m@example.com">
              m@example.com
            </SelectItem>
            <SelectItem value="m@google.com">
              m@google.com
            </SelectItem>
            <SelectItem value="m@support.com">
              m@support.com
            </SelectItem>
          </SelectContent>
        </Select>
        <FormDescription>
          你可以在<NuxtLink class="underline underline-offset-4" to="/">
            邮箱设置
          </NuxtLink>中管理已验证邮箱。
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="bio">
      <FormItem>
        <FormLabel>简介</FormLabel>
        <FormControl>
          <Textarea
            placeholder="简单介绍一下你自己"
            class="resize-none"
            v-bind="componentField"
          />
        </FormControl>
        <FormDescription>
          你可以使用 <span>@mention</span> 提及用户或组织以链接到对方。
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FieldArray v-slot="{ fields, push }" name="urls">
      <div>
        <template v-for="(f, index) in fields" :key="f.key">
          <FormField v-slot="{ componentField }" :name="`urls.${index}.value`">
            <FormItem>
              <FormLabel :class="cn(index !== 0 && 'sr-only')">
                链接
              </FormLabel>
              <FormDescription :class="cn(index !== 0 && 'sr-only')">
                添加你的网站、博客或社交媒体链接。
              </FormDescription>
              <FormControl :class="cn(index !== 0 && 'mt-1.5')">
                <Input v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </template>
        <Button
          type="button"
          variant="outline"
          size="sm"
          class="mt-2"
          @click="push({ value: '' })"
        >
          添加 URL
        </Button>
      </div>
    </FieldArray>

    <Button type="submit">
      更新资料
    </Button>
  </Form>
</template>

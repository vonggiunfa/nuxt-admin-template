<script setup lang="ts">
import type { SubmissionHandler } from 'vee-validate'
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { toTypedSchema } from '@vee-validate/zod'
import DatePicker from '@/components/DatePicker.vue'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import {
  LANGUAGE_OPTIONS,
  accountFormSchema,
  type AccountFormValues,
} from '@/lib/settingsSchemas'
import { showSubmittedData } from '@/lib/showSubmittedData'

const typedSchema = toTypedSchema(accountFormSchema)

const languageOpen = ref(false)

const onSubmit: SubmissionHandler<AccountFormValues> = (values) => {
  showSubmittedData(values)
}
</script>

<template>
  <Form
    :validation-schema="typedSchema"
    :initial-values="{ name: '', dob: undefined, language: '' }"
    class="space-y-8"
    :on-submit="onSubmit"
  >
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>姓名</FormLabel>
        <FormControl>
          <Input placeholder="你的姓名" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          该姓名将展示在个人资料与邮件中。
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="dob">
      <FormItem class="flex flex-col">
        <FormLabel>出生日期</FormLabel>
        <DatePicker
          :model-value="componentField.modelValue"
          @update:model-value="componentField['onUpdate:modelValue']"
        />
        <FormDescription>
          出生日期用于计算年龄。
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ value, handleChange }" name="language">
      <FormItem class="flex flex-col">
        <FormLabel>语言</FormLabel>
        <Popover v-model:open="languageOpen">
          <PopoverTrigger as-child>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                type="button"
                :class="cn(
                  'w-50 justify-between',
                  !value && 'text-muted-foreground',
                )"
              >
                {{
                  LANGUAGE_OPTIONS.find(l => l.value === value)?.label
                    ?? '选择语言'
                }}
                <ChevronsUpDown class="ms-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent class="w-50 p-0">
            <Command>
              <CommandInput placeholder="搜索语言…" />
              <CommandEmpty>未找到语言。</CommandEmpty>
              <CommandGroup>
                <CommandList>
                  <CommandItem
                    v-for="lang in LANGUAGE_OPTIONS"
                    :key="lang.value"
                    :value="lang.label"
                    @select="() => {
                      handleChange(lang.value)
                      languageOpen = false
                    }"
                  >
                    <Check
                      :class="cn(
                        'size-4',
                        lang.value === value ? 'opacity-100' : 'opacity-0',
                      )"
                    />
                    {{ lang.label }}
                  </CommandItem>
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <FormDescription>
          仪表盘中使用的界面语言。
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit">
      更新账户
    </Button>
  </Form>
</template>

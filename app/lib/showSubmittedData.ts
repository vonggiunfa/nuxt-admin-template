import { toast } from 'vue-sonner'

const DEFAULT_TITLE = '您提交了以下数据：'

/** 对标 react-template `show-submitted-data.tsx`：toast 展示提交负载（MOCK）。 */
export function showSubmittedData(data: unknown, title: string = DEFAULT_TITLE) {
  const description = `\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``
  toast.message(title, { description })
}

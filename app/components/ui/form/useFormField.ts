import { FieldContextKey } from 'vee-validate'
import { computed, inject } from 'vue'
import { FORM_ITEM_INJECTION_KEY } from './injectionKeys'

export function useFormField() {
  const fieldContext = inject(FieldContextKey)
  const fieldItemContext = inject(FORM_ITEM_INJECTION_KEY)

  if (!fieldContext)
    throw new Error('useFormField 必须在 FormField 内使用')

  if (!fieldItemContext)
    throw new Error('useFormField 必须在 FormItem 内使用')

  const { name, errorMessage, meta } = fieldContext
  const id = fieldItemContext

  return {
    id,
    name,
    meta,
    error: errorMessage,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    valid: computed(() => meta.valid),
    dirty: computed(() => meta.dirty),
    touched: computed(() => meta.touched),
  }
}

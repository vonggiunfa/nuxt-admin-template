import { configure } from 'vee-validate'

/**
 * 全站字段校验触发：仅在提交时跑 schema（对齐 react-hook-form 默认 mode / 产品约定）。
 * @see `.cursor/rules/forms-paradigm.mdc`
 */
export default defineNuxtPlugin(() => {
  configure({
    validateOnBlur: false,
    validateOnChange: false,
    validateOnInput: false,
    validateOnModelUpdate: false,
  })
})

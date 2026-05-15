import { useScrollLock } from '@vueuse/core'
import { injectDialogRootContext } from 'reka-ui'

/** 弹窗打开时锁定文档根滚动（便于布局下底层仍可滚动的情况）。 */
export function useDialogRootScrollLock() {
  const ctx = injectDialogRootContext(null)
  if (!ctx)
    return

  const scrollTarget = shallowRef<HTMLElement | null>(null)
  const locked = useScrollLock(scrollTarget)

  onMounted(() => {
    scrollTarget.value = document.documentElement
    locked.value = ctx.open.value
  })

  watch(
    () => ctx.open.value,
    (open) => {
      locked.value = open
    },
  )

  onBeforeUnmount(() => {
    locked.value = false
  })
}

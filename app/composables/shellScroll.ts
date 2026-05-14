import type { InjectionKey, Ref } from 'vue'

export const SHELL_INSET_SCROLL_EL: InjectionKey<Ref<HTMLElement | null>> = Symbol('shellInsetScrollEl')

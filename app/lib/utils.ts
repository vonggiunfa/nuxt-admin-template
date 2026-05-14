import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(ms = 1000) {
  return new Promise<void>(resolve => {
    const t = setTimeout(() => {
      clearTimeout(t)
      resolve()
    }, ms)
  })
}

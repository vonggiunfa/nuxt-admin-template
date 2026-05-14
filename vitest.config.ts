import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

/** Vitest：仅跑 tests 目录下的 *.spec.ts，Node 环境 */
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'node',
    include: ['tests/**/*.spec.ts'],
  },
})

import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['vue-sonner/nuxt'],
  // shadcn 的 ui/*/index.ts 仅导出组件与 cva；若参与自动注册会与 *.vue 重名为 Ui* 冲突
  components: [{ path: '~/components', extensions: ['vue'] }],
  css: ['./app/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})

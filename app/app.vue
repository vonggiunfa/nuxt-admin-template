<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>

<template>
  <NuxtLoadingIndicator color="var(--muted-foreground)" :height="2" />
  <ClientOnly>
    <Toaster position="bottom-right" />
  </ClientOnly>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>

<template>
  <ClientOnly>
    <Toaster position="bottom-right" />
  </ClientOnly>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

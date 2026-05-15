<script setup lang="ts">
import { Download } from 'lucide-vue-next'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppMain from '@/components/layout/AppMain.vue'
import { Button } from '@/components/ui/button'
import DataCollectionComposer from '@/features/data-collection/DataCollectionComposer.vue'

definePageMeta({ layout: 'authenticated' })
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <AppHeader />
    <AppMain layout="fixed">
      <div class="flex min-h-0 flex-1 flex-col gap-4">
        <div class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-4">
          <div>
            <div class="flex flex-wrap items-center justify-between gap-4">
              <h2 class="text-2xl font-bold tracking-tight">
                数据采集
              </h2>
              <Button disabled type="button">
                <span>导出</span>
                <Download :size="18" class="shrink-0" />
              </Button>
            </div>
            <p class="mt-2 text-muted-foreground">
              采集结果将显示在此处。
            </p>
          </div>
        </div>
        <DataCollectionComposer />
      </div>
    </AppMain>
  </div>
</template>

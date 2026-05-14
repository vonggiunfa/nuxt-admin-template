<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppMain from '@/components/layout/AppMain.vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Activity, CreditCard, DollarSign, Users } from 'lucide-vue-next'

definePageMeta({ layout: 'authenticated' })
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <AppHeader />
    <AppMain>
      <div class="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-bold tracking-tight">
          仪表盘
        </h1>
        <div class="flex items-center gap-2">
          <Button variant="outline">
            下载
          </Button>
        </div>
      </div>

      <Tabs default-value="overview" class="space-y-4">
        <div class="w-full overflow-x-auto pb-2">
          <TabsList>
            <TabsTrigger value="overview">
              总览
            </TabsTrigger>
            <TabsTrigger value="analytics">
              分析
            </TabsTrigger>
            <TabsTrigger value="reports" disabled>
              报表
            </TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              通知
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">
                  总收入
                </CardTitle>
                <DollarSign class="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">
                  ¥45,231.89
                </div>
                <p class="text-xs text-muted-foreground">
                  较上月 +20.1%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">
                  订阅数
                </CardTitle>
                <Users class="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">
                  +2350
                </div>
                <p class="text-xs text-muted-foreground">
                  较上月 +180.1%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">
                  销售额
                </CardTitle>
                <CreditCard class="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">
                  +12,234
                </div>
                <p class="text-xs text-muted-foreground">
                  较上月 +19%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle class="text-sm font-medium">
                  当前在线
                </CardTitle>
                <Activity class="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">
                  +573
                </div>
                <p class="text-xs text-muted-foreground">
                  过去一小时 +201
                </p>
              </CardContent>
            </Card>
          </div>

          <div class="grid gap-4 lg:grid-cols-7">
            <Card class="col-span-4">
              <CardHeader>
                <CardTitle>总览</CardTitle>
                <CardDescription>图表占位区域</CardDescription>
              </CardHeader>
              <CardContent class="h-[280px] rounded-md bg-muted/40" />
            </Card>
            <Card class="col-span-3">
              <CardHeader>
                <CardTitle>最近成交</CardTitle>
                <CardDescription>静态示例行</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="space-y-4">
                  <div v-for="i in 5" :key="i" class="flex items-center gap-3">
                    <div class="size-9 rounded-full bg-muted" />
                    <div class="min-w-0 flex-1 space-y-1">
                      <p class="truncate text-sm font-medium leading-none">
                        客户 {{ i }}
                      </p>
                      <p class="truncate text-xs text-muted-foreground">
                        kehu{{ i }}@example.com
                      </p>
                    </div>
                    <div class="font-medium">
                      +¥{{ 100 * i }}.00
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" class="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>分析</CardTitle>
              <CardDescription>分析占位</CardDescription>
            </CardHeader>
            <CardContent class="h-[240px] rounded-md bg-muted/40" />
          </Card>
        </TabsContent>
      </Tabs>
    </AppMain>
  </div>
</template>

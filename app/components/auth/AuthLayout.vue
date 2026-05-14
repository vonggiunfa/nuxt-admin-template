<template>
  <div class="container grid h-svh w-full max-w-none items-center justify-center">
    <div
      class="mx-auto flex w-[min(24rem,calc(100vw-2rem))] shrink-0 flex-col justify-center space-y-2 py-8 sm:p-8"
    >
      <div class="mb-4 flex items-center justify-center">
        <Logo class="me-2" />
        <h1 class="text-xl font-medium">
          Shadcn 管理后台
        </h1>
      </div>
      <slot />
    </div>
  </div>
</template>

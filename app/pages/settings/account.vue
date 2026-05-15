<script setup lang="ts">
import SettingsContentSection from '@/features/settings/components/SettingsContentSection.vue'
import AccountForm from '@/features/settings/account/AccountForm.vue'

definePageMeta({ layout: 'authenticated' })
</script>

<template>
  <SettingsContentSection
    title="个人账户"
    desc="更新个人账户设置，设置首选语言与时区。"
  >
    <AccountForm />
  </SettingsContentSection>
</template>

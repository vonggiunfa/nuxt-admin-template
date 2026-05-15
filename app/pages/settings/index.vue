<script setup lang="ts">
import SettingsContentSection from '@/features/settings/components/SettingsContentSection.vue'
import ProfileForm from '@/features/settings/profile/ProfileForm.vue'

definePageMeta({ layout: 'authenticated' })
</script>

<template>
  <SettingsContentSection
    title="个人资料"
    desc="此处展示的信息将对站内其他用户可见。"
  >
    <ProfileForm />
  </SettingsContentSection>
</template>

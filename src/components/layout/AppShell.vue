<script setup lang="ts">
import DesktopHeader from '@/components/layout/DesktopHeader.vue'
import MobileBottomNav from '@/components/layout/MobileBottomNav.vue'
import MobileHeader from '@/components/layout/MobileHeader.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <DesktopHeader />
    <MobileHeader />

    <main class="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-4 sm:px-6 md:pb-10 md:pt-8">
      <slot />
    </main>

    <MobileBottomNav />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { LayoutDashboard, LogOut, User } from '@lucide/vue'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { initials } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()

async function handleLogout() {
  await auth.logout()
  toast.success('Vous êtes déconnecté.')
  router.push({ name: 'catalog' })
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button
        type="button"
        class="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar>
          <AvatarFallback>{{ initials(auth.user?.name ?? '?') }}</AvatarFallback>
        </Avatar>
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuLabel class="truncate">{{ auth.user?.name }}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem as-child>
        <RouterLink :to="{ name: 'profile' }">
          <User />
          Mon profil
        </RouterLink>
      </DropdownMenuItem>
      <DropdownMenuItem v-if="auth.isAdmin" as-child>
        <RouterLink :to="{ name: 'admin-dashboard' }">
          <LayoutDashboard />
          Administration
        </RouterLink>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive" @select="handleLogout">
        <LogOut />
        Se déconnecter
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

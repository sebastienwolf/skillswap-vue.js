<script setup lang="ts">
import { useRouter } from 'vue-router'
import { CalendarClock, LogOut, Package, ShieldCheck } from '@lucide/vue'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { initials } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { userRoleLabels } from '@/types/enums'

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
  <div v-if="auth.user" class="mx-auto max-w-xl space-y-6">
    <Card>
      <CardHeader class="flex-row items-center gap-4 space-y-0">
        <Avatar class="size-14">
          <AvatarFallback class="text-lg">{{ initials(auth.user.name) }}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{{ auth.user.name }}</CardTitle>
          <p class="text-sm text-muted-foreground">{{ auth.user.email }}</p>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <Badge v-if="auth.user.role" variant="outline">
            <ShieldCheck class="size-3.5" />
            {{ userRoleLabels[auth.user.role] }}
          </Badge>
          <Badge variant="outline">Membre depuis {{ auth.user.member_since }}</Badge>
        </div>

        <Separator />

        <div class="grid grid-cols-2 gap-3">
          <RouterLink
            :to="{ name: 'my-listings' }"
            class="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center transition-colors hover:bg-accent"
          >
            <Package class="size-5 text-muted-foreground" />
            <span class="text-sm font-medium">Mes annonces</span>
          </RouterLink>
          <RouterLink
            :to="{ name: 'reservations' }"
            class="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center transition-colors hover:bg-accent"
          >
            <CalendarClock class="size-5 text-muted-foreground" />
            <span class="text-sm font-medium">Réservations</span>
          </RouterLink>
        </div>

        <Button variant="outline" class="w-full text-destructive hover:text-destructive" @click="handleLogout">
          <LogOut />
          Se déconnecter
        </Button>
      </CardContent>
    </Card>
  </div>
</template>

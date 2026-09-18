<script setup lang="ts">
import { Package, Plus, Sparkles } from '@lucide/vue'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button size="sm">
        <Plus />
        Publier
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem as-child>
        <RouterLink :to="{ name: 'item-create' }">
          <Package />
          Un objet
        </RouterLink>
      </DropdownMenuItem>
      <DropdownMenuItem as-child>
        <RouterLink :to="{ name: 'skill-create' }">
          <Sparkles />
          Une compétence
        </RouterLink>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

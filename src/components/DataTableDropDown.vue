<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { MoreHorizontal } from 'lucide-vue-next'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ref } from 'vue'
import { deleteContact } from '@/services/clientsService'
import EditContactDialog from './EditContactDialog.vue'

defineProps<{
  client: {
    id: string
  }
}>()

const isEditDialogOpen = ref(false)
const isDeleteDialogOpen = ref(false)

// Delete mutation
const queryClient = useQueryClient()
const { mutate: deleteItem } = useMutation({
  mutationFn: deleteContact,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['scheduleEvents'] })
  },
})

function onDelete(id: string) {
  deleteItem(id)
  isDeleteDialogOpen.value = false
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Ações</DropdownMenuLabel>
      <DropdownMenuItem @click="isEditDialogOpen = true">Editar</DropdownMenuItem>
      <DropdownMenuItem @click="isDeleteDialogOpen = true">Excluir</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <EditContactDialog :clientId="client.id" v-model:open="isEditDialogOpen" />

  <AlertDialog v-model:open="isDeleteDialogOpen">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
        <AlertDialogDescription>
          Esta ação não pode ser desfeita. Isso irá excluir permanentemente este contato.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="isDeleteDialogOpen = false">Cancelar</AlertDialogCancel>
        <AlertDialogAction
          @click="onDelete(client.id)"
          class="bg-red-600 text-white hover:bg-red-700"
        >
          Excluir
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

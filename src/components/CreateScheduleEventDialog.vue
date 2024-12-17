<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { toTypedSchema } from '@vee-validate/zod'
import { ref } from 'vue'
import * as z from 'zod'
import { useToast } from './ui/toast/use-toast'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { createScheduleEvent } from '@/services/clientsService'
import { Plus } from 'lucide-vue-next'

// Validation schema
const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(2).max(50),
    email: z.string().email(),
    phone: z.string().min(10).max(15),
  }),
)

const { toast } = useToast()

const isCreateScheduleEventDialogOpen = ref(false)

const queryClient = useQueryClient()

const { mutate, isPending } = useMutation({
  mutationFn: createScheduleEvent,
  onMutate: () => {
    toast({
      title: 'Creating event...',
      description: 'Please wait a moment.',
    })
  },
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ['scheduleEvents'],
    })

    // Close the dialog after success
    isCreateScheduleEventDialogOpen.value = false
    toast({
      title: 'Event created!',
      description: 'The event has been created successfully.',
    })
  },
  onError: (error) => {
    toast({
      title: 'An error occurred',
      description: error.message,
      variant: 'destructive',
    })
  },
})

// Function to submit the form
function onSubmit(values: Record<string, string>) {
  const payload = {
    name: values.username,
    email: values.email,
    phoneNumber: values.phone,
  }
  mutate(payload)
}

// Function to handle cancel button
function onCancel() {
  isCreateScheduleEventDialogOpen.value = false
}
</script>

<template>
  <Form v-slot="{ handleSubmit }" as="" keep-values :validation-schema="formSchema">
    <Dialog v-model:open="isCreateScheduleEventDialogOpen">
      <DialogTrigger as-child>
        <Button variant="outline"> <Plus /> Criar evento </Button>
      </DialogTrigger>

      <DialogContent class="w-5/6">
        <DialogHeader>
          <DialogTitle>Crie um novo evento no seu calendário</DialogTitle>
          <DialogDescription> Preencha as informações do usuário. </DialogDescription>
        </DialogHeader>

        <form class="flex flex-col gap-3" id="dialogForm" @submit="handleSubmit($event, onSubmit)">
          <FormField v-slot="{ componentField }" name="username">
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input type="text" placeholder="shadcn" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="phone">
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input type="text" placeholder="telefone" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </form>

        <DialogFooter>
          <Button :disabled="isPending" type="button" variant="secondary" @click="onCancel">
            Cancelar
          </Button>

          <Button :loading="isPending" type="submit" form="dialogForm"> Salvar </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Form>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { ref, watch } from 'vue'
import * as z from 'zod'
import { useMutation, useQueryClient, useQuery } from '@tanstack/vue-query'
import { fetchContactById, updateContact } from '@/services/clientsService'
import { useToast } from './ui/toast/use-toast'

const props = defineProps<{ clientId: string }>()
const model = defineModel<boolean>('open', { required: true })

const { toast } = useToast()
const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    phoneNumber: z.string().min(10).max(15),
  }),
)
const { data: contactData, isLoading } = useQuery({
  queryKey: ['contact', props.clientId],
  queryFn: () => fetchContactById(props.clientId),
  enabled: model,
})

const formValues = ref({
  name: '',
  email: '',
  phoneNumber: '',
})

watch(contactData, (newData) => {
  if (newData) {
    formValues.value = { ...newData }
  }
})

const queryClient = useQueryClient()
const { mutate: update, isPending } = useMutation({
  mutationFn: (updatedData) => updateContact(props.clientId, updatedData),
  onSuccess: () => {
    toast({
      title: 'Contact updated!',
      description: 'The contact has been updated successfully.',
    })
    queryClient.invalidateQueries({ queryKey: ['scheduleEvents'] })
    model.value = false
  },
  onError: (error) => {
    toast({
      title: 'Error updating contact',
      description: error.message,
      variant: 'destructive',
    })
  },
})

function onSubmit(values: any) {
  update(values)
}
</script>

<template>
  <Form v-slot="{ handleSubmit }" :validation-schema="formSchema">
    <Dialog v-model:open="model">
      <DialogContent class="w-5/6">
        <DialogHeader>
          <DialogTitle>Editar contato</DialogTitle>
          <DialogDescription>Atualize os detalhes do contato.</DialogDescription>
        </DialogHeader>

        <form v-if="!isLoading" @submit.prevent="handleSubmit($event, onSubmit)">
          <FormField v-slot="{ componentField }" name="name" v-model="formValues.name">
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Nome" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="email" v-model="formValues.email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="phoneNumber"
            v-model="formValues.phoneNumber"
          >
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Telefone" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <DialogFooter class="mt-4">
            <Button type="button" variant="secondary" @click="model = false">Cancelar</Button>
            <Button type="submit" :loading="isPending">Salvar</Button>
          </DialogFooter>
        </form>
        <div v-else>Carregando...</div>
      </DialogContent>
    </Dialog>
  </Form>
</template>

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { toTypedSchema } from '@vee-validate/zod'
import { h } from 'vue'
import * as z from 'zod'

const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(2).max(50),
    email: z.string().email(),
    phone: z.string().min(10).max(15),
  }),
)

function onSubmit(values: any) {
  toast({
    title: 'You submitted the following values:',
    description: h(
      'pre',
      { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' },
      h('code', { class: 'text-white' }, JSON.stringify(values, null, 2)),
    ),
  })
}
</script>

<template>
  <Form v-slot="{ handleSubmit }" as="" keep-values :validation-schema="formSchema">
    <Dialog>
      <DialogTrigger as-child>
        <Button variant="outline"> Criar evento </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
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
          <Button type="submit" form="dialogForm"> Save changes </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Form>
</template>

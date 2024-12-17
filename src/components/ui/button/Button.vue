<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Primitive, type PrimitiveProps } from 'radix-vue'
import { type ButtonVariants, buttonVariants } from '.'
import { Loader } from 'lucide-vue-next'
interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  loading: false,
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), { ' cursor-not-allowed': loading }, props.class)"
    :disabled="loading"
  >
    <slot v-if="!loading" />
    <template class="flex items-center gap-1" v-if="loading">
      Carregando <Loader class="animate-spin" />
    </template>
  </Primitive>
</template>

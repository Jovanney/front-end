import { ref, watch, type Ref } from 'vue'

/**
 * Debounces a reactive value by a specified delay.
 *
 * @param inputRef The ref that you want to debounce.
 * @param delay The delay in milliseconds.
 * @returns A new ref that updates only after the specified delay.
 */
export function useDebounce<T>(inputRef: Ref<T>, delay = 300): Ref<T> {
  const debounced = ref(inputRef.value) as Ref<T>
  let timeout: number | undefined

  watch(inputRef, (newVal) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = window.setTimeout(() => {
      debounced.value = newVal
    }, delay)
  })

  return debounced
}

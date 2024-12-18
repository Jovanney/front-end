<script setup lang="ts">
import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import CreateSceduleEventDialog from '@/components/CreateScheduleEventDialog.vue'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CaretSortIcon } from '@radix-icons/vue'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { computed, h, ref } from 'vue'
import { cn, valueUpdater } from '@/lib/utils'
import { useQuery } from '@tanstack/vue-query'
import { fetchContacts } from '@/services/clientsService'
import { useDebounce } from '@/composables/useDebounce'

export interface UserSchedule {
  name: string
  email: string
  phoneNumber: string
}

const search = ref<string>('')
const debouncedSearch = useDebounce(search, 500)
const queryKey = computed(() => ['scheduleEvents', debouncedSearch.value])
const { isPending, data } = useQuery({
  queryKey: queryKey,
  queryFn: () => fetchContacts(debouncedSearch.value),
})

const columns: ColumnDef<UserSchedule>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        checked:
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate'),
        'onUpdate:checked': (value) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Select all',
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        'onUpdate:checked': (value) => row.toggleSelected(!!value),
        ariaLabel: 'Select row',
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Email', h(CaretSortIcon, { class: 'h-4 w-4 ' })],
      )
    },
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('email')),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Name', h(CaretSortIcon, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('name')),
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Phone', h(CaretSortIcon, { class: 'ml-2 h-4 w-4' })],
      )
    },
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('phoneNumber')),
  },
  // {
  //   id: 'actions',
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const payment = row.original

  //     return h(DropdownAction, {
  //       payment,
  //       onExpand: row.toggleExpanded,
  //     })
  //   },
  // },
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const rowSelection = ref({})
const tableData = computed(() => data.value || [])

const table = useVueTable({
  data: tableData || [],
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
  onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelection),
  state: {
    get sorting() {
      return sorting.value
    },

    get rowSelection() {
      return rowSelection.value
    },
  },
})
</script>

<template>
  <div class="w-full">
    <div class="flex gap-2 items-center justify-between py-4">
      <Input class="max-w-sm" placeholder="Filter emails..." v-model="search" />
      <CreateSceduleEventDialog />
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="isPending">
            <TableRow>
              <TableCell :colspan="columns.length" class="text-center py-4">
                <div class="flex justify-center items-center">
                  <span class="ml-2 font-semibold">Loading...</span>
                </div>
              </TableCell>
            </TableRow>
          </template>
          <template v-else-if="table.getRowModel().rows?.length">
            <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <TableRow v-else>
            <TableCell :colspan="columns.length" class="text-center py-4"
              >No results found.</TableCell
            >
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <div class="flex items-center justify-end space-x-2 py-4">
      <div class="flex-1 text-sm text-muted-foreground">
        {{ table.getFilteredSelectedRowModel().rows.length }} of
        {{ table.getFilteredRowModel().rows.length }} row(s) selected.
      </div>
      <div class="space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>

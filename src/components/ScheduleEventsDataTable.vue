<script setup lang="ts">
import type {
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

export interface UserSchedule {
  name: string
  email: string
  phoneNumber: string
}

const { isPending, data } = useQuery({
  queryKey: ['scheduleEvents'],
  queryFn: fetchContacts,
})

const columnHelper = createColumnHelper<UserSchedule>()

const columns = [
  columnHelper.accessor('email', {
    header: 'EMAIL',
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('email')),
  }),
  columnHelper.accessor('name', {
    header: 'NOME',
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('name')),
  }),
  columnHelper.accessor('phoneNumber', {
    header: 'TELEFONE',
    cell: ({ row }) => h('div', { class: 'text-left' }, row.getValue('phoneNumber')),
  }),
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
})
</script>

<template>
  <div class="w-full">
    <div class="flex gap-2 items-center justify-between py-4">
      <Input
        class="max-w-sm"
        placeholder="Filter emails..."
        :model-value="table.getColumn('email')?.getFilterValue() as string"
        @update:model-value="table.getColumn('email')?.setFilterValue($event)"
      />
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
  </div>
</template>

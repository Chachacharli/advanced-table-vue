<script setup lang="ts">
import AdvanceTable from './components/AdvanceTable.vue'

import {
  type AdvancedHeader,
  // type AdvancedTableProps,
  type AdvnacedTableConfig,
} from './types/AdvanceTable'
import { type Ref, ref } from 'vue'

const headers: AdvancedHeader[] = [
  { id: '1', label: 'Name', key: 'name', sorteable: true },
  { id: '2', label: 'Email', key: 'email', sorteable: true },
]

const tableData: Ref<any[]> = ref([
  {
    id: '1',
    name: 'John Doe',
    email: 'jonhdoe@email.com',
  },
  {
    id: '2',
    name: 'Jane Doe',
    email: 'jonhdoe@email.com',
  },
  {
    id: '3',
    name: 'Johannes Doebles',
    email: 'JohannesDoebles@email.com',
  },
])

// mutiply table data 3 times
tableData.value = [...tableData.value, ...tableData.value, ...tableData.value]

const config: Ref<AdvnacedTableConfig> = ref({
  hover: true,
  pointer: true,
  risizable: true,
})
</script>

<template>
  <main>
    <AdvanceTable :items="tableData" :headers="headers" :config="config"></AdvanceTable>
  </main>
</template>

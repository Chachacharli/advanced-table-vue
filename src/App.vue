<script setup lang="ts">
import AdvanceTable from './components/AdvanceTable.vue'

import {
  type AdvancedHeader,
  // type AdvancedTableProps,
  type AdvnacedTableConfig,
} from './types/AdvanceTable'
import { type Ref, ref } from 'vue'

const headers: AdvancedHeader[] = [
  {
    id: 'folio',
    key: 'folio',
    label: 'Folio',
  },
  {
    id: 'status',
    key: 'status',
    label: 'Estatus',
  },
  {
    id: 'side',
    key: 'side',
    label: 'Direccion',
  },
  {
    id: 'currencyPair',
    key: 'currencyPair',
    label: 'Instrumento',
  },
  {
    id: 'baseCurrency',
    key: 'baseCurrency',
    label: 'Divisa Importe',
  },
  {
    id: 'termCurrency',
    key: 'termCurrency',
    label: 'currencyCounterValue',
  },
  {
    id: 'counterPartAmount',
    key: 'counterPartAmount',
    label: 'counterValue',
  },
  {
    id: 'amount',
    key: 'amount',
    label: 'import',
  },
  {
    id: 'price',
    key: 'exchangeRate',
    label: 'exchangeRate',
  },
  {
    id: 'customerName',
    key: 'customerName',
    label: 'customer',
  },
  {
    id: 'userName',
    key: 'userName',
    label: 'user',
  },
  {
    id: 'bankName',
    key: 'bankName',
    label: 'Contraparte',
  },
  {
    id: 'dateCreated',
    key: 'dateCreated',
    label: 'Fecha de ejecución',
  },
  {
    id: 'orderPriceConfirmationType',
    key: 'orderPriceConfirmationType',
    label: 'orderPriceConfirmationType',
  },
  {
    id: 'rejectReason',
    key: 'rejectReason',
    label: 'Motivo de rechazo',
  },
]

type Operation = {
  folio: string
  status: string
  side: string
  currencyPair: string
  baseCurrency: string
  termCurrency: string
  counterPartAmount: number
  amount: number
  exchangeRate: number
  customerName: string
  userName: string
  bankName: string
  dateCreated: string
  orderPriceConfirmationType: string
  rejectReason: string
}

const tableData: Ref<Operation[]> = ref([
  {
    folio: '12345',
    status: 'Completed',
    side: 'Buy',
    currencyPair: 'EUR/USD',
    baseCurrency: 'EUR',
    termCurrency: 'USD',
    counterPartAmount: 1000,
    amount: 2000,
    exchangeRate: 1.1,
    customerName: 'John Doe',
    userName: 'johndoe',
    bankName: 'Bank ABC',
    dateCreated: '2025-03-01',
    orderPriceConfirmationType: 'Market',
    rejectReason:
      'lñkasjdflkñasjdflkasjdñflkajsdklfñ aslñkjdfklasjdflañs dlkfdjasñdlkfjas fñlkfsdajñaflksj sadñ aksdfjalsñkjdf',
  },
  {
    folio: '12346',
    status: 'Pending',
    side: 'Sell',
    currencyPair: 'GBP/USD',
    baseCurrency: 'GBP',
    termCurrency: 'USD',
    counterPartAmount: 1500,
    amount: 3000,
    exchangeRate: 1.3,
    customerName: 'Jane Smith',
    userName: 'janesmith',
    bankName: 'Bank XYZ',
    dateCreated: '2025-03-02',
    orderPriceConfirmationType: 'Limit',
    rejectReason: '',
  },
  {
    folio: '12347',
    status: 'Rejected',
    side: 'Buy',
    currencyPair: 'USD/JPY',
    baseCurrency: 'USD',
    termCurrency: 'JPY',
    counterPartAmount: 2000,
    amount: 4000,
    exchangeRate: 110,
    customerName: 'Alice Brown',
    userName: 'alicebrown',
    bankName: 'Bank DEF',
    dateCreated: '2025-03-03',
    orderPriceConfirmationType: 'Market',
    rejectReason: 'Insufficient funds',
  },
  {
    folio: '12348',
    status: 'Completed',
    side: 'Sell',
    currencyPair: 'AUD/USD',
    baseCurrency: 'AUD',
    termCurrency: 'USD',
    counterPartAmount: 500,
    amount: 1000,
    exchangeRate: 0.7,
    customerName: 'Bob White',
    userName: 'bobwhite',
    bankName: 'Bank GHI',
    dateCreated: '2025-03-04',
    orderPriceConfirmationType: 'Market',
    rejectReason: '',
  },
  {
    folio: '12349',
    status: 'Pending',
    side: 'Buy',
    currencyPair: 'EUR/GBP',
    baseCurrency: 'EUR',
    termCurrency: 'GBP',
    counterPartAmount: 1200,
    amount: 2400,
    exchangeRate: 0.85,
    customerName: 'Charlie Green',
    userName: 'charliegreen',
    bankName: 'Bank JKL',
    dateCreated: '2025-03-05',
    orderPriceConfirmationType: 'Limit',
    rejectReason: '',
  },
])

tableData.value = [...tableData.value, ...tableData.value, ...tableData.value]

const config: Ref<AdvnacedTableConfig> = ref({
  hover: true,
  pointer: true,
  risizable: true,
  noItemMessage: 'No items found',
})

const handlerClick = (item: Operation) => {
  console.log('clicked', item)
}
</script>

<template>
  <main>
    <AdvanceTable :items="tableData" :headers="headers" :config="config" :row-click="handlerClick">
    </AdvanceTable>
  </main>
</template>

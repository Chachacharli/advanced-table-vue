// useDraggableColumns.ts
import { ref, type Ref, onMounted } from 'vue'
import type { AdvancedHeader } from '@/types/AdvanceTable'

export function useDraggableColumns(headers: Ref<AdvancedHeader[]>) {
  const draggedColumnIndex = ref<number | null>(null)

  const saveColumnOrder = () => {
    const order = headers.value.map((header) => header.key)
    localStorage.setItem('tableColumnOrder', JSON.stringify(order))
  }

  const restoreColumnOrder = () => {
    const savedOrder = localStorage.getItem('tableColumnOrder')
    if (savedOrder) {
      const order = JSON.parse(savedOrder)
      headers.value.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key))
    }
  }

  const onDragStart = (event: DragEvent, index: number) => {
    draggedColumnIndex.value = index
    event.dataTransfer?.setData('text/plain', index.toString()) // Guardar el índice en el evento
  }

  const onDragOver = (event: DragEvent) => {
    event.preventDefault()
  }

  const onDrop = (index: number) => {
    if (draggedColumnIndex.value === null || draggedColumnIndex.value === index) return

    const updatedHeaders = [...headers.value]
    const [draggedColumn] = updatedHeaders.splice(draggedColumnIndex.value, 1)
    updatedHeaders.splice(index, 0, draggedColumn)

    headers.value = updatedHeaders
    draggedColumnIndex.value = null
    saveColumnOrder()
  }

  onMounted(() => {
    restoreColumnOrder()
  })

  return { onDragStart, onDragOver, onDrop }
}

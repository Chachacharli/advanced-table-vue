// useDraggableColumns.ts
import { ref, type Ref } from 'vue'
import type { AdvancedHeader } from '@/types/AdvanceTable'

export function useDraggableColumns(headers: Ref<AdvancedHeader[]>) {
  const draggedColumnIndex = ref<number | null>(null)

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
  }

  return { onDragStart, onDragOver, onDrop }
}

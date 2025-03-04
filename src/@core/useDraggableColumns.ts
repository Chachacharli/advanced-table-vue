// useDraggableColumns.ts
import { ref, type Ref, onMounted } from 'vue'
import type { AdvancedHeader } from '@/types/AdvanceTable'

export function useDraggableColumns(headers: Ref<AdvancedHeader[]>) {
  const draggedColumnIndex = ref<number | null>(null)
  const dragOverIndex = ref<number | null>(null)

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

  const clearDragOverClass = () => {
    const ths = document.querySelectorAll('th')
    ths.forEach((th) => th.classList.remove('drag-over-left'))
  }

  const onDragStart = (event: DragEvent, index: number) => {
    draggedColumnIndex.value = index
    event.dataTransfer?.setData('text/plain', index.toString())

    const thElement = (event.target as HTMLElement).closest('th')
    if (thElement) {
      const clone = thElement.cloneNode(true) as HTMLElement
      clone.style.position = 'absolute'
      clone.style.top = '-9999px'

      clone.style.transform = 'rotate(8deg)'
      clone.style.background = 'white'
      clone.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)'
      clone.style.opacity = '0.9'
      clone.style.padding = '8px'
      clone.style.border = '1px solid #ccc'
      clone.style.zIndex = '9999'
      clone.style.maxWidth = '200px'

      document.body.appendChild(clone)
      event.dataTransfer?.setDragImage(clone, 10, 10)

      setTimeout(() => document.body.removeChild(clone), 0)
    }
  }

  const onDragOver = (event: DragEvent, index: number) => {
    event.preventDefault()
    if (dragOverIndex.value !== index) {
      clearDragOverClass()
      dragOverIndex.value = index

      const th = (event.target as HTMLElement).closest('th')
      if (th) {
        th.classList.add('drag-over-left')
      }
    }
  }

  const onDragLeave = (event: DragEvent) => {
    const th = (event.target as HTMLElement).closest('th')
    if (th) {
      th.classList.remove('drag-over-left')
    }
  }

  const onDrop = (index: number) => {
    if (draggedColumnIndex.value === null || draggedColumnIndex.value === index) return

    const updatedHeaders = [...headers.value]
    const [draggedColumn] = updatedHeaders.splice(draggedColumnIndex.value, 1)
    updatedHeaders.splice(index, 0, draggedColumn)

    headers.value = updatedHeaders
    draggedColumnIndex.value = null
    dragOverIndex.value = null
    saveColumnOrder()
    clearDragOverClass()
  }

  onMounted(() => {
    restoreColumnOrder()
  })

  return { onDragStart, onDragOver, onDragLeave, onDrop }
}

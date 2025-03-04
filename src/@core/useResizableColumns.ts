import { onMounted, onUnmounted, type Ref } from 'vue'
import { type AdvancedHeader } from '@/types/AdvanceTable'

type Width = {
  key: string
  width: number
}

export function useResizableColumns(
  tableRef: Ref<HTMLElement | undefined>,
  headers: Ref<AdvancedHeader[]>,
) {
  let curCol: HTMLElement | null = null
  let pageX = 0
  let curColWidth = 0
  let tableWidth = 0

  const MIN_WIDTH = 50

  const saveColumnWidths = () => {
    const widths = headers.value.map((header) => ({
      key: header.key,
      width: document.querySelector(`th[data-key="${header.key}"]`)?.clientWidth || 'auto',
    }))
    localStorage.setItem('tableColumnWidths', JSON.stringify(widths))
  }

  const createDiv = () => {
    const div = document.createElement('div')
    div.style.top = '0'
    div.style.right = '0'
    div.style.width = '5px'
    div.style.position = 'absolute'
    div.style.cursor = 'col-resize'
    div.style.userSelect = 'none'
    div.style.height = `100%`
    div.classList.add('resize-handle')
    return div
  }

  const paddingDiff = (col: HTMLElement) => {
    if (getStyleVal(col, 'box-sizing') === 'border-box') return 0
    const padLeft = getStyleVal(col, 'padding-left')
    const padRight = getStyleVal(col, 'padding-right')
    return parseInt(padLeft) + parseInt(padRight)
  }

  const getStyleVal = (elm: HTMLElement, css: string) => {
    return window.getComputedStyle(elm, null).getPropertyValue(css)
  }

  const onMouseMove = (e: MouseEvent) => {
    if (!curCol) return

    const diffX = e.pageX - pageX
    const newWidth = curColWidth + diffX

    // Verificar si la columna alcanzó el tamaño mínimo
    if (newWidth >= MIN_WIDTH) {
      curCol.style.width = `${newWidth}px`

      if (tableRef.value) {
        tableRef.value.style.width = `${tableWidth + diffX}px`
      }
    }

    if (curCol && newWidth < MIN_WIDTH) {
      curCol.style.width = `${MIN_WIDTH}px`
      if (tableRef.value) {
        return
      }
    }
  }

  const onMouseUp = () => {
    curCol = null
    pageX = 0
    curColWidth = 0
    saveColumnWidths()
  }

  const restoreColumnWidths = () => {
    let tableWidth = 0
    const savedWidths = localStorage.getItem('tableColumnWidths')
    if (savedWidths) {
      const widths: Width[] = JSON.parse(savedWidths)
      widths.forEach((width: Width) => {
        const column = document.querySelector(`th[data-key="${width.key}"]`) as HTMLElement
        if (column) {
          column.style.width = `${width.width}px`
          tableWidth += width.width
        }
        tableRef.value?.style.setProperty('width', `${tableWidth}px`, 'important')
      })
    }
    const table = tableRef.value
    if (table) {
      // que el width de la tabla sea igual a la sumna de todos los widths de las columnas
      const cols = table.querySelectorAll('thead tr th')
      let totalWidth = 0
      cols.forEach((col) => {
        totalWidth += col.clientWidth
      })
      table.style.width = `${totalWidth}px`
    }
  }

  const initResizableGrid = () => {
    if (!tableRef.value) return

    const table = tableRef.value
    const row = table.querySelector('thead tr')
    if (!row) return

    const cols = row.children
    table.style.overflow = 'hidden'

    for (let i = 0; i < cols.length; i++) {
      const col = cols[i] as HTMLElement
      col.style.position = 'relative'
      col.style.minWidth = `${MIN_WIDTH}px`

      const div = createDiv()
      col.appendChild(div)

      div.addEventListener('mousedown', (e) => {
        if (!tableRef.value) return

        tableWidth = tableRef.value.offsetWidth
        curCol = (e.target as HTMLElement)?.parentElement
        pageX = e.pageX

        if (curCol) {
          const padding = paddingDiff(curCol)
          curColWidth = curCol.offsetWidth - padding
        }
      })

      div.addEventListener('mouseover', (e) => {
        const target = e.target as HTMLElement
        if (target.closest('thead')) {
          target.classList.add('border-resize-active')
        }
      })

      div.addEventListener('mouseout', (e) => {
        ;(e.target as HTMLElement).classList.remove('border-resize-active')
      })
    }
  }

  onMounted(() => {
    initResizableGrid()
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    restoreColumnWidths()
  })

  onUnmounted(() => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  })
}

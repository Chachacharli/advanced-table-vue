import { onMounted, onUnmounted, type Ref } from 'vue'

export function useResizableColumns(tableRef: Ref<HTMLElement | undefined>) {
  let curCol: HTMLElement | null = null
  let pageX = 0
  let curColWidth = 0
  // let nxtColWidth = 0
  let tableWidth = 0

  const MIN_WIDTH = 50 // Definir el ancho mínimo de las columnas

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
    // nxtColWidth = 0
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
      col.style.minWidth = `${MIN_WIDTH}px` // Establecer el ancho mínimo

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
  })

  onUnmounted(() => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  })
}

import { ref } from 'vue'

export function useSortableColumns() {
  const sortState = ref<{ [key: string]: 'ASC' | 'DESC' | null }>({})

  const toggleSort = (key: string) => {
    // Reiniciar el estado de todas las columnas
    Object.keys(sortState.value).forEach((col) => {
      if (col !== key) sortState.value[col] = null
    })

    if (Object.keys(sortState.value)[0] !== key) {
      sortState.value = {}
    }

    // Alternar el estado de la columna seleccionada
    if (sortState.value[key] === 'ASC') {
      sortState.value[key] = 'DESC'
    } else if (sortState.value[key] === 'DESC') {
      sortState.value[key] = null
    } else {
      sortState.value[key] = 'ASC'
    }
  }

  return {
    sortState,
    toggleSort,
  }
}

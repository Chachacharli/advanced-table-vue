<template>
  <main name="advanced-table-container">
    <table ref="tableRef" class="advanced-table resizable">
      <thead>
        <tr class="advanced-table-header-row">
          <th
            v-for="(header, index) in headers"
            :key="header.key"
            @dragover="(event) => onDragOver(event, index)"
            @drop="onDrop(index)"
            @mouseenter="showOptions = index"
            @mouseleave="showOptions = null"
            :data-key="header.key"
          >
            <div
              name="advanced-table-header"
              role="columnheader"
              style="display: flex; justify-content: space-between; align-items: center"
              :style="{ cursor: header.sorteable ? 'pointer' : 'default' }"
            >
              <span name="header-label">
                {{ header.label }}
                <span
                  @click="toggleSort(header.key)"
                  v-if="header.sorteable"
                  style="margin-left: 0.5rem"
                >
                  <vue-feather
                    v-if="
                      sortState[header.key] === null ||
                      Object.keys(sortState).length === 0 ||
                      !sortState[header.key]
                    "
                    type="minus"
                    size="18"
                  />
                  <vue-feather v-if="sortState[header.key] === 'ASC'" type="chevron-up" size="18" />
                  <vue-feather
                    v-if="sortState[header.key] === 'DESC'"
                    type="chevron-down"
                    size="18"
                  />
                </span>
              </span>
              <transition name="fade">
                <div v-if="showOptions === index" class="header-options dropdown-menu">
                  <HeaderOptions
                    :header="header"
                    :index="index"
                    :filters="props.config?.filters ?? []"
                    :message="props.config?.notFiltersMessage ?? ''"
                  />
                  <button
                    class="drag-handle"
                    draggable="true"
                    @dragstart="(e) => onDragStart(e, index)"
                  >
                    ⠿
                  </button>
                </div>
              </transition>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="props.items.length > 0">
          <tr
            class="advanced-table-row"
            :class="getClasses(props.config ?? {})"
            v-for="item in props.items"
            :key="item.id"
            @click="handlerClick(item)"
          >
            <template v-for="td in headers" :key="td.key">
              <td v-if="$slots[`cell-${td.key}`]">
                <slot :name="`cell-${td.key}`" :item="item" />
              </td>
              <td v-else>{{ item[td.key] }}</td>
            </template>
          </tr>
        </template>
        <template v-if="props.items.length === 0">
          <tr>
            <td :colspan="props.headers.length">
              {{ props.config?.noItemMessage || 'No items found' }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type AdvancedTableProps, type AdvnacedTableConfig } from '@/types/AdvanceTable'
import { useResizableColumns } from '@/@core/useResizableColumns'
import { useDraggableColumns } from '@/@core/useDraggableColumns'
import { useSortableColumns } from '@/@core/useSortableColumns'
import HeaderOptions from '@/components/HeaderOptions.vue'

const props = defineProps<AdvancedTableProps>()
const showOptions = ref<number | null>(1)
const headers = ref(props.headers)

const getClasses = (config: AdvnacedTableConfig) => {
  const classes = []
  if (config.hover) classes.push('can-hover')
  if (config.pointer || props.rowClick) classes.push('can-pointer')
  return classes
}

const tableRef = ref<HTMLElement>()

const handlerClick = (item: unknown) => {
  if (props.rowClick) props.rowClick(item)
}

useResizableColumns(tableRef, headers)
const { onDragStart, onDragOver, onDrop } = useDraggableColumns(headers)
const { sortState, toggleSort } = useSortableColumns()
</script>

<style></style>

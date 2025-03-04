<template>
  <main name="advanced-table-container">
    <table ref="tableRef" class="advanced-table resizable">
      <thead>
        <tr class="advanced-table-header">
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
                <div v-if="showOptions === index" class="header-options">
                  <button name="btn-options" class="options-btn" @click="handlerOptions">
                    <vue-feather type="more-vertical" size="18" />
                  </button>
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

const props = defineProps<AdvancedTableProps>()
const showOptions = ref<number | null>(1)
const headers = ref(props.headers)

const getClasses = (config: AdvnacedTableConfig) => {
  const classes = []
  if (config.hover) classes.push('can-hover')
  if (config.pointer) classes.push('can-pointer')
  return classes
}

const tableRef = ref<HTMLElement>()

const handlerClick = (item: unknown) => {
  if (props.rowClick) props.rowClick(item)
}

const handlerOptions = () => {
  console.log('Options')
}

useResizableColumns(tableRef, headers)
const { onDragStart, onDragOver, onDrop } = useDraggableColumns(headers)
const { sortState, toggleSort } = useSortableColumns()
</script>

<style>
:root {
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
  --color-gray-950: #030712;

  --table-bg: var(--color-gray-100);
  --table-border: #e0e0e0;
  --table-header-bg: var(--color-gray-200);
  --table-header-text: #333;
  --table-row-bg: var(--color-gray-50);
  --table-row-hover: var(--color-gray-100);
  --table-text-color: #444;
  --table-border-radius: 8px;
  --table-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  --resize-line-color: #3b82f6;
  --resize-line-hover: #1d4ed8;
  --resize-line-width: 2px;

  --header-size-font: 1.2rem;
  --heigth-row: 2rem;
  --padding-row: 5px 0 5px 0;
}

.advanced-table-container {
  overflow-x: auto;
  width: 100%;
  max-width: 100%;
}

.advanced-table-header {
  background-color: var(--table-header-bg);
}

.advanced-table-row {
  background-color: var(--table-row-bg);
}

.advanced-table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  background-color: var(--table-bg);
  border-radius: var(--table-border-radius);
  box-shadow: var(--table-shadow);
}

.advanced-table thead {
  background-color: var(--table-header-bg);
  color: var(--table-header-text);
}

.advanced-table th {
  overflow: visible;
}

.advanced-table th,
.advanced-table td {
  text-align: left;
  border-bottom: 1px solid var(--table-border);
  color: var(--table-text-color);
  min-width: 50px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: var(--header-size-font);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.advanced-table tr {
  height: var(--heigth-row);
}

.advanced-table td {
  padding: var(--padding-row);
}
.advanced-table-row.can-hover:hover {
  background-color: var(--table-row-hover);
}
/* 
.advanced-table-row.can-pointer {
  cursor: pointer;
} */

.advanced-table tbody tr:last-child td {
  border-bottom: none;
}

/* Estilos para el handle de resize */
.resize-handle {
  right: -1px;
  z-index: 1;
  width: 4px !important;
  background: transparent;
}

th:hover > .resize-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  cursor: col-resize;
  border-right: 2px solid var(--color-gray-400);
}

.resize-handle:hover,
.resize-handle:active {
  width: 6px !important;
}

.advanced-table th {
  position: relative;
  /* background-clip: padding-box; */
}

.border-resize-active {
  border-right: 2px solid var(--resize-line-hover) !important;
}

.drag-handle {
  background: none;
  border: none;
  cursor: grab;
  font-size: 1rem;
  /* padding: 4px; */
}

.drag-handle:active {
  cursor: grabbing;
}

.options-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.5rem !important;
  /* padding: 4px; */
}

.options-btn:hover {
  cursor: pointer;
  background-color: var(--color-gray-300);
  border-radius: 5px;
}

.header-options {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: var(--table-header-bg);
  z-index: 1;
  padding: 0 4px;
}

span[name='header-label'] {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

th.drag-over-left {
  border-left: 2px solid var(--resize-line-color);
}
</style>

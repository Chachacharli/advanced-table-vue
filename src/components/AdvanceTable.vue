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

<style>
:root {
  /** 
   * Color Scheme
   * ----------------------------------------------------------------------
   */
  --color-primary: #3b82f6;
  --color-primary-hover: #1d4ed8;

  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;

  /**
   * Table Structure
   * ----------------------------------------------------------------------
   */
  --table-width: 100%;
  --table-border-radius: 8px;
  --table-row-height: 2rem;
  --table-row-padding: 0.5rem 1rem;
  --table-cell-min-width: 50px;
  --table-cell-padding: 0.5rem 1rem;

  /**
   * Table Colors
   * ----------------------------------------------------------------------
   */
  --table-bg-color: var(--color-gray-100);
  --table-header-bg-color: var(--color-gray-200);
  --table-row-bg-color: var(--color-gray-50);
  --table-row-hover-color: var(--color-gray-100);
  --table-border-color: #e0e0e0;
  --table-text-color: #444;
  --table-header-text-color: #333;

  /**
   * Interactive Elements
   * ----------------------------------------------------------------------
   */
  --resize-handle-width: 4px;
  --resize-handle-hover-width: 6px;
  --resize-line-color: var(--color-primary);
  --resize-line-hover-color: var(--color-primary-hover);

  /**
   * Typography
   * ----------------------------------------------------------------------
   */
  --table-font-size: 0.875rem;
  --table-header-font-size: 1rem;
  --table-icon-size: 1.125rem;

  /**
   * Effects
   * ----------------------------------------------------------------------
   */
  --table-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  --transition-duration: 0.2s;
}

main[name='advanced-table-container'] {
  --scrollbar-track-color: var(--color-gray-200);
  --scrollbar-thumb-color: var(--color-gray-400);

  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  max-width: 100%;
  scrollbar-color: var(--scrollbar-thumb-color) var(--scrollbar-track-color);
}

.advanced-table {
  table-layout: fixed;
  width: var(--table-width);
  border-collapse: collapse;
  background-color: var(--table-bg-color);
  border-radius: var(--table-border-radius);
  box-shadow: var(--table-box-shadow);
}

.advanced-table-header {
  background-color: var(--table-header-bg-color);
  color: var(--table-header-text-color);
  font-size: var(--table-header-font-size);
}

.advanced-table-row {
  background-color: var(--table-row-bg-color);
  height: var(--table-row-height);
}

.advanced-table th,
.advanced-table td {
  padding: var(--table-cell-padding);
  color: var(--table-text-color);
  border-bottom: 1px solid var(--table-border-color);
  min-width: var(--table-cell-min-width);
  font-size: var(--table-font-size);
  white-space: nowrap;
  text-overflow: ellipsis;
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

.border-resize-active {
  border-right: 2px solid var(--resize-line-color) !important;
}

.advanced-table td {
  padding: var(--table-row-padding);
}

/* Interactive States */
.advanced-table-row.can-hover:hover {
  background-color: var(--table-row-hover);
}

.resize-handle {
  width: var(--resize-handle-width);
  background: transparent;
}

.resize-handle:hover,
.resize-handle:active {
  width: var(--resize-handle-hover-width);
  border-right-color: var(--resize-line-hover-color);
}

/* Icon Sizing */
.vue-feather {
  width: var(--table-icon-size);
  height: var(--table-icon-size);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-duration) ease-in-out;
}

/* Drag and Drop Visuals */
.border-resize-active {
  border-right: var(--resize-handle-width) solid var(--resize-line-hover-color);
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
  background-color: var(--table-bg-color);
  z-index: 1;
  padding: 0 4px;
  margin-right: 0.5rem;
}

span[name='header-label'] {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

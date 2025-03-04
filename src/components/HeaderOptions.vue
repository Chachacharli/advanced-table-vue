<template>
  <div class="header-options-container">
    <button name="btn-options" class="options-btn" @click.stop="toggleDropdown">
      <vue-feather type="more-vertical" size="18" />
    </button>

    <transition name="fade">
      <ul v-if="isOpen" class="dropdown-menu">
        <li v-for="filter in filters" :key="filter" @click="applyFilter"></li>
        <li class="not-found-data" v-if="filters.length === 0">
          <span>{{ props.message }}</span>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { type AdvancedHeader, type AdvancedHeaderFilter } from '@/types/AdvanceTable'

const props = defineProps<{
  header: AdvancedHeader
  index: number
  filters: unknown
  message: string
}>()

const filters: AdvancedHeaderFilter = ref(props.filters || [])

const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.header-options-container')) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

const applyFilter = () => console.log(`Aplicando filtro en ${props.header.label}`)
</script>

<style scoped>
.header-options-container {
  position: relative;
}

.options-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.options-btn:hover {
  background-color: var(--color-gray-300);
}

.dropdown-menu {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--table-bg-color);
  border: 1px solid var(--color-gray-300);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  list-style: none;
  padding: 4px 0;
  min-width: 150px;
  z-index: 100;
}

.dropdown-menu li {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
}

.dropdown-menu li.not-found-data {
  padding: 8px 12px;
  font-size: 14px;
}

.dropdown-menu li:hover {
  background-color: var(--color-gray-200);
}

.dropdown-menu li.not-found-data:hover {
  background-color: var(--table-bg-color);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.not-found-data {
  padding: 8px 12px;
}
</style>

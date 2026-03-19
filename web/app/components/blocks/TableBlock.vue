<script setup lang="ts">
import type { TableBlock as TableBlockType } from '~/types/blocks'

const props = defineProps<{
  block: TableBlockType
}>()

const parseCsv = (csv: string): string[][] => {
  return csv
    .trim()
    .split('\n')
    .map((line) => line.split(',').map((cell) => cell.trim()))
}

const rows = computed(() => parseCsv(props.block.csvData))

const buttonLinks = computed(() => {
  if (!props.block.buttonLinksCsv) return []
  return props.block.buttonLinksCsv.split(',').map((link) => link.trim())
})

const headerRow = computed(() => {
  if (props.block.firstRowAreTitles && rows.value.length > 0) {
    return rows.value[0]
  }
  return null
})

const bodyRows = computed(() => {
  let result = rows.value
  if (props.block.firstRowAreTitles && result.length > 0) {
    result = result.slice(1)
  }
  if (props.block.lastRowAreButtons && result.length > 0) {
    result = result.slice(0, -1)
  }
  return result
})

const buttonRow = computed(() => {
  if (props.block.lastRowAreButtons && rows.value.length > 0) {
    return rows.value[rows.value.length - 1]
  }
  return null
})

const columnCount = computed(() => {
  if (rows.value.length > 0) {
    return rows.value[0].length
  }
  return 0
})
</script>

<template>
  <div>
    <!-- Desktop: Traditional table view -->
    <div class="hidden md:block overflow-x-auto">
      <table
        class="table-block w-full border-collapse"
        :class="{ 'with-borders': block.showBorders }"
      >
        <thead v-if="headerRow">
          <tr>
            <th
              v-for="(cell, index) in headerRow"
              :key="index"
              class="header-cell p-5 text-left text-xl font-bold align-top"
            >
              {{ cell }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in bodyRows" :key="rowIndex">
            <td
              v-for="(cell, cellIndex) in row"
              :key="cellIndex"
              class="body-cell p-5 align-top"
            >
              {{ cell }}
            </td>
          </tr>
          <tr v-if="buttonRow" class="button-row">
            <td
              v-for="(cell, cellIndex) in buttonRow"
              :key="cellIndex"
              class="button-cell-wrapper p-0"
            >
              <NuxtLink
                :to="buttonLinks[cellIndex] || '#'"
                class="button-cell"
              >
                <span>{{ cell }}</span>
                <span class="chevron">›</span>
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile: Column-based vertical view -->
    <div class="md:hidden">
      <div
        v-for="(_, colIndex) in columnCount"
        :key="colIndex"
        class="mobile-column"
        :class="{ 'border-b-2 border-[var(--color-table-borders)]': colIndex < columnCount - 1 }"
      >
        <!-- Column header -->
        <div
          v-if="headerRow && headerRow[colIndex]"
          class="p-3 text-lg font-bold text-[var(--color-headings)] border-b border-[var(--color-table-borders)]"
        >
          {{ headerRow[colIndex] }}
        </div>

        <!-- Column values from each row (skip empty cells) -->
        <template v-for="(row, rowIndex) in bodyRows" :key="rowIndex">
          <div
            v-if="row[colIndex]?.trim()"
            class="p-3 border-b border-[var(--color-table-borders)] last:border-b-0"
            :class="{ '!border-b-0': !buttonRow?.[colIndex] && rowIndex === bodyRows.length - 1 }"
          >
            {{ row[colIndex] }}
          </div>
        </template>

        <!-- Column button -->
        <NuxtLink
          v-if="buttonRow && buttonRow[colIndex]"
          :to="buttonLinks[colIndex] || '#'"
          class="mobile-button-cell"
        >
          <span>{{ buttonRow[colIndex] }}</span>
          <span class="chevron">›</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Table with borders */
.table-block.with-borders {
  border: 1px solid var(--color-table-borders);
}

.table-block.with-borders .header-cell,
.table-block.with-borders .body-cell,
.table-block.with-borders .button-cell-wrapper {
  border: 1px solid var(--color-table-borders);
}

/* Table without borders - just bottom borders */
.table-block:not(.with-borders) .header-cell {
  border-bottom: 2px solid var(--color-table-borders);
}

.table-block:not(.with-borders) .body-cell {
  border-bottom: 1px solid var(--color-table-borders);
}

/* Header row styling */
.header-cell {
  color: var(--color-headings);
}

/* Button cell styling */
.button-cell {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  width: 100%;
  padding: 1.25rem;
  color: var(--color-headings);
  font-weight: 600;
  transition: background-color 0.15s ease;
}

.button-cell:hover {
  background-color: var(--color-5);
}

.chevron {
  font-size: 1.25rem;
  line-height: 1;
}

/* Mobile vertical stack styles */
.mobile-button-cell {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  width: 100%;
  padding: 0.75rem;
  color: var(--color-headings);
  font-weight: 600;
  transition: background-color 0.15s ease;
}

.mobile-button-cell:hover {
  background-color: var(--color-5);
}
</style>

<template>
  <div class="card bg-white dark:bg-zinc-400">
    <DataTable
      :value="data"
      :paginator="paginator"
      :rows="rowsPerPage"
      :rows-per-page-options="[5, 10, 20]"
      :sort-field="sortField"
      :sort-order="sortOrder"
      :loading="loading"
      scrollable
      :total-records="totalRecords"
      paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      show-gridlines
      @update:sort="onSort"
      @update:paginator="onPage"
      @update:rows="onRows"
    >
      <!-- Dynamic Columns -->
      <Column
        v-for="col in columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :sortable="col.sortable"
        :headerStyle="col.style"
        class="bg-zinc-100 dark:bg-zinc-300"
        :frozen="col.frozen"
        :alignFrozen="col.alignFrozen"
      >
        <!-- Optional column body slot for custom rendering -->
        <template v-if="col.bodyTemplate" #body="slotProps">
          <slot
            :name="`cell(${col.field})`"
            :data="slotProps.data"
            :field="col.field"
          >
            {{ slotProps.data[col.field] }}
          </slot>
        </template>
      </Column>

      <!-- Empty State -->
      <template #empty>
        <div class="text-center p-4">No data available.</div>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  paginator: {
    type: Boolean,
    default: true,
  },
  rowsPerPage: {
    type: Number,
    default: 5,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  totalRecords: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["update:sort", "update:paginator", "update:rows"]);

// Reactive state for sorting
const sortField = ref("");
const sortOrder = ref(1);

// Handle sorting event
const onSort = (event) => {
  sortField.value = event.sortField;
  sortOrder.value = event.sortOrder;
  emit("update:sort", { field: event.sortField, order: event.sortOrder });
};

// Handle pagination event
const onPage = (event) => {
  emit("update:paginator", { page: event.page, rows: event.rows });
};

const onRows = (event) => {
  emit("update:rows", event);
};

// Handle rows per page event
</script>

<style scoped></style>

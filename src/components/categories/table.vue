<template>
  <div>
    <div v-if="error" class="text-red-600 mb-4">{{ error }}</div>
    <ReusableTable
      :data="data"
      :columns="columns"
      :paginator="true"
      :rowsPerPage="filters.limit"
      :totalRecords="totalRecords"
      :loading="loading"
      @update:sort="onSort"
      @update:paginator="onPage"
      @update:rows="onRows"
    >
      <template #cell(name)="{ data }">
        <strong>{{ data.name.toLowerCase().substring(0, 15) }}</strong>
      </template>

      <template #cell(image)="{ data }">
        <img width="50" height="50" class="mx-auto" :src="data.image" alt="" />
      </template>

      <template #cell(creationAt)="{ data }">
        <span>{{ data.creationAt.substring(0, 10) }}</span>
      </template>

      <template #cell(updatedAt)="{ data }">
        <span>{{ data.updatedAt.substring(0, 10) }}</span>
      </template>

      <template #cell(actions)="{ data }">
        <div class="flex justify-around">
          <i
            class="pi pi-pencil text-green-600 cursor-pointer"
            @click="editProduct(data.id)"
          />
          <i
            class="pi pi-trash text-red-600 cursor-pointer"
            @click="deleteCategory(data.id)"
          />
        </div>
      </template>
    </ReusableTable>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import ReusableTable from "@/components/shared/table.vue";
import { useApi } from "@/composables/useApi";
import { useToasted } from "@/composables/useToasted";
import { useConfirmDialog } from "@/composables/useConfirmDialog";

const emits = defineEmits(["handleEdit"]);

const { showToast } = useToasted();
const { showConfirmDialog } = useConfirmDialog();
const { t } = useI18n();
const { get, del } = useApi();

const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
});

onMounted(() => {
  fetchData(props.filters); // Fetch data based on initial
});

const loading = ref(false);
const error = ref(null);
const data = ref([]);
const totalRecords = ref(0);

watch(
  () => props.filters,
  (newValue) => {
    fetchData(newValue);
  },
  { deep: true }
);

const fetchData = (filters) => {
  loading.value = true;
  error.value = null;

  get("/categories", { params: { ...filters } })
    .then((response) => {
      data.value = response.data || response;
      totalRecords.value =
        response.total || response.length || data.value.length;
    })
    .catch((err) => {
      error.value = err.message || "Failed to fetch data";
      data.value = [];
      totalRecords.value = 0;
    })
    .finally(() => {
      loading.value = false;
    });
};

defineExpose({
  fetchData,
});

const columns = ref([
  { field: "id", header: "ID", sortable: true, style: { width: "5rem" } },
  { field: "name", header: "name", sortable: true, bodyTemplate: true },
  { field: "slug", header: "Slug", sortable: true },
  { field: "image", header: "Image", bodyTemplate: true, sortable: true },
  {
    field: "creationAt",
    header: "Creation At",
    sortable: true,
    bodyTemplate: true,
  },
  {
    field: "updatedAt",
    header: "Updated At",
    sortable: true,
    bodyTemplate: true,
  },
  {
    field: "actions",
    header: "Actions",
    bodyTemplate: true,
    frozen: true,
    alignFrozen: "right",
    style: { width: "10rem" },
  },
]);

// Handle sort event
const onSort = ({ field, order }) => {
  data.value.sort((a, b) => {
    const valA = a[field];
    const valB = b[field];
    return order * (valA > valB ? 1 : valA < valB ? -1 : 0);
  });
  // updateFilters({ sortField: field, sortOrder: order });
};

// Handle page event
const onPage = ({ page, rows }) => {
  console.log(`page: ${page}, rows: ${rows}`);
};

// Handle rows per page change
const onRows = (rows) => {
  console.log(`rows: ${rows}`); // updateFilters({ offset: 1, limit: rows });
};

const editProduct = (id) => {
  emits("handleEdit", id);
};

const deleteCategory = (id) => {
  showConfirmDialog(
    "Are you sure you want to delete this category?",
    "Delete Category",
    () => handleDelete(id),
    () => {
      showToast("info", "Rejected", "You have rejected");
    }
  );
};

const handleDelete = async (id) => {
  try {
    const res = await del(`/categories/${id}`);
    showToast("success", "Success", "Category deleted successfully");
    fetchData();
  } catch (err) {
    showToast("error", "Error", "Failed to delete category");
  }
};
</script>

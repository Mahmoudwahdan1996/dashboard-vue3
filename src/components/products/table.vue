<template>
  <div>
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
      <template #cell(title)="{ data }">
        <strong>{{ data.title.toLowerCase().substring(0, 15) }}</strong>
      </template>

      <template #cell(price)="{ data }">
        <span>{{ data.price.toFixed(2) }}</span>
      </template>

      <template #cell(category)="{ data }">
        <span>{{ data.category.name }}</span>
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
            @click="deleteProduct(data.id)"
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

const { t } = useI18n();
const router = useRouter();
const { get, del } = useApi();
const { showToast } = useToasted();
const { showConfirmDialog } = useConfirmDialog();

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

  get("/products", { params: { ...filters } })
    .then((response) => {
      data.value = response.data || response;
      totalRecords.value =
        response.total || response.length || data.value.length;
    })
    .catch((err) => {
      error.value = err.message || "Failed to fetch data";
      showToast("error", "Error", error.value);
      data.value = [];
      totalRecords.value = 0;
    })
    .finally(() => {
      loading.value = false;
    });
};

const columns = ref([
  { field: "id", header: "ID", sortable: true, style: { width: "5rem" } },
  { field: "title", header: "Title", sortable: true, bodyTemplate: true },
  { field: "price", header: "Price", sortable: true, bodyTemplate: true },
  { field: "slug", header: "Slug", sortable: true },
  { field: "category", header: "Category", bodyTemplate: true, sortable: true },
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
  console.log(`Sorting by ${field}, order: ${order}`);
  data.value.sort((a, b) => {
    const valA = a[field];
    const valB = b[field];
    return order * (valA > valB ? 1 : valA < valB ? -1 : 0);
  });
  // updateFilters({ sortField: field, sortOrder: order });
};

// Handle page event
const onPage = ({ page, rows }) => {
  // updateFilters({ offset: page + 1, limit: rows });
  // fetchData(filters.value);
};

// Handle rows per page change
const onRows = (rows) => {
  // updateFilters({ offset: 1, limit: rows });
};

const editProduct = (id) => {
  router.push({ name: "EditProduct", params: { id } });
};

const deleteProduct = (id) => {
  showConfirmDialog(
    "Are you sure you want to delete this product?",
    "Delete Product",
    () => handleDelete(id),
    () => {
      showToast("info", "Rejected", "You have rejected");
    }
  );
};

const handleDelete = async (id) => {
  try {
    const res = await del(`/products/${id}`);
    showToast("success", "Success", "Product deleted successfully");
    fetchData();
  } catch (err) {
    showToast("error", "Error", "Failed to delete product");
  }
};
</script>

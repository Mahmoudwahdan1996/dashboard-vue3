<template>
  <!-- Sidebar -->
  <aside
    class="hidden fixed md:flex flex-col bg-white dark:bg-zinc-900 dark:text-white shadow-lg z-10 transition-all duration-200 ease-in-out h-full group"
    :class="[sidebarHovered ? 'w-60' : 'w-16']"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="flex items-center justify-between h-16 px-4">
      <img src="@/assets/logo.png" class="w-8 h-8" alt="logo" />
      <transition name="fade">
        <span
          v-if="sidebarHovered"
          class="ml-2 font-bold text-background-light dark:text-text-dark text-xl whitespace-nowrap"
        >
          Logoipsum
        </span>
      </transition>
    </div>
    <Button label="Star" icon="material-icons"> </Button>
    <nav class="flex-1 px-2 pt-4 space-y-1 overflow-y-auto">
      <router-link
        v-for="item in items"
        :key="item.route"
        :to="item.route"
        :class="[
          route.path.includes(item.route)
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 fill-zinc-100 dark:fill-zinc-900'
            : '',
        ]"
        class="flex items-center px-4 py-2 rounded-lg transition border border-zinc-900 dark:border-zinc-100 hover:fill-zinc-100 dark:fill-zinc-100 dark:hover:fill-zinc-900 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-900"
      >
        <i class="text-xl" :class="item.icon" v-if="item.icon"></i>
        <template v-else>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path :d="item.component" />
          </svg>
        </template>
        <transition name="fade">
          <span v-if="sidebarHovered" class="ms-3">{{ t(item.label) }}</span>
        </transition>
      </router-link>
    </nav>

    <!-- <div class="flex items-center px-4 py-2">
      <ToggleSwitch
        :model-value="openSidebarAlways"
        @change="toggleSidebarAlways"
        inputClass="bg-zinc-900 dark:bg-zinc-100"
        class="mr-3"
      />
      <span class="ms-3 text-sm"> {{ t("sidebar-always") }} </span>
    </div> -->

    <ToggleButton
      :model-value="openSidebarAlways"
      @change="toggleSidebarAlways"
      onLabel="on"
      offLabel="off"
      :pt="{
        root: {
          class: [
            ' rounded-full p-1 flex items-center transition-all duration-300 mb-2',
            openSidebarAlways ? 'bg-zinc-900' : 'bg-zinc-200',
          ],
        },
        content: {
          class: [
            ' rounded-full flex items-center justify-center transition-all duration-300',
            openSidebarAlways ? 'bg-zinc-900' : 'bg-zinc-100',
          ],
        },
        label: {
          class: [
            'rounded-full text-sm font-semibold',
            openSidebarAlways ? 'text-zinc-100' : 'text-zinc-700',
          ],
        },
      }"
    />
  </aside>

  <Drawer
    v-model:visible="showSidebar"
    :modal="true"
    :position="locale === 'ar' ? 'right' : 'left'"
    class="md:hidden w-60 bg-white dark:!bg-zinc-900 dark:text-white shadow-lg"
  >
    <template #header>
      <div class="flex items-center justify-between h-16 gap-2 px-4">
        <img src="@/assets/logo.png" class="w-8 h-8 mr-2" alt="logo" />
        <span
          class="ml-2 font-bold dark:text-zinc-100 text-xl whitespace-nowrap"
        >
          Logoipsum
        </span>
      </div>
    </template>

    <nav class="flex-1 px-2 pt-4">
      <router-link
        v-for="item in items"
        :key="item.route"
        :to="item.route"
        :class="[
          route.path.includes(item.route)
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 fill-zinc-100'
            : '',
        ]"
        class="flex items-center px-4 py-2 my-2 rounded-lg transition border border-zinc-900 dark:border-zinc-100 dark:text-zinc-100 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-900"
      >
        <i class="text-xl" :class="item.icon"></i>
        <span class="ms-3">{{ item.label }}</span>
      </router-link>
    </nav>
  </Drawer>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDark, useToggle } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import ToggleButton from "primevue/togglebutton";
import Drawer from "primevue/drawer";
import { mdiPackageVariantClosed, mdiShapeOutline } from "@mdi/js";
const { t, locale } = useI18n();

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const route = useRoute();

const emit = defineEmits(["update:visible", "changeSidebarAlways"]);
const showSidebar = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value),
});

const items = ref([
  {
    label: "products",
    component: mdiPackageVariantClosed,
    route: "/products",
  },
  {
    label: "categories",
    component: mdiShapeOutline,
    route: "/categories",
  },
  {
    label: "users",
    icon: "pi pi-users",
    route: "/users",
  },
]);

const sidebarHovered = ref(false);
const openSidebarAlways = ref(false);

const handleMouseEnter = () => {
  if (!openSidebarAlways.value) {
    sidebarHovered.value = true;
  }
};

const handleMouseLeave = () => {
  if (!openSidebarAlways.value) {
    sidebarHovered.value = false;
  }
};

const toggleSidebarAlways = () => {
  openSidebarAlways.value = !openSidebarAlways.value;
  emit("changeSidebarAlways", openSidebarAlways.value);
};
</script>

<style scoped>
/* Scoped styles are fine here */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

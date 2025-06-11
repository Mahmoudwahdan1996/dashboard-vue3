<template>
  <BreadCrumb />

  <div>
    <h1>Product Details</h1>
    <span>{{ $route.params.id }}</span>
  </div>
</template>

<script setup>
import BreadCrumb from "@/components/layout/BreadCrumb.vue";
</script>

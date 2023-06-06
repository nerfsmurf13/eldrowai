<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header class="flex flex-col text-center text-[#2E2E2E] bg-[#30D5C8]">
    <div>Title</div>
    <nav class="flex mx-auto gap-2">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>

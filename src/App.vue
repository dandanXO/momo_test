<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
}

nav {
  display: flex;
  gap: 1rem;
  padding: 1rem 2rem;
  font-size: 0.95rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
  font-weight: 600;
}

nav a {
  text-decoration: none;
  color: var(--color-text);
  opacity: 0.7;
}

nav a:hover {
  opacity: 1;
}
</style>

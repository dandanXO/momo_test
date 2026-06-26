<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LocaleSwitcher from '@/components/LocaleSwitcher.vue'

const { t } = useI18n()
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">{{ t('nav.home') }}</RouterLink>
      <RouterLink to="/about">{{ t('nav.about') }}</RouterLink>
      <LocaleSwitcher />
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
  align-items: center;
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

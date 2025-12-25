<template>
  <div id="app">
    <nav class="navbar">
      <RouterLink to="/" class="nav-link">Форма обратной связи</RouterLink>
    </nav>
    <RouterView/>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  padding: 2rem 0;
  gap: 2rem;

  @media (max-width: 767px) {
    gap: 1rem 2rem;
    padding: 2rem 1rem;
  }

  a {
    font-size: 1rem;
  }
}
</style>
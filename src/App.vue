<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="page-header">
    <RouterLink to="/" class="page-header__logo">AI × コンサル</RouterLink>
    <nav class="page-header__nav">
      <RouterLink to="/">ホーム</RouterLink>
      <RouterLink to="/about">利用規約</RouterLink>
      <RouterLink to="/chat">サポート</RouterLink>
    </nav>
  </header>
  <RouterView />
  <footer class="page-footer">
    <span>プライバシー</span>
    <span>利用規約</span>
  </footer>
</template>

<style scoped lang="scss">
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;

  @media (max-width: 1024px) {
    justify-content: center;
  }

  &__logo {
    display: inline-block;
    text-decoration: none;
    font-size: 36px;
    font-weight: bold;

    @media (max-width: 1024px) {
      display: none;
    }
  }

  &__nav {
    display: flex;
    gap: 10px;
    font-size: 20px;
    font-weight: bold;
    color: inherit;

    & > a {
      padding: 0 5px;
      text-decoration: none;
      position: relative;

      &:after {
        position: absolute;
        content: '';
        bottom: 0;
        left: 0;
        height: 2px;
        background: #7852e1;
        z-index: 1;
        width: 100%;
        transform: scaleX(0);
        transform-origin: center;
        transition: transform 0.3s ease;
      }

      &:hover:after {
        transform: scaleX(1);
      }
    }

    @media (max-width: 1024px) {
      gap: 1.5rem;
      padding: 1rem 0 0;
      color: white;
    }
  }
}

.page-footer {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  font-size: 20px;
  position: relative;

  @media (max-width: 1024px) {
    font-size: 16px;
    color: #666;
  }

  &::before {
    position: absolute;
    content: '';
    height: 2px;
    width: 100%;
    background: #f0f0f0;
    top: -20px;
  }
}
</style>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed, onUnmounted, ref, watchEffect } from 'vue'

const route = useRoute()

const apiKey = ref('')
const isApiChoosed = ref(false)

const isApiKeyValid = computed(() => {
  return /^sk-[a-zA-Z0-9-_]{10,}$/.test(apiKey.value)
})
const nav = computed(() => [
  { name: 'ホーム', to: { path: '/', query: { type: '', key: route.query.key } }, cb: null },
  {
    name: 'サポート',
    to: { path: '/faq', query: { type: '', key: route.query.key }, hash: '#support' },
    cb: null,
  },
  { name: 'APIキー', to: { path: '', query: { key: route.query.key } }, cb: onApiKeyClick },
])
const isFaqRouter = computed(() => route.path.includes('faq'))

const onApiKeyClick = () => {
  isApiChoosed.value = true
}

const getApiKey = () => {
  if (!isApiKeyValid.value) {
    return
  }
  if (isApiKeyValid.value) {
    sessionStorage.setItem('apiKey', apiKey.value)
  } else {
    alert('API key not valid')
    isApiChoosed.value = false
    apiKey.value = ''
  }
}

watchEffect(() => {
  apiKey.value = (route.query.key as string) || ''
})

onUnmounted(() => {
  isApiChoosed.value = false
})
</script>

<template>
  <header class="page-header">
    <RouterLink to="/" class="page-header__logo">AI × コンサル</RouterLink>
    <nav
      class="page-header__nav"
      v-if="!isFaqRouter"
      v-click-outside="() => (isApiChoosed = false)"
    >
      <RouterLink
        v-for="(item, i) in nav"
        :key="i"
        :to="item.to"
        @click.native="item.cb !== null ? item.cb() : null"
      >
        <span v-if="i !== 2">{{ item.name }}</span>
        <span v-else-if="i === 2 && !isApiChoosed">{{ item.name }}</span>
      </RouterLink>
      <transition name="fade" mode="out-in">
        <form @click.prevent v-show="isApiChoosed" class="page-header__form">
          <input v-model.trim="apiKey" type="password" placeholder="APIキーを入力" required />
          <button type="submit" @click="getApiKey">送信</button>
        </form>
      </transition>
    </nav>
  </header>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <footer class="page-footer" v-if="!isFaqRouter">
    <router-link to="/faq#privacy">プライバシーポリシー</router-link>
    <router-link to="/faq#tos">利用規約</router-link>
  </footer>
</template>

<style scoped lang="scss">
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  z-index: 1;

  @media (max-width: 1024px) {
    justify-content: center;
  }

  &__logo {
    display: inline-block;
    text-decoration: none;
    font-size: 36px;
    font-weight: bold;
    z-index: 1;

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
    position: relative;
    min-width: 260px;

    & > a {
      padding: 0 5px;
      text-decoration: none;
      display: flex;
      color: #666;
      position: relative;

      @media (max-width: 1024px) {
        font-weight: inherit;
        font-size: 16px;
      }

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
    }
  }

  &__form {
    gap: 10px;
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    padding: 10px 20px;
    border-radius: 10px;
    z-index: 2;
    transform: translateX(50%);
    right: 54%;

    button,
    input {
      white-space: nowrap;
      background: transparent;
      outline: none;
      border: 1px solid #666;
      font-style: inherit;
      border-radius: 3px;
      height: 24px;
      color: inherit;
    }

    button {
      cursor: pointer;
      transition:
        transform 0.2s,
        box-shadow 0.2s;

      &:hover {
        box-shadow: 0 8px 16px rgba(139, 92, 246, 0.4);
      }

      &:active {
        transform: translateY(0);
        box-shadow: 0 4px 8px rgba(139, 92, 246, 0.3);
      }
    }
  }
}

.page-main {
  @media (max-width: 1024px) {
    z-index: 1;
  }
}

.page-footer {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  font-size: 14px;
  position: relative;
  color: #666;

  a {
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

  &::before {
    position: absolute;
    content: '';
    height: 2px;
    width: 100%;
    top: -20px;
    background: rgba(208, 191, 255, 0.4);
  }
}
</style>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { computed, ref } from 'vue'

const onApiKeyClick = () => {
  isApiChoosed.value = true
}

const nav = [
  { name: 'ホーム', to: '/', cb: null },
  { name: 'サポート', to: '/chat', query: { type: 'relationship' }, cb: null },
  { name: 'APIキー', to: '', cb: onApiKeyClick },
]
const apiKey = ref('')
const isApiChoosed = ref(false)

const isApiKeyValid = computed(() => {
  return /^sk-[a-zA-Z0-9]{32}$/.test(apiKey.value)
})

const getApiKey = () => {
  if (!isApiKeyValid.value) {
    return
  }
  if (isApiKeyValid.value) {
    sessionStorage.setItem('apiKey', apiKey.value)
    isApiChoosed.value = false
  } else {
    alert('API key not valid')
  }
}
</script>

<template>
  <header class="page-header">
    <RouterLink to="/" class="page-header__logo">AI × コンサル</RouterLink>
    <nav class="page-header__nav">
      <RouterLink
        v-for="(item, i) in nav"
        :key="i"
        :to="item.to"
        @click.native="item.cb !== null ? item.cb() : null"
      >
        <span v-if="i !== 2">{{ item.name }}</span>
        <span v-else-if="i === 2 && !isApiChoosed">{{ item.name }}</span>
        <transition name="fade" mode="out-in">
          <form action="#" v-if="i === 2 && isApiChoosed" class="page-header__form">
            <input
              v-model.trim="apiKey"
              type="password"
              placeholder="APIキーを入力"
              pattern="sk-[a-zA-Z0-9]{32}"
              required
            />
            <button type="submit" @click="getApiKey">送信</button>
          </form>
        </transition>
      </RouterLink>
    </nav>
  </header>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
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

    & > a {
      padding: 0 5px;
      text-decoration: none;
      display: flex;
      position: relative;
      color: #666;

      @media (max-width: 1024px) {
        font-weight: inherit;
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
    right: 0;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    padding: 10px 20px;
    border-radius: 10px;
    z-index: 2;

    button,
    input {
      white-space: nowrap;
      background: transparent;
      outline: none;
      border: 1px solid #666;
      font-style: inherit;
      border-radius: 3px;
      height: 24px;
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
  font-size: 20px;
  position: relative;
  color: #666;

  @media (max-width: 1024px) {
    font-size: 16px;
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

<script setup lang="ts">
import canvasImage from '@/components/canvasImage.vue'

const categorySelectBtns = [
  { name: '仕事', to: '/chat' },
  { name: '学業', to: '/chat' },
  { name: '人間関係', to: '/chat' },
  { name: '健康', to: '/chat' },
]
</script>

<template>
  <main class="page-main">
    <div class="page-main__container">
      <section class="page-main__title-section">
        <h1>お悩み相談ボット</h1>
        <p class="title-section__description">AIボットがあなたの悩みにアドバイスを提供します</p>
      </section>
      <section class="page-main__image-section">
        <canvas-image class="image-section__canvas" />
      </section>
      <section class="page-main__button-section">
        <template v-for="(item, i) in categorySelectBtns" :key="i">
          <RouterLink class="button-section__button" :to="item.to">{{ item.name }}</RouterLink>
        </template>
      </section>
      <section class="page-main__warning-section">
        <h3 class="warning-section__title">重要</h3>
        <p class="warning-section__subtitle">
          提供されるアドバイスは情報提供のみを目的としており、医学的な助言ではありません。
        </p>
      </section>
    </div>
  </main>
</template>
<style lang="scss" scoped>
.page-main {
  display: flex;
  flex: 1;

  &__container {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    grid-template-rows: 0.5fr 100px 100px;
    width: 100%;
    gap: 20px;
  }

  &__title-section {
    grid-row: 1;
    grid-column: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    h1 {
      margin-top: 20px;
      line-height: 1.1;
      font-size: 4rem;
      font-weight: bold;
    }
  }

  &__image-section {
    position: relative;
    grid-row: 1;
    grid-column: 2;

    &-image {
      width: 100%;
      height: auto;
      transform: translateX(14%);
    }
  }

  &__button-section {
    grid-row: 2;
    grid-column: 1 / span 3;
    display: flex;
    align-items: center;
    gap: 24px;
  }

  &__warning-section {
    grid-row: 3;
    grid-column: 1 / span 3;
  }
}

.title-section {
  &__description {
    font-size: 29px;
    margin-top: 20px;
  }
}

.warning-section {
  &__title {
    font-weight: bold;
    font-size: 28px;
  }

  &__subtitle {
    font-size: 20px;
  }
}

.button-section {
  &__button {
    outline: none;
    border: 1px solid #f0f0f0;
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 25px;
    font-weight: 600;
    background-color: inherit;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;

    &:hover {
      border-color: #7852e1;
      transform: scale(1.05);
      box-shadow: 0 8px 20px rgba(120, 82, 225, 0.4);
    }
  }
}

.image-section {
  &__canvas {
    width: 100%;
    transform: translate(55px, 10px);
  }
}
</style>

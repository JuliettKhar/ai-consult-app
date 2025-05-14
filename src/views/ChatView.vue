<script setup lang="ts">
import { ref } from 'vue'
import UserImage from '@/assets/image/user-image.jpeg'
import AssistanceImage from '@/assets/image/robot.jpg'

const textarea = ref('')
const messages = ref([
  { role: 'system', content: 'あなたは優しく丁寧なカウンセラーとして相談に答えます。' },
])

const getImageByRole = (role: string) => {
  switch (role) {
    case 'user':
      return UserImage
    case 'assistant':
      return AssistanceImage
  }
}

const scrollToMessage = () => {
  setTimeout(() => {
    const currMessage = document.getElementById(`message-${messages.value.length - 1}`)
    currMessage?.scrollIntoView({ behavior: 'smooth' })
  }, 0)
}

const fetchNextQuestion = () => {
  console.log(1)
  messages.value.push({
    role: 'user',
    content: textarea.value,
  })
  scrollToMessage()
  textarea.value = ''
}
</script>
<template>
  <div class="chat-view">
    <section class="chat-view__wrapper">
      <div class="chat-view__window" id="chatWindow">
        <div v-if="messages.length === 1" class="chat-message welcome-message">
          こんにちは！ご相談内容を教えてください。
        </div>
        <template v-for="(item, i) in messages" :key="i">
          <div v-if="i > 0" class="chat-message bot" :id="`message-${i}`">
            <img :src="getImageByRole(item.role)" alt="image" />
            <p>{{ item.content }}</p>
          </div>
        </template>
      </div>
      <div class="chat-view__form-wrapper">
        <form id="chatForm" class="chat-view__form" @click.prevent>
          <div class="chat-view__textarea">
            <textarea
              v-model="textarea"
              rows="4"
              cols="30"
              type="text"
              id="userInput"
              name="userInput"
              placeholder="メッセージを入力..."
              required
            />
          </div>
          <button type="submit" @click="fetchNextQuestion">送信</button>
        </form>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.chat-view {
  &__wrapper {
    display: grid;
    grid-template-columns: 3fr 1fr;
    justify-content: center;
    gap: 20px;
    padding: 2rem 0;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      padding: 0 0 2rem;
    }
  }

  &__window {
    gap: 10px;
    padding: 20px;
    height: 300px;
    border: 1px solid #f0f0f0;
    border-radius: 20px;
    box-shadow: 0 0 8px rgba(127, 90, 240, 0.5);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  &__form {
    margin-bottom: 1rem;
    display: flex;
    gap: 20px;
    flex-direction: column;
    height: 100%;

    button {
      height: 4rem;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px 24px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition:
        transform 0.2s,
        box-shadow 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(139, 92, 246, 0.4);
      }

      &:active {
        transform: translateY(0);
        box-shadow: 0 4px 8px rgba(139, 92, 246, 0.3);
      }
    }

    textarea {
      height: 100%;
      resize: none;
      border: 1px solid #f0f0f0;
      outline: none;
      border-radius: 10px;
      box-sizing: border-box;
      padding: 0.5rem;

      @media (max-width: 1024px) {
        width: 100%;
        background: transparent;
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 8px rgba(127, 90, 240, 0.5);
      }
    }
  }

  &__textarea {
    height: 100%;
  }
}

.chat-message {
  padding: 6px;
  border-radius: 5px;
  border: 1px solid #e9e9e9;
  width: fit-content;
  max-width: 95%;

  &.bot {
    display: flex;
    gap: 5px;
    align-items: center;

    &:nth-child(even) {
      align-self: flex-end;
    }

    &:nth-child(odd) {
      border: 1px solid #7f5af080;
    }

    p {
      margin: 0;
    }

    img {
      width: 30px;
    }
  }
}

.welcome-message {
  align-self: center;
  color: #3c3c3c4a;
  border: none;
}
</style>

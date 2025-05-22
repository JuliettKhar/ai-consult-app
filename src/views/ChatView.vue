<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import UserImage from '@/assets/image/user-image.jpeg'
import AssistanceImage from '@/assets/image/robot.jpg'
import { useRoute } from 'vue-router'
import type { IMessage, IPromtOptions } from '@/types.ts'
import {
  healthPromptConfig,
  relationshipPromptConfig,
  studyPromptConfig,
  workPromptConfig,
} from '@/utils/promptOptions.ts'
import { healthPrompt, relationshipPrompt, studyPrompt, workPrompt } from '@/utils/prompts.ts'

const route = useRoute()
const textarea = ref('')
const messages = ref<IMessage[]>([
  { role: 'system', content: 'あなたは優しく丁寧なカウンセラーとして相談に答えます。' },
])
const key = ref<string | null>(null)

const getImageByRole = (role: string): string | undefined => {
  switch (role) {
    case 'user':
      return UserImage
    case 'assistant':
      return AssistanceImage
  }
}

const getSystemPrompt = computed((): string => {
  switch (route.query.type) {
    case 'job':
      return workPrompt
    case 'study':
      return studyPrompt
    case 'relationship':
      return relationshipPrompt
    case 'health':
      return healthPrompt
    default:
      return 'あなたは優しく丁寧なカウンセラーとして相談に答えます。ユーザーの使用言語を自動的に判断して返答してください。'
  }
})

const getPromptConfig = computed((): IPromtOptions => {
  switch (route.query.type) {
    case 'job':
      return workPromptConfig
    case 'study':
      return studyPromptConfig
    case 'relationship':
      return relationshipPromptConfig
    case 'health':
      return healthPromptConfig
    default:
      return Partial<IPromtOptions>({ temperature: 0.7 })
  }
})

const getMessageHistory = computed((): IMessage[] => {
  const m = messages.value.slice(1)
  return [{ role: 'system', content: getSystemPrompt.value }, ...m]
})

const scrollToMessage = () => {
  setTimeout(() => {
    const currMessage = document.getElementById(`message-${messages.value.length - 1}`)
    currMessage?.scrollIntoView({ behavior: 'smooth' })
  }, 0)
}

const getAPIKey = () => sessionStorage.getItem('apiKey') || null

const getAnswerFromOpenAi = async () => {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: getMessageHistory.value,
        ...getPromptConfig.value,
      }),
    })

    const data = await res.json()
    messages.value.push({ role: 'assistant', content: data.choices[0].message.content })
  } catch (error: any) {
    messages.value.push({ role: 'assistant', content: error?.message })
  }
}

const fetchNextQuestion = async () => {
  if (textarea.value) {
    messages.value.push({
      role: 'user',
      content: textarea.value,
    })
    textarea.value = ''
  } else {
    return
  }
  if (import.meta.env.PROD && !key.value) {
    key.value = getAPIKey()
    if (!key.value) {
      alert('API key is required')
      return
    }
  }
  try {
    await getAnswerFromOpenAi()
    scrollToMessage()
  } catch (e: any) {
    console.error(e)
  }
}

onMounted(() => {
  key.value = getAPIKey()
})
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
              v-model.trim="textarea"
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
  z-index: 1;

  &__wrapper {
    display: grid;
    grid-template-columns: 3fr 1fr;
    justify-content: center;
    gap: 20px;
    padding: 0 0 2rem;

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
      border: 1px solid #5454543d;
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

.chat-message:not(.welcome-message) {
  padding: 6px;
  border-radius: 5px;
  border: 1px solid #e9e9e9;
  width: fit-content;
  max-width: 95%;
  animation: slideUp 0.3s ease;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);

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

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

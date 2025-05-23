<script setup lang="ts">
import { onMounted, ref } from 'vue'
import UserImage from '@/assets/image/user.svg'
import AssistanceImage from '@/assets/image/bot.svg'
import { useRoute } from 'vue-router'
import type { IMessage, IPromtOptions } from '@/types.ts'
import {
  healthPromptConfig,
  relationshipPromptConfig,
  studyPromptConfig,
  workPromptConfig,
} from '@/utils/promptOptions.ts'
import {
  defaultPrompt,
  healthPrompt,
  relationshipPrompt,
  studyPrompt,
  systemPrompt,
  workPrompt,
} from '@/utils/prompts.ts'

const route = useRoute()
const textarea = ref('')
const messages = ref<IMessage[]>([{ role: 'system', content: systemPrompt }])
const key = ref<string | null>(null)
const loading = ref(false)

const getImageByRole = (role: string): string | undefined => {
  switch (role) {
    case 'user':
      return UserImage
    case 'assistant':
      return AssistanceImage
  }
}

const getSystemPrompt = (type: string): string => {
  switch (type) {
    case 'job':
      return workPrompt
    case 'study':
      return studyPrompt
    case 'relationship':
      return relationshipPrompt
    case 'health':
      return healthPrompt
    default:
      return defaultPrompt
  }
}

const getPromptConfig = (type: string): Partial<IPromtOptions> => {
  switch (type) {
    case 'job':
      return workPromptConfig
    case 'study':
      return studyPromptConfig
    case 'relationship':
      return relationshipPromptConfig
    case 'health':
      return healthPromptConfig
    default:
      return { temperature: 0.7 }
  }
}

const getMessageHistory = (type: string): IMessage[] => {
  const m = messages.value.slice(1)
  return [{ role: 'system', content: getSystemPrompt(type) }, ...m]
}

const scrollToMessage = () => {
  setTimeout(() => {
    const currMessage = document.getElementById(`message-${messages.value.length - 1}`)
    currMessage?.scrollIntoView({ behavior: 'smooth' })
  }, 0)
}

const getAPIKey = () => sessionStorage.getItem('apiKey') || null

const getAnswerFromOpenAi = async () => {
  try {
    loading.value = true
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: getMessageHistory((route.query?.type as string) || ''),
        ...getPromptConfig((route.query?.type as string) || ''),
      }),
    })

    const data = await res.json()
    messages.value.push({ role: 'assistant', content: data.choices[0].message.content })
  } catch (error: any) {
    messages.value.push({ role: 'assistant', content: error?.message })
  } finally {
    loading.value = false
  }
}

const fetchNextQuestion = async () => {
  if (import.meta.env.PROD && !key.value) {
    key.value = getAPIKey()
    if (!key.value) {
      alert('API key is required')
    }
    return
  }

  if (textarea.value) {
    messages.value.push({
      role: 'user',
      content: textarea.value,
    })
    scrollToMessage()
    textarea.value = ''
  } else {
    return
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
            <span class="bot-title">
              <!--              <img :src="getImageByRole(item.role)" alt="image" />-->
              <span>{{ item.role === 'assistant' ? '🤖' : '👤' }}</span>
              <span class="bot-label">{{
                item.role === 'assistant' ? 'AI アシスタント' : 'あなた'
              }}</span>
            </span>
            <p>{{ item.content }}</p>
          </div>
        </template>
        <p v-if="loading" class="typing-indicator">考え...</p>
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
  height: 100%;

  &__wrapper {
    display: grid;
    grid-template-columns: 3fr 1fr;
    justify-content: center;
    gap: 20px;
    padding: 0 0 2rem;
    height: inherit;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      padding: 0 0 2rem;
    }
  }

  &__window {
    gap: 10px;
    padding: 20px;
    border: 1px solid #f0f0f0;
    border-radius: 20px;
    box-shadow: 0 0 8px rgba(127, 90, 240, 0.5);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    min-height: 30vh;

    @media (max-width: 1024px) {
      padding: 10px;
    }
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
      width: 100%;

      @media (max-width: 1024px) {
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

  @media (max-width: 1024px) {
    max-width: 100%;
  }

  &.bot {
    display: flex;
    gap: 5px;
    justify-content: center;
    flex-direction: column;

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
      height: 30px;
      align-self: start;

      @media (max-width: 1024px) {
        width: 30px;
        height: 30px;
      }
    }
  }
}

.welcome-message {
  align-self: center;
  color: #3c3c3c4a;
  border: none;
}

.bot-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #666;
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

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.typing-indicator {
  animation: blink 1s infinite;
  text-align: center;
}
</style>

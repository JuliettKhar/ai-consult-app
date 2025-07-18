<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
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
import dateFormatter from '../utils/dateFormatter.ts'

const route = useRoute()
const textarea = ref('')
const messages = ref<IMessage[]>([{ role: 'system', content: systemPrompt }])
const key = ref<string | null>(null)
const loading = ref(false)
const sessionId = ref<string | null>(null)
const previousSessionMessages = ref<IMessage[]>([])

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
  return [
    { role: 'system', content: getSystemPrompt(type) },
    ...previousSessionMessages.value,
    ...m,
  ]
}

const scrollToMessage = () => {
  setTimeout(() => {
    const currMessage = document.getElementById(`message-${messages.value.length - 1}`)
    currMessage?.scrollIntoView({ behavior: 'smooth' })
  }, 0)
}

const getAPIKey = () => sessionStorage.getItem('apiKey') || null

const createPreviousMessageList = () => {
  const history: IMessage[] = []
  history.push(...messages.value.slice(0, 1))

  if (previousSessionMessages.value.length > 0) {
    history.push(...previousSessionMessages.value)
  }
  if (messages.value.length > 1) {
    history.push(...messages.value.slice(1))
  }

  return history.filter((item) => item.type === route.query.type)
}

const getAnswerFromOpenAi = async () => {
  try {
    loading.value = true
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.MODE !== 'production' ? import.meta.env.VITE_API_KEY : key.value}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: getMessageHistory((route.query?.type as string) || ''),
        ...getPromptConfig((route.query?.type as string) || ''),
      }),
    })

    const data = await res.json()
    messages.value.push({ role: 'assistant', content: data.choices[0].message.content })
    saveMessage({
      ...data.choices[0].message,
      role: 'assistant',
      type: route.query?.type as string,
      session_id: sessionId.value,
    })
  } catch (error: any) {
    messages.value.push({
      role: 'assistant',
      content: error?.message,
      type: route.query?.type as string,
    })
  } finally {
    loading.value = false
  }
}

const saveMessage = async (message: IMessage) => {
  try {
    await fetch('http://3.90.2.57:8000/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...message, session_id: sessionId.value }),
    })
  } catch (error) {
    console.log(error)
  }
}

const getMessages = async () => {
  try {
    const params = new URLSearchParams()
    if (sessionId.value) {
      params.append('session_id', sessionId.value)
    }

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/messages?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    previousSessionMessages.value = await res.json()
  } catch (error) {
    console.log(error)
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
    const userMessage = {
      role: 'user',
      content: textarea.value,
      type: route.query?.type as string,
      session_id: sessionId.value,
    }
    messages.value.push(userMessage)
    scrollToMessage()
    saveMessage(userMessage)
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

const getOrCreateSessionId = async () => {
  try {
    let sessionId = localStorage.getItem('session_id')
    if (!sessionId) {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sessions`, { method: 'POST' })
      const data = await res.json()
      sessionId = data.id
      localStorage.setItem('session_id', sessionId as string)
    }
    return sessionId
  } catch (e) {
    console.error(e)
    return null
  }
}

onBeforeMount(async () => {
  key.value = getAPIKey()
})

onMounted(async () => {
  sessionId.value = await getOrCreateSessionId()
  await getMessages()
  messages.value = createPreviousMessageList()
  scrollToMessage()
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
          <div
            v-if="i > 0"
            class="chat-message bot"
            :id="`message-${i}`"
            :class="item.role === 'assistant' ? 'assistant' : 'user'"
          >
            <span class="bot-title">
              <span>{{ item.role === 'assistant' ? '🤖' : '👤' }}</span>
              <span class="bot-label">{{
                item.role === 'assistant' ? 'AI アシスタント' : 'あなた (ゲスト)'
              }}</span
              ><span>{{ dateFormatter(item.date as string) }}</span>
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
    grid-template-columns: 2.5fr 1.8fr;
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
    background: rgba(240, 240, 240, 0.2);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    max-height: 40vh;
    min-height: 30vh;

    @media (max-width: 1024px) {
      padding: 10px;
      background: rgba(255, 255, 255, 0.6);
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
      box-shadow: 0 0 8px rgba(127, 90, 240, 0.5);
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

  &.assistant {
    background-color: #eef3ff;
    color: #1a1a1a;
    border-radius: 16px 16px 16px 4px;
    box-shadow: 0 4px 16px rgba(120, 82, 225, 0.1);
  }

  &.user {
    background-color: #d3c4ff;
    color: #111;
    border-radius: 16px 16px 4px 16px;
    box-shadow: 0 4px 16px rgba(120, 82, 225, 0.1);
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

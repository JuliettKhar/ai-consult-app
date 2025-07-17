<template>
  <div class="admin-panel">
    <div class="sidebar">
      <h2>セッション</h2>
      <ul>
        <li
          v-for="session in sessions"
          :key="session.id"
          :class="{ active: session.id === activeSessionId }"
          @click="selectSession(session.id)"
        >
          <span> {{ session.id.slice(0, 8) }} • {{ dateFormatter(session.created_at) }} </span>
          <div class="sidebar__btn-wrapper">
            <button
              v-if="session.id === currentSessionId"
              @click="confirmDelete(session.id)"
              class="delete-btn"
            >
              🗑
            </button>
            <button
              v-if="session.id === currentSessionId"
              @click="copyAllMessages"
              class="copy-button"
            >
              📄
            </button>
          </div>
        </li>
      </ul>
    </div>
    <div class="main">
      <h2>メッセージ履歴</h2>
      <div class="filters">
        <label>
          役割:
          <select v-model="filters.role">
            <option value="" disabled selected>選択</option>
            <option v-for="item in Object.keys(userMap)" :key="item" :value="item">
              {{ userMap[item] }}
            </option>
          </select>
        </label>
        <label>
          タイプ:
          <select v-model="filters.type">
            <option value="" disabled selected>選択</option>
            <option v-for="item in Object.keys(typeMap)" :value="item" :key="item">
              {{ typeMap[item] }}
            </option>
          </select>
        </label>
        <label>
          開始日:
          <input type="date" v-model="filters.dateFrom" />
        </label>
        <label>
          日付順:
          <input type="date" v-model="filters.dateTo" />
        </label>
        <button @click="clearFilters">リセット</button>
      </div>
      <div v-if="messages.length === 0" class="empty">セッションを選択</div>
      <div v-else class="messages">
        <div
          v-for="message in filteredMessages"
          :key="message.id"
          class="message"
          :class="[message.role === 'user' ? 'user-message' : '']"
        >
          <div class="meta">
            <span class="role">{{ userMap[message.role] }}</span>
            <span class="type">{{ typeMap[message.type as string] }}</span>
            <span class="date">{{ dateFormatter(message.date as string) }}</span>
          </div>
          <div class="content">{{ message.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import dateFormatter from '../utils/dateFormatter.ts'
import type { ISession, IMessage } from '@/types.ts'

const sessions = ref<ISession[]>([])
const messages = ref<IMessage[]>([])
const activeSessionId = ref<string | null>(null)
const currentSessionId = ref(localStorage.getItem('session_id'))

const userMap: Record<string, string> = {
  user: 'ゲスト',
  assistant: 'AI アシスタント',
}

const typeMap: Record<string, string> = {
  job: '仕事',
  study: '学業',
  relationship: '人間関係',
  health: '健康',
}

const filters = ref({
  role: '',
  type: '',
  dateFrom: '',
  dateTo: '',
})

const clearFilters = () => {
  filters.value = {
    role: '',
    type: '',
    dateFrom: '',
    dateTo: '',
  }
}

const deleteSession = async (id: string) => {
  if (!confirm('このセッションを削除しますか?')) {
    return
  }
  try {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/sessions/${id}`, { method: 'DELETE' })
    sessions.value = sessions.value.filter((s) => s.id !== id)
    if (activeSessionId.value === id) {
      activeSessionId.value = null
      messages.value = []
    }
  } catch (err) {
    console.error('削除エラー', err)
  }
}

const confirmDelete = (id: string) => {
  deleteSession(id)
}

const copyAllMessages = async () => {
  if (messages.value.length === 0) return

  const allText = messages.value
    .map((msg: IMessage) => `[${msg.role.toUpperCase()}] ${msg.content}`)
    .join('\n\n')

  try {
    await navigator.clipboard.writeText(allText)
    alert('✅ コピーしました')
  } catch (err) {
    alert('❌ コピー失敗しました')
    console.error(err)
  }
}

const getSessions = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sessions`)
    sessions.value = await res.json()
  } catch (error) {
    console.log(error)
  }
}

const filteredMessages = computed(() => {
  return messages.value.filter((msg: IMessage) => {
    const roleMatch = !filters.value.role || msg.role.includes(filters.value.role)
    const typeMatch = !filters.value.type || msg.type?.includes(filters.value.type)
    const date = new Date(msg.date as string)
    const fromMatch = !filters.value.dateFrom || date >= new Date(filters.value.dateFrom)
    const toMatch = !filters.value.dateTo || date <= new Date(filters.value.dateTo + 'T23:59:59')
    return roleMatch && typeMatch && fromMatch && toMatch
  })
})

const selectSession = async (id: string) => {
  try {
    activeSessionId.value = id
    messages.value = sessions.value.filter((session) => session.id === id)[0].messages
  } catch (error) {
    console.error(error)
  }
}

onMounted(getSessions)
</script>

<style scoped lang="scss">
.admin-panel {
  display: flex;
  flex-direction: row;
  height: 70vh;
  z-index: 1;

  @media screen and (max-width: 1125px) {
    flex-direction: column;
    height: 80vh;
    overflow: auto;
  }
}

.sidebar {
  width: 250px;
  border-right: 1px solid #e2e2e2;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.6);

  @media screen and (max-width: 1125px) {
    border-right: none;
    overflow: auto;
    max-height: 130px;
    width: 100%;
  }

  &__btn-wrapper {
    display: flex;
    gap: 4px;
  }
}

.sidebar ul {
  list-style: none;
  padding: 0;

  @media screen and (max-width: 1125px) {
    display: inline-flex;
    overflow: auto;
  }
}

.sidebar li {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid lightgray;
  cursor: pointer;
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }

  @media screen and (max-width: 1125px) {
    white-space: nowrap;
    margin: 0 4px 0 0;
  }
}

.sidebar li:hover {
  border: 1px solid #8b5cf6;
  transition: all 0.3s ease-in-out;
}

.sidebar li.active {
  border: 1px solid #8b5cf6;
  font-weight: bold;
}

.main {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  border: 1px solid #d3c4ff;
  border-radius: 6px;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 16px rgba(120, 82, 225, 0.1);
  box-sizing: border-box;
}

.meta {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.content {
  font-size: 1rem;
}

.empty {
  color: #999;
  font-style: italic;
  text-align: center;
}

.user-message {
  background-color: rgba(211, 196, 255, 0.5);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.filters label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;

  @media screen and (max-width: 1125px) {
    width: 100%;
  }
}

.filters input,
.filters select {
  padding: 0.4rem;
  background: transparent;
  border: 1px solid #999;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.filters button {
  padding: 0.5rem 1rem;
  align-self: flex-end;
  cursor: pointer;
  border: 1px solid transparent;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  color: #fff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(139, 92, 246, 0.4);
  }

  @media screen and (max-width: 1125px) {
    width: 100%;
  }
}

.session-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delete-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #888;
}

.copy-button,
.delete-btn {
  height: 25px;
  width: 25px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0.3rem;
  background: transparent;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid #007bff;
}

.copy-button:hover,
.delete-btn:hover {
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
}
</style>

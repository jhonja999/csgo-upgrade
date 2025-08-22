<template>
  <div 
    v-if="isVisible"
    class="chat-widget fixed bottom-4 right-4 w-80 h-96 bg-gray-800 rounded-lg border border-gray-700 shadow-lg z-40 flex flex-col"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-700">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        <h3 class="font-semibold text-white">Chat Global</h3>
        <span class="text-xs text-gray-400">({{ onlineUsers }})</span>
      </div>
      
      <div class="flex items-center gap-2">
        <button
          @click="toggleMinimize"
          class="text-gray-400 hover:text-white transition-colors"
        >
          {{ isMinimized ? '⬆️' : '⬇️' }}
        </button>
        <button
          @click="closeChat"
          class="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Chat Content -->
    <div v-show="!isMinimized" class="flex flex-col flex-1">
      <!-- Messages Area -->
      <div 
        ref="messagesContainer"
        class="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
      >
        <!-- System Message -->
        <div class="text-center text-xs text-gray-500 mb-2">
          Bienvenido al chat global. Sé respetuoso con otros usuarios.
        </div>

        <!-- Messages -->
        <TransitionGroup name="message" tag="div">
          <div
            v-for="message in messages"
            :key="message.id"
            class="message-item"
            :class="getMessageClass(message.type)"
          >
            <!-- Regular Chat Message -->
            <div v-if="message.type === 'chat'" class="flex items-start gap-2">
              <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs text-white font-semibold">
                {{ getInitials(message.username!) }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-medium text-white">{{ message.username }}</span>
                  <span class="text-xs text-gray-400">{{ formatTime(message.timestamp) }}</span>
                </div>
                <p class="text-sm text-gray-300 break-words">{{ message.content }}</p>
              </div>
            </div>

            <!-- Win Announcement -->
            <div v-else-if="message.type === 'win'" class="bg-green-500 bg-opacity-10 border border-green-500 rounded p-2">
              <div class="flex items-center gap-2">
                <span class="text-green-400 text-lg">🎉</span>
                <div class="flex-1">
                  <p class="text-green-400 text-sm font-semibold">
                    {{ message.username }} ganó ${{ message.amount?.toFixed(2) }}
                  </p>
                  <p class="text-xs text-gray-400">{{ message.content }}</p>
                </div>
              </div>
            </div>

            <!-- System Message -->
            <div v-else-if="message.type === 'system'" class="text-center text-xs text-gray-500 italic">
              {{ message.content }}
            </div>
          </div>
        </TransitionGroup>

        <!-- Typing Indicator -->
        <div v-if="typingUsers.length > 0" class="text-xs text-gray-500 italic">
          {{ getTypingText() }}
        </div>
      </div>

      <!-- Input Area -->
      <div class="p-3 border-t border-gray-700">
        <div class="flex gap-2">
          <input
            v-model="messageInput"
            type="text"
            placeholder="Escribe un mensaje..."
            class="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            @keypress="onKeyPress"
            @input="onTyping"
            :disabled="isDisabled"
            maxlength="200"
          >
          <button
            @click="sendMessage"
            :disabled="!canSend"
            class="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
          >
            Enviar
          </button>
        </div>
        
        <!-- Character Counter -->
        <div class="flex justify-between items-center mt-1">
          <span class="text-xs text-gray-500">
            {{ messageInput.length }}/200
          </span>
          <span v-if="cooldownTime > 0" class="text-xs text-yellow-400">
            Espera {{ cooldownTime }}s
          </span>
        </div>
      </div>
    </div>
  </div>

  <!-- Chat Toggle Button (when closed) -->
  <button
    v-else
    @click="openChat"
    class="fixed bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-40"
  >
    <div class="relative">
      💬
      <div v-if="hasUnreadMessages" class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
    </div>
  </button>
</template>

<script setup lang="ts">
interface ChatMessage {
  id: string
  type: 'chat' | 'win' | 'system'
  username?: string
  content: string
  timestamp: number
  amount?: number
}

// State
const isVisible = ref(false)
const isMinimized = ref(false)
const messageInput = ref('')
const messages = ref<ChatMessage[]>([])
const onlineUsers = ref(127)
const typingUsers = ref<string[]>([])
const cooldownTime = ref(0)
const isDisabled = ref(false)
const hasUnreadMessages = ref(false)
const messagesContainer = ref<HTMLElement>()

// Typing timeout
let typingTimeout: NodeJS.Timeout | null = null
let cooldownInterval: NodeJS.Timeout | null = null

// Computed
const canSend = computed(() => {
  return messageInput.value.trim().length > 0 && 
         messageInput.value.length <= 200 && 
         cooldownTime.value === 0 && 
         !isDisabled.value
})

// Methods
const openChat = () => {
  isVisible.value = true
  hasUnreadMessages.value = false
  scrollToBottom()
}

const closeChat = () => {
  isVisible.value = false
}

const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value
  if (!isMinimized.value) {
    nextTick(() => scrollToBottom())
  }
}

const sendMessage = () => {
  if (!canSend.value) return

  const message: ChatMessage = {
    id: generateId(),
    type: 'chat',
    username: 'TuUsuario', // En producción vendría del store de usuario
    content: messageInput.value.trim(),
    timestamp: Date.now()
  }

  addMessage(message)
  messageInput.value = ''
  
  // Aplicar cooldown
  startCooldown(3)
}

const addMessage = (message: ChatMessage) => {
  messages.value.push(message)
  
  // Mantener solo los últimos 50 mensajes
  if (messages.value.length > 50) {
    messages.value = messages.value.slice(-50)
  }
  
  // Si el chat está cerrado o minimizado, mostrar notificación
  if (!isVisible.value || isMinimized.value) {
    hasUnreadMessages.value = true
  }
  
  nextTick(() => scrollToBottom())
}

const addWinMessage = (username: string, amount: number, item: string) => {
  const message: ChatMessage = {
    id: generateId(),
    type: 'win',
    username,
    content: `obtuvo ${item}`,
    timestamp: Date.now(),
    amount
  }
  
  addMessage(message)
}

const addSystemMessage = (content: string) => {
  const message: ChatMessage = {
    id: generateId(),
    type: 'system',
    content,
    timestamp: Date.now()
  }
  
  addMessage(message)
}

const onKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && canSend.value) {
    sendMessage()
  }
}

const onTyping = () => {
  // Simular indicador de escribiendo
  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }
  
  typingTimeout = setTimeout(() => {
    // Remover de la lista de usuarios escribiendo
  }, 2000)
}

const startCooldown = (seconds: number) => {
  cooldownTime.value = seconds
  isDisabled.value = true
  
  cooldownInterval = setInterval(() => {
    cooldownTime.value--
    if (cooldownTime.value <= 0) {
      isDisabled.value = false
      if (cooldownInterval) {
        clearInterval(cooldownInterval)
      }
    }
  }, 1000)
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const getMessageClass = (type: string) => {
  return {
    'message-chat': type === 'chat',
    'message-win': type === 'win',
    'message-system': type === 'system'
  }
}

const getInitials = (username: string) => {
  return username.slice(0, 2).toUpperCase()
}

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTypingText = () => {
  if (typingUsers.value.length === 1) {
    return `${typingUsers.value[0]} está escribiendo...`
  } else if (typingUsers.value.length > 1) {
    return `${typingUsers.value.length} usuarios están escribiendo...`
  }
  return ''
}

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Mock messages para desarrollo
const loadMockMessages = () => {
  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      type: 'system',
      content: 'Chat iniciado',
      timestamp: Date.now() - 1000 * 60 * 10
    },
    {
      id: '2',
      type: 'chat',
      username: 'ProGamer123',
      content: '¡Hola a todos! ¿Alguien ha probado el nuevo upgrade?',
      timestamp: Date.now() - 1000 * 60 * 8
    },
    {
      id: '3',
      type: 'win',
      username: 'LuckyPlayer',
      content: 'obtuvo AK-47 | Fire Serpent',
      timestamp: Date.now() - 1000 * 60 * 5,
      amount: 1200
    },
    {
      id: '4',
      type: 'chat',
      username: 'SkinHunter',
      content: '¡Felicidades! Qué suerte tienes',
      timestamp: Date.now() - 1000 * 60 * 4
    },
    {
      id: '5',
      type: 'chat',
      username: 'CasinoKing',
      content: 'Alguien sabe cuál es el multiplicador máximo?',
      timestamp: Date.now() - 1000 * 60 * 2
    }
  ]
  
  messages.value = mockMessages
}

// Lifecycle
onMounted(() => {
  loadMockMessages()
  
  // Simular mensajes aleatorios
  const messageInterval = setInterval(() => {
    if (Math.random() > 0.7) {
      const usernames = ['ProGamer123', 'LuckyPlayer', 'SkinHunter', 'CasinoKing', 'UpgradeGod']
      const messages = [
        '¡Buena suerte a todos!',
        'Acabo de hacer un upgrade exitoso',
        'Este sitio es genial',
        '¿Alguien quiere hacer trade?',
        'Vamos por más upgrades!'
      ]
      
      const randomUser = usernames[Math.floor(Math.random() * usernames.length)]
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]
      
      addMessage({
        id: generateId(),
        type: 'chat',
        username: randomUser,
        content: randomMessage,
        timestamp: Date.now()
      })
    }
  }, 15000) // Cada 15 segundos
  
  onUnmounted(() => {
    clearInterval(messageInterval)
    if (typingTimeout) clearTimeout(typingTimeout)
    if (cooldownInterval) clearInterval(cooldownInterval)
  })
})

// Expose methods for external components
defineExpose({
  addWinMessage,
  addSystemMessage
})
</script>

<style scoped>
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #1f2937;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Message animations */
.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.message-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}
</style>
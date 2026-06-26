import { ref, onMounted, onUnmounted, computed } from 'vue'

/**
 * 倒數計時 composable。把「時間邏輯」從卡片元件抽離，可被任何需要倒數的 UI 重用。
 */
export function useCountdown(endsAt: string) {
  const now = ref(Date.now())
  let timer: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    timer = setInterval(() => (now.value = Date.now()), 1000)
  })
  onUnmounted(() => clearInterval(timer))

  const remaining = computed(() => Math.max(0, new Date(endsAt).getTime() - now.value))
  const expired = computed(() => remaining.value === 0)

  function pad(n: number) {
    return n.toString().padStart(2, '0')
  }

  const text = computed(() => {
    const s = Math.floor(remaining.value / 1000)
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    return `${pad(h)}:${pad(m)}:${pad(s % 60)}`
  })

  return { remaining, expired, text }
}

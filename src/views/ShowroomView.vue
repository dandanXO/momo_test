<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCardConfigStore } from '@/stores/cardConfig'
import { CATEGORIES, type PromotionTag } from '@/mock/schema'
import ProductCard, { type CardVariant } from '@/components/cards/ProductCard.vue'

const store = useCardConfigStore()
const { config, endsAt, validationErrors } = storeToRefs(store)

const VARIANTS: { value: CardVariant; label: string }[] = [
  { value: 'standard', label: '標準卡' },
  { value: 'flashSale', label: '限時下殺' },
  { value: 'ranking', label: '排行榜' },
  { value: 'live', label: '直播' },
]

const ALL_TAGS: PromotionTag[] = ['限時', '免運', '滿額折', '新品', '熱銷', '直播優惠']

function toggleTag(tag: PromotionTag) {
  const tags = config.value.product.tags ?? []
  config.value.product.tags = tags.includes(tag)
    ? tags.filter((t) => t !== tag)
    : [...tags, tag]
}

// 圖片以 seed 控制，方便調整
const imageSeed = computed({
  get: () => config.value.product.image.split('/seed/')[1]?.split('/')[0] ?? 'momo-demo',
  set: (v: string) => (config.value.product.image = `https://picsum.photos/seed/${v || 'momo-demo'}/400/400`),
})
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-4">
    <header class="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h1 class="text-2xl font-black text-ink">商品卡 Showroom</h1>
        <p class="text-sm text-ink-soft">調整下方參數即時預覽商品卡，設定會自動儲存在瀏覽器（重整不遺失）。</p>
      </div>
      <a
        href="/sample.html"
        target="_blank"
        rel="noopener"
        class="rounded-md border border-momo px-3 py-1.5 text-sm font-medium text-momo hover:bg-momo-light"
      >
        Web Component 範例（sample.html）↗
      </a>
    </header>

    <div class="grid gap-6 lg:grid-cols-[1fr_320px]">
      <!-- 編輯器 -->
      <section class="space-y-4 rounded-lg bg-white p-4">
        <h2 class="font-bold text-ink">卡片細節調整</h2>

        <!-- 變體 -->
        <div>
          <label class="mb-1 block text-sm font-medium text-ink">變體 Variant</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="v in VARIANTS"
              :key="v.value"
              type="button"
              class="rounded-full border px-3 py-1 text-sm"
              :class="config.variant === v.value ? 'border-momo bg-momo text-white' : 'border-line text-ink hover:border-momo'"
              @click="config.variant = v.value"
            >
              {{ v.label }}
            </button>
          </div>
        </div>

        <!-- 文字欄位 -->
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="text-sm">
            <span class="mb-1 block font-medium text-ink">標題</span>
            <input v-model="config.product.title" class="w-full rounded-md border border-line px-2 py-1.5" />
          </label>
          <label class="text-sm">
            <span class="mb-1 block font-medium text-ink">分類</span>
            <select v-model="config.product.category" class="w-full rounded-md border border-line px-2 py-1.5">
              <option v-for="c in CATEGORIES" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </label>
          <label class="text-sm">
            <span class="mb-1 block font-medium text-ink">售價</span>
            <input v-model.number="config.product.price" type="number" min="0" class="w-full rounded-md border border-line px-2 py-1.5" />
          </label>
          <label class="text-sm">
            <span class="mb-1 block font-medium text-ink">原價（選填）</span>
            <input v-model.number="config.product.originalPrice" type="number" min="0" class="w-full rounded-md border border-line px-2 py-1.5" />
          </label>
          <label class="text-sm">
            <span class="mb-1 block font-medium text-ink">評分</span>
            <input v-model.number="config.product.rating" type="number" step="0.1" min="0" max="5" class="w-full rounded-md border border-line px-2 py-1.5" />
          </label>
          <label class="text-sm">
            <span class="mb-1 block font-medium text-ink">評論數</span>
            <input v-model.number="config.product.reviewCount" type="number" min="0" class="w-full rounded-md border border-line px-2 py-1.5" />
          </label>
          <label class="text-sm">
            <span class="mb-1 block font-medium text-ink">圖片 seed</span>
            <input v-model="imageSeed" class="w-full rounded-md border border-line px-2 py-1.5" />
          </label>
        </div>

        <!-- 標籤 -->
        <div>
          <label class="mb-1 block text-sm font-medium text-ink">促銷標籤</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in ALL_TAGS"
              :key="tag"
              type="button"
              class="rounded-full border px-3 py-1 text-xs"
              :class="config.product.tags?.includes(tag) ? 'border-momo bg-momo-light text-momo-dark' : 'border-line text-ink-soft'"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <!-- 變體專屬 -->
        <div v-if="config.variant === 'ranking'" class="text-sm">
          <span class="mb-1 block font-medium text-ink">名次</span>
          <input v-model.number="config.rank" type="number" min="1" class="w-32 rounded-md border border-line px-2 py-1.5" />
        </div>
        <div v-if="config.variant === 'flashSale'" class="grid gap-3 sm:grid-cols-2">
          <label class="text-sm">
            <span class="mb-1 block font-medium text-ink">已售比例：{{ Math.round(config.soldRatio * 100) }}%</span>
            <input v-model.number="config.soldRatio" type="range" min="0" max="1" step="0.01" class="w-full" />
          </label>
          <label class="text-sm">
            <span class="mb-1 block font-medium text-ink">倒數小時</span>
            <input v-model.number="config.countdownHours" type="number" min="0" class="w-full rounded-md border border-line px-2 py-1.5" />
          </label>
        </div>

        <!-- 驗證 + 重設 -->
        <div class="flex items-center justify-between border-t border-line pt-3">
          <p v-if="validationErrors.length" class="text-xs text-red-500">
            ⚠ 資料不符契約：{{ validationErrors.join('；') }}
          </p>
          <p v-else class="text-xs text-emerald-600">✓ 資料符合 Product 契約</p>
          <button type="button" class="rounded-md border border-line px-3 py-1 text-sm text-ink hover:border-momo" @click="store.reset()">
            重設預設值
          </button>
        </div>
      </section>

      <!-- 即時預覽 -->
      <section class="lg:sticky lg:top-20 lg:self-start">
        <h2 class="mb-2 font-bold text-ink">即時預覽</h2>
        <div class="w-48">
          <ProductCard
            :product="config.product"
            :variant="config.variant"
            :rank="config.rank"
            :ends-at="endsAt"
            :sold-ratio="config.soldRatio"
          />
        </div>
      </section>
    </div>

    <!-- 所有變體一覽 -->
    <section class="mt-10">
      <h2 class="mb-3 font-bold text-ink">所有卡片變體（套用目前商品資料）</h2>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div v-for="v in VARIANTS" :key="v.value">
          <p class="mb-1 text-xs font-medium text-ink-soft">{{ v.label }}</p>
          <ProductCard
            :product="config.product"
            :variant="v.value"
            :rank="config.rank"
            :ends-at="endsAt"
            :sold-ratio="config.soldRatio"
          />
        </div>
      </div>
    </section>
  </main>
</template>

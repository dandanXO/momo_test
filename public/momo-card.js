/**
 * <momo-product-card> — 純前端、無框架依賴的 momo 商品卡 Web Component。
 *
 * 用法（script 載入後即可使用）：
 *   <script src="momo-card.js"></script>
 *   <momo-product-card
 *     variant="flashSale"
 *     rank="1"
 *     ends-at="2026-12-31T23:59:59"
 *     sold-ratio="0.7"
 *     data='{"title":"...","image":"...","price":1280,"originalPrice":1980,"rating":4.6,"reviewCount":1284,"tags":["限時","免運"]}'>
 *   </momo-product-card>
 *
 * 也可用 JS 設定：el.product = {...}; el.variant = 'ranking'
 *
 * 設計：與 Vue 版 ProductCard 共用同一份 schema 與 variant 概念（Reusable Card Architecture）。
 */
(function () {
  const KNOWN = ['standard', 'flashSale', 'ranking', 'live']
  const TAG_COLORS = {
    限時: '#ff6b00', 免運: '#d62872', 滿額折: '#b01e5c',
    新品: '#10b981', 熱銷: '#f59e0b', 直播優惠: '#9333ea',
  }
  const ntd = (n) => '$' + Number(n).toLocaleString('en-US')

  class MomoProductCard extends HTMLElement {
    static get observedAttributes() {
      return ['variant', 'rank', 'ends-at', 'sold-ratio', 'data']
    }
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this._product = null
      this._timer = null
    }
    set product(v) { this._product = v; this.render() }
    get product() {
      if (this._product) return this._product
      try { return JSON.parse(this.getAttribute('data') || '{}') } catch { return {} }
    }
    set variant(v) { this.setAttribute('variant', v) }
    get variant() {
      const v = this.getAttribute('variant') || 'standard'
      return KNOWN.includes(v) ? v : (console.warn(`[momo-product-card] unknown variant "${v}", fallback to standard`), 'standard')
    }
    connectedCallback() { this.render() }
    disconnectedCallback() { clearInterval(this._timer) }
    attributeChangedCallback() { this.render() }

    _countdownText() {
      const endsAt = this.getAttribute('ends-at')
      if (!endsAt) return ''
      const ms = Math.max(0, new Date(endsAt).getTime() - Date.now())
      if (ms === 0) return '已結束'
      const s = Math.floor(ms / 1000)
      const p = (n) => String(n).padStart(2, '0')
      return `剩 ${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`
    }

    render() {
      const p = this.product
      const variant = this.variant
      const rank = this.getAttribute('rank')
      const soldRatio = parseFloat(this.getAttribute('sold-ratio') || '0')
      const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0

      clearInterval(this._timer)
      if (variant === 'flashSale' && this.getAttribute('ends-at')) {
        this._timer = setInterval(() => {
          const el = this.shadowRoot.querySelector('.countdown')
          if (el) el.textContent = this._countdownText()
        }, 1000)
      }

      const tags = (p.tags || []).map(
        (t) => `<span class="tag" style="background:${TAG_COLORS[t] || '#ccc'}">${t}</span>`,
      ).join('')

      this.shadowRoot.innerHTML = `
        <style>
          :host { display:block; font-family:'Noto Sans TC','PingFang TC','Microsoft JhengHei',system-ui,sans-serif; }
          .card { display:flex; flex-direction:column; overflow:hidden; border-radius:8px; background:#fff;
                  box-shadow:0 1px 3px rgba(0,0,0,.12); transition:box-shadow .2s; cursor:pointer; }
          .card:hover { box-shadow:0 4px 12px rgba(0,0,0,.16); }
          .imgwrap { position:relative; aspect-ratio:1/1; background:#ececec; overflow:hidden; }
          .imgwrap img { width:100%; height:100%; object-fit:cover; transition:transform .3s; }
          .card:hover img { transform:scale(1.05); }
          .rank { position:absolute; left:0; top:0; width:28px; height:28px; display:flex; align-items:center;
                  justify-content:center; background:#d62872; color:#fff; font-weight:700; font-size:14px; }
          .live { position:absolute; left:6px; top:6px; display:flex; align-items:center; gap:4px; background:#9333ea;
                  color:#fff; font-size:10px; font-weight:700; padding:2px 8px; border-radius:999px; }
          .live .dot { width:6px; height:6px; border-radius:50%; background:#fff; }
          .disc { position:absolute; right:0; top:0; background:#ff6b00; color:#fff; font-size:11px; font-weight:700; padding:2px 6px; }
          .body { display:flex; flex-direction:column; gap:4px; padding:8px; flex:1; }
          .tags { display:flex; flex-wrap:wrap; gap:4px; }
          .tag { color:#fff; font-size:10px; font-weight:700; padding:2px 6px; border-radius:2px; line-height:1; }
          .title { font-size:14px; line-height:1.3; color:#333; min-height:2.6em;
                   display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
          .countdown { font-family:monospace; font-size:12px; font-weight:700; color:#ff6b00; }
          .bar { height:10px; border-radius:999px; background:#fce4ee; overflow:hidden; }
          .bar > span { display:block; height:100%; background:#ff6b00; border-radius:999px; }
          .sold { font-size:10px; color:#888; }
          .price { display:flex; align-items:baseline; gap:6px; margin-top:auto; }
          .price .now { font-size:18px; font-weight:700; color:#d62872; }
          .price .old { font-size:12px; color:#888; text-decoration:line-through; }
          .rating { font-size:11px; color:#888; }
          .rating .star { color:#f59e0b; }
        </style>
        <div class="card">
          <div class="imgwrap">
            <img src="${p.image || ''}" alt="${p.title || ''}" loading="lazy" />
            ${variant === 'ranking' && rank ? `<div class="rank">${rank}</div>` : ''}
            ${variant === 'live' ? `<div class="live"><span class="dot"></span>LIVE</div>` : ''}
            ${discount ? `<div class="disc">${discount}% OFF</div>` : ''}
          </div>
          <div class="body">
            ${tags ? `<div class="tags">${tags}</div>` : ''}
            <div class="title">${p.title || ''}</div>
            ${variant === 'flashSale' ? `
              <div class="countdown">${this._countdownText()}</div>
              <div class="bar"><span style="width:${Math.round(soldRatio * 100)}%"></span></div>
              <div class="sold">已售出 ${Math.round(soldRatio * 100)}%</div>` : ''}
            <div class="price">
              <span class="now">${ntd(p.price || 0)}</span>
              ${p.originalPrice ? `<span class="old">${ntd(p.originalPrice)}</span>` : ''}
            </div>
            ${p.rating ? `<div class="rating"><span class="star">★ ${p.rating}</span> (${Number(p.reviewCount || 0).toLocaleString('en-US')})</div>` : ''}
          </div>
        </div>
      `
    }
  }

  if (!customElements.get('momo-product-card')) {
    customElements.define('momo-product-card', MomoProductCard)
  }
})()

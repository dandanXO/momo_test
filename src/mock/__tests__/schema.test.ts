import { describe, it, expect } from 'vitest'
import { validateProduct } from '../schema'
import { MOCK_PRODUCTS } from '../products'
import { fetchProducts, fetchProduct } from '../api'

describe('Product schema (data contract)', () => {
  it('accepts a valid product', () => {
    expect(validateProduct({ id: 'x', title: 't', price: 100, category: '3c' })).toEqual([])
  })

  it('rejects negative price', () => {
    const errors = validateProduct({ id: 'x', title: 't', price: -1, category: '3c' })
    expect(errors).toContain('price must be >= 0')
  })

  it('rejects originalPrice lower than price', () => {
    const errors = validateProduct({ id: 'x', title: 't', price: 100, originalPrice: 80, category: '3c' })
    expect(errors).toContain('originalPrice must be >= price')
  })

  it('rejects unknown category', () => {
    const errors = validateProduct({ id: 'x', title: 't', price: 100, category: 'nope' })
    expect(errors.some((e) => e.includes('not in CATEGORIES'))).toBe(true)
  })

  it('all mock products satisfy the contract', () => {
    for (const p of MOCK_PRODUCTS) expect(validateProduct(p)).toEqual([])
  })
})

describe('mock api (smoke)', () => {
  it('filters by keyword', async () => {
    const all = await fetchProducts()
    expect(all.length).toBeGreaterThan(0)
    const filtered = await fetchProducts({ keyword: '耳機' })
    expect(filtered.every((p) => p.title.includes('耳機'))).toBe(true)
  })

  it('fetches a single product by id', async () => {
    const p = await fetchProduct('3c-1')
    expect(p?.id).toBe('3c-1')
  })
})

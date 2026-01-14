/**
 * 统一的存储封装类
 * 处理 JSON 序列化/反序列化、类型安全和事件派发
 */

type StorageType = 'localStorage' | 'sessionStorage'

interface StorageEventDetail {
  key: string | null
  newValue: string | null
  type: StorageType
}

class StorageWrapper {
  private storage: Storage
  private type: StorageType

  constructor(type: StorageType) {
    this.type = type
    // SSR 安全检查
    this.storage = typeof window !== 'undefined' ? window[type] : ({} as Storage)
  }

  /**
   * 获取存储项
   * @param key 键名
   * @param defaultValue 默认值（当键不存在或出错时返回）
   */
  get<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === 'undefined') return defaultValue ?? null

    try {
      const value = this.storage.getItem(key)
      if (value === null) return defaultValue ?? null
      return JSON.parse(value) as T
    } catch (error) {
      console.warn(`[Storage] Error reading ${this.type} key "${key}":`, error)
      return defaultValue ?? null
    }
  }

  /**
   * 设置存储项
   * @param key 键名
   * @param value 值（会自动进行 JSON.stringify）
   */
  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return

    try {
      const stringValue = JSON.stringify(value)
      this.storage.setItem(key, stringValue)
      
      // 派发自定义事件，用于同一标签页的组件同步
      this.dispatch({
        key,
        newValue: stringValue,
        type: this.type,
      })
    } catch (error) {
      console.warn(`[Storage] Error setting ${this.type} key "${key}":`, error)
    }
  }

  /**
   * 移除存储项
   * @param key 键名
   */
  remove(key: string): void {
    if (typeof window === 'undefined') return

    try {
      this.storage.removeItem(key)
      this.dispatch({
        key,
        newValue: null,
        type: this.type,
      })
    } catch (error) {
      console.warn(`[Storage] Error removing ${this.type} key "${key}":`, error)
    }
  }

  /**
   * 清空存储
   */
  clear(): void {
    if (typeof window === 'undefined') return

    try {
      this.storage.clear()
      this.dispatch({
        key: null,
        newValue: null,
        type: this.type,
      })
    } catch (error) {
      console.warn(`[Storage] Error clearing ${this.type}:`, error)
    }
  }

  private dispatch(detail: StorageEventDetail) {
    window.dispatchEvent(
      new CustomEvent('shadcn-storage', {
        detail,
      })
    )
  }
}

export const local = new StorageWrapper('localStorage')
export const session = new StorageWrapper('sessionStorage')

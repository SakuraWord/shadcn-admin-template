import { useCallback, useEffect, useState } from 'react'
import { local, session } from '@/lib/storage'

type StorageType = 'local' | 'session'

/**
 * 内部使用的通用存储 Hook
 */
function useStorage<T>(
  type: StorageType,
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  
  const storageInstance = type === 'local' ? local : session

  // 初始化状态
  const [storedValue, setStoredValue] = useState<T>(() => {
    // 优先从 storage 读取，如果不存在则使用 initialValue
    const item = storageInstance.get<T>(key)
    return item !== null ? item : initialValue
  })

  // 封装 setValue，支持函数式更新
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        storageInstance.set(key, valueToStore)
      } catch (error) {
        console.error(`[useStorage] Error setting value for key "${key}":`, error)
      }
    },
    [key, storageInstance, storedValue]
  )

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent | CustomEvent) => {
      const targetType = type === 'local' ? 'localStorage' : 'sessionStorage'

      // 处理原生 StorageEvent (跨标签页同步)
      if (event instanceof StorageEvent) {
        if (event.key === key && event.storageArea === window[targetType]) {
          try {
            const newValue = event.newValue ? JSON.parse(event.newValue) : initialValue
            setStoredValue(newValue)
          } catch {
            setStoredValue(initialValue)
          }
        }
      }
      // 处理自定义事件 (同一标签页同步)
      else if (event instanceof CustomEvent && event.type === 'shadcn-storage') {
        const detail = event.detail
        if (detail.type === targetType && (detail.key === key || detail.key === null)) {
          // key === null 表示 clear
          if (detail.key === null) {
             setStoredValue(initialValue)
             return
          }
          try {
            const newValue = detail.newValue ? JSON.parse(detail.newValue) : initialValue
            setStoredValue(newValue)
          } catch {
            setStoredValue(initialValue)
          }
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('shadcn-storage', handleStorageChange as EventListener)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('shadcn-storage', handleStorageChange as EventListener)
    }
  }, [key, type, initialValue])

  return [storedValue, setValue]
}

/**
 * React Hook for localStorage
 * @param key 存储键名
 * @param initialValue 初始值
 */
export function useLocal<T>(key: string, initialValue: T) {
  return useStorage<T>('local', key, initialValue)
}

/**
 * React Hook for sessionStorage
 * @param key 存储键名
 * @param initialValue 初始值
 */
export function useSession<T>(key: string, initialValue: T) {
  return useStorage<T>('session', key, initialValue)
}

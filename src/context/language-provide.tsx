import { createContext,useContext, useEffect, useState } from 'react'
import { local } from '@/lib/storage'
import { LANG } from '@/config'

type LanguageType = 'EN' | 'ZH_CN'

type LanguageContextType = {
  language: LanguageType
  setLanguage: (language: LanguageType) => void
}

type LanguageProviderProps = {
  children: React.ReactNode
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'EN',
  setLanguage: () => null,
})

const languageProvide = ({ children }: LanguageProviderProps) => {

  const [language, setLanguage] = useState<LanguageType>(LANG)

  useEffect(() => {
    local.set('lang', language )
  }, [
    language
  ])

  return (
    <LanguageContext value={{ language, setLanguage }}>
      {children}
    </LanguageContext>
  )
}

export const useLanguage = () => {
  const languageContext = useContext(LanguageContext)
  if (!languageContext) {
    throw new Error('useLanguage must be used within a FontProvider')
  }
  return languageContext
}

export default languageProvide

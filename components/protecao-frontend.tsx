"use client"

import { useEffect } from 'react'

export const ProtecaoFrontend = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return

    const bloquear = (e: KeyboardEvent) => {
      // Bloquear F12
      if (e.key === 'F12') e.preventDefault()
      
      // Bloquear CTRL+S, CTRL+U, CTRL+I, CTRL+J
      if (e.ctrlKey && (['s', 'u', 'i', 'j'].includes(e.key.toLowerCase()))) {
        e.preventDefault()
      }
    }

    const bloquearMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    document.addEventListener('keydown', bloquear)
    document.addEventListener('contextmenu', bloquearMenu)

    return () => {
      document.removeEventListener('keydown', bloquear)
      document.removeEventListener('contextmenu', bloquearMenu)
    }
  }, [])

  return null
}

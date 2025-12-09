"use client"

import { useState } from "react"
import { login, signup } from '@/app/auth/actions'

export default function LoginPage() {
  const [lang, setLang] = useState<'en' | 'es'>('en')

  const t = {
    en: {
      title: "Access your account",
      subtitle: "Enter your details to access the dashboard",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      btnSignIn: "Sign In",
      btnSignUp: "Sign Up (Create Account)",
      placeholderEmail: "example@email.com",
      placeholderPass: "••••••••"
    },
    es: {
      title: "Accede a tu cuenta",
      subtitle: "Ingresa tus datos para acceder al panel",
      emailLabel: "Correo Electrónico",
      passwordLabel: "Contraseña",
      btnSignIn: "Entrar",
      btnSignUp: "Registrarse (Crear Cuenta)",
      placeholderEmail: "ejemplo@correo.com",
      placeholderPass: "••••••••"
    }
  }

  const text = t[lang]

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gray-900">
      
      {/* 
          IMAGEM DE FUNDO 
          Se a imagem não aparecer, verifique se ela está em: /public/bg.png
          A classe 'brightness-50' já escurece a imagem automaticamente.
      */}
      <div className="absolute inset-0 z-0 bg-[url('/bg.png')] bg-cover bg-center brightness-50" />

      {/* Botões de Troca de Idioma */}
      <div className="absolute top-5 right-5 z-20 flex gap-2">
        <button 
          onClick={() => setLang('en')}
          className={`px-3 py-1 rounded-full text-sm font-bold transition-all border ${
            lang === 'en' ? 'bg-white text-black border-white' : 'bg-black/40 text-white border-white/50 hover:bg-black/60'
          }`}
        >
          EN
        </button>
        <button 
          onClick={() => setLang('es')}
          className={`px-3 py-1 rounded-full text-sm font-bold transition-all border ${
            lang === 'es' ? 'bg-white text-black border-white' : 'bg-black/40 text-white border-white/50 hover:bg-black/60'
          }`}
        >
          ES
        </button>
      </div>

      {/* Cartão de Login */}
      <div className="z-10 w-full max-w-md space-y-8 bg-white/95 backdrop-blur-md p-8 shadow-2xl rounded-xl mx-4 border border-white/20">
        
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {text.title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {text.subtitle}
          </p>
        </div>

        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {text.emailLabel}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email" 
                  type="email"
                  autoComplete="email"
                  required
                  placeholder={text.placeholderEmail}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {text.passwordLabel}
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder={text.placeholderPass}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              formAction={login}
              className="flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 transition-colors"
            >
              {text.btnSignIn}
            </button>
            
            <button
              formAction={signup}
              className="flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              {text.btnSignUp}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

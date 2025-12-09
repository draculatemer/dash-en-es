"use client"

import { useState } from "react"
import { login, signup } from '@/app/auth/actions'

export default function LoginPage() {
  const [lang, setLang] = useState<'en' | 'es'>('en')
  
  // Novo estado para controlar o Popup
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const t = {
    en: {
      title: "Access your account",
      subtitle: "Enter your details to access the dashboard",
      emailLabel: "Email Address",
      passwordLabel: "Password",
      btnSignIn: "Sign In",
      btnSignUp: "Sign Up (Create Account)",
      placeholderEmail: "example@email.com",
      placeholderPass: "••••••••",
      // Traduções do Modal
      modalTitle: "Check your email!",
      modalBody: "We've sent a confirmation link to your email address. Please click the link to activate your account and access the dashboard.",
      modalBtn: "Got it, I'll check it"
    },
    es: {
      title: "Accede a tu cuenta",
      subtitle: "Ingresa tus datos para acceder al panel",
      emailLabel: "Correo Electrónico",
      passwordLabel: "Contraseña",
      btnSignIn: "Entrar",
      btnSignUp: "Registrarse (Crear Cuenta)",
      placeholderEmail: "ejemplo@correo.com",
      placeholderPass: "••••••••",
      // Traduções do Modal
      modalTitle: "¡Verifica tu correo!",
      modalBody: "Hemos enviado un enlace de confirmación a tu correo electrónico. Por favor haz clic en el enlace para activar tu cuenta y acceder al panel.",
      modalBtn: "Entendido, voy a revisar"
    }
  }

  const text = t[lang]

  // Função especial para lidar com o cadastro e abrir o modal
  const handleSignup = async (formData: FormData) => {
    setLoading(true)
    const result = await signup(formData)
    setLoading(false)

    if (result?.success) {
      setShowModal(true)
    } else {
      // Aqui você poderia mostrar um erro se quisesse
      alert("Error signing up. Please try again.")
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gray-900">
      
      {/* IMAGEM DE FUNDO */}
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
            
            {/* O Botão de Signup agora chama a função handleSignup */}
            <button
              formAction={handleSignup}
              disabled={loading}
              className="flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {loading ? "..." : text.btnSignUp}
            </button>
          </div>
        </form>
      </div>

      {/* MODAL / POPUP DE SUCESSO */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 text-center transform transition-all scale-100">
            
            {/* Ícone de Email */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {text.modalTitle}
            </h3>
            
            <p className="text-sm text-gray-500 mb-6">
              {text.modalBody}
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-800 focus:outline-none sm:text-sm"
            >
              {text.modalBtn}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

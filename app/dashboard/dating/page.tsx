"use client"

// 👇 Garante que a página seja dinâmica
export const dynamic = "force-dynamic"

import { useState, useEffect, useRef, useMemo, Suspense } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import FeatureCard from "@/components/feature-card"
import { useAuth } from "@/lib/auth-context"
import { translations } from "@/lib/translations"

// Ícones
import {
  Zap,
  AlertTriangle,
  Flame,
  Camera,
  CheckCircle,
  MapPin,
  X,
  Loader2,
  Search,
  MessageCircle,
  Clock,
  Send,
  User,
  MoreVertical
} from "lucide-react"

// =======================================================
// DADOS MOCKADOS
// =======================================================

interface Match {
  name: string
  age: number
  lastSeen: string
  avatar: string
  verified: boolean
  identity: string
  location: string
  distance: string
  bio: string
  images: string[]
}

// Mock de conversas (Dating context)
const DATING_CHATS = [
  [
    { sender: "other", text: "Hey! Your profile caught my eye. 😉" },
    { sender: "me", text: "Hi there! Thanks, you look great too." },
    { sender: "other", text: "Are you free this weekend? I know a great sushi place." },
    { sender: "me", text: "Sushi sounds perfect. I'm free Saturday night!" },
    { sender: "other", text: "It's a date then! 🍣" }
  ],
  [
    { sender: "me", text: "I have to ask... is that dog in your 3rd pic yours?" },
    { sender: "other", text: "Haha yes! That's Buster. He's the real star here." },
    { sender: "me", text: "He's adorable! We definitely need a dog playdate." },
    { sender: "other", text: "Buster would love that. And so would I 😏" }
  ],
  [
    { sender: "other", text: "So, what are you looking for on here?" },
    { sender: "me", text: "Just seeing where things go. You?" },
    { sender: "other", text: "Same. Maybe looking for someone to steal my hoodies." },
    { sender: "me", text: "I'm excellent at hoodie theft. Watch out. 😈" }
  ]
]

// Dados bases
const femaleMatchesData: Omit<Match, "location">[] = [
  {
    name: "Elizabeth",
    age: 24,
    lastSeen: "1h ago",
    avatar: "/images/male/tinder/1.jpg",
    verified: true,
    identity: "Woman",
    distance: "3 km",
    bio: "Seeking new adventures and a great cup of coffee.",
    images: ["/images/male/tinder/1.jpg", "/images/male/tinder/2.jpg"]
  },
  {
    name: "Victoria",
    age: 27,
    lastSeen: "5h ago",
    avatar: "/images/male/tinder/2.jpg",
    verified: false,
    identity: "Woman",
    distance: "1 km",
    bio: "Bookworm and aspiring chef.",
    images: ["/images/male/tinder/2.jpg", "/images/male/tinder/3.jpg"]
  },
  {
    name: "Charlotte",
    age: 22,
    lastSeen: "Online",
    avatar: "/images/male/tinder/3.jpg",
    verified: true,
    identity: "Woman",
    distance: "6 km",
    bio: "Lover of live music and spontaneous road trips.",
    images: ["/images/male/tinder/3.jpg", "/images/male/tinder/4.jpg"]
  },
    {
    name: "Emily",
    age: 25,
    lastSeen: "3h ago",
    avatar: "/images/male/tinder/4.jpg",
    verified: true,
    identity: "Woman",
    distance: "4 km",
    bio: "Fitness enthusiast.",
    images: ["/images/male/tinder/4.jpg", "/images/male/tinder/5.jpg"]
  },
]

const maleMatchesData: Omit<Match, "location">[] = [
  {
    name: "William",
    age: 26,
    lastSeen: "Online",
    avatar: "/images/female/tinder/1.jpg",
    verified: true,
    identity: "Man",
    distance: "2 km",
    bio: "Engineer by day, musician by night.",
    images: ["/images/female/tinder/1.jpg", "/images/female/tinder/2.jpg"]
  },
  {
    name: "James",
    age: 29,
    lastSeen: "4h ago",
    avatar: "/images/female/tinder/2.jpg",
    verified: true,
    identity: "Man",
    distance: "5 km",
    bio: "Outdoors enthusiast looking for someone to hike with.",
    images: ["/images/female/tinder/2.jpg", "/images/female/tinder/3.jpg"]
  },
  {
    name: "Henry",
    age: 25,
    lastSeen: "1h ago",
    avatar: "/images/female/tinder/3.jpg",
    verified: false,
    identity: "Man",
    distance: "3 km",
    bio: "Film buff and history nerd.",
    images: ["/images/female/tinder/3.jpg", "/images/female/tinder/4.jpg"]
  },
   {
    name: "Oliver",
    age: 27,
    lastSeen: "6h ago",
    avatar: "/images/female/tinder/4.jpg",
    verified: true,
    identity: "Man",
    distance: "8 km",
    bio: "Just a guy who enjoys good food.",
    images: ["/images/female/tinder/4.jpg", "/images/female/tinder/5.jpg"]
  },
]

// =======================================================
// CONTEÚDO PRINCIPAL
// =======================================================

function DatingAppScannerContent() {
  const { language } = useAuth()
  const t = translations[language || "en"]

  // --- ESTADOS ---
  const [step, setStep] = useState(1) // 1: Input, 2: Scanning, 3: Results
  const [selectedGender, setSelectedGender] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  // Estados de animação/loading
  const [loadingProgress, setLoadingProgress] = useState(0)
  
  // Estados de Resultados
  const [resultTab, setResultTab] = useState<"matches" | "chats">("matches")
  const [userLocation, setUserLocation] = useState<string>("your city")
  const [selectedChat, setSelectedChat] = useState<any>(null) // Para o modal de chat

  // Timer
  const [countdownString, setCountdownString] = useState("6d 23h 59m")

  // --- EFEITOS ---

  // Timer de 7 dias (Persistente por usuário)
  useEffect(() => {
    const STORAGE_KEY = "user_first_scan_dating";
    
    let firstAccess = localStorage.getItem(STORAGE_KEY);
    if (!firstAccess) {
        firstAccess = Date.now().toString();
        localStorage.setItem(STORAGE_KEY, firstAccess);
    }

    const targetDate = parseInt(firstAccess) + (7 * 24 * 60 * 60 * 1000);

    const timerInterval = setInterval(() => {
        const now = Date.now();
        const difference = targetDate - now;

        if (difference <= 0) {
            setCountdownString("0d 00h 00m (Updating System...)");
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        
        setCountdownString(`${days}d ${hours}h ${minutes}m`);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  // Simulação de Scan (Passo 2)
  const handleStartInvestigation = () => {
    setStep(2)
    setLoadingProgress(0)

    // Simula barra de progresso
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + Math.random() * 8
      })
    }, 400)

    // Finaliza após 4.5 segundos
    setTimeout(() => {
      setLoadingProgress(100)
      setTimeout(() => {
        setStep(3)
      }, 800)
    }, 4500)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagePreview(URL.createObjectURL(e.target.files[0]))
    }
  }

  // Dados filtrados baseados no gênero
  const matches = useMemo(() => {
    let baseMatches: Omit<Match, "location">[]
    if (selectedGender === "Male") {
      baseMatches = femaleMatchesData
    } else if (selectedGender === "Female") {
      baseMatches = maleMatchesData
    } else {
      baseMatches = maleMatchesData // Default ou misto
    }
    
    // Adiciona mock de chat para os primeiros 3
    return baseMatches.map((match, index) => ({
      ...match,
      location: `Lives in ${userLocation}`,
      chatHistory: index < 3 ? DATING_CHATS[index % DATING_CHATS.length] : null
    }))
  }, [userLocation, selectedGender])

  const genderEmojis: { [key: string]: string } = { Male: "👨🏻", Female: "👩🏻", "Non-binary": "🧑🏻" }

  // --- MODAL DE CHAT ---
  const ChatModal = () => {
    if (!selectedChat) return null
    const messages = selectedChat.chatHistory || []

    return (
        <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedChat(null)}>
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col h-[500px]" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500 to-pink-600 p-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <img src={selectedChat.avatar} className="w-10 h-10 rounded-full border-2 border-white" />
                        <div>
                            <p className="font-bold text-sm">{selectedChat.name}, {selectedChat.age}</p>
                            <div className="flex items-center gap-1 text-xs opacity-90">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/> Online
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setSelectedChat(null)} className="p-1.5 hover:bg-white/20 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Chat Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    <p className="text-xs text-center text-gray-400 my-2">Match started 2 days ago</p>
                    {messages.map((msg: any, i: number) => (
                        <div key={i} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                msg.sender === "me" 
                                ? "bg-blue-500 text-white rounded-br-none" 
                                : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Input */}
                <div className="p-3 bg-white border-t flex items-center gap-2">
                    <input 
                        disabled 
                        placeholder="Type a message..." 
                        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none cursor-not-allowed opacity-70"
                    />
                    <button className="text-pink-500 p-2 opacity-50 cursor-not-allowed">
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
  }

  // --- STEP 1: INPUT ---
  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex gap-3 text-sm">
            <AlertTriangle className="text-yellow-600 flex-shrink-0" size={20} />
            <p className="text-yellow-800">
                <span className="font-bold">Privacy Warning:</span> Ensure you are authorized to search for this person. Results may contain sensitive dating activity.
            </p>
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-xl border-2 border-dashed border-blue-200 p-6 text-center hover:bg-blue-50/50 transition-colors">
            <h2 className="font-bold text-gray-800 mb-4">1. Upload Target's Photo</h2>
            <label
                htmlFor="photo-upload"
                className="w-40 h-40 mx-auto flex items-center justify-center bg-gray-50 border-2 border-blue-100 rounded-full cursor-pointer overflow-hidden relative shadow-sm hover:scale-105 transition-transform"
            >
                <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                />
                {imagePreview ? (
                    <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center text-blue-400">
                        <Camera size={32} />
                        <span className="text-xs font-bold mt-1">Tap to Upload</span>
                    </div>
                )}
            </label>
            <p className="text-xs text-gray-400 mt-4">AI Face Recognition Technology</p>
        </div>

        {/* Gender Select */}
        <div className="text-center">
            <h2 className="font-bold text-gray-800 mb-3 text-left">2. Select Gender</h2>
            <div className="grid grid-cols-3 gap-3">
                {["Male", "Female", "Non-binary"].map((gender) => (
                    <button
                        key={gender}
                        onClick={() => setSelectedGender(gender)}
                        className={`p-3 border rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                            selectedGender === gender
                                ? "border-pink-500 bg-pink-50 ring-1 ring-pink-500"
                                : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                        <span className="text-3xl">{genderEmojis[gender]}</span>
                        <span className="text-xs font-bold text-gray-700">{gender}</span>
                    </button>
                ))}
            </div>
        </div>

        <button
            onClick={handleStartInvestigation}
            disabled={!imagePreview || !selectedGender}
            className="w-full h-14 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
            <Search size={20} />
            SCAN DATING APPS
        </button>
    </div>
  )

  // --- STEP 2: LOADING ---
  const renderStep2 = () => (
    <div className="text-center py-12 space-y-6 animate-fade-in">
        <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-pink-500 animate-spin"></div>
            {imagePreview && (
                <div className="absolute inset-2 rounded-full overflow-hidden">
                    <img
                        src={imagePreview || "/placeholder.svg"}
                        className="w-full h-full object-cover opacity-80"
                        alt="target"
                    />
                </div>
            )}
        </div>
        <div>
            <h2 className="text-xl font-bold text-gray-800">Scanning Database...</h2>
            <p className="text-sm text-gray-500 mt-2 mb-4">Checking Tinder, Bumble, Hinge, and 14 others...</p>
            
            {/* Progress Bar */}
            <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div 
                    className="bg-gradient-to-r from-red-500 to-pink-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                    style={{ width: `${loadingProgress}%` }}
                ></div>
            </div>
            <p className="text-xs text-gray-400 mt-2 font-mono">{Math.floor(loadingProgress)}% COMPLETED</p>
        </div>
    </div>
  )

  // --- STEP 3: RESULTS ---
  const renderStep3 = () => (
    <div className="space-y-4 animate-fade-in pb-2">
         {/* Banner de Sucesso */}
         <div className="bg-red-500 text-white p-4 rounded-lg shadow-md flex items-center gap-3">
            <Zap className="fill-yellow-400 text-yellow-400" size={24} />
            <div>
                <h1 className="font-bold text-sm">PROFILE FOUND ON 3 APPS</h1>
                <p className="text-xs text-red-100 opacity-90">
                Status: <span className="font-bold bg-white/20 px-1 rounded">Online Recently</span>
                </p>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2">
            <div className="bg-white p-2 py-3 rounded-lg border text-center shadow-sm">
                <p className="text-xl font-bold text-red-600">{matches.length}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Matches</p>
            </div>
            <div className="bg-white p-2 py-3 rounded-lg border text-center shadow-sm">
                <p className="text-xl font-bold text-orange-500">30+</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Likes</p>
            </div>
            <div className="bg-white p-2 py-3 rounded-lg border text-center shadow-sm">
                <p className="text-xl font-bold text-purple-600">3</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Chats</p>
            </div>
            <div className="bg-white p-2 py-3 rounded-lg border text-center shadow-sm">
                <p className="text-xl font-bold text-gray-800">2h</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Last Seen</p>
            </div>
        </div>

        {/* --- TABS --- */}
        <div className="flex p-1 bg-gray-100 rounded-xl overflow-x-auto no-scrollbar mt-4">
            <button 
                onClick={() => setResultTab("matches")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    resultTab === "matches" ? "bg-white text-pink-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
            >
                <Flame size={18} /> Recent Matches
            </button>
            <button 
                onClick={() => setResultTab("chats")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    resultTab === "chats" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
            >
                <MessageCircle size={18} /> Chats
            </button>
        </div>

        {/* --- CONTEÚDO DAS ABAS --- */}
        <div className="min-h-[300px] mt-2">
            
            {/* 1. ABA DE MATCHES */}
            {resultTab === "matches" && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800">
                        <Flame className="text-pink-500 fill-pink-500 w-5 h-5" /> Active Matches
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                        {matches.map((match, i) => (
                            <div key={i} className="flex gap-4 p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-pink-200 transition-colors">
                                <img src={match.avatar} alt={match.name} className="w-16 h-16 rounded-lg object-cover" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-gray-900 truncate">{match.name}, {match.age}</h4>
                                        {match.verified && <CheckCircle size={14} className="text-blue-500 mt-1" />}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                        <MapPin size={12} /> {match.distance} away
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2 line-clamp-1 italic">"{match.bio}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 2. ABA DE CHATS */}
            {resultTab === "chats" && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800">
                        <MessageCircle className="text-blue-500 w-5 h-5" /> Intercepted Conversations
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">Click on a chat to view history.</p>

                    <div className="space-y-3">
                        {matches.filter(m => m.chatHistory).map((match, i) => (
                            <div 
                                key={i}
                                onClick={() => setSelectedChat(match)}
                                className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="relative">
                                    <img src={match.avatar} alt={match.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-bold text-gray-900">{match.name}</p>
                                        <span className="text-[10px] text-gray-400">Just now</span>
                                    </div>
                                    <p className="text-sm text-gray-600 truncate flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 flex-shrink-0"></span>
                                        Click to read messages...
                                    </p>
                                </div>
                                <MoreVertical size={16} className="text-gray-400" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* RODAPÉ COM TIMER DINÂMICO */}
        <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col items-center justify-center gap-1 text-[11px] uppercase tracking-wide text-green-700 font-medium opacity-80 text-center">
            <div className="flex items-center gap-2">
                <Clock size={12} className="animate-pulse" />
                <span>Next automatic system update in:</span>
            </div>
            <span className="text-green-800 font-bold bg-green-100 px-2 py-0.5 rounded">
                {countdownString}
            </span>
            <span className="text-[10px] text-gray-400 normal-case mt-1">(7-day update cycle)</span>
        </div>

        {/* Renderiza o Modal se necessário */}
        {selectedChat && <ChatModal />}
    </div>
  )

  return (
    <DashboardLayout activeTab="dating">
      <div className="max-w-xl mx-auto space-y-6">
        <FeatureCard
          title={step === 1 ? t?.dateAppsScannerTitle || "Dating Apps Scanner" : step === 2 ? "Scanning..." : "Dating Scan Report"}
          description={
            step === 1 ? t?.dateAppsScannerDesc : step === 2 ? "Analyzing databases..." : "Profiles found matching the target image."
          }
        >
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
        </FeatureCard>

        {/* Info Card - Apenas no passo 1 */}
        {step === 1 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex gap-4">
              <div className="text-purple-600 flex-shrink-0 text-2xl">❤️</div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Deep Scan Technology</h3>
                <p className="text-sm text-muted-foreground">
                  We use advanced image recognition to find profiles on Tinder, Bumble, Hinge, Grindr, and 50+ other dating sites.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

// =======================================================
// EXPORTAÇÃO DA PÁGINA
// =======================================================

export default function DatingAppScannerPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout activeTab="dating">
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </DashboardLayout>
      }
    >
      <DatingAppScannerContent />
    </Suspense>
  )
}

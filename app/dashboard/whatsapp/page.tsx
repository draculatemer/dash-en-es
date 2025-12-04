"use client"

// 👇 Garante que o build não quebre por ser página privada
export const dynamic = "force-dynamic"

import { useState, useEffect, useMemo, useRef } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import FeatureCard from "@/components/feature-card"
import { useAuth } from "@/lib/auth-context"
import { translations } from "@/lib/translations"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Lock, 
  CheckCircle, 
  Loader2, 
  MapPin, 
  X, 
  CheckCheck, 
  AlertTriangle, 
  LockOpen, 
  MessageCircle,
  Search,
  ChevronDown
} from 'lucide-react'

// =======================================================
// DADOS MOCKADOS E UTILITÁRIOS
// =======================================================

const countries = [
  { code: "+1", name: "United States", flag: "🇺🇸", placeholder: "(555) 123-4567" },
  { code: "+55", name: "Brazil", flag: "🇧🇷", placeholder: "(11) 99999-9999" },
  { code: "+351", name: "Portugal", flag: "🇵🇹", placeholder: "912 345 678" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧", placeholder: "7911 123456" },
  { code: "+33", name: "France", flag: "🇫🇷", placeholder: "6 12 34 56 78" },
  { code: "+49", name: "Germany", flag: "🇩🇪", placeholder: "1512 3456789" },
  { code: "+34", name: "Spain", flag: "🇪🇸", placeholder: "612 34 56 78" },
  { code: "+52", name: "Mexico", flag: "🇲🇽", placeholder: "55 1234 5678" },
  { code: "+54", name: "Argentina", flag: "🇦🇷", placeholder: "11 1234-5678" },
  { code: "+57", name: "Colombia", flag: "🇨🇴", placeholder: "300 1234567" },
  // ... adicione mais países se necessário
]

const loadingStepsList = [
    { id: "initiating", text: "Initiating connection..." },
    { id: "locating", text: "Locating nearest server..." },
    { id: "establishing", text: "Establishing secure connection..." },
    { id: "verifying", text: "Verifying phone number..." },
    { id: "valid", text: "Valid phone number detected" },
    { id: "analyzing", text: "Analyzing database..." },
    { id: "fetching", text: "Fetching profile information..." },
    { id: "detecting", text: "Detecting device location..." },
    { id: "suspicious", text: "Suspicious activity found near target..." },
    { id: "preparing", text: "Preparing private channel..." },
    { id: "established", text: "Private channel established!" },
    { id: "synchronizing", text: "Synchronizing messages..." },
    { id: "complete", text: "Synchronization complete!" },
]

// Componente do Mapa
const RealtimeMap = ({ lat, lng, city, country }: { lat: number; lng: number; city: string; country: string }) => {
  const mapEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=13&output=embed`
  return (
    <div className="relative h-64 w-full rounded-lg overflow-hidden shadow-inner border border-gray-200">
      <iframe className="absolute top-0 left-0 w-full h-full border-0" loading="lazy" allowFullScreen src={mapEmbedUrl}></iframe>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 p-4 w-full text-white pointer-events-none">
        <div className="flex items-center gap-2 font-bold text-red-400 animate-pulse">
            <AlertTriangle className="h-5 w-5" /><span>SUSPICIOUS ACTIVITY DETECTED</span>
        </div>
        <p className="text-sm text-gray-200">Location: {city}, {country}</p>
      </div>
    </div>
  )
}

// Componente do Popup de Chat
const ChatPopup = ({ onClose, profilePhoto, conversationData, conversationName }: any) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative bg-[#efe7dd] rounded-lg shadow-2xl max-w-sm w-full overflow-hidden flex flex-col h-[500px]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-[#008069] text-white p-3 flex items-center gap-3 shadow-md">
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors"><X className="h-5 w-5" /></button>
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-gray-300">
            <img src={profilePhoto || "/placeholder.svg"} alt="Profile" className="object-cover h-full w-full" />
          </div>
          <div className="flex flex-col">
             <span className="font-semibold text-sm leading-tight">{conversationName.replace("🔒", "").trim()}</span>
             <span className="text-xs opacity-80">online</span>
          </div>
        </div>
        
        {/* Messages Body */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')]">
          {conversationData.map((msg: any, index: number) => (
             msg.type === "incoming" ? (
                <div key={index} className="flex justify-start">
                    <div className="bg-white rounded-lg rounded-tl-none p-2 px-3 max-w-[85%] shadow-sm relative">
                        <p className={`text-sm ${msg.isBlocked ? "font-semibold text-red-500 italic" : "text-gray-800"}`}>
                            {msg.isBlocked ? "🚫 This message was deleted" : msg.content}
                        </p>
                        <span className="text-[10px] text-gray-400 float-right mt-1 ml-2">{msg.time}</span>
                    </div>
                </div>
             ) : (
                <div key={index} className="flex justify-end">
                    <div className="bg-[#d9fdd3] rounded-lg rounded-tr-none p-2 px-3 max-w-[85%] shadow-sm relative">
                        <p className={`text-sm ${msg.isBlocked ? "font-semibold text-red-500 italic" : "text-gray-800"}`}>
                             {msg.content}
                        </p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                            <span className="text-[10px] text-gray-500">{msg.time}</span>
                            <CheckCheck className="h-3 w-3 text-[#53bdeb]" />
                        </div>
                    </div>
                </div>
             )
          ))}
        </div>

        {/* Footer Fake Input */}
        <div className="bg-[#f0f2f5] p-2 flex items-center gap-2">
            <div className="flex-1 bg-white rounded-full h-10 px-4 flex items-center text-gray-400 text-sm shadow-sm">
                Type a message
            </div>
            <div className="w-10 h-10 bg-[#008069] rounded-full flex items-center justify-center text-white">
                <MessageCircle size={20} />
            </div>
        </div>

        {/* Overlay CTA */}
        <div className="absolute bottom-[60px] left-2 right-2 p-3 bg-white/95 backdrop-blur rounded-lg shadow-lg border border-yellow-400 text-center animate-in slide-in-from-bottom-5">
            <p className="text-gray-800 text-xs font-semibold mb-2">Unlock to see deleted messages & photos</p>
            <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 h-8 text-xs">Unlock Now</Button>
        </div>
      </div>
    </div>
  )
}

export default function WhatsAppScannerPage() {
  const { language } = useAuth()
  const t = translations[language || "en"]

  // --- ESTADOS DO FUNIL ---
  const [step, setStep] = useState(1) // 1: Input, 2: Loading, 3: Results
  const [selectedGender, setSelectedGender] = useState<'Male' | 'Female' | 'Non-binary' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedCountry, setSelectedCountry] = useState(countries[0])
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [countrySearch, setCountrySearch] = useState("")
  
  // Estados de Carregamento
  const [progress, setProgress] = useState(0)
  const [currentStepText, setCurrentStepText] = useState(loadingStepsList[0].text)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false)
  
  // Estados de Resultado
  const [location, setLocation] = useState({ lat: -23.5505, lng: -46.6333, city: "São Paulo", country: "Brazil" })
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [selectedConvoIndex, setSelectedConvoIndex] = useState<number | null>(null)

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  // --- LÓGICA DE DADOS (Dinâmico por Gênero) ---
  const { reportConversations, reportMedia } = useMemo(() => {
    const isMale = selectedGender === 'Male';
    const genderPath = isMale ? 'male/zap' : 'female/zap';
    const suffix = isMale ? 'f' : 'h'; // f=female photos (for male target), h=homem photos

    // Mock Conversations
    const conversations = [
      { img: `/images/${genderPath}/1-${suffix}.png`, name: "Blocked Contact 🔒", msg: "🚫 This message was deleted", time: "Yesterday", popupName: "Blocked 🔒", chatData: [{ type: "incoming", content: "Hi, can we talk?", time: "2:38 PM" }, { type: "outgoing", content: "Sure, what's up?", time: "2:40 PM" }, { type: "incoming", content: "Blocked content", time: "2:43 PM", isBlocked: true }] },
      { img: `/images/${genderPath}/2-${suffix}.png`, name: "Unknown Number", msg: "Audio (0:14) 🎤", time: "2 days ago", popupName: "Unknown", chatData: [{ type: "incoming", content: "Where are you?", time: "10:21 PM" }, { type: "outgoing", content: "Just arrived", time: "10:27 PM" }, { type: "incoming", content: "Listen to this...", time: "10:29 PM", isBlocked: true }] },
      { img: `/images/${genderPath}/3-${suffix}.png`, name: "(Secret Chat) 🔒", msg: "📷 Photo", time: "3 days ago", popupName: "Secret", chatData: [{ type: "incoming", content: "Did you delete the photos?", time: "11:45 AM" }, { type: "outgoing", content: "Yes, don't worry", time: "11:47 AM" }, { type: "incoming", content: "Check this one", time: "11:50 AM", isBlocked: true }] },
    ];
    
    // Mock Media (Placeholders if images don't exist)
    const media = Array(6).fill(null).map((_, i) => `/images/${genderPath}/${i + 4}-${suffix}.png`);

    return { reportConversations: conversations, reportMedia: media };
  }, [selectedGender]);

  const filteredCountries = useMemo(() => countries.filter((c) => c.name.toLowerCase().includes(countrySearch.toLowerCase()) || c.code.includes(countrySearch)), [countrySearch])

  // --- EFEITOS ---

  // Timer do Passo 3
  useEffect(() => {
    if (step === 3 && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [step, timeLeft])

  // Fetch Fake da Foto
  const fetchWhatsAppPhoto = async (phone: string) => {
     setIsLoadingPhoto(true)
     // Simula delay de API
     setTimeout(() => {
        // Se quiser usar API real, coloque aqui. Por enquanto, usaremos placeholder ou mock
        setProfilePhoto("/placeholder.svg") 
        setIsLoadingPhoto(false)
     }, 1500)
  }

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const formatted = rawValue.replace(/[^0-9]/g, "")
    setPhoneNumber(formatted)
    
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
    
    debounceTimeout.current = setTimeout(() => {
        if (formatted.length >= 8) {
            fetchWhatsAppPhoto(formatted)
        }
    }, 1000)
  }

  // --- INICIAR PROCESSO ---
  const handleStartClone = () => {
     if(!phoneNumber) return
     setStep(2)
     setProgress(0)
     setCompletedSteps([])
     
     // Simulação de Loading Progressivo
     let currentStepIdx = 0
     const totalDuration = 15000 // 15s total
     const stepDuration = totalDuration / loadingStepsList.length

     const interval = setInterval(() => {
        setProgress(prev => {
            if(prev >= 100) return 100
            return prev + (100 / (totalDuration / 100))
        })
     }, 100)

     const stepInterval = setInterval(() => {
        currentStepIdx++
        if (currentStepIdx < loadingStepsList.length) {
            setCompletedSteps(prev => [...prev, loadingStepsList[currentStepIdx - 1].id])
            setCurrentStepText(loadingStepsList[currentStepIdx].text)
        } else {
            clearInterval(stepInterval)
            clearInterval(interval)
            setStep(3)
        }
     }, stepDuration)
  }

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const rem = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // --- RENDERIZADORES ---

  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">1. Select Target's Gender</h3>
            <div className="grid grid-cols-3 gap-3">
                {["Male", "Female", "Non-binary"].map((g) => (
                    <button
                        key={g}
                        onClick={() => setSelectedGender(g as any)}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all hover:scale-105 ${
                            selectedGender === g 
                            ? "border-green-500 bg-green-50 shadow-md" 
                            : "border-border bg-white hover:border-green-200"
                        }`}
                    >
                        <span className="text-3xl">{g === "Male" ? "👨🏻" : g === "Female" ? "👩🏻" : "🧑🏻"}</span>
                        <span className="font-medium text-sm text-gray-700">{g}</span>
                    </button>
                ))}
            </div>
        </div>

        <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">2. Enter WhatsApp Number</h3>
            
            <div className="flex items-center gap-2">
                 {/* Country Dropdown */}
                 <div className="relative">
                    <button 
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className="flex items-center gap-2 h-12 px-3 border rounded-lg bg-white hover:bg-gray-50 min-w-[100px]"
                    >
                        <span className="text-xl">{selectedCountry.flag}</span>
                        <span className="text-sm font-medium">{selectedCountry.code}</span>
                        <ChevronDown size={14} className="text-gray-400" />
                    </button>
                    
                    {showCountryDropdown && (
                        <div className="absolute top-full left-0 mt-2 bg-white border rounded-xl shadow-xl z-50 w-64 max-h-60 overflow-y-auto">
                            <div className="p-2 sticky top-0 bg-white border-b">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-3 w-3 text-gray-400" />
                                    <Input 
                                        value={countrySearch} 
                                        onChange={e => setCountrySearch(e.target.value)} 
                                        placeholder="Search..." 
                                        className="h-8 pl-7 text-xs" 
                                    />
                                </div>
                            </div>
                            {filteredCountries.map((c, i) => (
                                <button 
                                    key={i}
                                    onClick={() => { setSelectedCountry(c); setShowCountryDropdown(false); }}
                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 text-left text-sm"
                                >
                                    <span>{c.flag}</span>
                                    <span className="truncate flex-1">{c.name}</span>
                                    <span className="text-gray-400 text-xs">{c.code}</span>
                                </button>
                            ))}
                        </div>
                    )}
                 </div>

                 <Input 
                    type="tel" 
                    placeholder={selectedCountry.placeholder} 
                    value={phoneNumber}
                    onChange={handlePhoneInputChange}
                    className="h-12 text-lg"
                 />
            </div>
            
            {/* Foto Profile Preview */}
            <div className="min-h-[60px] flex items-center justify-center">
                 {isLoadingPhoto ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="animate-spin h-4 w-4"/> Found WhatsApp account...</div>
                 ) : profilePhoto && (
                    <div className="flex items-center gap-3 bg-green-50 p-2 pr-4 rounded-full border border-green-200 animate-in fade-in slide-in-from-bottom-2">
                        <img src={profilePhoto} className="w-10 h-10 rounded-full object-cover" alt="profile" />
                        <div>
                             <p className="text-xs font-bold text-green-700">Profile Found</p>
                             <p className="text-xs text-gray-600">Last seen: Recently</p>
                        </div>
                        <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                    </div>
                 )}
            </div>
        </div>

        <Button 
            onClick={handleStartClone}
            disabled={!phoneNumber || !selectedGender || isLoadingPhoto}
            className="w-full h-14 text-lg font-bold bg-[#25D366] hover:bg-[#128C7E] shadow-lg shadow-green-200"
        >
            Start WhatsApp Scan 🚀
        </Button>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in py-4">
        <div className="text-center space-y-4">
             <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg relative">
                 <img src={profilePhoto || "/placeholder.svg"} className="w-full h-full rounded-full object-cover opacity-80" alt="target" />
                 <div className="absolute inset-0 flex items-center justify-center">
                     <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
                 </div>
             </div>
             <div>
                <h3 className="font-bold text-lg text-foreground">Accessing Backup...</h3>
                <p className="text-sm text-muted-foreground">{selectedCountry.code} {phoneNumber}</p>
             </div>
        </div>

        <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono font-medium text-gray-500">
                <span>PROGRESS</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <div className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-center text-xs text-green-600 font-mono animate-pulse mt-2">
                {currentStepText}
            </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-hidden border border-gray-200">
             <div className="space-y-2">
                 {[...loadingStepsList].reverse().map((step) => {
                     const isCompleted = completedSteps.includes(step.id);
                     const isCurrent = step.text === currentStepText;
                     if (!isCompleted && !isCurrent) return null;
                     
                     return (
                         <div key={step.id} className="flex items-center gap-2 text-xs">
                             {isCompleted ? <CheckCircle size={12} className="text-green-500" /> : <Loader2 size={12} className="animate-spin text-blue-500" />}
                             <span className={isCurrent ? "font-bold text-gray-800" : "text-gray-500"}>{step.text}</span>
                         </div>
                     )
                 })}
             </div>
        </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
        <div className="bg-green-50 border border-green-200 p-3 rounded-lg flex items-center justify-center gap-2 text-green-800 font-bold">
            <CheckCircle className="h-5 w-5" /> Backup Cloned Successfully
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
             <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-center">
                 <p className="text-xs text-gray-500 uppercase">Messages</p>
                 <p className="text-xl font-bold text-gray-800">4,327</p>
             </div>
             <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-center">
                 <p className="text-xs text-gray-500 uppercase">Deleted</p>
                 <p className="text-xl font-bold text-red-500">148</p>
             </div>
        </div>

        {/* Conversations List */}
        <div className="space-y-3">
             <h3 className="font-bold text-sm text-gray-700 flex items-center gap-2">
                <MessageCircle size={16} /> Recent Conversations
             </h3>
             <div className="space-y-2">
                 {reportConversations.map((convo, i) => (
                     <div 
                        key={i} 
                        onClick={() => setSelectedConvoIndex(i)}
                        className="flex items-center gap-3 p-3 bg-white hover:bg-gray-50 border border-gray-100 rounded-lg shadow-sm cursor-pointer transition-colors"
                     >
                         <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                             <img src={convo.img || "/placeholder.svg"} className="w-full h-full object-cover" alt="user" />
                             {i === 0 && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Lock size={12} className="text-white"/></div>}
                         </div>
                         <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-center mb-0.5">
                                 <p className="font-semibold text-sm truncate text-gray-900">{convo.name}</p>
                                 <span className="text-[10px] text-gray-400">{convo.time}</span>
                             </div>
                             <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                                {convo.msg.includes("deleted") && <AlertTriangle size={10} className="text-red-500" />}
                                {convo.msg}
                             </p>
                         </div>
                     </div>
                 ))}
             </div>
        </div>

        {/* Media Grid */}
        <div className="space-y-3">
             <h3 className="font-bold text-sm text-gray-700">Recovered Media (Hidden)</h3>
             <div className="grid grid-cols-3 gap-2">
                 {reportMedia.slice(0, 3).map((img, i) => (
                     <div key={i} className="aspect-square bg-gray-900 rounded-md overflow-hidden relative group">
                         <img src={img || "/placeholder.svg"} className="w-full h-full object-cover opacity-30 blur-sm" alt="media" />
                         <div className="absolute inset-0 flex items-center justify-center">
                             <Lock className="text-white/80 w-6 h-6" />
                         </div>
                     </div>
                 ))}
             </div>
        </div>

        {/* Map */}
        <div className="space-y-2">
             <h3 className="font-bold text-sm text-gray-700">Last Known Location</h3>
             <RealtimeMap {...location} />
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-b from-white to-red-50 border border-red-100 rounded-xl p-6 shadow-lg text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full bg-red-500 text-white text-[10px] font-bold py-1">
                 FILE AUTO-DELETES IN {formatTime(timeLeft)}
             </div>

             <div className="mt-4 mb-4">
                <LockOpen className="w-10 h-10 text-green-600 mx-auto mb-2" />
                <h2 className="text-xl font-bold text-gray-900">Unlock Full History</h2>
                <p className="text-xs text-gray-500 mt-1">
                    See deleted messages, listen to audios, and view unblurred photos.
                </p>
             </div>

             <div className="mb-4">
                 <span className="text-gray-400 line-through text-xs">$79.00</span>
                 <span className="text-3xl font-black text-green-600 ml-2">$37.00</span>
             </div>

             <a 
                href="https://pay.hotmart.com/B101929057U?checkoutMode=10" 
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition-transform hover:scale-105"
             >
                 ACCESS FULL BACKUP 🔓
             </a>
        </div>
    </div>
  )

  return (
    <DashboardLayout activeTab="whatsapp">
      <div className="max-w-2xl mx-auto space-y-6">
        <FeatureCard 
            title={step === 1 ? t?.whatsappScannerTitle : step === 2 ? "Connection in Progress" : "Backup Analysis Complete"} 
            description={step === 1 ? t?.whatsappScannerDesc : step === 2 ? "Establishing secure connection to WhatsApp servers..." : "We found suspicious data in this backup."}
        >
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
        </FeatureCard>

        {step === 1 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="text-green-600" size={24} />
                    </div>
                    <div>
                    <h3 className="font-semibold text-foreground mb-1">Encrypted Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                        Our algorithm checks for patterns in public connection times, profile changes, and usage statistics to generate probability reports.
                    </p>
                    </div>
                </div>
            </div>
        )}
      </div>
      
      {selectedConvoIndex !== null && (
         <ChatPopup 
            onClose={() => setSelectedConvoIndex(null)}
            profilePhoto={reportConversations[selectedConvoIndex].img}
            conversationData={reportConversations[selectedConvoIndex].chatData}
            conversationName={reportConversations[selectedConvoIndex].popupName}
         />
      )}
    </DashboardLayout>
  )
}

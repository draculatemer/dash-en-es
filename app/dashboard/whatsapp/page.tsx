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
  CheckCircle, 
  Loader2, 
  X, 
  CheckCheck, 
  MessageCircle,
  Search,
  ChevronDown,
  Image as ImageIcon,
  Clock,
  Phone,
  Video,
  MoreVertical
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
]

const loadingStepsList = [
    { id: "initiating", text: "Initiating connection..." },
    { id: "locating", text: "Locating nearest server..." },
    { id: "establishing", text: "Establishing secure connection..." },
    { id: "verifying", text: "Verifying phone number..." },
    { id: "valid", text: "Valid phone number detected" },
    { id: "analyzing", text: "Analyzing database..." },
    { id: "fetching", text: "Fetching backup files (1.2GB)..." },
    { id: "decrypting", text: "Decrypting message history..." },
    { id: "media", text: "Recovering deleted media..." },
    { id: "complete", text: "Synchronization complete!" },
]

// Componente do Popup de Chat
const ChatPopup = ({ onClose, profilePhoto, conversationData, conversationName }: any) => {
  const chatEndRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200" onClick={onClose}>
      <div className="relative bg-[#efe7dd] rounded-lg shadow-2xl max-w-sm w-full overflow-hidden flex flex-col h-[600px] border border-gray-800/10" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-[#008069] text-white p-3 flex items-center gap-3 shadow-md z-10">
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors"><X className="h-5 w-5" /></button>
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-gray-300 border border-white/30">
            <img src={profilePhoto || "/placeholder.svg"} alt="Profile" className="object-cover h-full w-full" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
             <span className="font-semibold text-sm leading-tight truncate">{conversationName}</span>
             <span className="text-xs opacity-80">online</span>
          </div>
          <div className="flex gap-4 text-white/90">
             <Video size={22} />
             <Phone size={20} />
             <MoreVertical size={20} />
          </div>
        </div>
        
        {/* Messages Body */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
          {conversationData.map((msg: any, index: number) => (
             msg.type === "incoming" ? (
                <div key={index} className="flex justify-start mb-1">
                    <div className="bg-white rounded-lg rounded-tl-none p-2 px-3 max-w-[85%] shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] relative">
                        <p className={`text-[14px] text-[#111b21] leading-snug`}>
                            {msg.content}
                        </p>
                        <span className="text-[10px] text-gray-400 float-right mt-1 ml-2 select-none">{msg.time}</span>
                    </div>
                </div>
             ) : (
                <div key={index} className="flex justify-end mb-1">
                    <div className="bg-[#d9fdd3] rounded-lg rounded-tr-none p-2 px-3 max-w-[85%] shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] relative">
                        <p className={`text-[14px] text-[#111b21] leading-snug`}>
                             {msg.content}
                        </p>
                        <div className="flex items-center justify-end gap-1 mt-1 select-none">
                            <span className="text-[10px] text-gray-500">{msg.time}</span>
                            <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb]" />
                        </div>
                    </div>
                </div>
             )
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Footer Fake Input */}
        <div className="bg-[#f0f2f5] p-2 flex items-center gap-2 z-10">
            <div className="flex-1 bg-white rounded-full h-10 px-4 flex items-center text-gray-400 text-sm shadow-sm cursor-not-allowed">
                Type a message
            </div>
            <div className="w-10 h-10 bg-[#008069] rounded-full flex items-center justify-center text-white shadow-sm">
                <MessageCircle size={20} />
            </div>
        </div>
      </div>
    </div>
  )
}

export default function WhatsAppScannerPage() {
  const { language } = useAuth()
  const t = translations[language || "en"]

  // --- ESTADOS ---
  const [step, setStep] = useState(1) // 1: Input, 2: Loading, 3: Results
  const [selectedGender, setSelectedGender] = useState<'Male' | 'Female' | 'Non-binary' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedCountry, setSelectedCountry] = useState(countries[0])
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [countrySearch, setCountrySearch] = useState("")
  
  // Loading & Photo
  const [progress, setProgress] = useState(0)
  const [currentStepText, setCurrentStepText] = useState(loadingStepsList[0].text)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false)
  
  // Results
  const [resultTab, setResultTab] = useState<"chats" | "media">("chats")
  const [selectedConvoIndex, setSelectedConvoIndex] = useState<number | null>(null)
  const [countdownString, setCountdownString] = useState("6d 23h 59m")

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  // --- LÓGICA DO TIMER (User Specific) ---
  useEffect(() => {
    // Apenas roda no cliente
    const STORAGE_KEY = "user_first_wa_scan_access";
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
            setCountdownString("0d 00h 00m (Updating...)");
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        
        setCountdownString(`${days}d ${hours}h ${minutes}m`);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  // --- GERADOR DE DADOS DINÂMICOS ---
  const { reportConversations, reportMedia } = useMemo(() => {
    const isTargetMale = selectedGender === 'Male';
    
    // CORREÇÃO DE GÊNERO:
    // Se o alvo é Male -> Mostra fotos da pasta 'male' (que contém mulheres, seguindo a lógica do mock anterior)
    // Se o alvo é Female -> Mostra fotos da pasta 'female' (que contém homens)
    const mediaFolder = isTargetMale ? 'male' : 'female'; 

    // Imagens para a galeria
    const media = Array.from({ length: 9 }).map((_, i) => `/images/${mediaFolder}/perfil/${i + 1}.jpg`);

    const chatAvatars = [
        `/images/${mediaFolder}/perfil/5.jpg`,
        `/images/${mediaFolder}/perfil/6.jpg`,
        `/images/${mediaFolder}/perfil/7.jpg`,
        `/images/${mediaFolder}/perfil/8.jpg`
    ];

    // Nomes Mockados: Garante que nomes femininos apareçam para Male Target e vice-versa
    const names = isTargetMale 
        ? ["Unknown Number", "Secret 🔒", "Julia Gym", "Work (Ana)"] // Para Homem ver
        : ["Unknown Number", "Secret 🔒", "Mark Gym", "Work (Daniel)"]; // Para Mulher ver

    // SCRIPT 1: ALVO HOMEM (MALE) TRAINDO
    // Ele fala com ela
    const CHAT_FOR_MALE_TARGET = [
        { "type": "incoming", "content": "Heyyy, you free tonight? 😏", "time": "10:20 AM" },
        { "type": "outgoing", "content": "Depends… what kinda trouble you planning this time?", "time": "10:21 AM" },
        { "type": "incoming", "content": "Got a surprise you’re gonna fucking love…", "time": "10:22 AM" },
        { "type": "incoming", "content": "But I only deliver in person 😉", "time": "10:22 AM" },
        { "type": "outgoing", "content": "Fuck, you know I can’t say no when you talk like that", "time": "10:24 AM" },
        { "type": "outgoing", "content": "What time can you sneak out?", "time": "10:24 AM" },
        { "type": "incoming", "content": "I can make it happen after 9… hubby thinks I’m at my sister’s lmao", "time": "10:26 AM" },
        { "type": "incoming", "content": "And you? What lie you feeding your girl tonight? 😈", "time": "10:26 AM" },
        { "type": "outgoing", "content": "Last-minute work meeting, she’s used to it by now", "time": "10:28 AM" },
        { "type": "outgoing", "content": "Same motel or wanna switch it up?", "time": "10:28 AM" },
        { "type": "incoming", "content": "Mmm same one’s fine… I literally dreamed about you waiting in that dark blue dress shirt this week", "time": "10:30 AM" },
        { "type": "incoming", "content": "The one I love ripping the buttons off 😂", "time": "10:30 AM" },
        { "type": "outgoing", "content": "Jesus woman you’re killing me already", "time": "10:32 AM" },
        { "type": "outgoing", "content": "Send a pic so I can start getting hard?", "time": "10:32 AM" },
        { "type": "incoming", "content": "(Photo sent – black lingerie mirror selfie, biting lip)", "time": "10:35 AM" },
        { "type": "incoming", "content": "Just so you don’t forget what’s waiting for you tonight 🔥", "time": "10:35 AM" },
        { "type": "outgoing", "content": "Already saved in the hidden folder lol", "time": "10:37 AM" },
        { "type": "outgoing", "content": "9:30 I’ll pick you up at the usual spot. Don’t you dare be late", "time": "10:37 AM" },
        { "type": "incoming", "content": "Wouldn’t miss it for the world. Counting the minutes already…", "time": "10:38 AM" },
        { "type": "incoming", "content": "And wear that fucking cologne that drives me insane", "time": "10:38 AM" },
        { "type": "outgoing", "content": "Done. Now go act normal before someone sees you grinning like that", "time": "10:40 AM" },
        { "type": "incoming", "content": "Impossible when I’m thinking about what we’re gonna do 😈", "time": "10:41 AM" },
        { "type": "incoming", "content": "See you tonight, you dirty fuck. Kiss where you know…", "time": "10:41 AM" },
        { "type": "outgoing", "content": "Fuck, can’t wait ❤️", "time": "10:42 AM" }
    ]

    // SCRIPT 2: ALVO MULHER (FEMALE) TRAINDO
    // Ela fala com ele (NOVO SCRIPT INSERIDO)
    const CHAT_FOR_FEMALE_TARGET = [
        { "type": "incoming", "content": "Hey trouble… still married? 😈", "time": "2:14 PM" },
        { "type": "incoming", "content": "Been thinking about that tight little dress you wore last time", "time": "2:15 PM" },
        { "type": "outgoing", "content": "Unfortunately still married lol", "time": "2:17 PM" },
        { "type": "outgoing", "content": "And yeah I wore it on purpose… knew you couldn’t take your eyes off me", "time": "2:17 PM" },
        { "type": "incoming", "content": "Worked. I jerked off thinking about bending you over in it twice this week", "time": "2:19 PM" },
        { "type": "outgoing", "content": "Fuck… don’t say that, I’m at work getting wet already", "time": "2:20 PM" },
        { "type": "outgoing", "content": "When are you gonna let me feel you again?", "time": "2:20 PM" },
        { "type": "incoming", "content": "Tonight if you’re brave enough", "time": "2:22 PM" },
        { "type": "incoming", "content": "I’ll book the usual room. 9 PM. Bring that red lipstick", "time": "2:22 PM" },
        { "type": "outgoing", "content": "I’m already shaking", "time": "2:24 PM" },
        { "type": "outgoing", "content": "I’ll tell my husband I’m having drinks with the girls… he’ll never know", "time": "2:24 PM" },
        { "type": "incoming", "content": "Good girl", "time": "2:25 PM" },
        { "type": "incoming", "content": "No panties tonight. I wanna slide right in the second the door closes", "time": "2:25 PM" },
        { "type": "outgoing", "content": "Already decided that this morning 😈", "time": "2:26 PM" },
        { "type": "outgoing", "content": "Been wet since you texted", "time": "2:26 PM" },
        { "type": "incoming", "content": "Send me something to get me through the day", "time": "2:28 PM" },
        { "type": "outgoing", "content": "(Photo sent – mirror selfie in the office bathroom, skirt pulled up, no panties, biting finger)", "time": "2:31 PM" },
        { "type": "outgoing", "content": "This pussy is yours tonight", "time": "2:31 PM" },
        { "type": "incoming", "content": "Jesus fucking Christ", "time": "2:32 PM" },
        { "type": "incoming", "content": "Room 512. 9 sharp. I’m gonna ruin you", "time": "2:32 PM" },
        { "type": "outgoing", "content": "Counting the hours baby", "time": "2:33 PM" },
        { "type": "outgoing", "content": "I’m gonna scream your name so loud tonight", "time": "2:33 PM" },
        { "type": "incoming", "content": "That’s the plan ❤️", "time": "2:34 PM" }
    ]

    // Chats Mockados
    const conversations = [
      { 
          // CONVERSAÇÃO 1 - DINÂMICA
          img: chatAvatars[0], 
          name: names[0], 
          time: isTargetMale ? "10:42 AM" : "2:34 PM", 
          lastMsg: isTargetMale ? "Fuck, can’t wait ❤️" : "That’s the plan ❤️", 
          chatData: isTargetMale ? CHAT_FOR_MALE_TARGET : CHAT_FOR_FEMALE_TARGET
      },
      { 
          // CONVERSAÇÃO 2 - MOCK "SECRET"
          img: chatAvatars[1], 
          name: names[1], 
          time: "Yesterday", 
          lastMsg: "📷 Photo", 
          chatData: [
              { type: "incoming", content: "Did you delete the photos?", time: "11:45 PM" },
              { type: "outgoing", content: "Yes, don't worry", time: "11:47 PM" },
              { type: "incoming", content: "Check this one before I delete it", time: "11:50 PM" }
          ] 
      },
      { 
          // CONVERSAÇÃO 3 - MOCK "FRIEND"
          img: chatAvatars[2], 
          name: names[2], 
          time: "Yesterday", 
          lastMsg: "Missed voice call", 
          chatData: [
              { type: "incoming", content: "Where are you?", time: "4:00 PM" },
              { type: "outgoing", content: "On my way", time: "4:05 PM" },
              { type: "incoming", content: "Hurry up! I'm already wet/hard... 🔥", time: "4:10 PM" }
          ] 
      },
      { 
          // CONVERSAÇÃO 4 - MOCK "WORK"
          img: chatAvatars[3], 
          name: names[3], 
          time: "2 days ago", 
          lastMsg: "Call me when you can", 
          chatData: [
              { type: "outgoing", content: "I can't talk right now, spouse is here", time: "2:00 PM" },
              { type: "incoming", content: "It's urgent. We need to talk about us.", time: "2:05 PM" },
              { type: "incoming", content: "Call me when you can", time: "2:06 PM" }
          ] 
      },
    ];

    return { reportConversations: conversations, reportMedia: media };
  }, [selectedGender]);

  const filteredCountries = useMemo(() => countries.filter((c) => c.name.toLowerCase().includes(countrySearch.toLowerCase()) || c.code.includes(countrySearch)), [countrySearch])

  // --- ACTIONS ---
  const fetchWhatsAppPhoto = async (phone: string) => {
     setIsLoadingPhoto(true)
     setTimeout(() => {
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

  const handleStartClone = (e?: React.MouseEvent) => {
     if(e) e.preventDefault();
     if(!phoneNumber) return;
     
     setStep(2)
     setProgress(0)
     setCompletedSteps([])
     
     let currentStepIdx = 0
     const totalDuration = 12000 // 12s total
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

  // --- RENDERS ---

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
                                <Input 
                                    value={countrySearch} 
                                    onChange={e => setCountrySearch(e.target.value)} 
                                    placeholder="Search..." 
                                    className="h-8 text-xs" 
                                />
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
            type="button" 
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
                <h3 className="font-bold text-lg text-foreground">Extracting Data...</h3>
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
    <div className="space-y-6 animate-fade-in pb-4">
        <div className="bg-green-50 border border-green-200 p-3 rounded-lg flex items-center justify-center gap-2 text-green-800 font-bold">
            <CheckCircle className="h-5 w-5" /> Backup Cloned Successfully
        </div>

        {/* Abas de Navegação */}
        <div className="flex p-1 bg-gray-100 rounded-xl overflow-x-auto no-scrollbar">
            <button 
                onClick={() => setResultTab("chats")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    resultTab === "chats" ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
            >
                <MessageCircle size={18} /> Chats
            </button>
            <button 
                onClick={() => setResultTab("media")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    resultTab === "media" ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
            >
                <ImageIcon size={18} /> Recovered Media
            </button>
        </div>

        {/* Conteúdo das Abas */}
        <div className="min-h-[300px]">
            
            {/* 1. ABA CHATS */}
            {resultTab === "chats" && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                     <h3 className="font-bold text-sm text-gray-700 flex items-center gap-2">
                        <MessageCircle size={16} /> Recent Conversations (4 Found)
                     </h3>
                     <p className="text-xs text-gray-500">Click on a chat to read the history.</p>
                     
                     <div className="space-y-2">
                         {reportConversations.map((convo, i) => (
                             <div 
                                key={i} 
                                onClick={() => setSelectedConvoIndex(i)}
                                className="flex items-center gap-3 p-3 bg-white hover:bg-gray-50 border border-gray-100 rounded-lg shadow-sm cursor-pointer transition-colors group"
                             >
                                 <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden relative border border-gray-200">
                                     <img src={convo.img || "/placeholder.svg"} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="user" />
                                 </div>
                                 <div className="flex-1 min-w-0">
                                     <div className="flex justify-between items-center mb-0.5">
                                         <p className="font-semibold text-sm truncate text-gray-900">{convo.name}</p>
                                         <span className="text-[10px] text-green-600 font-medium">{convo.time}</span>
                                     </div>
                                     <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                                        <CheckCheck size={12} className="text-blue-400" />
                                        {convo.lastMsg}
                                     </p>
                                 </div>
                             </div>
                         ))}
                     </div>
                </div>
            )}

            {/* 2. ABA MEDIA */}
            {resultTab === "media" && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                     <h3 className="font-bold text-sm text-gray-700 flex items-center gap-2">
                        <ImageIcon size={16} /> Recovered Media (9 Photos)
                     </h3>
                     <div className="grid grid-cols-3 gap-2">
                         {reportMedia.map((img, i) => (
                             <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group shadow-sm border border-gray-100">
                                 <img src={img || "/placeholder.svg"} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="media" />
                             </div>
                         ))}
                     </div>
                </div>
            )}

        </div>

        {/* Rodapé com Timer */}
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

        {/* Popup Chat */}
        {selectedConvoIndex !== null && (
            <ChatPopup 
                onClose={() => setSelectedConvoIndex(null)}
                profilePhoto={reportConversations[selectedConvoIndex].img}
                conversationData={reportConversations[selectedConvoIndex].chatData}
                conversationName={reportConversations[selectedConvoIndex].name}
            />
        )}
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
    </DashboardLayout>
  )
}

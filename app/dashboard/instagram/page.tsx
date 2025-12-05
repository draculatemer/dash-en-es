"use client"

// 👇 Garante que o build não quebre
export const dynamic = "force-dynamic"

import { useState, useRef, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import FeatureCard from "@/components/feature-card"
import { useAuth } from "@/lib/auth-context"
import { translations } from "@/lib/translations"
import { Input } from "@/components/ui/input"
import { 
  User, 
  Instagram, 
  CheckCircle, 
  Heart, 
  MessageCircle, 
  MessageSquare, 
  Bookmark,      
  Loader2,
  X, 
  Send, 
  Clock 
} from "lucide-react"

// ==========================================================
// DADOS MOCKADOS
// ==========================================================
const FEMALE_PROFILES = ["@jessy_nutty", "@alexis_30", "@izes", "@maryjane434", "@emma.whistle32", "@celina_anderson467", "@letty.miriah99", "@sophia_rose45", "@katie.bell87", "@lily_grace23", "@mia.evans56", "@olivia_star78", "@ava_johnson91", "@isabella.moon12", "@harper_lee34", "@evelyn.brooks67", "@abigail_smith89", "@ella.frost45"]
const FEMALE_IMAGES = ["/images/male/perfil/1.jpg", "/images/male/perfil/2.jpg", "/images/male/perfil/3.jpg", "/images/male/perfil/4.jpg", "/images/male/perfil/5.jpg", "/images/male/perfil/6.jpg", "/images/male/perfil/7.jpg", "/images/male/perfil/8.jpg", "/images/male/perfil/9.jpg"]
const MALE_PROFILES = ["@john.doe92", "@mike_anderson", "@chris_williams", "@danny.smith", "@liam.baker", "@noah_carter", "@ryan_hills", "@ethan_jones55", "@oliver.miller78", "@jacob_thomas23", "@logan_green45", "@mason.evans67", "@elijah_wood89", "@james.parker12", "@benjamin_hall34", "@lucas_gray56", "@aiden.clark78", "@wyatt_brooks90"]
const MALE_IMAGES = ["/images/female/perfil/1.jpg", "/images/female/perfil/2.jpg", "/images/female/perfil/3.jpg", "/images/female/perfil/4.jpg", "/images/female/perfil/5.jpg", "/images/female/perfil/6.jpg", "/images/female/perfil/7.jpg", "/images/female/perfil/8.jpeg", "/images/female/perfil/9.jpg"]

const LIKED_BY_MALE_PHOTOS = ["/images/male/liked/male-liked-photo-1.jpg", "/images/male/liked/male-liked-photo-2.jpeg", "/images/male/liked/male-liked-photo-3.jpeg", "/images/male/liked/male-liked-photo-4.jpg", "/images/male/liked/male-liked-photo-5.jpg", "/images/male/liked/male-liked-photo-6.jpg", "/images/male/liked/male-liked-photo-7.jpg", "/images/male/liked/male-liked-photo-8.jpg", "/images/male/liked/male-liked-photo-9.jpg", "/images/male/liked/male-liked-photo-10.jpg", "/images/male/liked/male-liked-photo-11.jpg", "/images/male/liked/male-liked-photo-12.jpg", "/images/male/liked/male-liked-photo-13.jpg"]
const LIKED_BY_MALE_STORIES = ["/images/male/liked/male-liked-story-1.jpg", "/images/male/liked/male-liked-story-2.jpg", "/images/male/liked/male-liked-story-3.jpg", "/images/male/liked/male-liked-story-4.jpg", "/images/male/liked/male-liked-story-5.jpg", "/images/male/liked/male-liked-story-6.jpg", "/images/male/liked/male-liked-story-7.jpg", "/images/male/liked/male-liked-story-8.jpg", "/images/male/liked/male-liked-story-9.jpg", "/images/male/liked/male-liked-story-10.jpg", "/images/male/liked/male-liked-story-11.jpg", "/images/male/liked/male-liked-story-12.jpg", "/images/male/liked/male-liked-story-13.jpg"]
const LIKED_BY_FEMALE_PHOTOS = ["/images/female/liked/female-liked-photo-1.jpg", "/images/female/liked/female-liked-photo-2.jpg", "/images/female/liked/female-liked-photo-3.jpg", "/images/female/liked/female-liked-photo-4.jpg", "/images/female/liked/female-liked-photo-5.jpg", "/images/female/liked/female-liked-photo-6.jpg", "/images/female/liked/female-liked-photo-7.jpg", "/images/female/liked/female-liked-photo-8.jpg", "/images/female/liked/female-liked-photo-9.jpg", "/images/female/liked/female-liked-photo-10.jpg", "/images/female/liked/female-liked-photo-11.jpg", "/images/female/liked/female-liked-photo-12.jpg", "/images/female/liked/female-liked-photo-13.jpg"]
const LIKED_BY_FEMALE_STORIES = ["/images/female/liked/female-liked-story-1.jpg", "/images/female/liked/female-liked-story-2.jpg", "/images/female/liked/female-liked-story-3.jpg", "/images/female/liked/female-liked-story-4.jpg", "/images/female/liked/female-liked-story-5.jpg", "/images/female/liked/female-liked-story-6.jpg", "/images/female/liked/female-liked-story-7.jpg", "/images/female/liked/female-liked-story-8.jpg", "/images/female/liked/female-liked-story-9.jpg", "/images/female/liked/female-liked-story-10.jpg", "/images/female/liked/female-liked-story-11.jpg", "/images/female/liked/female-liked-story-12.jpg", "/images/female/liked/female-liked-story-13.jpg"]

const INTERCEPTED_COMMENTS = ["Wow, you are very hot 🥰", "🫣😏", "I'm getting horny 🥵", "drives me crazy 😈", "Beautiful pic!", "Send me DM", "Miss you", "You're so sexy 😍", "Can't stop staring 🔥", "You turn me on 😉", "Damn, you're irresistible 😜", "Let's get naughty together 💋", "You're making me wild 🐾", "Hot damn! 🌶️", "I want more of you 😘", "You're driving me insane 😈", "Send nudes? 🫣", "You're my fantasy 🥵", "Let's DM now 📩"]

// ==========================================================
// MOCK DE CONVERSAS (DINÂMICAS POR GÊNERO)
// ==========================================================

// Se o alvo for FEMALE (Alvo Mulher falando com Homem)
// Guy = other (esquerda), Woman = me (direita)
const CHATS_FOR_FEMALE_TARGET = [
    [ // Conversation 1
        { sender: "other", text: "Hey, that pic you posted is fire! 😍" },
        { sender: "me", text: "Haha thanks! Glad you liked it. What's up?" },
        { sender: "other", text: "Just thinking about you... We should catch up soon." },
        { sender: "me", text: "I'd love that! Been missing our chats too 🔥" },
        { sender: "other", text: "How about this weekend? Dinner on me? 😉" },
        { sender: "me", text: "Sounds perfect. Can't wait!" }
    ],
    [ // Conversation 2
        { sender: "other", text: "Saw your update – you're glowing! What's your secret? 😏" },
        { sender: "me", text: "Aw, you're sweet! Maybe it's just good vibes lol. How've you been?" },
        { sender: "other", text: "Better now talking to you. We need to hang out again." },
        { sender: "me", text: "Totally agree. When are you free? I'm down for anything 😘" },
        { sender: "other", text: "Friday night? Movie or something fun?" },
        { sender: "me", text: "Yes please! That'd be amazing." }
    ],
    [ // Conversation 3
        { sender: "other", text: "Your story made my day brighter. Looking stunning as always 🌟" },
        { sender: "me", text: "Thanks, that's so nice! You've been on my mind too." },
        { sender: "other", text: "Really? We should make some new memories together." },
        { sender: "me", text: "I'm all in. What do you have in mind? 😈" },
        { sender: "other", text: "How about a spontaneous adventure this week?" },
        { sender: "me", text: "Love the idea! Let's do it." }
    ]
]

// Se o alvo for MALE (Alvo Homem falando com Mulher)
// Man = me (direita), Woman = other (esquerda)
const CHATS_FOR_MALE_TARGET = [
    [ // Conversation 1
        { sender: "me", text: "Hey, that story of yours got me hooked... you're looking dangerously hot 😏" },
        { sender: "other", text: "Haha, thanks! What caught your eye?" },
        { sender: "me", text: "Everything, but that smile is killer. Miss seeing it up close 🔥" },
        { sender: "other", text: "Aw, you're sweet. We should fix that soon." },
        { sender: "me", text: "How about tonight? Let's make some heat together 😈" },
        { sender: "other", text: "Tempting... I'm free after 8." }
    ],
    [ // Conversation 2
        { sender: "me", text: "Saw your pic – damn, you're fire! Can't stop thinking about you 🥵" },
        { sender: "other", text: "Lol, really? What's on your mind?" },
        { sender: "me", text: "You in that outfit... drives me wild. We need to hang out ASAP 😉" },
        { sender: "other", text: "Sounds fun. Been thinking about you too." },
        { sender: "me", text: "Good, because I have some naughty ideas for us 💋" },
        { sender: "other", text: "Tell me more... I'm intrigued." }
    ],
    [ // Conversation 3
        { sender: "me", text: "Your update just made my day – you're stunning and sexy as hell 🌶️" },
        { sender: "other", text: "Thanks! You always know how to flatter." },
        { sender: "me", text: "Not flattery, truth. Let's catch up and turn up the heat 😘" },
        { sender: "other", text: "I'd like that. When?" },
        { sender: "me", text: "This weekend? Promise it'll be unforgettable 🔥" },
        { sender: "other", text: "Deal. Can't wait!" }
    ]
]

export default function InstagramScannerPage() {
  const { language } = useAuth()
  const t = translations[language || "en"]

  // --- ESTADOS DO FUNIL ---
  const [step, setStep] = useState(1) // 1: Input, 2: Scanning, 3: Results
  const [instagramHandle, setInstagramHandle] = useState("")
  const [selectedGender, setSelectedGender] = useState<string | null>(null)
  
  const [profileData, setProfileData] = useState<any>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [error, setError] = useState("")
  
  // Estados de animação do passo 2
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [instagramPosts, setInstagramPosts] = useState<any[]>([])
  const [visiblePosts, setVisiblePosts] = useState<number>(0)
  
  // Estados do passo 3 (Resultados)
  const [resultTab, setResultTab] = useState<"messages" | "likes" | "comments" | "saved">("messages")
  const [randomizedResults, setRandomizedResults] = useState<Array<{ username: string; image: string; type: "like" | "message"; chatHistory?: any[] }>>([])
  const [interceptedImages, setInterceptedImages] = useState<Array<{ image: string; comment: string }>>([])
  const [savedImages, setSavedImages] = useState<string[]>([])

  // Estado para o Chat Popup
  const [selectedChat, setSelectedChat] = useState<any>(null)

  // Estado para o Cronômetro Individual
  const [countdownString, setCountdownString] = useState("6d 23h 59m")

  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  // --- LÓGICA DO CRONÔMETRO (User Specific) ---
  useEffect(() => {
    // Apenas roda no cliente
    const STORAGE_KEY = "user_first_scan_access";
    
    // 1. Verifica se já existe uma data de acesso
    let firstAccess = localStorage.getItem(STORAGE_KEY);
    
    // 2. Se não existir, salva o momento atual
    if (!firstAccess) {
        firstAccess = Date.now().toString();
        localStorage.setItem(STORAGE_KEY, firstAccess);
    }

    // 3. Define a data alvo (7 dias a partir do primeiro acesso)
    const targetDate = parseInt(firstAccess) + (7 * 24 * 60 * 60 * 1000);

    // 4. Inicia o intervalo de atualização
    const timerInterval = setInterval(() => {
        const now = Date.now();
        const difference = targetDate - now;

        if (difference <= 0) {
            setCountdownString("0d 00h 00m (Atualizando...)");
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        
        setCountdownString(`${days}d ${hours}h ${minutes}m`);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);


  // --- FUNÇÕES AUXILIARES ---
  const sanitizeUsername = (username: string): string => {
    let u = (username || "").trim()
    if (u.startsWith("@")) u = u.slice(1)
    u = u.toLowerCase()
    return u.replace(/[^a-z0-9._]/g, "")
  }

  const shuffleAndPick = (arr: any[], num: number) => {
    return [...arr].sort(() => 0.5 - Math.random()).slice(0, num)
  }

  // --- LÓGICA DE BUSCA DE PERFIL (Passo 1) ---
  const handleInstagramChange = (value: string) => {
    setInstagramHandle(value)
    const sanitizedUser = sanitizeUsername(value)
    
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    setError("")
    setProfileData(null)

    if (sanitizedUser.length < 3) {
      setIsLoadingProfile(false)
      return
    }

    setIsLoadingProfile(true)
    debounceTimer.current = setTimeout(async () => {
      try {
        const response = await fetch("/api/instagram/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: sanitizedUser }),
        })
        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Profile not found or private.")
        }
        setProfileData(result.profile)
      } catch (err: any) {
        setError(err.message)
        setProfileData(null)
      } finally {
        setIsLoadingProfile(false)
      }
    }, 1200)
  }

  // --- LÓGICA DE TRANSIÇÃO (Passo 1 -> 2 -> 3) ---
  const handleStartScan = () => {
    if (!profileData || !selectedGender) return

    const fetchPosts = async () => {
        try {
          const cleanUsername = sanitizeUsername(instagramHandle)
          const response = await fetch("/api/instagram/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: cleanUsername }),
          })
          if (response.ok) {
            const data = await response.json()
            if (data.success && data.posts) {
              setInstagramPosts(data.posts.slice(0, 9))
            }
          }
        } catch (error) {
          console.error("Error fetching posts:", error)
        }
    }
    fetchPosts()

    setStep(2)
    setLoadingProgress(0)
    setVisiblePosts(0)

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + Math.random() * 10
      })
    }, 800)

    const postsInterval = setInterval(() => {
        setVisiblePosts((prev) => {
          if (prev >= 9) {
            clearInterval(postsInterval)
            return 9
          }
          return prev + 1
        })
    }, 1500)

    setTimeout(() => {
      setLoadingProgress(100)
      setTimeout(() => {
        setStep(3)
      }, 1000)
    }, 15000)
  }

  // --- LÓGICA DO PASSO 3 (Geração de Dados) ---
  useEffect(() => {
    if (step === 3) {
      let profilesToUse = FEMALE_PROFILES
      let imagesToUse = FEMALE_IMAGES
      let likedImagesSource = LIKED_BY_MALE_PHOTOS.concat(LIKED_BY_MALE_STORIES)
      let chatSource = CHATS_FOR_FEMALE_TARGET // Default
      
      // Se selecionei FEMALE, o alvo é mulher. Os perfis com quem ela fala são HOMENS.
      // Se selecionei MALE, o alvo é homem. Os perfis com quem ele fala são MULHERES.
      
      if (selectedGender === "female") {
        // Alvo mulher -> Interage com Homens
        profilesToUse = MALE_PROFILES
        imagesToUse = MALE_IMAGES
        likedImagesSource = LIKED_BY_FEMALE_PHOTOS.concat(LIKED_BY_FEMALE_STORIES)
        chatSource = CHATS_FOR_FEMALE_TARGET
      } else {
        // Alvo homem -> Interage com Mulheres (Male e Non-binary cai aqui como default para mulher interagir)
        profilesToUse = FEMALE_PROFILES
        imagesToUse = FEMALE_IMAGES
        likedImagesSource = LIKED_BY_MALE_PHOTOS.concat(LIKED_BY_MALE_STORIES)
        chatSource = CHATS_FOR_MALE_TARGET
      }

      // 1. Sorteia usuários (3 Mensagens + 6 Likes = 9 Total)
      const randomUsernames = shuffleAndPick(profilesToUse, 9) 
      const randomImages = shuffleAndPick(imagesToUse, 9)

      const results = randomUsernames.map((username, index) => {
        const isMessage = index < 3
        return {
            username,
            image: randomImages[index % randomImages.length],
            type: (isMessage ? "message" : "like") as "like" | "message",
            // Atribui o chat correspondente se for mensagem (0->Chat1, 1->Chat2, 2->Chat3)
            chatHistory: isMessage ? chatSource[index] : undefined
        }
      })
      setRandomizedResults(results)

      // 2. Comentários
      const randomCommentedImages = shuffleAndPick(likedImagesSource, 4)
      const randomComments = shuffleAndPick(INTERCEPTED_COMMENTS, 4)
      const commentedData = randomCommentedImages.map((img, index) => ({
        image: img,
        comment: randomComments[index % randomComments.length],
      }))
      setInterceptedImages(commentedData)

      // 3. Saved (Quero 6 imagens)
      const randomSaved = shuffleAndPick(likedImagesSource.reverse(), 6)
      setSavedImages(randomSaved)
    }
  }, [step, selectedGender])


  // --- COMPONENTES DE RENDERIZAÇÃO ---

  const ProfileCard = () => {
      if (!profileData) return null
      return (
        <div className="p-4 rounded-lg border border-border bg-white shadow-sm animate-fade-in">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                {profileData.profile_pic_url ? (
                    <img
                    src={profileData.profile_pic_url}
                    alt="profile"
                    className="w-14 h-14 rounded-full object-cover border-2 border-green-500"
                    />
                ) : (
                    <div className="w-14 h-14 rounded-full bg-gray-200" />
                )}
                <div>
                    <p className="text-green-600 font-bold text-sm">Instagram Profile</p>
                    <p className="font-bold text-lg text-foreground">@{profileData.username}</p>
                    <p className="text-muted-foreground text-sm">
                    {profileData.media_count} posts • {profileData.follower_count} followers
                    </p>
                </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
            </div>
        </div>
      )
  }

  // --- MODAL DE CHAT ---
  const ChatModal = () => {
    if (!selectedChat) return null
    
    // Pega o histórico específico desse chat ou usa um array vazio se der erro
    const messages = selectedChat.chatHistory || []

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col h-[500px]">
                {/* Header */}
                <div className="bg-gray-50 border-b p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={selectedChat.image} className="w-10 h-10 rounded-full border border-gray-200" />
                        <div>
                            <p className="font-bold text-sm">{selectedChat.username}</p>
                            <p className="text-xs text-green-600 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> Online
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setSelectedChat(null)} className="p-2 hover:bg-gray-200 rounded-full transition">
                        <X size={20} className="text-gray-500"/>
                    </button>
                </div>

                {/* Chat Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    <p className="text-xs text-center text-gray-400 my-2">Today, 2:30 AM</p>
                    {messages.map((msg: any, i: number) => (
                        <div key={i} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                                msg.sender === "me" 
                                ? "bg-blue-500 text-white rounded-br-none" 
                                : "bg-white border text-gray-800 rounded-bl-none shadow-sm"
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Input */}
                <div className="p-3 bg-white border-t flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <div className="w-4 h-4 border-2 border-current rounded-full"/>
                    </div>
                    <input 
                        disabled 
                        placeholder="Reply..." 
                        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none"
                    />
                    <button className="text-blue-500 p-2">
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
  }

  // PASSO 1: INPUTS
  const renderStep1 = () => (
    <div className="space-y-6">
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">1. Select Target's Gender</h3>
            <div className="grid grid-cols-3 gap-3">
                {["male", "female", "non-binary"].map((g) => (
                    <button
                        key={g}
                        onClick={() => setSelectedGender(g)}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all hover:scale-105 ${
                            selectedGender === g 
                            ? "border-primary bg-primary/5 shadow-md" 
                            : "border-border bg-white hover:border-primary/50"
                        }`}
                    >
                        <span className="text-2xl capitalize">{g === "male" ? "👱‍♂️" : g === "female" ? "👱‍♀️" : "👱"}</span>
                        <span className="font-medium text-sm capitalize">{g}</span>
                    </button>
                ))}
            </div>
        </div>

        <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">2. Enter Instagram Username</h3>
            <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                    type="text"
                    placeholder="ex: john_doe"
                    className="pl-12 h-12 text-lg"
                    value={instagramHandle}
                    onChange={(e) => handleInstagramChange(e.target.value)}
                />
            </div>
            
            {isLoadingProfile && (
                 <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin" /> Searching profile...
                 </div>
            )}
            {!isLoadingProfile && error && (
                <p className="text-red-500 text-sm font-medium">{error}</p>
            )}
            {!isLoadingProfile && profileData && <ProfileCard />}
        </div>

        <button
            onClick={handleStartScan}
            disabled={!profileData || !selectedGender || isLoadingProfile}
            className="w-full py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
            Start Deep Scan 🔍
        </button>
    </div>
  )

  // PASSO 2: LOADING / SCANNING
  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-xl font-bold text-center">Analyzing @{instagramHandle}...</h2>
        <ProfileCard />
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-muted-foreground">
                <span>SCANNING DATABASE...</span>
                <span>{Math.floor(loadingProgress)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-300 ease-out"
                    style={{ width: `${loadingProgress}%` }}
                />
            </div>
        </div>
        <div className="grid grid-cols-3 gap-2 opacity-80">
            {instagramPosts.slice(0, visiblePosts).map((post, i) => (
                <div key={i} className="aspect-square rounded-md overflow-hidden bg-gray-100 animate-fade-in relative">
                     <img 
                        src={post.imageUrl || "/placeholder.svg"} 
                        className="w-full h-full object-cover" 
                        alt="post"
                     />
                     <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                     </div>
                </div>
            ))}
            {Array.from({ length: Math.max(0, 9 - visiblePosts) }).map((_, i) => (
                <div key={`p-${i}`} className="aspect-square rounded-md bg-secondary animate-pulse" />
            ))}
        </div>
        <p className="text-center text-sm text-muted-foreground animate-pulse">
            Analyzing interactions, likes, and direct messages...
        </p>
    </div>
  )

  // PASSO 3: RESULTADOS E ABAS
  const renderStep3 = () => {
    // Separa os resultados para Directs (3) e Likes (6)
    const messages = randomizedResults.filter(r => r.type === "message").slice(0, 3);
    const likes = randomizedResults.filter(r => r.type === "like").slice(0, 6);

    return (
        <div className="space-y-6 animate-fade-in pb-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center justify-center gap-2 text-green-700 font-bold text-lg">
                <CheckCircle className="w-6 h-6" /> Scan Completed Successfully
            </div>

            <ProfileCard />

            {/* --- TABS DE NAVEGAÇÃO --- */}
            <div className="flex p-1 bg-gray-100 rounded-xl overflow-x-auto no-scrollbar">
                <button 
                    onClick={() => setResultTab("messages")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        resultTab === "messages" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    <MessageCircle size={18} /> Directs
                </button>
                <button 
                    onClick={() => setResultTab("likes")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        resultTab === "likes" ? "bg-white text-pink-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    <Heart size={18} /> Likes
                </button>
                <button 
                    onClick={() => setResultTab("comments")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        resultTab === "comments" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    <MessageSquare size={18} /> Comments
                </button>
                <button 
                    onClick={() => setResultTab("saved")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        resultTab === "saved" ? "bg-white text-purple-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    <Bookmark size={18} /> Saved
                </button>
            </div>

            {/* --- CONTEÚDO DAS ABAS --- */}
            <div className="min-h-[300px]">
                
                {/* 1. ABA DE MENSAGENS (3 PERFIS + POPUP) */}
                {resultTab === "messages" && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800">
                            <MessageCircle className="text-blue-500 w-5 h-5" /> Recent Direct Messages
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">Click on a profile to view intercepted chat.</p>
                        
                        {messages.map((item, i) => (
                            <div 
                                key={i} 
                                onClick={() => setSelectedChat(item)}
                                className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-blue-200"
                            >
                                <img src={item.image} alt="user" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform" />
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold text-gray-900">{item.username}</p>
                                        <span className="text-xs text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded-full">Suspicious</span>
                                    </div>
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                        Click to read history... <span className="w-2 h-2 rounded-full bg-blue-500 ml-1"></span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 2. ABA DE LIKES (6 PERFIS) */}
                {resultTab === "likes" && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800">
                            <Heart className="text-pink-500 w-5 h-5" /> Liked by Target
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                             {likes.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                                    <img src={item.image} alt="user" className="w-10 h-10 rounded-full object-cover" />
                                    <div className="flex-1 text-sm">
                                        <p className="text-gray-800">
                                            Liked <b>{item.username}'s</b> photo
                                        </p>
                                        <p className="text-gray-400 text-xs">Yesterday</p>
                                    </div>
                                    <Heart className="text-pink-500 fill-pink-500" size={16} />
                                </div>
                             ))}
                        </div>
                    </div>
                )}

                {/* 3. ABA DE COMENTÁRIOS */}
                {resultTab === "comments" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                         <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800">
                            <MessageSquare className="text-orange-500 w-5 h-5" /> Recent Comments
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {interceptedImages.map((item, index) => (
                                <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                    <div className="relative h-48 w-full">
                                        <img
                                            src={item.image || "/placeholder.svg"}
                                            alt={`Commented content ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-3">
                                        <div className="flex items-start gap-3">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-gray-500 mb-1">Commented on this photo:</p>
                                                <p className="text-sm text-gray-800 font-medium italic">
                                                    "{item.comment}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. ABA DE SALVOS (6 IMAGENS) */}
                {resultTab === "saved" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                         <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800">
                            <Bookmark className="text-purple-500 w-5 h-5" /> Saved to Collection
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            {savedImages.map((img, index) => (
                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden shadow-sm group">
                                    <img 
                                        src={img} 
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                                        alt="saved" 
                                    />
                                    <div className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full text-white">
                                        <Bookmark size={12} className="fill-white" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* RODAPÉ COM AVISO DE ATUALIZAÇÃO E TIMER DINÂMICO */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col items-center justify-center gap-1 text-[11px] uppercase tracking-wide text-green-700 font-medium opacity-80 text-center">
                <div className="flex items-center gap-2">
                    <Clock size={12} className="animate-pulse" />
                    <span>Next automatic system update in:</span>
                </div>
                <span className="text-green-800 font-bold bg-green-100 px-2 py-0.5 rounded">
                    {countdownString}
                </span>
                <span className="text-[10px] text-gray-400 normal-case mt-1"></span>
            </div>

            {/* RENDERIZA O MODAL SE TIVER UM CHAT SELECIONADO */}
            {selectedChat && <ChatModal />}
        </div>
    )
  }

  return (
    <DashboardLayout activeTab="instagram">
      <div className="max-w-2xl mx-auto space-y-6">
        <FeatureCard 
            title={step === 1 ? t?.instagramScannerTitle : step === 2 ? "Deep Scanning In Progress" : "Scanner Results"} 
            description={step === 1 ? t?.instagramScannerDesc : step === 2 ? "Please wait while we analyze the target profile." : `Results found for @${instagramHandle}`}
        >
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
        </FeatureCard>

        {step === 1 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex gap-4">
                <Instagram className="text-blue-600 flex-shrink-0" size={24} />
                <div>
                <h3 className="font-semibold text-foreground mb-1">How it works</h3>
                <p className="text-sm text-muted-foreground">
                    Our AI scans public interactions, followers, and activity patterns to build a comprehensive report.
                </p>
                </div>
            </div>
            </div>
        )}
      </div>
    </DashboardLayout>
  )
}

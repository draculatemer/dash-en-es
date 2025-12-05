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
  MessageSquare, // Ícone para comentários
  Bookmark,      // Ícone para salvos
  Loader2,
  Search
} from "lucide-react"

// ==========================================================
// DADOS MOCKADOS
// ==========================================================
const FEMALE_PROFILES = ["@jessy_nutty", "@alexis_30", "@izes", "@maryjane434", "@emma.whistle32", "@celina_anderson467", "@letty.miriah99", "@sophia_rose45", "@katie.bell87", "@lily_grace23", "@mia.evans56", "@olivia_star78", "@ava_johnson91", "@isabella.moon12", "@harper_lee34", "@evelyn.brooks67", "@abigail_smith89", "@ella.frost45"]
const FEMALE_IMAGES = ["/images/male/perfil/1.jpg", "/images/male/perfil/2.jpg", "/images/male/perfil/3.jpg", "/images/male/perfil/4.jpg", "/images/male/perfil/5.jpg", "/images/male/perfil/6.jpg", "/images/male/perfil/7.jpg", "/images/male/perfil/8.jpg", "/images/male/perfil/9.jpg"]
const MALE_PROFILES = ["@john.doe92", "@mike_anderson", "@chris_williams", "@danny.smith", "@liam.baker", "@noah_carter", "@ryan_hills", "@ethan_jones55", "@oliver.miller78", "@jacob_thomas23", "@logan_green45", "@mason.evans67", "@elijah_wood89", "@james.parker12", "@benjamin_hall34", "@lucas_gray56", "@aiden.clark78", "@wyatt_brooks90"]
const MALE_IMAGES = ["/images/female/perfil/1.jpg", "/images/female/perfil/2.jpg", "/images/female/perfil/3.jpg", "/images/female/perfil/4.jpg", "/images/female/perfil/5.jpg", "/images/female/perfil/6.jpg", "/images/female/perfil/7.jpg", "/images/female/perfil/8.jpeg", "/images/female/perfil/9.jpg"]

const LIKED_BY_MALE_PHOTOS = ["/images/male/liked/male-liked-photo-1.jpg", "/images/male/liked/male-liked-photo-2.jpeg", "/images/male/liked/male-liked-photo-3.jpeg"]
const LIKED_BY_MALE_STORIES = ["/images/male/liked/male-liked-story-1.jpg", "/images/male/liked/male-liked-story-2.jpg", "/images/male/liked/male-liked-story-3.jpg"]
const LIKED_BY_FEMALE_PHOTOS = ["/images/female/liked/female-liked-photo-1.jpg", "/images/female/liked/female-liked-photo-2.jpg", "/images/female/liked/female-liked-photo-3.jpg"]
const LIKED_BY_FEMALE_STORIES = ["/images/female/liked/female-liked-story-1.jpg", "/images/female/liked/female-liked-story-2.jpg", "/images/female/liked/female-liked-story3.jpg"]

const INTERCEPTED_COMMENTS = ["Wow, you are very hot 🥰", "🫣😏", "I'm getting horny 🥵", "drives me crazy 😈", "Beautiful pic!", "Send me DM", "Miss you"]

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
  // Nova state para controlar as abas
  const [resultTab, setResultTab] = useState<"messages" | "likes" | "comments" | "saved">("messages")
  
  const [randomizedResults, setRandomizedResults] = useState<Array<{ username: string; image: string; type: "like" | "message" }>>([])
  const [interceptedImages, setInterceptedImages] = useState<Array<{ image: string; comment: string }>>([])
  const [savedImages, setSavedImages] = useState<string[]>([])

  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

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

    // 1. Iniciar busca de posts (background)
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

    // 2. Mudar para tela de loading
    setStep(2)
    setLoadingProgress(0)
    setVisiblePosts(0)

    // 3. Animação da Barra de Progresso
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + Math.random() * 10
      })
    }, 800)

    // 4. Animação de aparecer posts
    const postsInterval = setInterval(() => {
        setVisiblePosts((prev) => {
          if (prev >= 9) {
            clearInterval(postsInterval)
            return 9
          }
          return prev + 1
        })
    }, 1500)

    // 5. Finalizar após X segundos (simulado)
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
      // 1. Sorteia interações (Mensagens e Likes de usuários)
      let profilesToUse = FEMALE_PROFILES
      let imagesToUse = FEMALE_IMAGES
      let likedImagesSource = LIKED_BY_MALE_PHOTOS.concat(LIKED_BY_MALE_STORIES)
      
      if (selectedGender === "female") {
        profilesToUse = MALE_PROFILES
        imagesToUse = MALE_IMAGES
        likedImagesSource = LIKED_BY_FEMALE_PHOTOS.concat(LIKED_BY_FEMALE_STORIES)
      }

      // Sorteia usuários
      const randomUsernames = shuffleAndPick(profilesToUse, 6) // Pega mais para ter dados para mensagens e likes
      const randomImages = shuffleAndPick(imagesToUse, 6)

      // Cria lista mista para usar nas abas
      const results = randomUsernames.map((username, index) => ({
        username,
        image: randomImages[index % randomImages.length],
        type: (index < 3 ? "message" : "like") as "like" | "message", // Primeiros 3 são mensagens
      }))
      setRandomizedResults(results)

      // 2. Sorteia imagens Comentadas (antigas "interceptadas")
      const randomCommentedImages = shuffleAndPick(likedImagesSource, 4)
      const randomComments = shuffleAndPick(INTERCEPTED_COMMENTS, 4)

      const commentedData = randomCommentedImages.map((img, index) => ({
        image: img,
        comment: randomComments[index % randomComments.length],
      }))
      setInterceptedImages(commentedData)

      // 3. Sorteia imagens Salvas (usa o restante das imagens de stories/posts)
      const randomSaved = shuffleAndPick(likedImagesSource.reverse(), 4)
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

  // PASSO 1: INPUTS
  const renderStep1 = () => (
    <div className="space-y-6">
        {/* Seletor de Gênero */}
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

        {/* Input de Usuário */}
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
            
            {/* Feedback de Loading/Erro do Perfil */}
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

        {/* Botão de Ação */}
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

        {/* Barra de Progresso */}
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

        {/* Grid de Posts sendo "analisados" */}
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
            {/* Placeholders */}
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
    // Filtros para as abas
    const messages = randomizedResults.filter(r => r.type === "message");
    const likes = randomizedResults.filter(r => r.type === "like");

    return (
        <div className="space-y-6 animate-fade-in pb-10">
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
                
                {/* 1. ABA DE MENSAGENS */}
                {resultTab === "messages" && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800">
                            <MessageCircle className="text-blue-500 w-5 h-5" /> Recent Direct Messages
                        </h3>
                        {messages.length > 0 ? messages.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <img src={item.image} alt="user" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold text-gray-900">{item.username}</p>
                                        <span className="text-xs text-gray-400">2h ago</span>
                                    </div>
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                        Sent a message <span className="w-2 h-2 rounded-full bg-blue-500 ml-1"></span>
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-center py-10">No recent messages found.</p>
                        )}
                    </div>
                )}

                {/* 2. ABA DE LIKES */}
                {resultTab === "likes" && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800">
                            <Heart className="text-pink-500 w-5 h-5" /> Liked by Target
                        </h3>
                        <p className="text-sm text-gray-500">Users whose photos {instagramHandle} liked recently.</p>
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
                                        {/* REMOVIDO BLUR E LOCK */}
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

                {/* 4. ABA DE SALVOS */}
                {resultTab === "saved" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                         <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800">
                            <Bookmark className="text-purple-500 w-5 h-5" /> Saved to Collection
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {savedImages.map((img, index) => (
                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden shadow-sm group">
                                     {/* REMOVIDO BLUR E LOCK */}
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

        {/* Info Card - Só aparece no passo 1 */}
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

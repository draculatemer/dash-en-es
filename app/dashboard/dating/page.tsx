"use client"

// 👇 Garante que a página seja dinâmica
export const dynamic = "force-dynamic"

import { useState, useEffect, useCallback, useMemo, Suspense } from "react"
import Script from "next/script"
import DashboardLayout from "@/components/dashboard-layout"
import FeatureCard from "@/components/feature-card"
import { useAuth } from "@/lib/auth-context"
import { translations } from "@/lib/translations"

// Bibliotecas de UI e Ícones
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { 
  Zap, 
  AlertTriangle, 
  Flame, 
  Lock, 
  Camera, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Users, 
  MapPin, 
  X, 
  Loader2, 
  Search 
} from "lucide-react"

// =======================================================
// DADOS MOCKADOS E TYPES
// =======================================================

interface Match { 
    name: string; 
    age: number; 
    lastSeen: string; 
    avatar: string; 
    verified: boolean; 
    identity: string; 
    location: string; 
    distance: string; 
    bio: string; 
    zodiac: string; 
    mbti: string; 
    passion: string; 
    interests: string[]; 
}

const defaultMatchesData: Omit<Match, 'location'>[] = [
    { name: "Mila", age: 26, lastSeen: "6h ago", avatar: "/images/male/tinder/5.jpg", verified: true, identity: "Bisexual", distance: "2 km", bio: "Part dreamer, part doer, all about good vibes. Ready to make some memories?", zodiac: "Virgo", mbti: "KU", passion: "Coffee", interests: ["Hiking", "Green Living", "Live Music", "Pottery"] },
    { name: "John", age: 25, lastSeen: "4h ago", avatar: "/images/female/tinder/5.jpg", verified: true, identity: "Bisexual", distance: "2 km", bio: "Half adrenaline junkie, half cozy blanket enthusiast. What’s your vibe?", zodiac: "Leo", mbti: "BU", passion: "Fitness", interests: ["Meditation", "Books", "Wine", "Music"] },
    { name: "Harper", age: 21, lastSeen: "3h ago", avatar: "/images/male/tinder/3.jpg", verified: false, identity: "Woman", distance: "5 km", bio: "Just a girl who loves sunsets and long walks on the beach. Looking for someone to share adventures with.", zodiac: "Leo", mbti: "UVA", passion: "Yoga", interests: ["Travel", "Photography", "Podcasts"] },
    { name: "Will", age: 23, lastSeen: "2h ago", avatar: "/images/female/tinder/3.jpg", verified: true, identity: "Man", distance: "8 km", bio: "Fluent in sarcasm and movie quotes. Let's find the best pizza place in town.", zodiac: "Gemini", mbti: "OHY", passion: "Baking", interests: ["Concerts", "Netflix", "Dogs"] },
];

const femaleMatchesData: Omit<Match, 'location'>[] = [
    { name: "Elizabeth", age: 24, lastSeen: "1h ago", avatar: "/images/male/tinder/1.jpg", verified: true, identity: "Woman", distance: "3 km", bio: "Seeking new adventures and a great cup of coffee. Let's explore the city together.", zodiac: "Aries", mbti: "ENFP", passion: "Traveling", interests: ["Art", "History", "Podcasts"] },
    { name: "Victoria", age: 27, lastSeen: "5h ago", avatar: "/images/male/tinder/2.jpg", verified: false, identity: "Woman", distance: "1 km", bio: "Bookworm and aspiring chef. Tell me about the last great book you read.", zodiac: "Taurus", mbti: "ISFJ", passion: "Cooking", interests: ["Reading", "Yoga", "Documentaries"] },
    { name: "Charlotte", age: 22, lastSeen: "Online", avatar: "/images/male/tinder/3.jpg", verified: true, identity: "Woman", distance: "6 km", bio: "Lover of live music and spontaneous road trips. What's our first destination?", zodiac: "Sagittarius", mbti: "ESFP", passion: "Music", interests: ["Concerts", "Photography", "Hiking"] },
    { name: "Emily", age: 25, lastSeen: "3h ago", avatar: "/images/male/tinder/4.jpg", verified: true, identity: "Woman", distance: "4 km", bio: "Fitness enthusiast who's equally happy on the couch with a good movie.", zodiac: "Virgo", mbti: "ISTJ", passion: "Fitness", interests: ["Movies", "Healthy Eating", "Dogs"] },
    { name: "Grace", age: 28, lastSeen: "8h ago", avatar: "/images/male/tinder/5.jpg", verified: false, identity: "Woman", distance: "7 km", bio: "Creative soul with a love for painting and poetry. Looking for meaningful conversations.", zodiac: "Pisces", mbti: "INFP", passion: "Art", interests: ["Museums", "Writing", "Coffee Shops"] },
    { name: "Olivia", age: 23, lastSeen: "2h ago", avatar: "/images/male/tinder/6.jpg", verified: true, identity: "Woman", distance: "2 km", bio: "Sarcasm is my second language. Let's find the best taco spot in town.", zodiac: "Gemini", mbti: "ENTP", passion: "Comedy", interests: ["Foodie", "Travel", "Stand-up"] },
];

const maleMatchesData: Omit<Match, 'location'>[] = [
    { name: "William", age: 26, lastSeen: "Online", avatar: "/images/female/tinder/1.jpg", verified: true, identity: "Man", distance: "2 km", bio: "Engineer by day, musician by night. Let's talk about tech and tunes.", zodiac: "Capricorn", mbti: "INTJ", passion: "Guitar", interests: ["Technology", "Live Music", "Brewing"] },
    { name: "James", age: 29, lastSeen: "4h ago", avatar: "/images/female/tinder/2.jpg", verified: true, identity: "Man", distance: "5 km", bio: "Outdoors enthusiast looking for someone to hike with. My dog will probably like you.", zodiac: "Leo", mbti: "ESTP", passion: "Hiking", interests: ["Camping", "Dogs", "Bonfires"] },
    { name: "Henry", age: 25, lastSeen: "1h ago", avatar: "/images/female/tinder/3.jpg", verified: false, identity: "Man", distance: "3 km", bio: "Film buff and history nerd. Can recommend a movie for any mood.", zodiac: "Cancer", mbti: "INFJ", passion: "Movies", interests: ["History", "Reading", "Chess"] },
    { name: "Oliver", age: 27, lastSeen: "6h ago", avatar: "/images/female/tinder/4.jpg", verified: true, identity: "Man", distance: "8 km", bio: "Just a guy who enjoys good food, good company, and exploring new places.", zodiac: "Libra", mbti: "ESFJ", passion: "Foodie", interests: ["Travel", "Cooking", "Sports"] },
    { name: "Thomas", age: 30, lastSeen: "2h ago", avatar: "/images/female/tinder/5.jpg", verified: true, identity: "Man", distance: "4 km", bio: "Trying to find someone who won't steal my fries. Kidding... mostly.", zodiac: "Scorpio", mbti: "ISTP", passion: "Traveling", interests: ["Photography", "Motorcycles", "Gym"] },
    { name: "Edward", age: 24, lastSeen: "7h ago", avatar: "/images/female/tinder/6.jpg", verified: false, identity: "Man", distance: "6 km", bio: "Fluent in sarcasm and bad jokes. Looking for a partner in crime.", zodiac: "Aquarius", mbti: "ENTP", passion: "Gaming", interests: ["Comedy", "Sci-Fi", "Concerts"] },
];

const defaultCensoredPhotos = ["/images/censored/photo1.jpg", "/images/censored/photo2.jpg", "/images/censored/photo3.jpg", "/images/censored/photo4.jpg"];
const femaleCensoredPhotos = ["/images/male/tinder/censored/censored-f-1.jpg", "/images/male/tinder/censored/censored-f-2.jpg", "/images/male/tinder/censored/censored-f-3.jpg", "/images/male/tinder/censored/censored-f-4.jpg"];
const maleCensoredPhotos = ["/images/female/tinder/censored/censored-h-1.jpg", "/images/female/tinder/censored/censored-h-2.jpg", "/images/female/tinder/censored/censored-h-3.jpg", "/images/female/tinder/censored/censored-h-4.jpg"];

// =======================================================
// COMPONENTES AUXILIARES
// =======================================================

const PrevButton = (props: any) => { 
    const { enabled, onClick } = props; 
    return ( 
        <button className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full disabled:opacity-30 transition-opacity z-10" onClick={onClick} disabled={!enabled}> 
            <ChevronLeft size={20} /> 
        </button> 
    ) 
}

const NextButton = (props: any) => { 
    const { enabled, onClick } = props; 
    return ( 
        <button className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full disabled:opacity-30 transition-opacity z-10" onClick={onClick} disabled={!enabled}> 
            <ChevronRight size={20} /> 
        </button> 
    ) 
}

function MatchDetailModal({ match, onClose }: { match: Match; onClose: () => void }) { 
    useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = 'unset'; }; }, []); 
    
    return ( 
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4 animate-fade-in" onClick={onClose}> 
            <div className="bg-white rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}> 
                <button onClick={onClose} className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 z-10"> <X size={20} /> </button> 
                <img src={match.avatar} alt={match.name} className="w-full h-80 object-cover rounded-t-2xl" /> 
                <div className="p-5"> 
                    <div className="flex items-center gap-2"> 
                        <h1 className="text-3xl font-bold text-gray-800">{match.name}</h1> 
                        {match.verified && <CheckCircle className="text-blue-500" fill="white" size={28} />} 
                    </div> 
                    <div className="flex flex-col gap-1 text-gray-600 mt-2 text-sm"> 
                        <div className="flex items-center gap-1.5"><Users size={16} /><p>{match.identity}</p></div> 
                        <div className="flex items-center gap-1.5"><MapPin size={16} /><p>{match.location}</p></div> 
                        <div className="flex items-center gap-1.5"><p>📍 {match.distance} away</p></div> 
                    </div> 
                    <div className="mt-6"> 
                        <h2 className="font-bold text-gray-800">About Me</h2> 
                        <p className="text-gray-600 mt-1">{match.bio}</p> 
                    </div> 
                    <div className="flex flex-wrap gap-2 mt-4 text-sm"> 
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{match.zodiac}</span> 
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{match.mbti}</span> 
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{match.passion}</span> 
                    </div> 
                    <div className="mt-6"> 
                        <h2 className="font-bold text-gray-800">My Interests</h2> 
                        <div className="flex flex-wrap gap-2 mt-2 text-sm"> 
                            {match.interests.map(interest => ( <span key={interest} className="border border-gray-300 text-gray-700 px-3 py-1 rounded-full">{interest}</span> ))} 
                        </div> 
                    </div> 
                </div> 
                <div className="sticky bottom-0 grid grid-cols-2 gap-4 bg-white p-4 border-t border-gray-200"> 
                    <button className="bg-gray-200 text-gray-800 font-bold py-3 rounded-full hover:bg-gray-300 transition-colors">Pass</button> 
                    <button className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-3 rounded-full hover:opacity-90 transition-opacity">Like</button> 
                </div> 
            </div> 
        </div> 
    ) 
}

// =======================================================
// CONTEÚDO PRINCIPAL (Separado para usar Suspense)
// =======================================================

function DatingAppScannerContent() {
  const { language } = useAuth()
  const t = translations[language || "en"]

  // --- ESTADOS ---
  const [pageState, setPageState] = useState<'input' | 'loading' | 'results'>('input');
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [userLocation, setUserLocation] = useState<string>("your city");
  const [timeLeft, setTimeLeft] = useState(5 * 60);

  // --- CARROSSEL LOGIC ---
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000, stopOnInteraction: true })]); 
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false); 
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false); 
  const [selectedIndex, setSelectedIndex] = useState(0); 
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]); 

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]); 
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]); 
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]); 
  
  const onSelect = useCallback(() => { 
    if (!emblaApi) return; 
    setSelectedIndex(emblaApi.selectedScrollSnap()); 
    setPrevBtnEnabled(emblaApi.canScrollPrev()); 
    setNextBtnEnabled(emblaApi.canScrollNext()); 
  }, [emblaApi, setSelectedIndex]); 

  useEffect(() => { 
    if (!emblaApi) return; 
    onSelect(); 
    setScrollSnaps(emblaApi.scrollSnapList()); 
    emblaApi.on("select", onSelect); 
    emblaApi.on("reInit", onSelect); 
  }, [emblaApi, setScrollSnaps, onSelect]); 

  // --- EFEITOS ---
  
  // Timer
  useEffect(() => { 
    if (pageState === 'results' && timeLeft > 0) {
        const timer = setInterval(() => { setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0)); }, 1000); 
        return () => clearInterval(timer); 
    }
  }, [timeLeft, pageState]); 
  
  const formatTime = (seconds: number) => { 
    const minutes = Math.floor(seconds / 60); 
    const remainingSeconds = seconds % 60; 
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`; 
  }

  // Location Fetch
  useEffect(() => {
    if (pageState === 'results') {
      const fetchLocation = async () => {
        try {
          // Aqui usaria sua API de location se existir
          // const response = await fetch('/api/location');
          // const data = await response.json();
          // if (data.city) setUserLocation(data.city);
        } catch (error) { console.error("Could not fetch location."); }
      };
      fetchLocation();
    }
  }, [pageState]);

  // Hotmart Scripts
  useEffect(() => {
    if (pageState === 'results' && typeof (window as any).checkoutElements !== "undefined") {
      try { (window as any).checkoutElements.init("salesFunnel").mount("#hotmart-sales-funnel"); }
      catch (e) { console.error("Failed to mount Hotmart widget:", e); }
    }
  }, [pageState]);

  // --- MOCK DATA LOGIC ---
  const fakeMatches: Match[] = useMemo(() => {
    let baseMatches: Omit<Match, 'location'>[];
    if (selectedGender === 'Male') { baseMatches = femaleMatchesData; } 
    else if (selectedGender === 'Female') { baseMatches = maleMatchesData; } 
    else { baseMatches = defaultMatchesData; }
    return baseMatches.map(match => ({ ...match, location: `Lives in ${userLocation}` }));
  }, [userLocation, selectedGender]);
  
  const censoredPhotos = useMemo(() => {
    if (selectedGender === 'Male') { return femaleCensoredPhotos; }
    if (selectedGender === 'Female') { return maleCensoredPhotos; }
    return defaultCensoredPhotos;
  }, [selectedGender]);

  // --- HANDLERS ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleStartInvestigation = () => {
    setPageState('loading');
    setTimeout(() => { setPageState('results'); }, 3500);
  };

  const genderEmojis: { [key: string]: string } = { 'Male': '👨🏻', 'Female': '👩🏻', 'Non-binary': '🧑🏻' };

  return (
    <DashboardLayout activeTab="dating">
        {selectedMatch && <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />}
        
        {/* Scripts externos (Hotmart) */}
        <Script src="https://checkout.hotmart.com/lib/hotmart-checkout-elements.js" strategy="afterInteractive" />

        <div className="max-w-xl mx-auto space-y-6">
            <FeatureCard 
                title={pageState === 'input' ? t?.dateAppsScannerTitle || "Dating Apps Scanner" : "Dating Profile Scan"} 
                description={pageState === 'input' ? t?.dateAppsScannerDesc : "Analyzing facial features against dating databases..."}
            >
                {/* --- STEP 1: INPUT --- */}
                {pageState === 'input' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex gap-3 text-sm">
                            <AlertTriangle className="text-yellow-600 flex-shrink-0" size={20} />
                            <p className="text-yellow-800">
                                <span className="font-bold">Privacy Warning:</span> Facial recognition scans are powerful. Please ensure you are authorized to search for this person.
                            </p>
                        </div>

                        {/* Image Upload */}
                        <div className="bg-white rounded-xl border-2 border-dashed border-blue-200 p-6 text-center hover:bg-blue-50/50 transition-colors">
                            <h2 className="font-bold text-gray-800 mb-4">1. Upload Target's Photo</h2>
                            <label htmlFor="photo-upload" className="w-40 h-40 mx-auto flex items-center justify-center bg-gray-50 border-2 border-blue-100 rounded-full cursor-pointer overflow-hidden relative shadow-sm hover:scale-105 transition-transform">
                                <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover"/>
                                ) : (
                                    <div className="flex flex-col items-center text-blue-400">
                                        <Camera size={32} />
                                        <span className="text-xs font-bold mt-1">Tap to Upload</span>
                                    </div>
                                )}
                            </label>
                            <p className="text-xs text-gray-400 mt-4">Supports JPG, PNG (Max 5MB)</p>
                        </div>

                        {/* Gender Select */}
                        <div className="text-center">
                            <h2 className="font-bold text-gray-800 mb-3 text-left">2. Select Gender</h2>
                            <div className="grid grid-cols-3 gap-3">
                                {['Male', 'Female', 'Non-binary'].map((gender) => (
                                    <button 
                                        key={gender} 
                                        onClick={() => setSelectedGender(gender)} 
                                        className={`p-3 border rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                                            selectedGender === gender 
                                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                                            : 'border-gray-200 hover:border-gray-300'
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
                            <Search size={20}/>
                            SCAN DATING APPS
                        </button>
                    </div>
                )}

                {/* --- STEP 2: LOADING --- */}
                {pageState === 'loading' && (
                    <div className="text-center py-12 space-y-6 animate-fade-in">
                        <div className="relative w-24 h-24 mx-auto">
                             <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                             <div className="absolute inset-0 rounded-full border-4 border-t-pink-500 animate-spin"></div>
                             {imagePreview && (
                                 <div className="absolute inset-2 rounded-full overflow-hidden">
                                     <img src={imagePreview} className="w-full h-full object-cover opacity-50" alt="target" />
                                 </div>
                             )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Scanning Databases...</h2>
                            <p className="text-sm text-gray-500 mt-2">Checking Tinder, Bumble, Hinge, and 14 others...</p>
                        </div>
                    </div>
                )}

                {/* --- STEP 3: RESULTS --- */}
                {pageState === 'results' && (
                    <div className="space-y-4 animate-fade-in">
                        
                        {/* Banner de Sucesso */}
                        <div className="bg-red-500 text-white p-4 rounded-lg shadow-md flex items-center gap-3">
                            <Zap className="fill-yellow-400 text-yellow-400" size={24} />
                            <div>
                                <h1 className="font-bold text-sm">PROFILE FOUND ON TINDER</h1>
                                <p className="text-xs text-red-100 opacity-90">Status: <span className="font-bold bg-white/20 px-1 rounded">Online Recently</span></p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-4 gap-2">
                            <div className="bg-white p-2 py-3 rounded-lg border text-center shadow-sm">
                                <p className="text-xl font-bold text-red-600">6</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase">Matches</p>
                            </div>
                            <div className="bg-white p-2 py-3 rounded-lg border text-center shadow-sm">
                                <p className="text-xl font-bold text-orange-500">30</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase">Likes</p>
                            </div>
                            <div className="bg-white p-2 py-3 rounded-lg border text-center shadow-sm">
                                <p className="text-xl font-bold text-purple-600">4</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase">Chats</p>
                            </div>
                            <div className="bg-white p-2 py-3 rounded-lg border text-center shadow-sm">
                                <p className="text-xl font-bold text-gray-800">18h</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase">Last Seen</p>
                            </div>
                        </div>

                        {/* Recent Matches List */}
                        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-lg">
                            <div className="flex items-center gap-2 mb-4">
                                <Flame className="text-orange-500 fill-orange-500" size={20} />
                                <h2 className="font-bold">Recent Matches Found</h2>
                            </div>
                            
                            <div className="space-y-3">
                                {fakeMatches.map((match, index) => (
                                    <div 
                                        key={index} 
                                        onClick={() => setSelectedMatch(match)} 
                                        className="flex items-center gap-3 bg-slate-800 p-2 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors border border-slate-700"
                                    >
                                        <img src={match.avatar} alt={match.name} className="w-10 h-10 rounded-full object-cover border border-slate-500" />
                                        <div className="flex-grow min-w-0">
                                            <p className="font-bold text-sm truncate">{match.name}, {match.age}</p>
                                            <p className="text-xs text-gray-400">Active chat detected</p>
                                        </div>
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Censored Carousel */}
                        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-lg">
                            <div className="flex items-center gap-2 mb-3">
                                <Camera className="text-gray-400" size={20} />
                                <h2 className="font-bold">Hidden Photos</h2>
                            </div>
                            
                            <div className="overflow-hidden relative rounded-lg border border-slate-700" ref={emblaRef}>
                                <div className="flex">
                                    {censoredPhotos.map((src, index) => (
                                        <div className="relative flex-[0_0_100%] aspect-video bg-gray-800 overflow-hidden" key={index}>
                                            <img src={src} className="w-full h-full object-cover filter blur-lg opacity-60" alt="Censored content"/>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                                <Lock size={32} className="mb-2" />
                                                <span className="font-bold text-xs tracking-widest bg-black/50 px-2 py-1 rounded">BLOCKED CONTENT</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
                                <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
                            </div>
                            
                            <div className="flex justify-center items-center mt-3 gap-1.5">
                                {scrollSnaps.map((_, index) => (
                                    <button 
                                        key={index} 
                                        onClick={() => scrollTo(index)} 
                                        className={`w-1.5 h-1.5 rounded-full transition-colors ${index === selectedIndex ? 'bg-white' : 'bg-slate-700'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Upsell Card */}
                        <div className="bg-gradient-to-b from-white to-red-50 border border-red-200 p-6 rounded-xl shadow-lg text-center relative overflow-hidden">
                            <div className="mx-auto w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-3 text-blue-600">
                                <Lock className="fill-blue-600" size={24} />
                            </div>
                            
                            <h2 className="text-xl font-bold text-gray-900">Unlock Full Dating Report</h2>
                            <p className="text-xs text-gray-600 mt-2 mb-4">
                                View unblurred photos, read match messages, and see full dating profiles.
                            </p>

                            <div className="bg-red-100 border border-red-300 text-red-800 p-3 rounded-lg mb-4">
                                <div className="flex items-center justify-center gap-1.5 text-xs font-bold mb-1">
                                    <AlertTriangle size={14} />
                                    <span>OFFER EXPIRES IN:</span>
                                </div>
                                <p className="text-3xl font-mono font-bold">{formatTime(timeLeft)}</p>
                            </div>

                            <a 
                                href="https://pay.hotmart.com/B101929057U?checkoutMode=10" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition-transform hover:scale-105"
                            >
                                ACCESS FULL REPORT 🔓
                            </a>
                            
                            <div id="hotmart-sales-funnel" className="w-full pt-4"></div>
                        </div>
                    </div>
                )}
            </FeatureCard>

            {/* Info Card - Apenas no passo 1 */}
            {pageState === 'input' && (
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
// EXPORTAÇÃO DA PÁGINA (COM SUSPENSE WRAPPER)
// =======================================================

export default function DatingAppScannerPage() {
    return (
        <Suspense fallback={
            <DashboardLayout activeTab="dating">
                 <div className="flex items-center justify-center h-96">
                     <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                 </div>
            </DashboardLayout>
        }>
            <DatingAppScannerContent />
        </Suspense>
    )
}

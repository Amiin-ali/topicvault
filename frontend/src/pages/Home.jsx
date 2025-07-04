"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Search,
  BookOpen,
  Users,
  TrendingUp,
  Mail,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  ClipboardList,
  BarChart3,
  Code,
  Cpu,
  Rocket,
  Brain,
  Monitor,
  Database,
  Wifi,
  Play,
  Award,
  Target,
  Lightbulb,
  Trophy,
  Medal,
  Star,
  Sparkles,
  Shield,
  Crown,
  Zap,
  Activity,
  Globe,
  Settings,
  ArrowRight,
  Heart,
  ThumbsUp,
  Eye,
  MapPin,
  Phone,
  AtSign,
} from "lucide-react"

// Add these counter components at the top of the file
const TopicCounter = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/topics")
      .then((res) => res.json())
      .then((data) => setCount(Array.isArray(data) ? data.length : 0))
      .catch(() => setCount(0))
  }, [])

  return <span>{count}+</span>
}

const StudentCounter = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/topics")
      .then((res) => res.json())
      .then((data) => {
        // Estimate students helped (assuming 3-4 students per topic)
        const topicCount = Array.isArray(data) ? data.length : 0
        setCount(Math.floor(topicCount * 3.5))
      })
      .catch(() => setCount(0))
  }, [])

  return <span>{count}+</span>
}

const EvaluationCounter = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/evaluations-report")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const totalEvaluations = data.reduce(
            (sum, report) => sum + (report.evaluations ? report.evaluations.length : 0),
            0,
          )
          setCount(totalEvaluations)
        }
      })
      .catch(() => setCount(0))
  }, [])

  return <span>{count}+</span>
}

const Home = () => {
  const [email, setEmail] = useState("")
  const [subscriptionStatus, setSubscriptionStatus] = useState(null)
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    setIsSubscribing(true)
    setSubscriptionStatus(null)

    try {
      const response = await fetch("http://localhost:5000/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setSubscriptionStatus({ type: "success", message: data.message })
        setEmail("")
      } else {
        setSubscriptionStatus({ type: "error", message: data.message })
      }
    } catch (error) {
      setSubscriptionStatus({
        type: "error",
        message: "Subscription failed. Please try again later.",
      })
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-white dark:bg-gray-900 px-4 overflow-hidden min-h-screen flex items-center transition-colors duration-300 mt-4 mb-10">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/5 dark:bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/5 dark:bg-green-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-gray-900 dark:text-white space-y-10 transition-colors duration-300">
              {/* <div className="space-y-4">
                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">SIU - FECT</h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">Faculty of Computer Science & Technology</p>
                <div className="flex items-center space-x-2">
                  <Crown className="text-green-600 dark:text-green-400" size={16} />
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Excellence in Innovation
                  </span>
                </div>
              </div> */}

              <div className="space-y-6">
                <h1 className="text-6xl md:text-6xl font-black leading-tight text-gray-900 dark:text-white">
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    FECT
                  </span>
                </h1>

                <div className="relative">
                  <h2 className="text-2xl md:text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text">
                    Faculty of Computer Science & Technology
                  </h2>
                </div>
              </div>

              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl flex items-center space-x-3">
                <Rocket className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={28} />
                <span>
                  The Faculty of Computer Science & Technology at Somali International University (SIU) is dedicated to advancing knowledge in computing and IT.
It provides students with a strong foundation in programming, networking, and emerging technologies
                </span>
              </p>

              {/* Tech Stack Icons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
                <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl px-4 py-3 border border-blue-100 dark:border-blue-800">
                  <Brain className="text-blue-600 dark:text-blue-400" size={20} />
                  <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">AI-Powered</span>
                </div>
                <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/30 rounded-xl px-4 py-3 border border-green-100 dark:border-green-800">
                  <Zap className="text-green-600 dark:text-green-400" size={20} />
                  <span className="text-sm font-semibold text-green-800 dark:text-green-300">Ultra Fast</span>
                </div>
                <div className="flex items-center space-x-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl px-4 py-3 border border-yellow-100 dark:border-yellow-800">
                  <Shield className="text-yellow-600 dark:text-yellow-400" size={20} />
                  <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">Secure</span>
                </div>
                <div className="flex items-center space-x-2 bg-purple-50 dark:bg-purple-900/30 rounded-xl px-4 py-3 border border-purple-100 dark:border-purple-800">
                  <Sparkles className="text-purple-600 dark:text-purple-400" size={20} />
                  <span className="text-sm font-semibold text-purple-800 dark:text-purple-300">Smart</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/search"
                  className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors shadow-lg"
                >
                  <Search size={20} />
                  <span>Explore Topics</span>
                </Link>
                <button className="inline-flex items-center justify-center space-x-2 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                  <Play size={20} />
                  <span>Watch Demo</span>
                </button>
              </div>
            </div>

            {/* Right Content - Facebook Video */}
            <div className="relative">
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <iframe
                  src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FSIU.UNIVERSITY%2Fvideos%2F1746666009446000&show_text=false&width=560&t=0"
                  width="100%"
                  height="400"
                  style={{ border: "none", overflow: "hidden" }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  className="rounded-2xl"
                ></iframe>
                <div className="absolute bottom-8 left-8 text-white pointer-events-none">
                  <h3 className="text-2xl font-bold mb-2 flex items-center space-x-2">
                    <Trophy className="text-yellow-400" size={24} />
                    <span>SIU Excellence</span>
                  </h3>
                  <p className="text-lg text-gray-200">University Showcase</p>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-6 shadow-2xl">
                <Medal className="text-white" size={40} />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-6 shadow-2xl">
                <Code className="text-white" size={40} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-800 relative overflow-hidden transition-colors duration-300">
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-3 bg-white dark:bg-gray-700 rounded-full px-8 py-3 border border-gray-200 dark:border-gray-600 mb-8 shadow-sm">
              <Play className="text-blue-600 dark:text-blue-400" size={24} />
              <span className="text-gray-800 dark:text-gray-200 font-bold text-lg">Exclusive SIU Content</span>
              <Sparkles className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-8">
              Experience{" "}
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                SIU Excellence
              </span>
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed flex items-center justify-center space-x-3">
              <Eye className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={28} />
              <span>
                Dive into the world of Computer Science and Technology excellence through our exclusive video content
              </span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-20">
            {/* Main SIU Video */}
            <div className="group relative">
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                <iframe
                  src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2F100054575013658%2Fvideos%2F3022527391358316&show_text=false&width=560&t=0"
                  width="100%"
                  height="350"
                  style={{ border: "none", overflow: "hidden" }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  className="rounded-2xl"
                ></iframe>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <Crown className="text-green-400" size={20} />
                    <span className="text-sm font-bold text-green-400">OFFICIAL SIU</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 flex items-center space-x-2">
                    <Globe className="text-blue-400" size={20} />
                    <span>SIU University Excellence</span>
                  </h3>
                  <p className="text-sm text-gray-300">Celebrating our academic achievements</p>
                </div>
              </div>
            </div>

            {/* second video */}
           <div className="group relative">
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
              <iframe width="656" height="365" src="https://www.youtube.com/embed/Fhq4pCx2wTM" title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <Crown className="text-green-400" size={20} />
                    <span className="text-sm font-bold text-green-400">OFFICIAL SIU</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 flex items-center space-x-2">
                    <Globe className="text-blue-400" size={20} />
                    <span>SIU University Excellence</span>
                  </h3>
                  <p className="text-sm text-gray-300">Celebrating our academic achievements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Section - Football Only */}
      <section className="py-24 px-4 bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/5 dark:bg-green-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/5 dark:bg-blue-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-3 bg-green-50 dark:bg-green-900/30 rounded-full px-8 py-3 border border-green-200 dark:border-green-800 mb-8">
              <Trophy className="text-green-600 dark:text-green-400" size={28} />
              <span className="text-green-800 dark:text-green-300 font-bold text-xl">FECT FOOTBALL EXCELLENCE</span>
              <Medal className="text-green-600 dark:text-green-400" size={28} />
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-8">
              Champions on{" "}
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                The Field
              </span>
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed flex items-center justify-center space-x-3">
              <Activity className="text-green-600 dark:text-green-400 flex-shrink-0" size={28} />
              <span>
                Where athletic excellence meets technological innovation - FECT football team dominating the field!
              </span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Football Team Image */}
            <div className="relative">
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-300">
                <img
                  src="/football-team.jpg"
                  alt="FECT Football Team"
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute bottom-8 left-8 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <Crown className="text-yellow-400" size={20} />
                    <span className="text-sm font-bold text-yellow-400">CHAMPIONS</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 flex items-center space-x-2">
                    <Trophy className="text-green-400" size={24} />
                    <span>FECT Football Team</span>
                  </h3>
                  <p className="text-lg text-gray-200">University league champions</p>
                </div>
              </div>
            </div>

            {/* Football Achievements */}
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                  <Activity className="text-white" size={40} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Trophy className="text-green-600 dark:text-green-400" size={28} />
                  <span>Football Champions</span>
                </h3>
                <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                  <p className="font-semibold text-green-800 dark:text-green-300">
                    𝐓𝐚𝐫𝐭𝐚𝐧𝐤𝐚 𝐊𝐮𝐛𝐛𝐚𝐝𝐝𝐚 𝐂𝐚𝐠𝐭𝐚 𝐊𝐮𝐥𝐥𝐢𝐲𝐚𝐝𝐚𝐡𝐚 𝐉𝐚𝐚𝐦𝐚𝐜𝐚𝐝𝐝𝐚 𝐒𝐈𝐔 𝟐𝟎𝟐𝟓
                  </p>

                  <p className="text-sm">
                    Kulankii koowaad ee cayaarta waxaa galabta wada cayaaray kooxaha labada kulliyadood ee kala ah:
                  </p>

                  <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg space-y-2 text-sm border border-green-100 dark:border-green-800">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                      <span className="font-medium text-sm">
                        𝟏. 𝐊𝐨𝐨𝐱𝐝𝐚 𝐊𝐮𝐥𝐥𝐢𝐲𝐚𝐝𝐝𝐚 𝐈𝐧𝐣𝐢𝐧𝐧𝐞𝐞𝐫𝐢𝐲𝐚𝐝𝐚 𝐢𝐲𝐨 𝐂𝐮𝐥𝐮𝐮𝐦𝐭𝐚 𝐓𝐢𝐤𝐧𝐨𝐥𝐨𝐣𝐢𝐲𝐚𝐝𝐚
                      </span>
                    </div>
                    <p className="ml-4 text-green-800 dark:text-green-300 font-semibold text-sm">𝐤𝐞𝐞𝐧𝐬𝐚𝐭𝐚𝐲 𝟕 𝐠𝐨𝐨𝐥</p>

                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="font-medium text-sm">𝟐. 𝐊𝐨𝐨𝐱𝐝𝐚 𝐊𝐮𝐥𝐥𝐢𝐲𝐚𝐝𝐝𝐚 𝐂𝐮𝐥𝐮𝐮𝐦𝐭𝐚 𝐁𝐞𝐞𝐫𝐚𝐡𝐚 𝐢𝐲𝐨 𝐃𝐞𝐞𝐠𝐚𝐚𝐧𝐤𝐚</span>
                    </div>
                    <p className="ml-4 text-gray-600 dark:text-gray-400 text-sm">𝐤𝐞𝐞𝐧𝐬𝐚𝐭𝐚𝐲 𝟑 𝐠𝐨𝐨𝐥</p>
                  </div>

                  <p className="font-medium text-green-800 dark:text-green-300 text-sm">
                    Gabaggabadii cayaartu waxay guushu raacday kooxda Kulliyadda Injinneeriyada iyo Culuumta
                    Tiknolojiyada oo keensatay 7 gool.
                  </p>

                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Koobkan waxaa soo agaasimay Midowga Ardayda Jaamacadda SIU, wuxuuna muhiim u yahay isdhexgalka
                    ardayda dhigata kulliyadaha kala duwan ee Jaamacadda SIU.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center space-x-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-full px-4 py-2 border border-yellow-200 dark:border-yellow-800">
                    <Medal className="text-yellow-600 dark:text-yellow-400" size={16} />
                    <span className="text-yellow-800 dark:text-yellow-300 text-sm font-bold">3x Champions</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/30 rounded-full px-4 py-2 border border-green-200 dark:border-green-800">
                    <Star className="text-green-600 dark:text-green-400" size={16} />
                    <span className="text-green-800 dark:text-green-300 text-sm font-bold">Undefeated</span>
                  </div>
                </div>
              </div>

              {/* Football Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-300">
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                  <BarChart3 className="text-green-600 dark:text-green-400" size={24} />
                  <span>Season Statistics</span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-black text-green-600 dark:text-green-400 mb-2">25</div>
                    <div className="text-gray-700 dark:text-gray-300 font-bold text-sm">Matches Won</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-2">85</div>
                    <div className="text-gray-700 dark:text-gray-300 font-bold text-sm">Goals Scored</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-yellow-600 dark:text-yellow-400 mb-2">15</div>
                    <div className="text-gray-700 dark:text-gray-300 font-bold text-sm">Clean Sheets</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mb-2">30</div>
                    <div className="text-gray-700 dark:text-gray-300 font-bold text-sm">Team Players</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-800 relative overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-3 bg-white dark:bg-gray-700 rounded-full px-8 py-3 border border-gray-200 dark:border-gray-600 mb-8 shadow-sm">
              <GraduationCap className="text-blue-600 dark:text-blue-400" size={24} />
              <span className="text-gray-800 dark:text-gray-200 font-bold text-lg">Academic Excellence</span>
              <Star className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-8">
              Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Departments
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed flex items-center justify-center space-x-3">
              <Target className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={24} />
              <span>Comprehensive programs designed to prepare you for the future of technology and innovation</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Computer Science */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-3xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Code className="text-white" size={36} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Cpu className="text-blue-600 dark:text-blue-400" size={24} />
                <span>Computer Science</span>
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed flex items-start space-x-2">
                <Rocket className="text-blue-500 flex-shrink-0 mt-1" size={16} />
                <span>
                  Advanced programming, algorithms, AI, machine learning, and cutting-edge software engineering
                </span>
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  <span className="font-medium">Software Development</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  <span className="font-medium">Artificial Intelligence</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  <span className="font-medium">Data Science & Analytics</span>
                </div>
              </div>
            </div>

            {/* Information Technology */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-3xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-green-700 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Monitor className="text-white" size={36} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Globe className="text-green-600 dark:text-green-400" size={24} />
                <span>Information Technology</span>
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed flex items-start space-x-2">
                <Shield className="text-green-500 flex-shrink-0 mt-1" size={16} />
                <span>Network administration, cybersecurity, database management, and cloud infrastructure</span>
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-3 h-3 bg-green-600 dark:bg-green-400 rounded-full"></div>
                  <span className="font-medium">Cybersecurity</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-3 h-3 bg-green-600 dark:bg-green-400 rounded-full"></div>
                  <span className="font-medium">Network Management</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-3 h-3 bg-green-600 dark:bg-green-400 rounded-full"></div>
                  <span className="font-medium">Cloud Computing</span>
                </div>
              </div>
            </div>

            {/* Software Engineering */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-3xl p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Settings className="text-white" size={36} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Code className="text-purple-600 dark:text-purple-400" size={24} />
                <span>Software Engineering</span>
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed flex items-start space-x-2">
                <Zap className="text-purple-500 flex-shrink-0 mt-1" size={16} />
                <span>Full-stack development, system architecture, DevOps, and agile methodologies</span>
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-3 h-3 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                  <span className="font-medium">Full-Stack Development</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-3 h-3 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                  <span className="font-medium">System Architecture</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-3 h-3 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                  <span className="font-medium">DevOps & Cloud</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0">
          <div className="absolute top-32 left-32 w-96 h-96 bg-blue-500/5 dark:bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 right-32 w-96 h-96 bg-green-500/5 dark:bg-green-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-3 bg-blue-50 dark:bg-blue-900/30 rounded-full px-8 py-3 border border-blue-200 dark:border-blue-800 mb-8">
              <Rocket className="text-blue-600 dark:text-blue-400" size={24} />
              <span className="text-blue-800 dark:text-blue-300 font-bold text-lg">Next-Gen Platform</span>
              <Sparkles className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-8">
              Revolutionary{" "}
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Research Hub
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed flex items-center justify-center space-x-3">
              <Brain className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={24} />
              <span>
                TopicVault leverages cutting-edge AI and machine learning to revolutionize how FECT students discover,
                validate, and dominate their research projects
              </span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI-Powered Search */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Brain className="text-white" size={36} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Search className="text-blue-600 dark:text-blue-400" size={24} />
                <span>AI-Powered Search</span>
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Advanced semantic search with natural language processing, supporting multiple languages with
                intelligent auto-correction
              </p>
              <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                <span>Explore AI Magic</span>
                <ArrowRight className="ml-2" size={16} />
              </div>
            </div>

            {/* Smart Validation */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-green-700 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Target className="text-white" size={36} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Shield className="text-green-600 dark:text-green-400" size={24} />
                <span>Smart Validation</span>
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Intelligent duplicate detection and topic similarity analysis to ensure research originality and
                academic integrity
              </p>
              <div className="flex items-center text-green-600 dark:text-green-400 font-semibold group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                <span>Discover More</span>
                <Lightbulb className="ml-2" size={16} />
              </div>
            </div>

            {/* Comprehensive Database */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Database className="text-white" size={36} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <BookOpen className="text-purple-600 dark:text-purple-400" size={24} />
                <span>Mega Database</span>
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Extensive repository of computer science and technology projects with advanced categorization and
                filtering
              </p>
              <div className="flex items-center text-purple-600 dark:text-purple-400 font-semibold group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                <span>Browse Database</span>
                <ArrowRight className="ml-2" size={16} />
              </div>
            </div>

            {/* Evaluation System */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-orange-700 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <ClipboardList className="text-white" size={36} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Award className="text-orange-600 dark:text-orange-400" size={24} />
                <span>Digital Evaluation</span>
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Streamlined evaluation process with customizable rubrics, automated scoring, and real-time feedback
                systems
              </p>
              <div className="flex items-center text-orange-600 dark:text-orange-400 font-semibold group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors">
                <span>View System</span>
                <Settings className="ml-2" size={16} />
              </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <BarChart3 className="text-white" size={36} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <TrendingUp className="text-indigo-600 dark:text-indigo-400" size={24} />
                <span>Analytics Hub</span>
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Real-time insights, comprehensive reporting, and predictive analytics for faculty and administrative
                oversight
              </p>
              <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-semibold group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                <span>View Analytics</span>
                <BarChart3 className="ml-2" size={16} />
              </div>
            </div>

            {/* Collaboration Tools */}
            <div className="group bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-r from-teal-600 to-teal-700 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="text-white" size={36} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Heart className="text-teal-600 dark:text-teal-400" size={24} />
                <span>Collaboration Hub</span>
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Connect students, supervisors, and evaluators in a unified platform for seamless communication and
                teamwork
              </p>
              <div className="flex items-center text-teal-600 dark:text-teal-400 font-semibold group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                <span>Join Community</span>
                <Wifi className="ml-2" size={16} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-800 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/5 dark:bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500/5 dark:bg-green-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-3 bg-white dark:bg-gray-700 rounded-full px-8 py-3 border border-gray-200 dark:border-gray-600 mb-8 shadow-sm">
              <Trophy className="text-green-600 dark:text-green-400" size={28} />
              <span className="text-gray-800 dark:text-gray-200 font-bold text-xl">FECT ACHIEVEMENTS</span>
              <Crown className="text-blue-600 dark:text-blue-400" size={28} />
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-8">
              Empowering{" "}
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Excellence
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed flex items-center justify-center space-x-3">
              <Star className="text-green-600 dark:text-green-400 flex-shrink-0" size={24} />
              <span>
                Supporting innovation and academic achievement across all computer science and technology disciplines
              </span>
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <BookOpen className="text-white" size={48} />
              </div>
              <div className="text-5xl font-black text-gray-900 dark:text-white mb-4">
                <TopicCounter />
              </div>
              <div className="text-gray-700 dark:text-gray-300 font-bold text-lg mb-2">Research Topics</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Across all FECT departments</div>
            </div>

            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-green-700 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <GraduationCap className="text-white" size={48} />
              </div>
              <div className="text-5xl font-black text-gray-900 dark:text-white mb-4">
                <StudentCounter />
              </div>
              <div className="text-gray-700 dark:text-gray-300 font-bold text-lg mb-2">Students Empowered</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Successful project completions</div>
            </div>

            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <ClipboardList className="text-white" size={48} />
              </div>
              <div className="text-5xl font-black text-gray-900 dark:text-white mb-4">
                <EvaluationCounter />
              </div>
              <div className="text-gray-700 dark:text-gray-300 font-bold text-lg mb-2">Evaluations Done</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Quality assessments completed</div>
            </div>

            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-600 to-orange-700 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Award className="text-white" size={48} />
              </div>
              <div className="text-5xl font-black text-gray-900 dark:text-white mb-4">99%</div>
              <div className="text-gray-700 dark:text-gray-300 font-bold text-lg mb-2">Success Rate</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Project approval excellence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-blue-600 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center text-white">
          <div className="mb-16">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Mail className="text-white" size={48} />
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-8">
              Stay Connected with{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">FECT</span>
            </h2>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed flex items-center justify-center space-x-3">
              <Rocket className="text-yellow-400 flex-shrink-0" size={24} />
              <span>
                Subscribe to receive the latest updates on research opportunities, technological breakthroughs, sports
                achievements, and academic excellence from the Faculty of Computer Science and Technology
              </span>
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="max-w-lg mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your FECT email address"
                className="flex-1 px-8 py-5 rounded-3xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 bg-white/95 backdrop-blur-sm font-medium text-lg shadow-lg"
                required
                disabled={isSubscribing}
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-10 py-5 rounded-3xl font-bold text-lg hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl flex items-center justify-center space-x-2"
              >
                {isSubscribing ? (
                  <>
                    <Activity className="animate-spin" size={20} />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <Rocket size={20} />
                    <span>Subscribe</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {subscriptionStatus && (
            <div className="max-w-md mx-auto">
              <div
                className={`relative overflow-hidden rounded-3xl p-8 backdrop-blur-sm border-2 transform transition-all duration-300 shadow-2xl ${
                  subscriptionStatus.type === "success"
                    ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/40 shadow-green-500/20"
                    : "bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-400/40 shadow-red-500/20"
                }`}
              >
                <div className="flex items-center justify-center space-x-4">
                  <div
                    className={`p-3 rounded-full ${
                      subscriptionStatus.type === "success" ? "bg-green-500/30" : "bg-red-500/30"
                    }`}
                  >
                    {subscriptionStatus.type === "success" ? (
                      <CheckCircle size={32} className="text-green-300" />
                    ) : (
                      <AlertCircle size={32} className="text-red-300" />
                    )}
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-xl mb-2 flex items-center space-x-2">
                      {subscriptionStatus.type === "success" ? (
                        <>
                          <ThumbsUp className="text-green-400" size={20} />
                          <span>Welcome to FECT!</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="text-red-400" size={20} />
                          <span>Oops!</span>
                        </>
                      )}
                    </div>
                    <div className="text-white/90">{subscriptionStatus.message}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-20 px-4 relative overflow-hidden transition-colors duration-300">
        <div className="relative max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center space-x-4 mb-10">
                <div className="relative">
                  <img src="/siu-logo.png" alt="SIU Logo" className="h-20 w-auto relative z-10" />
                </div>
                <div>
                  <div className="text-3xl font-black">TopicVault</div>
                  <div className="text-blue-400 font-bold text-lg">Faculty of Computer Science & Technology</div>
                  <div className="text-sm text-gray-400">Somali International University</div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Crown className="text-green-400" size={16} />
                    <span className="text-xs text-green-400 font-medium">Excellence in Innovation</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 max-w-md leading-relaxed text-lg flex items-start space-x-2">
                <Rocket className="text-blue-400 flex-shrink-0 mt-1" size={20} />
                <span>
                  Pioneering the future of technology education in Somalia through innovative research, cutting-edge
                  curriculum, world-class facilities, and championship sports programs.
                </span>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-8 text-blue-400 flex items-center space-x-2">
                <GraduationCap size={24} />
                <span>Academic Programs</span>
              </h3>
              <div className="space-y-4">
                <div className="text-gray-400 hover:text-white transition-colors cursor-pointer font-medium flex items-center space-x-2">
                  <Code size={16} />
                  <span>Computer Science</span>
                </div>
                <div className="text-gray-400 hover:text-white transition-colors cursor-pointer font-medium flex items-center space-x-2">
                  <Monitor size={16} />
                  <span>Information Technology</span>
                </div>
                <div className="text-gray-400 hover:text-white transition-colors cursor-pointer font-medium flex items-center space-x-2">
                  <Settings size={16} />
                  <span>Software Engineering</span>
                </div>
                <div className="text-gray-400 hover:text-white transition-colors cursor-pointer font-medium flex items-center space-x-2">
                  <Sparkles size={16} />
                  <span>Digital Innovation</span>
                </div>
                <Link
                  to="/search"
                  className="block text-blue-400 hover:text-blue-300 transition-colors font-bold text-lg flex items-center space-x-2"
                >
                  <Search size={16} />
                  <span>Research Topics</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-8 text-blue-400 flex items-center space-x-2">
                <Mail size={24} />
                <span>Contact FECT</span>
              </h3>
              <div className="space-y-4 text-gray-400">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span className="font-medium">FECT Building, SIU Campus</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="text-blue-400" size={16} />
                  <span className="font-medium">Mogadishu, Somalia</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="text-green-400" size={16} />
                  <span className="font-medium">+252 61 FECT (3328)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <AtSign className="text-blue-400" size={16} />
                  <span className="font-medium">fect@siu.edu.so</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-16 pt-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-6 md:mb-0 text-lg">
                &copy; {new Date().getFullYear()} Faculty of Computer Science & Technology - SIU. All rights reserved.
              </p>
              <div className="flex items-center space-x-8">
                <div className="text-sm text-gray-500 flex items-center space-x-2">
                  <Sparkles className="text-blue-400" size={16} />
                  <span>Powered by TopicVault AI</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Brain className="text-blue-400" size={20} />
                  <span className="text-sm text-gray-500 font-medium">AI-Enhanced Platform</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="text-green-400" size={20} />
                  <span className="text-sm text-gray-500 font-medium">Champions in Tech & Sports</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home

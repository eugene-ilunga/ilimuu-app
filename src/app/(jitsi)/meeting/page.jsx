"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Sparkles, Play } from "lucide-react"
import { VideoIcon, Monitor, MessageCircle, Radio, Hand, Settings, Zap } from "lucide-react"

export default function HomePage() {
  const [roomName, setRoomName] = useState("")
  const router = useRouter()

  const handleCreateRoom = () => {
    if (roomName.trim()) {
      const sanitizedRoomName = roomName.trim().replace(/[^a-zA-Z0-9-_]/g, "-")
      router.push(`/meeting/${sanitizedRoomName}`)
    }
  }

  const handleJoinRoom = () => {
    if (roomName.trim()) {
      const sanitizedRoomName = roomName.trim().replace(/[^a-zA-Z0-9-_]/g, "-")
      router.push(`/meeting/${sanitizedRoomName}`)
    }
  }

  const generateRandomRoom = () => {
    const randomId = Math.random().toString(36).substring(2, 8)
    setRoomName(`room-${randomId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12">
        <div className="w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12">
        <div className="w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header with Logo - Animated */}
        <header className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative animate-bounce-slow">
              <Image
                src="/assets/icon/logo.png"
                alt="Smart Meeting Logo"
                width={120}
                height={60}
                className="rounded-xl shadow-lg lg:w-[120px] w-[100px] lg:h-[60px] h-[50px] object-contain bg-white/80 backdrop-blur-sm p-2 hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-25 animate-pulse" />
              {/* Floating particles around logo */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400 rounded-full animate-ping" />
              <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-indigo-400 rounded-full animate-ping animation-delay-1000" />
            </div>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6 animate-slide-up">
            Smart Video Meetings
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-300">
            Connect, collaborate, and create together with our next-generation video conferencing platform
          </p>
        </header>

        {/* Main Meeting Card - Enhanced Animation */}
        <div className="max-w-lg mx-auto mb-16 animate-slide-up animation-delay-500">
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm hover:shadow-3xl hover:scale-105 transition-all duration-500 relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 animate-gradient-x" />
            <CardHeader className="text-center pb-4 relative z-10">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <Play className="h-6 w-6 text-blue-600 animate-pulse" />
                Start Your Meeting
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                Create a new room or join an existing meeting instantly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="relative group">
                <Input
                  type="text"
                  placeholder="Enter room name or meeting ID"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleCreateRoom()}
                  className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl group-hover:border-blue-300 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleCreateRoom}
                  className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                  disabled={!roomName.trim()}
                >
                  Create Room
                </Button>
                <Button
                  onClick={handleJoinRoom}
                  variant="outline"
                  className="h-12 border-2 border-gray-300 hover:border-blue-500 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 hover:scale-105 active:scale-95"
                  disabled={!roomName.trim()}
                >
                  Join Room
                </Button>
              </div>
              <Button
                onClick={generateRandomRoom}
                variant="ghost"
                className="w-full h-11 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                <Sparkles className="h-4 w-4 animate-spin-slow" />
                Generate Random Room ID
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid - Staggered Animation */}
        <div className="max-w-7xl mx-auto animate-slide-up animation-delay-700">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4 animate-slide-up animation-delay-800">
              Everything You Need for Perfect Meetings
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-slide-up animation-delay-900">
              Powerful features designed to make your video meetings seamless, secure, and productive
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-2 hover:rotate-1 animate-slide-up animation-delay-1000">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <Play className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                      One-Click Video Meetings
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Start or join live video meetings directly from your platform. No app install required — works in
                      any browser.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-2 hover:-rotate-1 animate-slide-up animation-delay-1100">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-md flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors duration-300">
                      Secure & Private Meetings
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      End-to-end encryption support, password-protected rooms, and lobby mode for controlled access.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-2 hover:rotate-1 animate-slide-up animation-delay-1200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-md flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <VideoIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors duration-300">
                      High-Quality Video & Audio
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      HD video with automatic quality adjustment and background noise suppression for crystal-clear
                      communication.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-2 hover:-rotate-1 animate-slide-up animation-delay-1300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg shadow-md flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <Monitor className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-orange-700 transition-colors duration-300">
                      Screen Sharing
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Share your full screen, app window, or browser tab. Perfect for classes, demos, and presentations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-2 hover:rotate-1 animate-slide-up animation-delay-1400">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg shadow-md flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-cyan-700 transition-colors duration-300">
                      Live Chat During Meetings
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Real-time group chat with emojis, mentions, and notifications to enhance collaboration.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-2 hover:-rotate-1 animate-slide-up animation-delay-1500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg shadow-md flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <Radio className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-pink-700 transition-colors duration-300">
                      Recording & Live Streaming
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Record sessions or stream to YouTube and other platforms. Ideal for webinars and recorded classes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 8 */}
            <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-2 hover:rotate-1 animate-slide-up animation-delay-1600">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg shadow-md flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <Hand className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-yellow-700 transition-colors duration-300">
                      Raise Hand & Participant Controls
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Users can raise hands to speak while moderators control muting, removal, and meeting flow.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 11 */}
            <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-2 hover:-rotate-1 animate-slide-up animation-delay-1700">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg shadow-md flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors duration-300">
                      Real-Time Moderation Tools
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Control who can speak, share screen, or record. Enable lobby mode and assign moderators.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 12 */}
            <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:-translate-y-2 hover:rotate-1 animate-slide-up animation-delay-1800">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg shadow-md flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors duration-300">
                      Chat + Video + Collaboration in One
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Run classes, team meetings, interviews, or support sessions — all from one unified platform.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer CTA - Animated */}
        <div className="text-center mt-16 animate-slide-up animation-delay-2000">
          <p className="text-gray-500 text-sm hover:text-gray-700 transition-colors duration-300">
            Trusted by thousands of teams worldwide • No credit card required
          </p>
        </div>
      </div>
    </div>
  )
}

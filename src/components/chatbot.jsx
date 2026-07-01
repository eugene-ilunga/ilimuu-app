"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, X, Minimize2, MessageCircle, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

const CHATBOT_NAME = "Assistant ELIMUU"
const CHATBOT_AVATAR = "/assets/default-avatar.png"

// Knowledge base for the chatbot
const knowledgeBase = {
  greetings: {
    patterns: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"],
    responses: [
      "Bonjour ! 👋 Je suis là pour vous aider à découvrir ELIMUU. Comment puis-je vous assister aujourd'hui ?",
      "Salut ! Bienvenue sur ELIMUU. Que souhaitez-vous savoir ?",
      "Bonjour ! Je suis votre assistant ELIMUU. N'hésitez pas à me poser des questions sur notre plateforme !"
    ]
  },
  system: {
    patterns: ["how does the system work", "how does this work", "how the system works", "explain the system", "what is this platform"],
    responses: [
      "ELIMUU est une plateforme d'apprentissage numérique où vous pouvez :\n\n📚 **Parcourir les formations** : Explorez un large choix de cours dans divers domaines\n🎓 **Rejoindre des Bootcamps** : Participez à des programmes intensifs structurés\n👨‍🏫 **Apprendre avec des formateurs** : Accédez à des contenus experts et bénéficiez de conseils de professionnels\n💼 **Mentorat** : Connectez-vous avec des mentors pour un accompagnement personnalisé\n\nVous pouvez parcourir les formations, vous y inscrire, suivre votre progression et obtenir des certificats. Souhaitez-vous en savoir plus sur les cours ou les bootcamps ?"
    ]
  },
  courses: {
    patterns: ["how do courses work", "how courses work", "what are courses", "explain courses", "course enrollment", "how to enroll in course"],
    responses: [
      "Voici comment fonctionnent les cours sur ELIMUU :\n\n📖 **Parcourir et choisir** : Parcourez les formations disponibles, lisez les descriptions et vérifiez les notes\n💰 **Achat** : Une fois que vous trouvez une formation qui vous intéresse, vous pouvez l'acheter directement\n📝 **Apprenez à votre rythme** : Accédez aux supports de cours, vidéos et ressources à tout moment\n📊 **Suivez votre progression** : Surveillez votre avancement et terminez les devoirs\n🎓 **Obtenez un certificat** : Recevez un certificat à la fin de la formation\n\nLes cours sont accessibles à votre rythme. Vous voulez en savoir plus sur les bootcamps ?"
    ]
  },
  bootcamps: {
    patterns: ["how do bootcamps work", "how bootcamps work", "what are bootcamps", "explain bootcamps", "bootcamp enrollment", "how to enroll in bootcamp", "bootcamp application"],
    responses: [
      "Les bootcamps sont des programmes d'apprentissage intensifs structurés avec les caractéristiques suivantes :\n\n📅 **Calendrier structuré** : Les bootcamps ont des dates de début et de fin spécifiques avec des sessions planifiées\n📋 **Processus de candidature** : Vous devez postuler avec une lettre de motivation, votre niveau d'expérience et vos objectifs\n👥 **Places limitées** : Les bootcamps ont un nombre maximum d'étudiants pour une attention personnalisée\n📈 **Apprentissage par phases** : Progressez à travers des phases structurées avec des projets et des évaluations\n👨‍🏫 **Encadré par un formateur** : Apprenez directement avec des instructeurs expérimentés\n📊 **Suivi de progression** : Suivez votre avancement à travers différentes phases et projets\n\nLes bootcamps sont plus intensifs que les cours et nécessitent un engagement. Souhaitez-vous en savoir plus sur le processus d'inscription ?"
    ]
  },
  enrollment: {
    patterns: ["how to enroll", "enrollment process", "how to apply", "application process", "how do I enroll"],
    responses: [
      "Le processus d'inscription dépend de ce que vous souhaitez rejoindre :\n\n**Pour les cours :**\n1. Parcourez et sélectionnez un cours\n2. Cliquez sur 'S'inscrire' ou 'Acheter'\n3. Effectuez le paiement\n4. Commencez à apprendre immédiatement !\n\n**Pour les Bootcamps :**\n1. Trouvez un bootcamp qui vous intéresse\n2. Cliquez sur 'Postuler' ou 'S'inscrire'\n3. Remplissez le formulaire de candidature (lettre de motivation, niveau d'expérience, objectifs)\n4. Soumettez votre candidature\n5. Attendez l'approbation (ou payez si c'est un bootcamp payant)\n6. Une fois accepté, vous aurez accès à tout le contenu du bootcamp\n\nBesoin d'aide sur un aspect particulier de l'inscription ?"
    ]
  },
  payment: {
    patterns: ["payment", "how to pay", "pricing", "cost", "price", "how much"],
    responses: [
      "Options de paiement sur ELIMUU :\n\n💰 **Tarifs des cours** : Les cours ont des prix individuels fixés par les formateurs. Les prix varient selon le contenu et la durée.\n💳 **Moyens de paiement** : Nous acceptons plusieurs méthodes de paiement : Mobile Money, cartes bancaires, virements et autres passerelles sécurisées\n🎓 **Tarifs des Bootcamps** : Les bootcamps peuvent être gratuits ou payants selon le programme\n\nTous les paiements sont sécurisés et traités via des passerelles de confiance. Vous verrez le prix exact avant de finaliser votre achat. Besoin de plus de détails ?"
    ]
  },
  help: {
    patterns: ["help", "support", "contact", "need help", "assistance"],
    responses: [
      "Je suis là pour vous aider ! Je peux répondre à vos questions sur :\n\n✅ Comment fonctionne la plateforme\n✅ Les cours et leur fonctionnement\n✅ Les bootcamps et l'inscription\n✅ Les paiements et tarifs\n✅ Les informations générales\n\nVous pouvez également contacter notre équipe d'assistance via les coordonnées fournies sur la plateforme. Que souhaitez-vous savoir de plus ?"
    ]
  },
  default: {
    responses: [
      "Je n'ai pas bien compris votre question. Pouvez-vous la reformuler ? Je peux vous aider avec :\n\n• Le fonctionnement de la plateforme\n• Les cours disponibles\n• Les bootcamps\n• Le processus d'inscription\n• Les informations de paiement\n\nEssayez de demander : 'Comment fonctionnent les cours ?' ou 'Qu'est-ce qu'un bootcamp ?'"
    ]
  }
}

// Function to find the best matching response
const findResponse = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase().trim()
  
  // Check each category
  for (const [category, data] of Object.entries(knowledgeBase)) {
    if (category === "default") continue
    
    // Check if any pattern matches
    const matches = data.patterns.some(pattern => 
      lowerMessage.includes(pattern.toLowerCase())
    )
    
    if (matches) {
      const responses = data.responses
      return responses[Math.floor(Math.random() * responses.length)]
    }
  }
  
  // Return default response
  return knowledgeBase.default.responses[0]
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour ! 👋 Je suis votre assistant ELIMUU. Je peux vous aider à comprendre comment fonctionne notre plateforme, comment suivre des formations et bien plus encore. Comment puis-je vous assister aujourd'hui ?",
      sender: "bot",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current && isOpen) {
      const viewport = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight
      }
    }
  }, [messages, isOpen])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const handleSendMessage = () => {
    const trimmedMessage = inputMessage.trim()
    if (!trimmedMessage || isTyping) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: trimmedMessage,
      sender: "user",
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate bot thinking and respond
    setTimeout(() => {
      const botResponse = findResponse(trimmedMessage)
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: "bot",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 800) // Simulate typing delay
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChat = () => {
    if (isOpen) {
      setIsMinimized(!isMinimized)
    } else {
      setIsOpen(true)
      setIsMinimized(false)
    }
  }

  const closeChat = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[10000]">
        <Button
          onClick={toggleChat}
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center p-0"
          size="lg"
          aria-label="Open chatbot"
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" strokeWidth={2.5} />
        </Button>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[10000] transition-all duration-300",
        isMinimized ? "h-16" : "h-[85vh] sm:h-[600px]",
        "w-full sm:w-[380px] sm:max-w-[380px] sm:rounded-lg"
      )}
    >
      <div className="h-full flex flex-col bg-white sm:rounded-lg shadow-2xl border border-gray-200 overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 sm:p-4 flex items-center justify-between flex-shrink-0 relative z-10">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-white">
              <AvatarImage src={CHATBOT_AVATAR} alt={CHATBOT_NAME} />
              <AvatarFallback className="bg-white text-blue-600 font-semibold">
                <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm sm:text-base">{CHATBOT_NAME}</h3>
              <p className="text-xs text-blue-100 hidden sm:block">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={toggleChat}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              onClick={closeChat}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-3 sm:p-4 bg-gray-50">
              <div className="space-y-3 sm:space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.sender === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] sm:max-w-[80%] rounded-lg p-2.5 sm:p-3 shadow-sm",
                        message.sender === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-white text-gray-900 border border-gray-200"
                      )}
                    >
                      {message.sender === "bot" && (
                        <div className="flex items-center space-x-2 mb-1">
                          <Bot className="h-3 w-3 text-blue-600" />
                          <span className="text-xs font-semibold text-blue-600">
                            {CHATBOT_NAME}
                          </span>
                        </div>
                      )}
                      <p className="text-xs sm:text-sm whitespace-pre-line">{message.text}</p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          message.sender === "user"
                            ? "text-blue-100"
                            : "text-gray-500"
                        )}
                      >
                        {message.timestamp.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-900 border border-gray-200 rounded-lg p-3 shadow-sm">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-3 sm:p-4 border-t bg-white flex-shrink-0">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 text-sm sm:text-base"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 h-10 w-10 sm:h-auto sm:w-auto sm:px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

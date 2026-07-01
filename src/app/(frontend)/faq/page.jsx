'use client'

import React, { useState, useEffect } from "react"
import { Search, HelpCircle, ChevronDown, Mail, CheckCircle, MessageCircle } from "lucide-react"

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  const allFaqs = [
    { category: "Général", question: "Qu'est-ce qu'ELIMUU ?", answer: "ELIMUU est une plateforme numérique d'apprentissage conçue pour permettre aux étudiants, professionnels, entreprises et organisations d'accéder à des formations de qualité, de développer leurs compétences et d'obtenir des certifications reconnues. Grâce à ELIMUU, apprendre devient simple, flexible et accessible à tout moment." },
    { category: "Inscription", question: "Comment créer un compte sur ELIMUU ?", answer: "Cliquez sur « S'inscrire », renseignez vos informations personnelles (nom, adresse e-mail ou numéro de téléphone), créez un mot de passe sécurisé puis validez votre inscription pour accéder à votre espace personnel." },
    { category: "Inscription", question: "L'inscription sur ELIMUU est-elle gratuite ?", answer: "Oui. La création d'un compte est entièrement gratuite. Certaines formations sont gratuites tandis que d'autres nécessitent un paiement avant d'y accéder." },
    { category: "Formation", question: "Comment m'inscrire à une formation ?", answer: "Connectez-vous à votre compte, recherchez la formation qui vous intéresse, consultez sa présentation puis cliquez sur « S'inscrire » ou « Acheter maintenant » selon le type de formation." },
    { category: "Formation", question: "ELIMUU propose-t-elle des formations gratuites ?", answer: "Oui. ELIMUU met à disposition un large catalogue de formations gratuites ainsi que des formations premium destinées aux particuliers, étudiants, professionnels et entreprises." },
    { category: "Paiement", question: "Quels sont les moyens de paiement disponibles ?", answer: "Selon votre pays, vous pouvez effectuer vos paiements via Mobile Money, carte bancaire, virement bancaire ou tout autre moyen de paiement pris en charge par la plateforme." },
    { category: "Plateforme", question: "Puis-je suivre les cours depuis mon téléphone ?", answer: "Oui. ELIMUU est accessible sur smartphone, tablette et ordinateur afin de vous permettre d'apprendre où que vous soyez et quand vous le souhaitez." },
    { category: "Formation", question: "Puis-je apprendre à mon propre rythme ?", answer: "Oui. Les formations sont disponibles 24 heures sur 24 et 7 jours sur 7. Vous avancez selon votre propre rythme et votre disponibilité." },
    { category: "Certification", question: "Vais-je obtenir un certificat après la formation ?", answer: "Oui. Après avoir terminé avec succès une formation et satisfait aux conditions d'évaluation, vous pourrez recevoir un certificat numérique correspondant à la formation suivie." },
    { category: "Formation", question: "Comment suivre ma progression ?", answer: "Votre tableau de bord personnel affiche votre progression, les modules terminés, vos résultats aux évaluations ainsi que les formations en cours et celles déjà complétées." },
    { category: "Formation", question: "Puis-je reprendre une formation là où je l'avais laissée ?", answer: "Oui. ELIMUU enregistre automatiquement votre progression afin que vous puissiez reprendre votre apprentissage exactement au point où vous vous êtes arrêté." },
    { category: "Formateur", question: "Comment poser des questions à un formateur ?", answer: "Selon les fonctionnalités disponibles, vous pouvez échanger avec les formateurs via la messagerie, les espaces de discussion ou les commentaires intégrés aux formations." },
    { category: "Compte", question: "Que faire si j'oublie mon mot de passe ?", answer: "Cliquez sur « Mot de passe oublié », puis suivez les instructions envoyées par e-mail ou SMS afin de créer un nouveau mot de passe sécurisé." },
    { category: "Formateur", question: "Puis-je devenir formateur sur ELIMUU ?", answer: "Oui. Les enseignants, experts, consultants et professionnels peuvent proposer leurs formations sur ELIMUU après validation de leur profil et de leurs contenus par l'équipe de la plateforme." },
    { category: "Assistance", question: "Comment contacter le service d'assistance ?", answer: "Notre équipe d'assistance est à votre disposition pour répondre à toutes vos questions concernant votre compte, vos paiements, vos formations ou tout problème technique. Vous pouvez nous contacter directement depuis la plateforme via les différents canaux de support disponibles." },
  ]

  const categories = ["Toutes", ...new Set(allFaqs.map(faq => faq.category))]

  const filteredFaqs = allFaqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-[#5F0EB3] via-purple-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/bg-image/popular-bg.png')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute top-20 -right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-10 left-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6 border border-white/20">
              <HelpCircle className="w-5 h-5 text-purple-200" />
              <span className="text-sm font-medium tracking-wider uppercase">FAQ — ELIMUU</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Foire Aux <span className="text-purple-300">Questions</span>
            </h1>
            <p className="text-lg text-purple-200 max-w-2xl mx-auto leading-relaxed">
              Trouvez rapidement des réponses à toutes vos questions sur ELIMUU, nos formations et nos services.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-purple-200">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> 15 questions</span>
              <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
              <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> 8 catégories</span>
            </div>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-t from-white to-transparent relative z-10"></div>
      </div>

      {/* Contenu */}
      <div className="container mx-auto px-4 py-12 -mt-8 relative z-20">
        <div className="max-w-4xl mx-auto">
          {/* Barre de recherche */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-10">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Questions */}
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
              <HelpCircle className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune question trouvée</h3>
              <p className="text-gray-500">Essayez de modifier votre recherche</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-3 py-1 text-xs font-medium bg-purple-50 text-[#5F0EB3] rounded-full">
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#5F0EB3] transition-colors">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`} />
                  </button>
                  <div className={`transition-all duration-300 overflow-hidden ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#5F0EB3]/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <MessageCircle className="w-4 h-4 text-[#5F0EB3]" />
                        </div>
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA Contact */}
          <div className="mt-12 bg-gradient-to-r from-[#5F0EB3] to-purple-700 rounded-2xl p-8 text-white text-center shadow-xl">
            <h2 className="text-2xl font-bold mb-2">Vous ne trouvez pas votre réponse ?</h2>
            <p className="text-purple-200 mb-6">Notre équipe d'assistance est là pour vous aider.</p>
            <a href="/contact" className="inline-flex items-center gap-2 bg-white text-[#5F0EB3] px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition-all shadow-lg">
              <Mail className="w-5 h-5" />
              Contactez-nous
            </a>
          </div>
        </div>
      </div>

      <footer className="mt-16 py-8 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-400">© {new Date().getFullYear()} <span className="font-medium text-gray-600">ELIMUU</span>. Tous droits réservés.</p>
      </footer>
    </div>
  )
}

export default FAQPage

'use client'

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Target, Eye, TrendingUp, Facebook, Linkedin, Twitter, Instagram, Mail, Phone, BookOpen, Globe, Users, Award, Lightbulb, Rocket, Zap, Shield } from "lucide-react";

const About = () => {
  const [team, setTeam] = useState([]);
  const [aboutContent, setAboutContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/team-member?activeOnly=true');
        const result = await res.json();
        if (result.success) setTeam(result.data || []);
      } catch (error) {
        console.error('Error fetching team data:', error);
      }

      try {
        const res = await fetch('/api/about-page');
        const data = await res.json();
        if (data && !data.error) setAboutContent(data);
      } catch (error) {
        console.error('Error fetching about page content:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Contenu complet "À propos d'ELIMUU" (fallback si API indisponible)
  const aboutSections = [
    {
      title: "Notre Mission",
      icon: <Rocket className="w-7 h-7 text-indigo-600" />,
      content: "Chez ELIMUU, nous croyons que chaque personne mérite l'opportunité d'apprendre, de progresser et de réussir, quels que soient son âge, son parcours ou sa localisation. Notre mission est de rendre une éducation de qualité accessible à tous grâce à une plateforme moderne, intuitive et disponible à tout moment."
    },
    {
      title: "Notre Vision",
      icon: <Eye className="w-7 h-7 text-indigo-600" />,
      content: "Notre ambition est de devenir une référence de l'apprentissage numérique en Afrique et à l'international, en contribuant au développement des compétences, à l'employabilité, à l'innovation et à la croissance économique. ELIMUU — Apprendre aujourd'hui. Réussir demain."
    },
    {
      title: "Notre Écosystème",
      icon: <Globe className="w-7 h-7 text-indigo-600" />,
      content: "ELIMUU rassemble des étudiants, des enseignants, des experts, des professionnels, des entreprises et des institutions au sein d'un même écosystème numérique. Notre catalogue couvre une grande variété de domaines : technologies de l'information, commerce, gestion, santé, entrepreneuriat, langues, développement personnel, métiers techniques, compétences numériques et bien d'autres disciplines."
    },
    {
      title: "Notre Engagement",
      icon: <Shield className="w-7 h-7 text-indigo-600" />,
      content: "Nous nous engageons à offrir une plateforme sécurisée, fiable et innovante, en améliorant continuellement nos services grâce aux nouvelles technologies et aux retours de nos utilisateurs."
    }
  ];

  const values = [
    { icon: <BookOpen className="w-6 h-6" />, title: "Éducation accessible", desc: "Une éducation de qualité pour tous, partout et à tout moment." },
    { icon: <Users className="w-6 h-6" />, title: "Communauté", desc: "Un écosystème qui connecte apprenants, formateurs et institutions." },
    { icon: <Award className="w-6 h-6" />, title: "Excellence", desc: "Des formations de qualité avec des certifications reconnues." },
    { icon: <Lightbulb className="w-6 h-6" />, title: "Innovation", desc: "Une plateforme moderne qui évolue avec les technologies." },
    { icon: <Zap className="w-6 h-6" />, title: "Flexibilité", desc: "Apprenez à votre rythme, sur smartphone, tablette ou ordinateur." },
    { icon: <Globe className="w-6 h-6" />, title: "Impact panafricain", desc: "Contribuer au développement des compétences à travers l'Afrique." }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#5F0EB3] via-purple-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/bg-image/popular-bg.png')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute top-20 -right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-20 left-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6 border border-white/20">
                  <span className="text-sm font-medium tracking-wider uppercase">À propos d'ELIMUU</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  La plateforme qui <span className="text-purple-300">transforme</span> l'accès à l'éducation
                </h1>
                <p className="text-lg text-purple-200 leading-relaxed">
                  ELIMUU est une plateforme d'apprentissage numérique qui transforme l'accès à l'éducation, au développement des compétences et à la formation professionnelle en République Démocratique du Congo et en Afrique.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a href="/courselist" className="inline-flex items-center gap-2 bg-white text-[#5F0EB3] px-6 py-3 rounded-full font-semibold hover:bg-purple-50 transition-all shadow-lg">
                    Explorer les formations →
                  </a>
                  <a href="/contact" className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/20 transition-all border border-white/20">
                    Nous contacter
                  </a>
                </div>
              </div>
              <div className="hidden md:block">
                <Image
                  src="/assets/custom-image/BannerImageAboutPage.jpg"
                  alt="ELIMUU - Apprentissage Numérique"
                  width={500}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-t from-white to-transparent relative z-10"></div>
      </div>

      {/* Message de bienvenue */}
      <div className="container mx-auto px-4 py-16 -mt-8 relative z-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Bienvenue sur ELIMUU</h2>
            <div className="prose prose-lg text-gray-700 space-y-4 leading-relaxed">
              <p>Bienvenue sur ELIMUU, la plateforme d'apprentissage numérique qui transforme l'accès à l'éducation, au développement des compétences et à la formation professionnelle.</p>
              <p>Chez ELIMUU, nous croyons que chaque personne mérite l'opportunité d'apprendre, de progresser et de réussir, quels que soient son âge, son parcours ou sa localisation. Notre mission est de rendre une éducation de qualité accessible à tous grâce à une plateforme moderne, intuitive et disponible à tout moment.</p>
              <p>ELIMUU rassemble des étudiants, des enseignants, des experts, des professionnels, des entreprises et des institutions au sein d'un même écosystème numérique. Notre catalogue couvre une grande variété de domaines, notamment les technologies de l'information, le commerce, la gestion, la santé, l'entrepreneuriat, les langues, le développement personnel, les métiers techniques, les compétences numériques et bien d'autres disciplines.</p>
              <p>Notre plateforme offre une expérience d'apprentissage complète grâce à des cours vidéo, des documents pédagogiques, des quiz, des exercices pratiques, des évaluations, un suivi personnalisé de la progression et des certificats de réussite. Les apprenants peuvent apprendre à leur rythme, depuis un smartphone, une tablette ou un ordinateur, où qu'ils se trouvent.</p>
              <p>ELIMUU accompagne également les formateurs et les établissements de formation en leur fournissant les outils nécessaires pour créer, gérer et diffuser leurs contenus pédagogiques, suivre les performances des apprenants et développer leur communauté d'apprentissage.</p>
              <p>Nous nous engageons à offrir une plateforme sécurisée, fiable et innovante, en améliorant continuellement nos services grâce aux nouvelles technologies et aux retours de nos utilisateurs.</p>
              <p className="text-xl font-bold text-indigo-700 text-center pt-4">Notre ambition est de devenir une référence de l'apprentissage numérique en Afrique et à l'international, en contribuant au développement des compétences, à l'employabilité, à l'innovation et à la croissance économique.</p>
              <p className="text-2xl font-bold text-[#5F0EB3] text-center pt-2">ELIMUU — Apprendre aujourd'hui. Réussir demain.</p>
            </div>
          </div>

          {/* Sections Mission/Vision */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {aboutSections.map((section, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-lg transition-all">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                  {section.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h3>
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          {/* Valeurs */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Nos Valeurs Fondamentales</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                    {v.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-600">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Apprentissage */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-10 mb-16 border border-indigo-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Une expérience d'apprentissage complète</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <BookOpen className="w-8 h-8" />, title: "Cours vidéo", desc: "Contenu pédagogique de qualité" },
                { icon: <Users className="w-8 h-8" />, title: "Quiz & exercices", desc: "Évaluez vos connaissances" },
                { icon: <Award className="w-8 h-8" />, title: "Certificats", desc: "Reconnaissance de vos acquis" },
                { icon: <Zap className="w-8 h-8" />, title: "Suivi personnalisé", desc: "Progression à votre rythme" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-sm text-center">
                  <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-[#5F0EB3] to-purple-700 rounded-3xl p-10 mb-16 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "500+", label: "Formations disponibles" },
                { number: "50+", label: "Formateurs experts" },
                { number: "10K+", label: "Apprenants actifs" },
                { number: "95%", label: "Taux de satisfaction" }
              ].map((stat, idx) => (
                <div key={idx}>
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-sm text-purple-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Équipe */}
          {team.length > 0 && (
            <div className="mb-16">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900">Notre Équipe</h2>
                <p className="text-gray-600 mt-2">Des professionnels passionnés au service de l'éducation</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {team.map((member) => (
                  <div key={member._id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative h-64 bg-gradient-to-br from-indigo-100 to-purple-100">
                      <Image src={member.image || "/assets/placeholder.jpg"} alt={member.name} fill className="object-cover" />
                    </div>
                    <div className="p-6 text-center">
                      <h4 className="text-xl font-bold text-gray-800">{member.name}</h4>
                      <p className="text-indigo-600 font-medium text-sm mb-3">{member.position}</p>
                      {member.bio && <p className="text-gray-600 text-sm mb-4">{member.bio}</p>}
                      {member.email && (
                        <a href={`mailto:${member.email}`} className="text-xs text-gray-500 hover:text-indigo-600 flex items-center justify-center gap-1 mb-1">
                          <Mail className="w-3 h-3" /> {member.email}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;

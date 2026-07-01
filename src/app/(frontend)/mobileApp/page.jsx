'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Download, Smartphone, Play, Apple, CheckCircle2, Star, Users, BookOpen, Award, Zap, Globe, Shield, Clock, ArrowRight, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileApp = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch('/api/mobile-app');
                const data = await res.json();
                setContent(data);
            } catch (error) {
                console.error('Error fetching mobile app content:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
                <Loader2 className="h-12 w-12 animate-spin text-[--primary]" />
            </div>
        );
    }

    const activeFeatures = content?.features?.filter(f => f.isActive)?.sort((a, b) => a.displayOrder - b.displayOrder) || [];

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const stats = [
        { icon: Users, value: '100K+', label: 'Active Users', color: 'text-blue-500' },
        { icon: BookOpen, value: '500+', label: 'Cours', color: 'text-purple-500' },
        { icon: Award, value: '4.8', label: 'App Rating', color: 'text-orange-500' },
        { icon: Globe, value: '50+', label: 'Countries', color: 'text-green-500' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-100/30 to-orange-100/30 rounded-full blur-3xl"></div>
            </div>

            <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-24 pb-16 lg:pb-24">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                    >
                        <motion.div className="space-y-6 lg:space-y-8" variants={fadeInUp}>
                            <motion.div
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-orange-100 rounded-full text-sm font-semibold text-[--primary]"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Smartphone className="w-4 h-4" />
                                <span>Mobile App Available</span>
                            </motion.div>

                            <motion.h1
                                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
                                variants={fadeInUp}
                            >
                                <span className="bg-gradient-to-r from-[--primary] to-[--secondary] bg-clip-text text-transparent">
                                    {content?.heroTitle?.split(' ').slice(0, 3).join(' ') || 'Apprenez à tout moment'}
                                </span>
                                <br />
                                <span className="text-gray-900">
                                    {content?.heroTitle?.split(' ').slice(3).join(' ') || 'Anywhere with Our Powerful Mobile Learning App'}
                                </span>
                            </motion.h1>

                            <motion.p
                                className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl"
                                variants={fadeInUp}
                            >
                                {content?.heroDescription || 'Access all your courses, track progress, and learn on the go with our mobile app built for students and instructors alike. Transform your learning experience today.'}
                            </motion.p>

                            <motion.div
                                className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                                variants={fadeInUp}
                            >
                                <Link href={content?.downloadLink || 'https://smartacademypro.arcadexit.com/apk_file/smart_academy_v1.0.0.apk'} className="w-full sm:w-auto">
                                    <Button
                                        size="lg"
                                        className="w-full sm:w-auto bg-gradient-to-r from-[--primary] to-[--secondary] hover:from-[--primary-hover] hover:to-[--secondary] text-white px-8 py-6 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 group"
                                    >
                                        <Download className="w-5 h-5 mr-2 group-hover:translate-y-[-2px] transition-transform" />
                                        {content?.downloadButtonText || 'Download the App'}
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>

                                <div className="flex gap-3">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="cursor-pointer"
                                    >
                                        <Link href={content?.downloadLink || 'https://smartacademypro.arcadexit.com/apk_file/smart_academy_v1.0.0.apk'}>
                                            <div className="flex items-center gap-2 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
                                                <Apple className="w-6 h-6" />
                                                <div className="text-left">
                                                    <div className="text-xs">Download on the</div>
                                                    <div className="text-sm font-semibold">App Store</div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="cursor-pointer"
                                    >
                                        <Link href={content?.downloadLink || 'https://smartacademypro.arcadexit.com/apk_file/smart_academy_v1.0.0.apk'}>
                                            <div className="flex items-center gap-2 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
                                                <Play className="w-6 h-6" />
                                                <div className="text-left">
                                                    <div className="text-xs">Get it on</div>
                                                    <div className="text-sm font-semibold">Google Play</div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {content?.showQRCode && (
                                <motion.div
                                    className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <div className="p-2 bg-gradient-to-br from-purple-100 to-orange-100 rounded-xl">
                                        <QrCode className="w-6 h-6 text-[--primary]" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-700">Scan to Download</p>
                                        <p className="text-xs text-gray-500">Use your phone camera</p>
                                    </div>
                                    <Image
                                        src={content?.qrCodeImage || '/assets/custom-image/qr-code.png'}
                                        alt='QR code'
                                        width={80}
                                        height={80}
                                        className='rounded-lg border-2 border-gray-200'
                                    />
                                </motion.div>
                            )}
                        </motion.div>

                        <motion.div
                            className="relative lg:block hidden"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <div className="relative">
                                <div className="relative w-full max-w-md mx-auto">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[--primary] to-[--secondary] rounded-[3rem] blur-2xl opacity-30"></div>
                                    <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                                        <div className="bg-white rounded-[2.5rem] overflow-hidden">
                                            <div className="bg-gray-100 h-12 flex items-center justify-center">
                                                <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
                                            </div>
                                            {activeFeatures[0] && (
                                                <Image
                                                    src={activeFeatures[0].image}
                                                    alt="Aperçu de l'application"
                                                    width={400}
                                                    height={800}
                                                    className="w-full h-auto object-cover"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <motion.div
                    className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto"
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{ scale: 1.05, y: -8 }}
                                className="group"
                            >
                                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden">
                                    <CardContent className="p-8 text-center relative">
                                        {/* Gradient background effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        
                                        <div className="relative z-10">
                                            <div className={`inline-flex p-4 rounded-3xl bg-gradient-to-br from-purple-100 to-orange-100 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg ${stat.color}`}>
                                                <Icon className="w-7 h-7" />
                                            </div>
                                            <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[--primary] to-[--secondary] bg-clip-text text-transparent mb-3">
                                                {stat.value}
                                            </div>
                                            <div className="text-base text-gray-700 font-semibold">
                                                {stat.label}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </section>

            <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <motion.div
                    className="text-center mb-12 lg:mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-[--primary] to-[--secondary] bg-clip-text text-transparent">
                            Powerful Features
                        </span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Everything you need to learn, teach, and grow - all in one beautiful app
                    </p>
                </motion.div>

                <div className="space-y-24 lg:space-y-32">
                    {activeFeatures.map((feature, index) => (
                        <motion.div
                            key={feature._id || index}
                            className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                            }`}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <motion.div
                                className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-orange-100/50 opacity-50"></div>
                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        width={600}
                                        height={600}
                                        className='relative z-10 w-full h-auto object-contain rounded-2xl'
                                    />
                                </div>
                                <div className={`absolute -z-10 ${index % 2 === 0 ? '-left-10 -bottom-10' : '-right-10 -bottom-10'} w-64 h-64 bg-gradient-to-br from-purple-200/30 to-orange-200/30 rounded-full blur-3xl`}></div>
                            </motion.div>

                            <motion.div
                                className={`space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-orange-100 rounded-full text-sm font-semibold text-[--primary] w-fit">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Feature {index + 1}</span>
                                </div>

                                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                                    <span className="bg-gradient-to-r from-[--primary] to-[--secondary] bg-clip-text text-transparent">
                                        {feature.title.split(' ')[0]}
                                    </span>
                                    {' '}
                                    <span className="text-gray-900">
                                        {feature.title.split(' ').slice(1).join(' ')}
                                    </span>
                                </h3>

                                <p className="text-lg text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>

                                {feature.tags && feature.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-3 pt-4">
                                        {feature.tags.map((tag, tagIndex) => (
                                            <motion.span
                                                key={tagIndex}
                                                whileHover={{ scale: 1.05 }}
                                                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-orange-50 text-gray-700 px-4 py-2 rounded-full text-sm font-medium border border-gray-200 hover:border-[--primary] transition-colors"
                                            >
                                                <CheckCircle2 className="w-4 h-4 text-[--primary]" />
                                                {tag}
                                            </motion.span>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <motion.div
                    className="max-w-6xl mx-auto"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="text-center mb-12 lg:mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-[--primary] to-[--secondary] bg-clip-text text-transparent">
                                Why Choose Our App?
                            </span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Experience the future of mobile learning with cutting-edge features
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {[
                            { icon: Zap, title: 'Lightning Fast', description: 'Optimized for speed and performance' },
                            { icon: Shield, title: 'Secure & Private', description: 'Your data is protected with enterprise-grade security' },
                            { icon: Clock, title: 'Learn Offline', description: 'Download courses and learn without internet' },
                            { icon: Globe, title: 'Multi-Language', description: 'Available in multiple languages' },
                            { icon: Star, title: 'Top Rated', description: '4.8+ stars from thousands of users' },
                            { icon: Users, title: 'Active Community', description: 'Connect with learners worldwide' },
                        ].map((benefit, index) => {
                            const Icon = benefit.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                >
                                    <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm h-full">
                                        <CardContent className="p-6">
                                            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-orange-100 mb-4">
                                                <Icon className="w-6 h-6 text-[--primary]" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {benefit.title}
                                            </h3>
                                            <p className="text-gray-600">
                                                {benefit.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </section>

            <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <motion.div
                    className="max-w-4xl mx-auto text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Card className="border-0 shadow-2xl bg-gradient-to-br from-[--primary] to-[--secondary] text-white overflow-hidden relative">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                        <CardContent className="relative z-10 p-12 lg:p-16">
                            <motion.div
                                initial={{ scale: 0.9 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                            >
                                <Smartphone className="w-16 h-16 mx-auto mb-6 opacity-90" />
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                                    Ready to Start Learning?
                                </h2>
                                <p className="text-lg sm:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                                    Join thousands of learners who are already transforming their skills with our mobile app
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <Link href={content?.downloadLink || 'https://smartacademypro.arcadexit.com/apk_file/smart_academy_v1.0.0.apk'} className="w-full sm:w-auto">
                                        <Button
                                            size="lg"
                                            className="w-full sm:w-auto bg-white text-[--primary] hover:bg-gray-100 px-8 py-6 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            <Download className="w-5 h-5 mr-2" />
                                            Download Now
                                        </Button>
                                    </Link>
                                    {content?.showQRCode && (
                                        <div className="flex items-center gap-3 p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                                            <Image
                                                src={content?.qrCodeImage || '/assets/custom-image/qr-code.png'}
                                                alt='QR code'
                                                width={60}
                                                height={60}
                                                className='rounded-lg'
                                            />
                                            <div className="text-left">
                                                <p className="text-sm font-semibold">Scan QR Code</p>
                                                <p className="text-xs opacity-80">Quick download</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </section>
        </div>
    )
}

export default MobileApp

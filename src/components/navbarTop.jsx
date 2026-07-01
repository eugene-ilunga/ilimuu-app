'use client'

import { FacebookIcon, InstagramIcon, LinkedinIcon, Mail, MapPin, PhoneCall, YoutubeIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

const NavbarTop = () => {

    const [settings, setSettings] = useState(null);
    const [isLoadingSettings, setIsLoadingSettings] = useState(true);

    useEffect(() => {
        const getSettings = async () => {
            try {
                const res = await fetch("/api/setttings", {
                    method: "GET",
                });
                const settingsData = await res.json();
                
                if (settingsData && !settingsData.error) {
                    setSettings({
                        supportPhone: settingsData.supportPhone || '+243860275282',
                        supportEmail: settingsData.supportEmail || 'contact@revival-business.com',
                        supportAddress: settingsData.supportAddress || '195 Av Kabambare, Commune/Lingwala, Kinshasa, RDC',
                        facebookLink: settingsData.facebookLink || 'https://www.facebook.com/profile.php?id=61587848550970',
                        instagramLink: settingsData.instagramLink || 'https://instagram.com/revivalgroup7',
                        linkedinLink: settingsData.linkedinLink || 'https://linkedin.com/company/revival-group-drc',
                        youtubeLink: settingsData.youtubeLink || 'https://x.com/groupe85249'
                    });
                } else {
                    // Set fallback values if API fails
                    setSettings({
                        supportPhone: '+243860275282',
                        supportEmail: 'contact@revival-business.com',
                        supportAddress: '195 Av Kabambare, Commune/Lingwala, Kinshasa, RDC',
                        facebookLink: 'https://www.facebook.com/profile.php?id=61587848550970',
                        instagramLink: 'https://instagram.com/revivalgroup7',
                        linkedinLink: 'https://linkedin.com/company/revival-group-drc',
                        youtubeLink: 'https://x.com/groupe85249'
                    });
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
                // Set fallback values on error
                setSettings({
                    supportPhone: '+243860275282',
                    supportEmail: 'contact@revival-business.com',
                    supportAddress: '195 Av Kabambare, Commune/Lingwala, Kinshasa, RDC',
                    facebookLink: 'https://www.facebook.com/profile.php?id=61587848550970',
                    instagramLink: 'https://instagram.com/revivalgroup7',
                    linkedinLink: 'https://linkedin.com/company/revival-group-drc',
                    youtubeLink: 'https://x.com/groupe85249'
                });
            } finally {
                setIsLoadingSettings(false);
            }
        };
        getSettings();
    }, []);

    return (
        <div className="bg-[#1D1742] hidden lg:block top-0 z-[9999]">
            <div className="container flex gap-5 text-gray-200 justify-between">
                <div className="flex gap-5 text-gray-200  py-3">
                    {!isLoadingSettings && settings && (
                        <>
                            <div className="nav-text flex gap-1 items-center">
                                <PhoneCall className="text-[--primary] w-4 h-4" />
                                <a href={`https://wa.me/${settings.supportPhone.replace(/[^0-9]/g, '')}`} target="_blank">
                                    <h5 className="text-sm">{settings.supportPhone}</h5>
                                </a>
                            </div>
                            <div className="nav-text flex gap-1 items-center">
                                <Mail className="text-[--primary] w-4 h-4" />
                                <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${settings.supportEmail}`} target="_blank">
                                    <h5 className="text-sm">{settings.supportEmail}</h5>
                                </a>



                            </div>
                            <div className="nav-text flex gap-1 items-center">
                                <MapPin className="text-[--primary] w-4 h-4" />
                                <a
                                    href={`https://maps.google.com/?q=${encodeURIComponent(settings.supportAddress)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <h5 className="text-sm">{settings.supportAddress}</h5>
                                </a>
                            </div>
                        </>
                    )}
                </div>
                {!isLoadingSettings && settings && (
                    <div className="flex gap-5 bg-[--primary] px-4 items-center">
                        {settings.facebookLink && (
                            <a target="_blank" href={settings.facebookLink} rel="noopener noreferrer">
                                <FacebookIcon className="cursor-pointer w-4 h-4" />
                            </a>
                        )}
                        {settings.instagramLink && (
                            <a target="_blank" href={settings.instagramLink} rel="noopener noreferrer">
                                <InstagramIcon className="cursor-pointer w-4 h-4" />
                            </a>
                        )}
                        {settings.linkedinLink && (
                            <a target="_blank" href={settings.linkedinLink} rel="noopener noreferrer">
                                <LinkedinIcon className="cursor-pointer w-4 h-4" />
                            </a>
                        )}
                        {settings.youtubeLink && (
                            <a target="_blank" href={settings.youtubeLink} rel="noopener noreferrer">
                                <YoutubeIcon className="cursor-pointer w-4 h-4" />
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default NavbarTop

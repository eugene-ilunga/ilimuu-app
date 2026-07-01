"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import contactImg from "../../../../public/assets/custom-image/contact.png"
import earthImg from "../../../../public/assets/custom-image/earth-bg.png"
import starImg from "../../../../public/assets/custom-image/starImg.png"
import Swal from "sweetalert2"
import toast from "react-hot-toast"

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(`Message sent successfully`, {
        position: 'top-right',
        duration: 1500,
        style: {
          backgroundColor: 'rgba(124, 255, 100)',
          color: '#fff',
          fontSize: '16px',
          padding: '10px',
          borderRadius: '5px',
        },
      })
      setForm({ name: "", email: "", phone: "", message: "" });
    } else {
      toast.error(`Failed to send message: ${data.error || 'Unknown error'}`, {
        position: 'top-right',
        duration: 1500,
        style: {
          backgroundColor: 'rgba(255, 112, 100 )',
          color: '#fff',
          fontSize: '16px',
          padding: '10px',
          borderRadius: '5px',
        },
      })
    }
  };

  return (
    <div className=" py-20 w-full flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="w-full container grid md:grid-cols-2 gap-8 relative">
        <div className="absolute lg:-right-36 top-10 translate-y-1/4 text-purple-200 opacity-70">
          <Image className="w-28 h-28" src={earthImg} width={300} height={300} alt='' ></Image>
        </div>
        <div className="absolute left-20 -top-16 translate-y-1/4 text-purple-200 opacity-70">
          <Image className="w-12 h-12" src={starImg} width={300} height={300} alt='' ></Image>
        </div>
        <div className="absolute lg:-right-20 bottom-10 translate-y-1/4 text-purple-200 opacity-70">
          <Image className="w-12 h-12" src={starImg} width={300} height={300} alt='' ></Image>
        </div>
        <div className="flex flex-col justify-center">
          <h5 className="text-sm bg-white w-fit px-5 py-1  text-[--primary] uppercase rounded-full mb-2">Contactez-nous</h5>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Contactez ELIMUU
          </h1>
          <p className="text-slate-600 mb-8">
            Nous sommes là pour vous aider ! Que vous ayez des questions sur nos formations, des préoccupations techniques, ou besoin d'assistance, notre équipe est prête à vous accompagner. N'hésitez pas à nous contacter.
          </p>
          <div>
            <Image src={contactImg} alt="" width={350} height={350}></Image>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="bg-blue-100 rounded-lg p-6 md:p-8 relative">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Envoyez-nous un message</h2>
            <form onSubmit={handleSubmit} className="bg-blue-50 p-6 rounded-lg shadow space-y-4">
              <Input
                type="text"
                name="name"
                placeholder="Votre nom"
                value={form.name}
                onChange={handleChange}
                required
              />
              <Input
                type="email"
                name="email"
                placeholder="Votre email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <Input
                type="tel"
                name="phone"
                placeholder="Téléphone"
                value={form.phone}
                onChange={handleChange}
                required
              />
              <Textarea
                name="message"
                placeholder="Message (optionnel)"
                value={form.message}
                onChange={handleChange}
              />
              <Button type="submit" className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
                Envoyer le message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

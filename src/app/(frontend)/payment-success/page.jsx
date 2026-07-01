"use client";

import Link from 'next/link'
import { CheckCircle, Download, Sparkles } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Invoice from "@/components/Invoice"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import toast from "react-hot-toast"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const invoiceId = searchParams.get("invoiceId")
  const [checkoutData, setCheckoutData] = useState(null)
  const [loading, setLoading] = useState(true)
  const invoiceRef = useRef(null)

  useEffect(() => {
    if (invoiceId) {
      fetchCheckoutDetails()
    } else {
      setLoading(false)
    }
  }, [invoiceId])

  const fetchCheckoutDetails = async () => {
    try {
      const res = await fetch(`/api/checkout/details?invoiceId=${invoiceId}`)
      const data = await res.json()
      if (data.status === 200 && data.data) {
        setCheckoutData(data.data)
      }
    } catch (error) {
      console.error("Error fetching checkout details:", error)
      toast.error("Failed to load invoice details")
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadInvoice = async () => {
    if (!invoiceRef.current) {
      toast.error("Invoice not available")
      return
    }

    const toastId = toast.loading("Generating PDF...")

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: invoiceRef.current.scrollWidth,
        height: invoiceRef.current.scrollHeight,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      // If content fits on one page, add it directly
      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      } else {
        // Scale down to fit on one page
        const scale = pageHeight / imgHeight
        const scaledWidth = imgWidth * scale
        const scaledHeight = pageHeight
        pdf.addImage(imgData, "PNG", (imgWidth - scaledWidth) / 2, 0, scaledWidth, scaledHeight)
      }

      pdf.save(`invoice-${checkoutData?.invoiceId || "invoice"}.pdf`)
      toast.success("Invoice downloaded successfully!", { id: toastId })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Failed to generate PDF", { id: toastId })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Bubbles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-float"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: i % 3 === 0 ? '#5F0EB3' : i % 3 === 1 ? '#FC6441' : '#9333EA',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <Card className="w-full shadow-2xl border-0 overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-[#5F0EB3] to-[#9333EA] text-white pb-8 pt-12 relative">
            <div className="absolute top-4 right-4">
              <Sparkles className="w-6 h-6 text-white/30 animate-pulse" />
            </div>
            <div className="relative z-10">
              <div className="relative inline-block mb-4">
                <CheckCircle className="w-20 h-20 text-white mx-auto animate-bounce" />
                <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-ping"></div>
              </div>
              <CardTitle className="text-3xl font-bold text-white mb-2">
                Payment Successful!
              </CardTitle>
              <p className="text-white/90 text-lg">
                Thank you for your purchase. Your order has been processed successfully.
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-8">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#5F0EB3]"></div>
                <p className="mt-4 text-gray-600">Loading invoice details...</p>
              </div>
            ) : checkoutData ? (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900">Order Confirmed</p>
                    <p className="text-sm text-green-700 mt-1">
                      Invoice #{checkoutData.invoiceId} • Paid via {checkoutData.paymentMethod}
                    </p>
                  </div>
                </div>

                {/* Invoice Preview */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 max-h-[500px] overflow-y-auto">
                  <div className="bg-white rounded-lg shadow-sm" ref={invoiceRef}>
                    <Invoice checkoutData={checkoutData} />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No invoice data available.</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center p-8 pt-0">
            {checkoutData && (
              <Button
                onClick={handleDownloadInvoice}
                className="bg-gradient-to-r from-[#5F0EB3] to-[#9333EA] hover:from-[#4B0B8E] hover:to-[#7C2D9A] text-white shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Invoice
              </Button>
            )}
            <Link href="/profile">
              <Button
                variant="outline"
                className="border-2 border-[#5F0EB3] text-[#5F0EB3] hover:bg-[#5F0EB3] hover:text-white transition-all"
                size="lg"
              >
                Return to Profile
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

    </div>
  )
}

export default function SuccessfulPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#5F0EB3]"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}

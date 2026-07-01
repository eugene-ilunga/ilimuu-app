"use client";

import Image from "next/image";

export default function Invoice({ checkoutData }) {
  if (!checkoutData) return null;

  const {
    invoiceId,
    paymentDate,
    totalAmount,
    tax = 0,
    platformFee = 0,
    commission = 0,
    paymentMethod,
    billingAddress,
    course = [],
    user,
  } = checkoutData;

  const subtotal = totalAmount - (tax || 0) - (platformFee || 0);
  const formattedDate = new Date(paymentDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div id="invoice" className="bg-white p-6 max-w-4xl mx-auto" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '12px' }}>
      {/* Header - Compact */}
      <div className="flex justify-between items-start mb-4 pb-3 border-b-2 border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-[#5F0EB3] mb-1">Invoice</h1>
          <p className="text-gray-600 text-xs">Invoice #{invoiceId}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-0.5">Date</p>
          <p className="font-semibold text-sm">{formattedDate}</p>
        </div>
      </div>

      {/* Company and Billing Info - Side by Side */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Company/Platform Info */}
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-1">ELIMUU</h2>
          <p className="text-gray-600 text-xs">Plateforme d'Apprentissage Numérique</p>
          <p className="text-gray-600 text-xs mt-1">195 Av Kabambare, Lingwala, Kinshasa, RDC</p>
        </div>

        {/* Billing Address */}
        {billingAddress && (
          <div className="bg-gray-50 p-3 rounded">
            <h3 className="text-xs font-semibold text-gray-900 mb-1.5">Bill To:</h3>
            <div className="text-gray-700 text-xs leading-tight">
              <p className="font-semibold">
                {billingAddress.firstName} {billingAddress.lastName}
              </p>
              {billingAddress.company && (
                <p className="mt-0.5">{billingAddress.company}</p>
              )}
              <p className="mt-0.5">{billingAddress.address}</p>
              <p className="mt-0.5">
                {billingAddress.city}
                {billingAddress.state && `, ${billingAddress.state}`}
                {billingAddress.zipCode && ` ${billingAddress.zipCode}`}
              </p>
              <p className="mt-0.5">{billingAddress.country}</p>
            </div>
          </div>
        )}
      </div>

      {/* User Info - Compact */}
      {user && (
        <div className="mb-3 text-xs text-gray-700">
          <span className="font-semibold">Customer:</span> {user.name} | 
          <span className="font-semibold ml-2">Email:</span> {user.email}
          {user.phone && <><span className="font-semibold ml-2">| Phone:</span> {user.phone}</>}
        </div>
      )}

      {/* Items Table - Compact */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Items Purchased:</h3>
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-[#5F0EB3] text-white">
              <th className="p-2 text-left border border-gray-300">Course</th>
              <th className="p-2 text-right border border-gray-300">Price</th>
            </tr>
          </thead>
          <tbody>
            {course.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    {item.thumbnail && (
                      <div className="relative w-12 h-8 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 text-xs">{item.title}</p>
                    </div>
                  </div>
                </td>
                <td className="p-2 text-right font-semibold text-xs">
                  ${item.price?.toFixed(2) || "0.00"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary and Payment Info - Side by Side */}
      <div className="grid grid-cols-2 gap-4">
        {/* Summary */}
        <div className="bg-gray-50 p-3 rounded">
          <div className="space-y-1.5">
            <div className="flex justify-between text-gray-700 text-xs">
              <span>Subtotal:</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            {platformFee > 0 && (
              <div className="flex justify-between text-gray-700 text-xs">
                <span>Platform Fee:</span>
                <span className="font-semibold">${platformFee.toFixed(2)}</span>
              </div>
            )}
            {tax > 0 && (
              <div className="flex justify-between text-gray-700 text-xs">
                <span>Tax:</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-300 pt-1.5 mt-1.5">
              <div className="flex justify-between text-sm font-bold text-[#5F0EB3]">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-xs text-gray-600 mb-1">
            <span className="font-semibold">Payment Method:</span> {paymentMethod}
          </p>
          <p className="text-xs text-gray-600">
            <span className="font-semibold">Payment Status:</span>{" "}
            <span className="text-green-600 font-semibold">Completed</span>
          </p>
        </div>
      </div>

      {/* Footer - Compact */}
      <div className="mt-3 pt-3 border-t border-gray-200 text-center text-xs text-gray-500">
        <p>Merci pour votre achat ! Cette facture est générée automatiquement par ELIMUU.</p>
      </div>
    </div>
  );
}

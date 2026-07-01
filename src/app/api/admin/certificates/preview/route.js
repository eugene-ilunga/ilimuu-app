import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

// Dynamic import for CommonJS module to avoid Next.js bundling issues
let generateCertificatePDF;
try {
  const certGenerator = require("@/utils/certificate-generator");
  generateCertificatePDF = certGenerator.generateCertificatePDF;
} catch (error) {
  console.error("Error loading certificate generator:", error);
}

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value || "";
    const role = cookieStore.get("role")?.value || "";

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Authentication required",
      }, { status: 401 });
    }

    if (role !== "admin") {
      return NextResponse.json({
        success: false,
        message: "Only admin can generate certificates",
      }, { status: 403 });
    }

    const body = await req.json();
    const {
      userName,
      userEmail,
      bootcampName,
      certificateLevel,
      score,
      issueDate,
      certificateNumber,
      verificationCode,
      organizationName,
      organizationTagline,
      logoUrl,
      watermarkText,
      signatureLeftName,
      signatureLeftTitle,
      signatureLeftImage,
      signatureRightName,
      signatureRightTitle,
      signatureRightImage,
    } = body;

    // Validation
    const errors = [];
    if (!userName || userName.trim() === "") {
      errors.push("Student name is required");
    }
    if (!userEmail || userEmail.trim() === "") {
      errors.push("Student email is required");
    }
    if (!bootcampName || bootcampName.trim() === "") {
      errors.push("Program name is required");
    }
    if (!certificateLevel || !["A", "B", "C"].includes(certificateLevel)) {
      errors.push("Certificate level must be A, B, or C");
    }
    if (score === undefined || score === null || score < 0 || score > 100) {
      errors.push("Score must be between 0 and 100");
    }
    if (!issueDate) {
      errors.push("Issue date is required");
    }

    if (errors.length > 0) {
      return NextResponse.json({
        success: false,
        errors,
        message: "Validation failed",
      }, { status: 400 });
    }

    // Generate certificate number if not provided
    const finalCertificateNumber = certificateNumber || `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Generate verification code if not provided
    const finalVerificationCode = verificationCode || crypto.randomBytes(8).toString("hex").toUpperCase();

    const certificateData = {
      certificateNumber: finalCertificateNumber,
      userName: userName.trim(),
      bootcampName: bootcampName.trim(),
      certificateLevel,
      score: Math.round(score),
      issueDate: new Date(issueDate),
      verificationCode: finalVerificationCode,
      organizationName: organizationName || "ELIMUU",
      organizationTagline: organizationTagline || "Empowering Future Professionals",
      logoUrl: logoUrl || null,
      watermarkText: watermarkText || "ELIMUU",
      signatures: {
        left: {
          name: signatureLeftName || "Program Director",
          title: signatureLeftTitle || "Program Director",
          imageUrl: signatureLeftImage || null,
        },
        right: {
          name: signatureRightName || "Chief Learning Officer",
          title: signatureRightTitle || "Chief Learning Officer",
          imageUrl: signatureRightImage || null,
        },
      },
    };

    // Check if generator is available
    if (!generateCertificatePDF) {
      return NextResponse.json({
        success: false,
        message: "Certificate generator not available. Please ensure pdfkit is properly installed.",
      }, { status: 500 });
    }

    // Generate certificate PDF (without uploading to Cloudinary for preview)
    const result = await generateCertificatePDF(certificateData, { upload: false });

    return NextResponse.json({
      success: true,
      base64: result.base64,
      fileName: `certificate_${finalCertificateNumber}.pdf`,
      meta: {
        certificateNumber: finalCertificateNumber,
        verificationCode: finalVerificationCode,
        userName: certificateData.userName,
        bootcampName: certificateData.bootcampName,
        score: certificateData.score,
        issueDate: certificateData.issueDate.toISOString(),
        organizationName: certificateData.organizationName,
        organizationTagline: certificateData.organizationTagline,
        watermarkText: certificateData.watermarkText,
        signatures: certificateData.signatures,
      },
    });
  } catch (error) {
    console.error("Error generating certificate preview:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to generate certificate preview",
    }, { status: 500 });
  }
}


const cloudinary = require('cloudinary').v2;

// pdfkit will be loaded dynamically at runtime to avoid bundling issues

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

const DEFAULT_BRANDING = {
  organizationName: resolveEnv('CERT_ORG_NAME', 'ELIMUU'),
  organizationTagline: resolveEnv(
    'CERT_ORG_TAGLINE',
    'Empowering Future Professionals'
  ),
  logoUrl: resolveEnv('CERT_LOGO_URL', null),
  watermarkText: resolveEnv('CERT_WATERMARK_TEXT', 'ELIMUU'),
  signatures: {
    left: {
      name: resolveEnv('CERT_SIGN_LEFT_NAME', 'Program Director'),
      title: resolveEnv('CERT_SIGN_LEFT_TITLE', 'Program Director'),
      imageUrl: resolveEnv('CERT_SIGN_LEFT_IMAGE', null),
    },
    right: {
      name: resolveEnv('CERT_SIGN_RIGHT_NAME', 'Chief Learning Officer'),
      title: resolveEnv('CERT_SIGN_RIGHT_TITLE', 'Chief Learning Officer'),
      imageUrl: resolveEnv('CERT_SIGN_RIGHT_IMAGE', null),
    },
  },
};

const LEVEL_STYLES = {
  A: {
    title: 'With Highest Honours',
    badgeBg: '#FCEFD8',
    badgeBorder: '#D9AE4F',
    badgeText: '#9B6B08',
  },
  B: {
    title: 'With Distinction',
    badgeBg: '#E6F0FF',
    badgeBorder: '#6F95E8',
    badgeText: '#2E5CB5',
  },
  C: {
    title: 'Certified Graduate',
    badgeBg: '#E8F8ED',
    badgeBorder: '#61B879',
    badgeText: '#2D7A47',
  },
  default: {
    title: 'Certified Achievement',
    badgeBg: '#F2F2F2',
    badgeBorder: '#C5C5C5',
    badgeText: '#4F4F4F',
  },
};

/**
 * Generate Certificate PDF
 *
 * Creates a professional certificate PDF and uploads to Cloudinary
 */
async function generateCertificatePDF(certificateData, options = {}) {
  try {
    // Load PDFDocument at runtime to avoid bundling issues with Next.js/Turbopack
    let PDFDocumentClass;
    try {
      const pdfkitModule = require('pdfkit');
      // pdfkit exports the constructor directly
      PDFDocumentClass = pdfkitModule;

      // Handle different export formats
      if (typeof PDFDocumentClass !== 'function') {
        if (pdfkitModule.default && typeof pdfkitModule.default === 'function') {
          PDFDocumentClass = pdfkitModule.default;
        } else if (pdfkitModule.PDFDocument && typeof pdfkitModule.PDFDocument === 'function') {
          PDFDocumentClass = pdfkitModule.PDFDocument;
        } else {
          throw new Error('PDFDocument constructor not found in pdfkit module');
        }
      }
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') {
        throw new Error('pdfkit is not installed. Please run: npm install pdfkit');
      }
      throw error;
    }

    if (typeof PDFDocumentClass !== 'function') {
      throw new Error('PDFDocument is not a constructor. pdfkit may not be installed correctly.');
    }

    const { upload = true } = options;
    const {
      certificateNumber,
      userName,
      bootcampName,
      certificateLevel,
      score,
      issueDate,
      verificationCode,
    } = certificateData;

    const brandingOverrides = normalizeBrandingInput(certificateData);
    const branding = mergeBranding(brandingOverrides);
    const assets = await loadBrandingAssets(branding);

    const canvasWidth = 840;
    const canvasHeight = 720;

    const doc = new PDFDocumentClass({
      size: [canvasWidth, canvasHeight],
      margins: {
        top: 45,
        bottom: 0,
        left: 45,
        right: 45,
      },
    });

    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    const theme = {
      accent: '#1F2667',
      accentAlt: '#56318D',
      gold: '#C89B3C',
      textPrimary: '#1F1F1F',
      textSecondary: '#4B4B4B',
      textMuted: '#7A7A7A',
      neutralBackground: '#FFFFFF',
      neutralSoft: '#F9F5EA',
    };

    drawBackground(doc, theme, pageWidth, pageHeight);
    drawWatermark(doc, branding.watermarkText, theme, pageWidth, pageHeight);
    drawBrandingHeader(doc, branding, assets, theme, pageWidth);
    drawCertificateTitle(doc, theme, pageWidth);
    drawRecipientSection(doc, { userName, bootcampName }, theme, pageWidth);

    const signatureLayout = getSignatureLayout(pageWidth, pageHeight);
    const levelStyle = getLevelStyle(certificateLevel);
    const badgeBounds = drawAchievementBadge(
      doc,
      levelStyle,
      signatureLayout,
      theme
    );

    drawPerformanceSummary(
      doc,
      { score, issueDate, verificationCode },
      theme,
      pageWidth,
      signatureLayout,
      badgeBounds
    );

    drawSignatures(doc, signatureLayout, branding, assets, theme);
    drawFooter(doc, theme, certificateNumber, branding, pageWidth, pageHeight);

    // Wait for PDF to be generated
    const pdfBuffer = await new Promise((resolve, reject) => {
      const errorHandler = (error) => {
        doc.removeListener('end', endHandler);
        doc.removeListener('error', errorHandler);
        reject(error);
      };

      const endHandler = () => {
        doc.removeListener('end', endHandler);
        doc.removeListener('error', errorHandler);
        resolve(Buffer.concat(chunks));
      };

      doc.on('end', endHandler);
      doc.on('error', errorHandler);
      doc.end();
    });

    if (!upload) {
      return {
        base64: pdfBuffer.toString('base64'),
        buffer: pdfBuffer,
      };
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'certificates',
          public_id: `cert_${certificateNumber}`,
        },
        (error, uploadResult) => {
          if (error) reject(error);
          else resolve(uploadResult);
        }
      );

      uploadStream.end(pdfBuffer);
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error('Error generating certificate PDF:', error);
    throw error;
  }
}

module.exports = { generateCertificatePDF };

/**
 * Format date for certificate
 */
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function drawBackground(doc, theme, pageWidth, pageHeight) {
  doc.save();
  doc.rect(0, 0, pageWidth, pageHeight).fill(theme.neutralBackground);
  doc.restore();

  doc.save();
  doc.fillColor('#000000').fillOpacity(0.03);
  doc.roundedRect(58, 60, pageWidth - 116, pageHeight - 116, 16).fill();
  doc.restore();

  const cornerPolygons = [
    { points: [[0, 0], [0, 120], [220, 0]], color: theme.accent },
    {
      points: [
        [pageWidth, 0],
        [pageWidth - 120, 0],
        [pageWidth, 130],
      ],
      color: theme.accentAlt,
    },
    {
      points: [
        [pageWidth, pageHeight],
        [pageWidth, pageHeight - 120],
        [pageWidth - 220, pageHeight],
      ],
      color: theme.accent,
    },
    {
      points: [
        [0, pageHeight],
        [120, pageHeight],
        [0, pageHeight - 130],
      ],
      color: theme.accentAlt,
    },
  ];

  cornerPolygons.forEach(({ points, color }) => {
    doc.save();
    doc.fillColor(color);
    doc.moveTo(points[0][0], points[0][1]);
    points.slice(1).forEach(([x, y]) => doc.lineTo(x, y));
    doc.closePath().fill();
    doc.restore();
  });

  doc.save();
  doc.lineWidth(4);
  doc.strokeColor(theme.gold);
  doc.roundedRect(45, 45, pageWidth - 90, pageHeight - 90, 18).stroke();
  doc.restore();

  doc.save();
  doc.lineWidth(1.5);
  doc.strokeColor('#EAD6A7');
  doc.roundedRect(62, 62, pageWidth - 124, pageHeight - 124, 12).stroke();
  doc.restore();
}

function drawWatermark(doc, text, theme, pageWidth, pageHeight) {
  if (!text) return;

  const watermark = text.toUpperCase();
  doc.save();
  doc.fillColor(theme.gold);
  doc.fillOpacity(0.06);
  doc.font('Helvetica-Bold').fontSize(118);
  const watermarkWidth = doc.widthOfString(watermark);

  doc.rotate(-20, { origin: [pageWidth / 2, pageHeight / 2] });
  doc.text(
    watermark,
    (pageWidth - watermarkWidth) / 2,
    pageHeight / 2 - 80,
    {
      width: watermarkWidth,
      align: 'center',
    }
  );
  doc.restore();
  doc.fillOpacity(1);
}

function drawBrandingHeader(doc, branding, assets, theme, pageWidth) {
  const headerTop = 72;
  if (assets.logoBuffer) {
    doc.image(assets.logoBuffer, 70, headerTop, {
      width: 120,
      fit: [120, 60],
    });
  } else if (branding.organizationName) {
    doc.font('Helvetica-Bold')
      .fontSize(18)
      .fillColor(theme.textPrimary)
      .text(branding.organizationName, 70, headerTop);
  }

  if (branding.organizationName) {
    doc.font('Helvetica-Bold')
      .fontSize(16)
      .fillColor(theme.textPrimary)
      .text(branding.organizationName, pageWidth - 260, headerTop, {
        width: 180,
        align: 'right',
      });
  }

  if (branding.organizationTagline) {
    doc.font('Helvetica')
      .fontSize(10)
      .fillColor(theme.textMuted)
      .text(branding.organizationTagline, pageWidth - 260, headerTop + 22, {
        width: 180,
        align: 'right',
      });
  }
}

function drawCertificateTitle(doc, theme, pageWidth) {
  doc.font('Times-BoldItalic')
    .fontSize(54)
    .fillColor(theme.gold)
    .text('Certificat', 0, 130, {
      align: 'center',
      width: pageWidth,
      lineBreak: false,
    });

  doc.font('Helvetica-Bold')
    .fontSize(18)
    .fillColor(theme.textPrimary)
    .text('OF ACHIEVEMENT', 0, 188, {
      align: 'center',
      width: pageWidth,
      characterSpacing: 2,
      lineBreak: false,
    });

  doc.moveTo(pageWidth * 0.28, 218)
    .lineTo(pageWidth * 0.72, 218)
    .strokeColor('#E5E5E5')
    .lineWidth(1)
    .dash(3, { space: 4 })
    .stroke()
    .undash();
}

function drawRecipientSection(doc, details, theme, pageWidth) {
  doc.font('Helvetica')
    .fontSize(16)
    .fillColor(theme.textSecondary)
    .text('This certificate is proudly presented to', 0, 240, {
      align: 'center',
      width: pageWidth,
      lineBreak: false,
    });

  doc.font('Times-BoldItalic')
    .fontSize(38)
    .fillColor(theme.textPrimary)
    .text(details.userName, 0, 300, {
      align: 'center',
      width: pageWidth,
      lineBreak: false,
      ellipsis: true,
    });

  doc.font('Helvetica')
    .fontSize(16)
    .fillColor(theme.textSecondary)
    .text('for outstanding accomplishment in', 0, 350, {
      align: 'center',
      width: pageWidth,
      lineBreak: false,
    });

  doc.font('Helvetica-Bold')
    .fontSize(22)
    .fillColor(theme.accentAlt)
    .text(details.bootcampName, 0, 380, {
      align: 'center',
      width: pageWidth,
      lineBreak: false,
      ellipsis: true,
    });
}

function drawAchievementBadge(doc, levelStyle, signatureLayout, theme) {
  const badgePadding = 28;
  const badgeHeight = 48;
  const badgeGap = signatureLayout.badgeGap;
  const leftSignatureEdge = signatureLayout.leftX + signatureLayout.width;
  const rightSignatureEdge = signatureLayout.rightX;
  const availableBadgeWidthRaw =
    rightSignatureEdge - leftSignatureEdge - badgeGap * 2;

  doc.font('Helvetica-Bold').fontSize(16);
  const textWidth = doc.widthOfString(levelStyle.title.toUpperCase());
  const availableBadgeWidth = Math.max(availableBadgeWidthRaw, 180);
  const desiredWidth = Math.max(
    signatureLayout.minBadgeWidth,
    textWidth + badgePadding * 2
  );
  const badgeWidth = Math.min(desiredWidth, availableBadgeWidth);
  const badgeAreaStart = leftSignatureEdge + badgeGap;
  const badgeX =
    badgeAreaStart +
    Math.max(0, availableBadgeWidth - badgeWidth) / 2;
  const badgeY = 410;

  doc.save();
  doc.fillColor('#000000').fillOpacity(0.06);
  doc.roundedRect(badgeX + 3, badgeY + 4, badgeWidth, badgeHeight, 16).fill();
  doc.restore();

  doc.save();
  doc.fillColor(levelStyle.badgeBg);
  doc.strokeColor(levelStyle.badgeBorder);
  doc.lineWidth(2);
  doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 16).fillAndStroke();
  doc.restore();

  doc.font('Helvetica-Bold')
    .fontSize(16)
    .fillColor(levelStyle.badgeText)
    .text(levelStyle.title.toUpperCase(), badgeX, badgeY + 14, {
      width: badgeWidth,
      align: 'center',
      lineBreak: false,
    });

  return {
    x: badgeX,
    y: badgeY,
    width: badgeWidth,
    height: badgeHeight,
  };
}

function drawPerformanceSummary(
  doc,
  performance,
  theme,
  pageWidth,
  signatureLayout,
  badgeBounds
) {
  const summaryTop = Math.max(
    signatureLayout.lineY - 120,
    badgeBounds.y + badgeBounds.height + 22
  );
  const summaryWidth = pageWidth - 260;
  const summaryX = (pageWidth - summaryWidth) / 2;
  const summaryHeight = 56;

  doc.save();
  doc.fillColor(theme.neutralSoft);
  doc.roundedRect(summaryX, summaryTop, summaryWidth, summaryHeight, 16).fill();
  doc.restore();

  const columns = [
    { label: 'Final Score', value: `${performance.score}/100` },
    { label: 'Issued On', value: formatDate(performance.issueDate) },
    { label: 'Verification Code', value: performance.verificationCode },
  ];

  const columnWidth = summaryWidth / columns.length;
  columns.forEach((column, index) => {
    const columnX = summaryX + index * columnWidth;
    doc.font('Helvetica-Bold')
      .fontSize(10)
      .fillColor(theme.gold)
      .text(column.label.toUpperCase(), columnX, summaryTop + 10, {
        width: columnWidth,
        align: 'center',
      });
    doc.font('Helvetica')
      .fontSize(12)
      .fillColor(theme.textPrimary)
      .text(column.value, columnX, summaryTop + 28, {
        width: columnWidth,
        align: 'center',
      });
  });
}

function drawSignatures(doc, signatureLayout, branding, assets, theme) {
  const blocks = [
    {
      x: signatureLayout.leftX,
      signature: branding.signatures.left,
      imageBuffer: assets.signatureLeftBuffer,
    },
    {
      x: signatureLayout.rightX,
      signature: branding.signatures.right,
      imageBuffer: assets.signatureRightBuffer,
    },
  ];

  blocks.forEach(({ x }) => {
    doc.strokeColor('#D6D6D6')
      .lineWidth(1.2)
      .moveTo(x, signatureLayout.lineY)
      .lineTo(x + signatureLayout.width, signatureLayout.lineY)
      .stroke();
  });

  blocks.forEach(({ x, signature, imageBuffer }) => {
    drawSignatureBlock(doc, signatureLayout, x, signature, imageBuffer, theme);
  });
}

function drawSignatureBlock(
  doc,
  layout,
  positionX,
  signature,
  imageBuffer,
  theme
) {
  const imageWidth = Math.min(layout.width, 100);
  if (imageBuffer) {
    const imageX = positionX + (layout.width - imageWidth) / 2;
    const imageY = layout.lineY - layout.imageHeight - 2;
    doc.image(imageBuffer, imageX, imageY, {
      width: imageWidth,
      height: layout.imageHeight,
      fit: [imageWidth, layout.imageHeight],
    });
  }

  doc.font('Helvetica-Bold')
    .fontSize(12)
    .fillColor(theme.textPrimary)
    .text(signature?.name || '', positionX, layout.lineY + 10, {
      width: layout.width,
      align: 'center',
    });

  doc.font('Helvetica')
    .fontSize(10)
    .fillColor(theme.textMuted)
    .text(signature?.title || '', positionX, layout.lineY + 26, {
      width: layout.width,
      align: 'center',
    });
}

function drawFooter(doc, theme, certificateNumber, branding, pageWidth, pageHeight) {
  doc.save();
  const footerHeight = 60;
  const footerY = pageHeight - footerHeight - 10;
  doc.rect(0, footerY, pageWidth, footerHeight).fill(theme.accent);
  doc.fillColor('#FFFFFF')
    .font('Helvetica-Bold')
    .fontSize(12)
    .text(branding.organizationName || 'ELIMUU', 40, footerY + 14, {
      width: pageWidth - 80,
      align: 'left',
    });

  doc.font('Helvetica')
    .fontSize(11)
    .text(`Certificate No: ${certificateNumber}`, 0, footerY + 24, {
      width: pageWidth,
      align: 'center',
    });

  doc.font('Helvetica')
    .fontSize(9)
    .text(
      "Vérifiez l'authenticité avec le code de vérification ci-dessus",
      0,
      footerY + 38,
      {
        width: pageWidth,
        align: 'center',
      }
    );
  doc.restore();
}

function getSignatureLayout(pageWidth, pageHeight) {
  const width = 150;
  const leftX = 90;
  const rightX = pageWidth - width - 90;
  const lineY = pageHeight - 115;
  return {
    width,
    leftX,
    rightX,
    lineY,
    imageHeight: 55,
    badgeGap: 24,
    minBadgeWidth: 240,
  };
}

function getLevelStyle(level) {
  return LEVEL_STYLES[level] || LEVEL_STYLES.default;
}

async function loadBrandingAssets(branding) {
  const [logoBuffer, signatureLeftBuffer, signatureRightBuffer] =
    await Promise.all([
      fetchImageBuffer(branding.logoUrl),
      fetchImageBuffer(branding.signatures.left?.imageUrl),
      fetchImageBuffer(branding.signatures.right?.imageUrl),
    ]);

  return {
    logoBuffer,
    signatureLeftBuffer,
    signatureRightBuffer,
  };
}

async function fetchImageBuffer(url) {
  if (!url) return null;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load image from ${url} (status ${response.status})`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.warn(`Certificate image load failed for ${url}:`, error.message);
    return null;
  }
}

function normalizeBrandingInput(data = {}) {
  const baseBranding = data.branding ? { ...data.branding } : {};
  const baseSignatures = {
    left: { ...(baseBranding.signatures?.left || {}) },
    right: { ...(baseBranding.signatures?.right || {}) },
  };

  const overrides = {
    ...baseBranding,
    signatures: baseSignatures,
  };

  const directMappings = [
    'organizationName',
    'organizationTagline',
    'logoUrl',
    'watermarkText',
  ];

  directMappings.forEach((key) => {
    if (data[key]) {
      overrides[key] = data[key];
    }
  });

  if (data.signatures) {
    overrides.signatures.left = {
      ...overrides.signatures.left,
      ...(data.signatures.left || {}),
    };
    overrides.signatures.right = {
      ...overrides.signatures.right,
      ...(data.signatures.right || {}),
    };
  }

  overrides.signatures.left = {
    ...overrides.signatures.left,
    ...pickDefined(
      {
        name: data.signatureLeftName,
        title: data.signatureLeftTitle,
        imageUrl: data.signatureLeftImage,
      },
      ['name', 'title', 'imageUrl']
    ),
  };

  overrides.signatures.right = {
    ...overrides.signatures.right,
    ...pickDefined(
      {
        name: data.signatureRightName,
        title: data.signatureRightTitle,
        imageUrl: data.signatureRightImage,
      },
      ['name', 'title', 'imageUrl']
    ),
  };

  return overrides;
}

function mergeBranding(overrides = {}) {
  const branding = {
    ...DEFAULT_BRANDING,
    ...pickDefined(overrides, [
      'organizationName',
      'organizationTagline',
      'logoUrl',
      'watermarkText',
    ]),
  };

  branding.signatures = {
    left: {
      ...DEFAULT_BRANDING.signatures.left,
      ...pickDefined(overrides.signatures?.left || {}, ['name', 'title', 'imageUrl']),
    },
    right: {
      ...DEFAULT_BRANDING.signatures.right,
      ...pickDefined(overrides.signatures?.right || {}, ['name', 'title', 'imageUrl']),
    },
  };

  return branding;
}

function pickDefined(source = {}, keys = []) {
  return keys.reduce((acc, key) => {
    const value = source[key];
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {});
}

function resolveEnv(key, fallback) {
  return (
    process.env[key] ||
    process.env[`NEXT_PUBLIC_${key}`] ||
    fallback
  );
}




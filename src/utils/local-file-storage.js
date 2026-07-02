import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const DEFAULT_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const PUBLIC_UPLOAD_PREFIX = "/uploads/";

const MIME_EXTENSION_MAP = {
  "application/pdf": ".pdf",
  "image/gif": ".gif",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/svg+xml": ".svg",
  "image/webp": ".webp",
  "text/plain": ".txt",
  "video/mp4": ".mp4",
  "video/quicktime": ".mov",
  "video/webm": ".webm",
  "video/x-msvideo": ".avi",
  "video/x-matroska": ".mkv",
};

function getUploadDir() {
  return process.env.UPLOAD_DIR || DEFAULT_UPLOAD_DIR;
}

function sanitizeNamePart(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getFileExtension(file) {
  const originalExtension = path.extname(file?.name || "");

  if (originalExtension) {
    return originalExtension.toLowerCase();
  }

  return MIME_EXTENSION_MAP[file?.type] || "";
}

function buildStoredFileName(file, prefix = "file") {
  const normalizedPrefix = sanitizeNamePart(prefix) || "file";
  const extension = getFileExtension(file);
  return `${normalizedPrefix}-${Date.now()}-${randomUUID()}${extension}`;
}

function normalizePublicIdentifier(identifier) {
  if (!identifier) {
    return null;
  }

  let normalized = String(identifier).trim();

  if (!normalized) {
    return null;
  }

  if (/^https?:\/\//i.test(normalized)) {
    try {
      normalized = new URL(normalized).pathname;
    } catch {
      return null;
    }
  }

  if (normalized.startsWith(PUBLIC_UPLOAD_PREFIX)) {
    normalized = normalized.slice(PUBLIC_UPLOAD_PREFIX.length);
  }

  normalized = normalized.replace(/^\/+/, "");

  if (!normalized || normalized.includes("..")) {
    return null;
  }

  return normalized;
}

export async function ensureUploadDir() {
  await fs.mkdir(getUploadDir(), { recursive: true });
}

export async function saveUploadedFile(file, options = {}) {
  if (!file || typeof file.arrayBuffer !== "function") {
    throw new Error("No valid file provided for upload");
  }

  await ensureUploadDir();

  const prefix = options.prefix || "file";
  const fileName = buildStoredFileName(file, prefix);
  const filePath = path.join(getUploadDir(), fileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.writeFile(filePath, buffer);

  return {
    contentType: file.type || "application/octet-stream",
    fileName,
    filePath,
    public_id: fileName,
    size: buffer.length,
    url: `${PUBLIC_UPLOAD_PREFIX}${fileName}`,
  };
}

export async function saveBufferAsFile(buffer, options = {}) {
  await ensureUploadDir();

  const prefix = options.prefix || "file";
  const extension = options.extension
    ? options.extension.startsWith(".")
      ? options.extension
      : `.${options.extension}`
    : "";
  const providedName = options.fileName
    ? `${sanitizeNamePart(path.basename(options.fileName, path.extname(options.fileName))) || prefix}${extension || path.extname(options.fileName)}`
    : null;
  const fileName =
    providedName || `${sanitizeNamePart(prefix) || "file"}-${Date.now()}-${randomUUID()}${extension}`;
  const filePath = path.join(getUploadDir(), fileName);

  await fs.writeFile(filePath, buffer);

  return {
    fileName,
    filePath,
    public_id: fileName,
    size: buffer.length,
    url: `${PUBLIC_UPLOAD_PREFIX}${fileName}`,
  };
}

export async function deleteStoredFile(identifier) {
  const normalizedIdentifier = normalizePublicIdentifier(identifier);

  if (!normalizedIdentifier) {
    return { deleted: false, reason: "invalid_identifier" };
  }

  const filePath = path.join(getUploadDir(), normalizedIdentifier);
  const uploadRoot = path.resolve(getUploadDir());
  const resolvedFilePath = path.resolve(filePath);

  if (!resolvedFilePath.startsWith(uploadRoot)) {
    return { deleted: false, reason: "outside_upload_dir" };
  }

  try {
    await fs.unlink(resolvedFilePath);
    return { deleted: true, filePath: resolvedFilePath };
  } catch (error) {
    if (error.code === "ENOENT") {
      return { deleted: false, reason: "not_found", filePath: resolvedFilePath };
    }

    throw error;
  }
}

export function isLocalUploadReference(value) {
  return Boolean(normalizePublicIdentifier(value));
}

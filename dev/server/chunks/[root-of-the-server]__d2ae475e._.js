module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/security/crypto.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Security Core - Cryptographic Functions
 * Uses Web Crypto API for maximum security
 */ // Constants
__turbopack_context__.s([
    "createJWT",
    ()=>createJWT,
    "decryptData",
    ()=>decryptData,
    "encryptData",
    ()=>encryptData,
    "generateAPIKey",
    ()=>generateAPIKey,
    "generateSecureRandom",
    ()=>generateSecureRandom,
    "generateTOTPSecret",
    ()=>generateTOTPSecret,
    "generateUUID",
    ()=>generateUUID,
    "hashAPIKey",
    ()=>hashAPIKey,
    "hashPIN",
    ()=>hashPIN,
    "verifyJWT",
    ()=>verifyJWT,
    "verifyPIN",
    ()=>verifyPIN,
    "verifyTOTP",
    ()=>verifyTOTP
]);
const JWT_ALGORITHM = "HS256";
const PIN_SALT_ROUNDS = 12;
const TOKEN_EXPIRY = 15 * 60 * 1000 // 15 minutes for access token
;
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7 days
;
// Get secret key from environment
function getSecretKey() {
    const secret = process.env.JWT_SECRET || process.env.AUTH_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error("JWT_SECRET must be at least 32 characters");
    }
    return new TextEncoder().encode(secret);
}
function generateSecureRandom(length) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (byte)=>byte.toString(16).padStart(2, "0")).join("");
}
function generateUUID() {
    return crypto.randomUUID();
}
// HMAC-SHA256 signing
async function hmacSign(data, key) {
    const cryptoKey = await crypto.subtle.importKey("raw", key, {
        name: "HMAC",
        hash: "SHA-256"
    }, false, [
        "sign"
    ]);
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data));
    return btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
// HMAC-SHA256 verification
async function hmacVerify(data, signature, key) {
    const expectedSignature = await hmacSign(data, key);
    // Timing-safe comparison
    if (signature.length !== expectedSignature.length) return false;
    let result = 0;
    for(let i = 0; i < signature.length; i++){
        result |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
    }
    return result === 0;
}
// Base64URL encode
function base64UrlEncode(str) {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
// Base64URL decode
function base64UrlDecode(str) {
    const padded = str + "=".repeat((4 - str.length % 4) % 4);
    return atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
}
async function createJWT(payload, expiresIn) {
    const secretKey = getSecretKey();
    const now = Date.now();
    const expiry = payload.type === "refresh" ? REFRESH_TOKEN_EXPIRY : TOKEN_EXPIRY;
    const fullPayload = {
        ...payload,
        iat: now,
        exp: now + (expiresIn || expiry),
        jti: generateUUID()
    };
    const header = {
        alg: JWT_ALGORITHM,
        typ: "JWT"
    };
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
    const signature = await hmacSign(`${encodedHeader}.${encodedPayload}`, secretKey);
    return `${encodedHeader}.${encodedPayload}.${signature}`;
}
async function verifyJWT(token) {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const [encodedHeader, encodedPayload, signature] = parts;
        const secretKey = getSecretKey();
        // Verify signature
        const isValid = await hmacVerify(`${encodedHeader}.${encodedPayload}`, signature, secretKey);
        if (!isValid) return null;
        // Decode payload
        const payload = JSON.parse(base64UrlDecode(encodedPayload));
        // Check expiration
        if (payload.exp < Date.now()) return null;
        return payload;
    } catch  {
        return null;
    }
}
async function hashPIN(pin, salt) {
    const pinSalt = salt || generateSecureRandom(32);
    const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, [
        "deriveBits"
    ]);
    const derivedBits = await crypto.subtle.deriveBits({
        name: "PBKDF2",
        salt: new TextEncoder().encode(pinSalt),
        iterations: 100000,
        hash: "SHA-256"
    }, keyMaterial, 256);
    const hash = Array.from(new Uint8Array(derivedBits), (byte)=>byte.toString(16).padStart(2, "0")).join("");
    return {
        hash,
        salt: pinSalt
    };
}
async function verifyPIN(pin, storedHash, salt) {
    const { hash } = await hashPIN(pin, salt);
    // Timing-safe comparison
    if (hash.length !== storedHash.length) return false;
    let result = 0;
    for(let i = 0; i < hash.length; i++){
        result |= hash.charCodeAt(i) ^ storedHash.charCodeAt(i);
    }
    return result === 0;
}
function generateTOTPSecret() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let secret = "";
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    for(let i = 0; i < 32; i++){
        secret += chars[array[i] % chars.length];
    }
    return secret;
}
async function verifyTOTP(secret, code, window = 1) {
    if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) return false;
    const time = Math.floor(Date.now() / 30000);
    for(let i = -window; i <= window; i++){
        const expectedCode = await generateTOTPCode(secret, time + i);
        // Timing-safe comparison
        if (expectedCode.length === code.length) {
            let result = 0;
            for(let j = 0; j < code.length; j++){
                result |= code.charCodeAt(j) ^ expectedCode.charCodeAt(j);
            }
            if (result === 0) return true;
        }
    }
    return false;
}
// Generate TOTP Code
async function generateTOTPCode(secret, counter) {
    // Decode base32 secret
    const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let bits = "";
    for (const char of secret.toUpperCase()){
        const val = base32Chars.indexOf(char);
        if (val === -1) continue;
        bits += val.toString(2).padStart(5, "0");
    }
    const secretBytes = new Uint8Array(Math.floor(bits.length / 8));
    for(let i = 0; i < secretBytes.length; i++){
        secretBytes[i] = parseInt(bits.substr(i * 8, 8), 2);
    }
    // Create counter buffer (8 bytes, big-endian)
    const counterBuffer = new ArrayBuffer(8);
    const counterView = new DataView(counterBuffer);
    counterView.setUint32(4, counter, false);
    // HMAC-SHA1
    const key = await crypto.subtle.importKey("raw", secretBytes, {
        name: "HMAC",
        hash: "SHA-1"
    }, false, [
        "sign"
    ]);
    const signature = await crypto.subtle.sign("HMAC", key, counterBuffer);
    const hmacResult = new Uint8Array(signature);
    // Dynamic truncation
    const offset = hmacResult[hmacResult.length - 1] & 0xf;
    const binary = (hmacResult[offset] & 0x7f) << 24 | (hmacResult[offset + 1] & 0xff) << 16 | (hmacResult[offset + 2] & 0xff) << 8 | hmacResult[offset + 3] & 0xff;
    const otp = binary % 1000000;
    return otp.toString().padStart(6, "0");
}
function generateAPIKey() {
    const prefix = "pf_live_";
    const key = generateSecureRandom(32);
    return `${prefix}${key}`;
}
async function hashAPIKey(apiKey) {
    const encoder = new TextEncoder();
    const data = encoder.encode(apiKey);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = new Uint8Array(hashBuffer);
    return Array.from(hashArray, (byte)=>byte.toString(16).padStart(2, "0")).join("");
}
async function encryptData(data, key) {
    const secretKey = key || process.env.ENCRYPTION_KEY || process.env.JWT_SECRET;
    if (!secretKey) throw new Error("Encryption key not configured");
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(secretKey.slice(0, 32).padEnd(32, "0")), "AES-GCM", false, [
        "encrypt"
    ]);
    const encrypted = await crypto.subtle.encrypt({
        name: "AES-GCM",
        iv
    }, keyMaterial, encoder.encode(data));
    return {
        encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
        iv: btoa(String.fromCharCode(...iv))
    };
}
async function decryptData(encrypted, iv, key) {
    const secretKey = key || process.env.ENCRYPTION_KEY || process.env.JWT_SECRET;
    if (!secretKey) throw new Error("Encryption key not configured");
    const decoder = new TextDecoder();
    const ivArray = new Uint8Array(atob(iv).split("").map((c)=>c.charCodeAt(0)));
    const encryptedArray = new Uint8Array(atob(encrypted).split("").map((c)=>c.charCodeAt(0)));
    const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(secretKey.slice(0, 32).padEnd(32, "0")), "AES-GCM", false, [
        "decrypt"
    ]);
    const decrypted = await crypto.subtle.decrypt({
        name: "AES-GCM",
        iv: ivArray
    }, keyMaterial, encryptedArray);
    return decoder.decode(decrypted);
}
}),
"[project]/lib/security/rate-limiter.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Rate Limiter - Prevents brute force and DDoS attacks
 * Uses in-memory storage (use Redis in production)
 */ __turbopack_context__.s([
    "RATE_LIMITS",
    ()=>RATE_LIMITS,
    "checkRateLimit",
    ()=>checkRateLimit,
    "getClientIP",
    ()=>getClientIP,
    "resetFailedAttempts",
    ()=>resetFailedAttempts,
    "trackFailedAttempt",
    ()=>trackFailedAttempt
]);
const RATE_LIMITS = {
    // Auth endpoints - very strict
    "auth/login": {
        maxRequests: 5,
        windowMs: 60000,
        blockDurationMs: 900000
    },
    "auth/register": {
        maxRequests: 3,
        windowMs: 60000,
        blockDurationMs: 3600000
    },
    "auth/2fa": {
        maxRequests: 5,
        windowMs: 60000,
        blockDurationMs: 900000
    },
    // PIN validation - very strict
    "security/pin": {
        maxRequests: 5,
        windowMs: 300000,
        blockDurationMs: 900000
    },
    // Transactions - moderate
    "transfers": {
        maxRequests: 10,
        windowMs: 60000,
        blockDurationMs: 300000
    },
    "deposits": {
        maxRequests: 10,
        windowMs: 60000,
        blockDurationMs: 300000
    },
    // Webhooks - moderate
    "webhooks": {
        maxRequests: 30,
        windowMs: 60000,
        blockDurationMs: 60000
    },
    // Default
    default: {
        maxRequests: 100,
        windowMs: 60000,
        blockDurationMs: 60000
    }
};
// In-memory storage (replace with Redis in production)
const rateLimitStore = new Map();
// Clean up old entries periodically
setInterval(()=>{
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()){
        const config = getConfigForKey(key);
        if (now - entry.firstRequest > config.windowMs * 2) {
            rateLimitStore.delete(key);
        }
    }
}, 60000);
function getConfigForKey(key) {
    // Extract endpoint type from key
    for (const [endpoint, config] of Object.entries(RATE_LIMITS)){
        if (key.includes(endpoint)) {
            return config;
        }
    }
    return RATE_LIMITS.default;
}
function checkRateLimit(identifier, endpoint) {
    const key = `${endpoint}:${identifier}`;
    const config = RATE_LIMITS[endpoint] || RATE_LIMITS.default;
    const now = Date.now();
    let entry = rateLimitStore.get(key);
    // Check if blocked
    if (entry?.blockedUntil && now < entry.blockedUntil) {
        return {
            allowed: false,
            remaining: 0,
            resetAt: entry.blockedUntil,
            blockedUntil: entry.blockedUntil,
            retryAfter: Math.ceil((entry.blockedUntil - now) / 1000)
        };
    }
    // Reset if window expired
    if (!entry || now - entry.firstRequest > config.windowMs) {
        entry = {
            count: 0,
            firstRequest: now
        };
    }
    entry.count++;
    // Check if limit exceeded
    if (entry.count > config.maxRequests) {
        entry.blockedUntil = now + config.blockDurationMs;
        rateLimitStore.set(key, entry);
        return {
            allowed: false,
            remaining: 0,
            resetAt: entry.blockedUntil,
            blockedUntil: entry.blockedUntil,
            retryAfter: Math.ceil(config.blockDurationMs / 1000)
        };
    }
    rateLimitStore.set(key, entry);
    return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetAt: entry.firstRequest + config.windowMs
    };
}
// Track failed attempts (for PIN, login, etc.)
const failedAttemptsStore = new Map();
function trackFailedAttempt(identifier, maxAttempts = 5, windowMs = 900000 // 15 minutes
) {
    const now = Date.now();
    let entry = failedAttemptsStore.get(identifier);
    // Reset if window expired
    if (!entry || now - entry.lastAttempt > windowMs) {
        entry = {
            count: 0,
            lastAttempt: now
        };
    }
    entry.count++;
    entry.lastAttempt = now;
    failedAttemptsStore.set(identifier, entry);
    if (entry.count >= maxAttempts) {
        return {
            blocked: true,
            attemptsRemaining: 0,
            resetAt: entry.lastAttempt + windowMs
        };
    }
    return {
        blocked: false,
        attemptsRemaining: maxAttempts - entry.count
    };
}
function resetFailedAttempts(identifier) {
    failedAttemptsStore.delete(identifier);
}
function getClientIP(request) {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    const realIP = request.headers.get("x-real-ip");
    if (realIP) {
        return realIP;
    }
    return "unknown";
}
}),
"[project]/lib/security/auth-middleware.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Authentication Middleware
 * Handles JWT verification, API key validation, and request authentication
 */ __turbopack_context__.s([
    "SECURITY_HEADERS",
    ()=>SECURITY_HEADERS,
    "isValidCPF",
    ()=>isValidCPF,
    "isValidEmail",
    ()=>isValidEmail,
    "isValidPIN",
    ()=>isValidPIN,
    "isValidPhone",
    ()=>isValidPhone,
    "logSecurityEvent",
    ()=>logSecurityEvent,
    "sanitizeInput",
    ()=>sanitizeInput,
    "validateRequestBody",
    ()=>validateRequestBody,
    "verifyAPIKey",
    ()=>verifyAPIKey,
    "verifyAuth",
    ()=>verifyAuth,
    "withAuth",
    ()=>withAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$crypto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/security/crypto.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$rate$2d$limiter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/security/rate-limiter.ts [app-route] (ecmascript)");
;
;
;
const SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-src 'self' https://accounts.google.com;"
};
async function verifyAuth(request) {
    try {
        const authHeader = request.headers.get("authorization");
        if (!authHeader) {
            return {
                authenticated: false,
                error: "No authorization header",
                statusCode: 401
            };
        }
        // Check for Bearer token
        if (!authHeader.startsWith("Bearer ")) {
            return {
                authenticated: false,
                error: "Invalid authorization format",
                statusCode: 401
            };
        }
        const token = authHeader.slice(7);
        if (!token || token.length < 10) {
            return {
                authenticated: false,
                error: "Invalid token",
                statusCode: 401
            };
        }
        // Verify JWT
        const payload = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$crypto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyJWT"])(token);
        if (!payload) {
            return {
                authenticated: false,
                error: "Invalid or expired token",
                statusCode: 401
            };
        }
        // Check if access token (not refresh)
        if (payload.type !== "access") {
            return {
                authenticated: false,
                error: "Invalid token type",
                statusCode: 401
            };
        }
        return {
            authenticated: true,
            user: payload
        };
    } catch (error) {
        console.error("[Auth] Verification error:", error);
        return {
            authenticated: false,
            error: "Authentication failed",
            statusCode: 500
        };
    }
}
async function verifyAPIKey(request) {
    try {
        const apiKey = request.headers.get("x-api-key");
        if (!apiKey) {
            return {
                valid: false,
                error: "No API key provided"
            };
        }
        // Check API key format
        if (!apiKey.startsWith("pf_live_") && !apiKey.startsWith("pf_test_")) {
            return {
                valid: false,
                error: "Invalid API key format"
            };
        }
        // Hash the API key for comparison
        const hashedKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$crypto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hashAPIKey"])(apiKey);
        // In production: Look up hashed key in database
        // const apiKeyRecord = await db.apiKeys.findByHash(hashedKey)
        // For now, validate format only
        return {
            valid: true,
            userId: "api_user",
            permissions: [
                "read",
                "write"
            ]
        };
    } catch (error) {
        console.error("[APIKey] Verification error:", error);
        return {
            valid: false,
            error: "API key verification failed"
        };
    }
}
async function withAuth(request, handler, options = {}) {
    const { endpoint = "default", requireAuth = true, allowAPIKey = false } = options;
    // Rate limiting
    const clientIP = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$rate$2d$limiter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getClientIP"])(request);
    const rateLimit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$rate$2d$limiter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkRateLimit"])(clientIP, endpoint);
    if (!rateLimit.allowed) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Rate limit exceeded",
            retryAfter: rateLimit.retryAfter
        }, {
            status: 429,
            headers: {
                ...SECURITY_HEADERS,
                "Retry-After": String(rateLimit.retryAfter || 60),
                "X-RateLimit-Remaining": "0",
                "X-RateLimit-Reset": String(rateLimit.resetAt)
            }
        });
    }
    // Try API Key first if allowed
    if (allowAPIKey) {
        const apiKeyResult = await verifyAPIKey(request);
        if (apiKeyResult.valid) {
            const syntheticUser = {
                sub: apiKeyResult.userId || "api_user",
                email: "api@fluxpay.com",
                iat: Date.now(),
                exp: Date.now() + 3600000,
                jti: crypto.randomUUID(),
                type: "access"
            };
            const response = await handler(request, syntheticUser);
            // Add security headers and rate limit info
            Object.entries(SECURITY_HEADERS).forEach(([key, value])=>{
                response.headers.set(key, value);
            });
            response.headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));
            response.headers.set("X-RateLimit-Reset", String(rateLimit.resetAt));
            return response;
        }
    }
    // Verify JWT
    const authResult = await verifyAuth(request);
    if (requireAuth && !authResult.authenticated) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: authResult.error || "Unauthorized"
        }, {
            status: authResult.statusCode || 401,
            headers: SECURITY_HEADERS
        });
    }
    // Call handler with user
    const response = await handler(request, authResult.user);
    // Add security headers and rate limit info
    Object.entries(SECURITY_HEADERS).forEach(([key, value])=>{
        response.headers.set(key, value);
    });
    response.headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));
    response.headers.set("X-RateLimit-Reset", String(rateLimit.resetAt));
    return response;
}
function validateRequestBody(body, requiredFields, validators) {
    if (!body || typeof body !== "object") {
        return {
            valid: false,
            error: "Invalid request body"
        };
    }
    const data = body;
    // Check required fields
    for (const field of requiredFields){
        if (!(field in data) || data[field] === undefined || data[field] === null) {
            return {
                valid: false,
                error: `Missing required field: ${String(field)}`
            };
        }
    }
    // Run custom validators
    if (validators) {
        for (const [field, validator] of Object.entries(validators)){
            if (validator && !validator(data[field])) {
                return {
                    valid: false,
                    error: `Invalid value for field: ${field}`
                };
            }
        }
    }
    return {
        valid: true,
        data: data
    };
}
function sanitizeInput(input) {
    return input.trim().replace(/[<>]/g, "") // Remove HTML brackets
    .replace(/javascript:/gi, "") // Remove javascript: URLs
    .replace(/on\w+=/gi, "") // Remove event handlers
    .slice(0, 10000) // Limit length
    ;
}
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 254;
}
function isValidCPF(cpf) {
    const cleanCPF = cpf.replace(/\D/g, "");
    if (cleanCPF.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false // All same digits
    ;
    // Validate check digits
    let sum = 0;
    for(let i = 0; i < 9; i++){
        sum += parseInt(cleanCPF[i]) * (10 - i);
    }
    let remainder = sum * 10 % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(cleanCPF[9])) return false;
    sum = 0;
    for(let i = 0; i < 10; i++){
        sum += parseInt(cleanCPF[i]) * (11 - i);
    }
    remainder = sum * 10 % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(cleanCPF[10])) return false;
    return true;
}
function isValidPhone(phone) {
    const cleanPhone = phone.replace(/\D/g, "");
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
}
function isValidPIN(pin) {
    return /^\d{6}$/.test(pin);
}
function logSecurityEvent(event, details, severity = "info") {
    const logEntry = {
        timestamp: new Date().toISOString(),
        event,
        severity,
        ...details
    };
    // In production: Send to security logging service (e.g., Datadog, Splunk)
    console.log(`[Security:${severity.toUpperCase()}]`, JSON.stringify(logEntry));
    // For critical events, send Discord notification
    if (severity === "critical" && process.env.DISCORD_ADMIN_WEBHOOK) {
        fetch(process.env.DISCORD_ADMIN_WEBHOOK, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: "fluxpay Security",
                embeds: [
                    {
                        title: `Security Alert: ${event}`,
                        color: 0xff0000,
                        fields: Object.entries(details).map(([name, value])=>({
                                name,
                                value: String(value),
                                inline: true
                            })),
                        timestamp: new Date().toISOString()
                    }
                ]
            })
        }).catch(()=>{});
    }
}
}),
"[project]/lib/security/audit-log.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Audit Logger - Records all security-relevant actions
 * Immutable audit trail for compliance and forensics
 */ __turbopack_context__.s([
    "createAuditEntry",
    ()=>createAuditEntry,
    "exportAuditLog",
    ()=>exportAuditLog,
    "queryAuditLog",
    ()=>queryAuditLog,
    "verifyEntryIntegrity",
    ()=>verifyEntryIntegrity
]);
// In-memory store (use database in production)
const auditLog = [];
// Generate integrity hash for audit entry
async function generateEntryHash(entry) {
    const data = JSON.stringify(entry);
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
    const hashArray = new Uint8Array(hashBuffer);
    return Array.from(hashArray, (byte)=>byte.toString(16).padStart(2, "0")).join("");
}
async function createAuditEntry(action, params) {
    const entry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        action,
        userId: params.userId,
        userEmail: params.userEmail,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        resource: params.resource,
        resourceId: params.resourceId,
        details: params.details,
        metadata: {
            requestId: params.requestId,
            sessionId: params.sessionId
        }
    };
    // Generate integrity hash
    const hash = await generateEntryHash(entry);
    const completeEntry = {
        ...entry,
        hash
    };
    // Store entry
    auditLog.push(completeEntry);
    // Keep only last 10000 entries in memory (in production, use database)
    if (auditLog.length > 10000) {
        auditLog.shift();
    }
    // Log to console for development
    console.log(`[Audit] ${action}`, {
        userId: params.userId,
        ip: params.ipAddress,
        resource: params.resource
    });
    // Send critical events to Discord
    const criticalActions = [
        "security.suspicious_activity",
        "security.account_locked",
        "transfer.failed",
        "user.login_failed"
    ];
    if (criticalActions.includes(action) && process.env.DISCORD_ADMIN_WEBHOOK) {
        sendDiscordAlert(completeEntry);
    }
    return completeEntry;
}
// Send Discord alert for critical events
async function sendDiscordAlert(entry) {
    const webhookUrl = process.env.DISCORD_ADMIN_WEBHOOK;
    if (!webhookUrl) return;
    const colorMap = {
        "security.suspicious_activity": 0xff0000,
        "security.account_locked": 0xff6600,
        "security.rate_limited": 0xffcc00,
        "transfer.failed": 0xff9900,
        "user.login_failed": 0xffcc00
    };
    try {
        await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: "fluxpay Security",
                avatar_url: "https://ui-avatars.com/api/?name=Security&background=ff0000&color=fff",
                embeds: [
                    {
                        title: `Audit Alert: ${entry.action}`,
                        color: colorMap[entry.action] || 0xff0000,
                        fields: [
                            {
                                name: "User ID",
                                value: entry.userId || "N/A",
                                inline: true
                            },
                            {
                                name: "IP Address",
                                value: entry.ipAddress,
                                inline: true
                            },
                            {
                                name: "Resource",
                                value: entry.resource || "N/A",
                                inline: true
                            },
                            {
                                name: "Details",
                                value: entry.details ? JSON.stringify(entry.details).slice(0, 500) : "N/A",
                                inline: false
                            }
                        ],
                        footer: {
                            text: `Entry ID: ${entry.id}`
                        },
                        timestamp: entry.timestamp
                    }
                ]
            })
        });
    } catch (error) {
        console.error("[Audit] Failed to send Discord alert:", error);
    }
}
function queryAuditLog(params) {
    let results = [
        ...auditLog
    ];
    if (params.userId) {
        results = results.filter((e)=>e.userId === params.userId);
    }
    if (params.action) {
        results = results.filter((e)=>e.action === params.action);
    }
    if (params.startDate) {
        results = results.filter((e)=>new Date(e.timestamp) >= params.startDate);
    }
    if (params.endDate) {
        results = results.filter((e)=>new Date(e.timestamp) <= params.endDate);
    }
    // Sort by timestamp descending
    results.sort((a, b)=>new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    // Apply pagination
    const offset = params.offset || 0;
    const limit = params.limit || 100;
    return results.slice(offset, offset + limit);
}
async function verifyEntryIntegrity(entry) {
    const { hash, ...entryWithoutHash } = entry;
    const expectedHash = await generateEntryHash(entryWithoutHash);
    return hash === expectedHash;
}
function exportAuditLog(format = "json") {
    if (format === "csv") {
        const headers = [
            "id",
            "timestamp",
            "action",
            "userId",
            "userEmail",
            "ipAddress",
            "resource",
            "resourceId"
        ];
        const rows = auditLog.map((entry)=>headers.map((h)=>JSON.stringify(entry[h] || "")).join(","));
        return [
            headers.join(","),
            ...rows
        ].join("\n");
    }
    return JSON.stringify(auditLog, null, 2);
}
}),
"[project]/lib/security/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Security Module - Main Export
 * Centralized security utilities for fluxpay
 */ // Cryptographic functions
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$crypto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/security/crypto.ts [app-route] (ecmascript)");
// Rate limiting
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$rate$2d$limiter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/security/rate-limiter.ts [app-route] (ecmascript)");
// Authentication middleware
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/security/auth-middleware.ts [app-route] (ecmascript)");
// Audit logging
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$audit$2d$log$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/security/audit-log.ts [app-route] (ecmascript)");
;
;
;
;
}),
"[project]/app/api/auth/register/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/security/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$crypto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/security/crypto.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$rate$2d$limiter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/security/rate-limiter.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/security/auth-middleware.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$audit$2d$log$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/security/audit-log.ts [app-route] (ecmascript)");
;
;
// Send notification to admin Discord webhook
async function notifyAdminNewAccount(user) {
    const webhookUrl = process.env.DISCORD_ADMIN_WEBHOOK;
    if (!webhookUrl) return;
    try {
        const cpfMasked = user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.***.***-$4");
        const phoneMasked = user.telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) *****-$3");
        await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: "fluxpay Admin",
                avatar_url: "https://ui-avatars.com/api/?name=PF&background=10b981&color=fff&bold=true",
                embeds: [
                    {
                        title: "Nova Conta Criada",
                        color: 0x10b981,
                        thumbnail: {
                            url: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nomeCompleto)}&background=10b981&color=fff`
                        },
                        fields: [
                            {
                                name: "ID",
                                value: `\`${user.id}\``,
                                inline: true
                            },
                            {
                                name: "Nome",
                                value: user.nomeCompleto,
                                inline: true
                            },
                            {
                                name: "Email",
                                value: user.email,
                                inline: false
                            },
                            {
                                name: "CPF",
                                value: cpfMasked,
                                inline: true
                            },
                            {
                                name: "Telefone",
                                value: phoneMasked,
                                inline: true
                            },
                            {
                                name: "Data Nascimento",
                                value: user.dataNascimento,
                                inline: true
                            },
                            {
                                name: "IP",
                                value: user.ipAddress,
                                inline: true
                            }
                        ],
                        footer: {
                            text: "fluxpay Gateway - Sistema de Notificacoes"
                        },
                        timestamp: user.createdAt
                    }
                ]
            })
        });
    } catch (error) {
        console.error("[Admin] Discord notification failed:", error);
    }
}
async function POST(request) {
    const clientIP = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$rate$2d$limiter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getClientIP"])(request);
    const userAgent = request.headers.get("user-agent") || "unknown";
    const requestId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$crypto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateUUID"])();
    try {
        // Rate limiting
        const rateLimit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$rate$2d$limiter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkRateLimit"])(clientIP, "auth/register");
        if (!rateLimit.allowed) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logSecurityEvent"])("registration_rate_limited", {
                ip: clientIP
            }, "warning");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$audit$2d$log$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuditEntry"])("security.rate_limited", {
                ipAddress: clientIP,
                userAgent,
                resource: "auth/register",
                requestId
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Muitas tentativas. Tente novamente mais tarde.",
                retryAfter: rateLimit.retryAfter
            }, {
                status: 429,
                headers: {
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SECURITY_HEADERS"],
                    "Retry-After": String(rateLimit.retryAfter || 60)
                }
            });
        }
        const body = await request.json();
        const { googleId, email, nomeCompleto, cpf, dataNascimento, telefone, pin, photoURL } = body;
        // Validate required fields
        if (!email || !nomeCompleto || !cpf || !dataNascimento || !telefone || !pin) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Campos obrigatorios ausentes"
            }, {
                status: 400,
                headers: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SECURITY_HEADERS"]
            });
        }
        // Sanitize inputs
        const sanitizedEmail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeInput"])(email).toLowerCase();
        const sanitizedName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeInput"])(nomeCompleto);
        const sanitizedCPF = cpf.replace(/\D/g, "");
        const sanitizedPhone = telefone.replace(/\D/g, "");
        // Validate email
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isValidEmail"])(sanitizedEmail)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Email invalido"
            }, {
                status: 400,
                headers: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SECURITY_HEADERS"]
            });
        }
        // Validate CPF
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isValidCPF"])(sanitizedCPF)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "CPF invalido"
            }, {
                status: 400,
                headers: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SECURITY_HEADERS"]
            });
        }
        // Validate phone
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isValidPhone"])(sanitizedPhone)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Telefone invalido"
            }, {
                status: 400,
                headers: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SECURITY_HEADERS"]
            });
        }
        // Validate PIN
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isValidPIN"])(pin)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "PIN deve ter 6 digitos numericos"
            }, {
                status: 400,
                headers: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SECURITY_HEADERS"]
            });
        }
        // Validate date format
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!dateRegex.test(dataNascimento)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Data de nascimento invalida"
            }, {
                status: 400,
                headers: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SECURITY_HEADERS"]
            });
        }
        // IMPORTANT: Check if user already exists before creating
        // In production: Check in real database
        // For now using in-memory store, but this must check real API/database
        // const existingUser = await db.users.findByEmail(sanitizedEmail) || await db.users.findByCPF(sanitizedCPF)
        // Simulated check - in production replace with real database check
        const users = {} // This should be replaced with real database query
        ;
        const existingUser = Object.values(users).find((u)=>u.email === sanitizedEmail || u.cpf === sanitizedCPF || googleId && u.googleId === googleId);
        if (existingUser) {
            // User already exists - do not create and do not send webhook
            // Instead, return error that user exists
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$audit$2d$log$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuditEntry"])("security.suspicious_activity", {
                userEmail: sanitizedEmail,
                ipAddress: clientIP,
                userAgent,
                resource: "auth/register",
                details: {
                    reason: "registration_attempt_existing_user",
                    existingUserId: existingUser.id
                },
                requestId
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Usuario ja existe. Use o login."
            }, {
                status: 409,
                headers: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SECURITY_HEADERS"]
            });
        }
        // Hash PIN securely
        const { hash: pinHash, salt: pinSalt } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$crypto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hashPIN"])(pin);
        // Generate user ID
        const userId = `user_${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$crypto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateSecureRandom"])(16)}`;
        const createdAt = new Date().toISOString();
        const newUser = {
            id: userId,
            googleId: googleId || null,
            email: sanitizedEmail,
            nomeCompleto: sanitizedName,
            cpf: sanitizedCPF,
            dataNascimento,
            telefone: sanitizedPhone,
            photoURL: photoURL || null,
            saldo: 0,
            createdAt,
            twoFactorEnabled: false,
            pinHash,
            pinSalt,
            apiKey: null,
            lastLogin: null,
            loginAttempts: 0,
            lockedUntil: null
        };
        // In production: Save to database
        // await db.users.create(newUser)
        // Store in memory (replace with real database)
        users[userId] = newUser;
        // Create audit entry
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$audit$2d$log$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuditEntry"])("user.created", {
            userId: newUser.id,
            userEmail: newUser.email,
            ipAddress: clientIP,
            userAgent,
            resource: "users",
            resourceId: newUser.id,
            details: {
                cpfLastDigits: sanitizedCPF.slice(-4),
                hasGoogleId: !!googleId
            },
            requestId
        });
        // WEBHOOK: Only notify admin when user is actually created (not when already exists)
        await notifyAdminNewAccount({
            ...newUser,
            ipAddress: clientIP
        });
        // Generate JWT tokens
        const accessToken = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$crypto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createJWT"])({
            sub: newUser.id,
            email: newUser.email,
            name: newUser.nomeCompleto,
            type: "access"
        });
        const refreshToken = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$crypto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createJWT"])({
            sub: newUser.id,
            email: newUser.email,
            type: "refresh"
        });
        // Create response
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            user: {
                id: newUser.id,
                email: newUser.email,
                nomeCompleto: newUser.nomeCompleto,
                photoURL: newUser.photoURL,
                saldo: newUser.saldo,
                twoFactorEnabled: newUser.twoFactorEnabled
            },
            accessToken,
            refreshToken,
            expiresIn: 900
        });
        // Add security headers
        Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SECURITY_HEADERS"]).forEach(([key, value])=>{
            response.headers.set(key, value);
        });
        // Set refresh token as HTTP-only cookie
        response.cookies.set("refresh_token", refreshToken, {
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60,
            path: "/"
        });
        return response;
    } catch (error) {
        console.error("[Register] Error:", error);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logSecurityEvent"])("registration_error", {
            ip: clientIP,
            error: error instanceof Error ? error.message : "Unknown"
        }, "warning");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Erro interno do servidor"
        }, {
            status: 500,
            headers: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SECURITY_HEADERS"]
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d2ae475e._.js.map
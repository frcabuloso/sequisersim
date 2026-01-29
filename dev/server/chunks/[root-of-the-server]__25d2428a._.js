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
"[project]/app/api/deposits/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40bf95ba32f7aa548ea317499a7ff1e3c2fa4cf895":"POST","40ddb6af7a3c66c70763790e10c4a0b057b1f8fe3c":"GET"},"",""] */ __turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-route] (ecmascript)");
;
;
// Deposit rates - Only PIX and Crypto
const DEPOSIT_RATES = {
    pix: 0.005,
    crypto: 0.01 // 1.0%
};
const CRYPTO_ADDRESSES = {
    usdt_trc20: {
        address: "TN8gJ7xZ2K9mQ5wEr3Yb6Pm1Vq8Nc4Lj",
        network: "TRC20"
    },
    usdt_erc20: {
        address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8bF2a",
        network: "ERC20"
    },
    btc: {
        address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        network: "Bitcoin"
    },
    eth: {
        address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8bF2a",
        network: "Ethereum"
    },
    ltc: {
        address: "ltc1qhz8gxkmjc7t3knhfvz9fzqjxlqkzpxrjnqy7e4",
        network: "Litecoin"
    }
};
async function POST(request) {
    try {
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        const body = await request.json();
        const { metodo, valor, pin, cryptoCurrency } = body;
        // Validate method
        if (![
            "pix",
            "crypto"
        ].includes(metodo)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid payment method. Only PIX and Crypto are supported."
            }, {
                status: 400
            });
        }
        // Validate PIN
        if (!pin || pin.length !== 6) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "PIN required"
            }, {
                status: 400
            });
        }
        // Validate amount
        const amount = parseFloat(valor);
        if (isNaN(amount) || amount <= 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid amount"
            }, {
                status: 400
            });
        }
        // Calculate fee
        const rate = DEPOSIT_RATES[metodo];
        const fee = amount * rate;
        const netAmount = amount - fee;
        // Generate idempotency key
        const idempotencyKey = `deposit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        let processingResult = null;
        switch(metodo){
            case "pix":
                // Generate PIX QR Code
                const pixPayload = generatePixPayload(amount);
                processingResult = {
                    txid: `PIX${Date.now()}`,
                    qrCode: pixPayload,
                    qrCodeBase64: Buffer.from(pixPayload).toString("base64"),
                    copiaECola: pixPayload,
                    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 min
                };
                break;
            case "crypto":
                if (!cryptoCurrency) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: "Cryptocurrency required"
                    }, {
                        status: 400
                    });
                }
                const cryptoInfo = CRYPTO_ADDRESSES[cryptoCurrency];
                if (!cryptoInfo) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: "Unsupported cryptocurrency"
                    }, {
                        status: 400
                    });
                }
                processingResult = {
                    currency: cryptoCurrency,
                    walletAddress: cryptoInfo.address,
                    network: cryptoInfo.network,
                    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
                };
                break;
            default:
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Invalid payment method"
                }, {
                    status: 400
                });
        }
        const deposit = {
            id: idempotencyKey,
            metodo,
            valorBruto: amount,
            taxa: fee,
            valorLiquido: netAmount,
            status: "pending",
            processing: processingResult,
            createdAt: new Date().toISOString()
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            deposit
        });
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal server error"
        }, {
            status: 500
        });
    }
}
// Generate PIX payload (EMV format)
function generatePixPayload(amount) {
    const merchantName = "FRLINDO";
    const merchantCity = "SAO PAULO";
    const txid = Math.random().toString(36).substr(2, 25).toUpperCase();
    // This is a simplified PIX payload. In production, use proper EMV generation
    const payload = `00020126580014br.gov.bcb.pix0136${txid}5204000053039865404${amount.toFixed(2)}5802BR5913${merchantName}6009${merchantCity}62070503***`;
    return payload;
}
async function GET(request) {
    try {
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        const deposits = [
            {
                id: "deposit_1",
                metodo: "pix",
                valorBruto: 1000.00,
                taxa: 5.00,
                valorLiquido: 995.00,
                status: "completed",
                createdAt: new Date(Date.now() - 43200000).toISOString()
            },
            {
                id: "deposit_2",
                metodo: "crypto",
                currency: "usdt_trc20",
                valorBruto: 500.00,
                taxa: 5.00,
                valorLiquido: 495.00,
                status: "completed",
                createdAt: new Date(Date.now() - 86400000).toISOString()
            }
        ];
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            deposits
        });
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal server error"
        }, {
            status: 500
        });
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    POST,
    GET
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["registerServerReference"])(POST, "40bf95ba32f7aa548ea317499a7ff1e3c2fa4cf895", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["registerServerReference"])(GET, "40ddb6af7a3c66c70763790e10c4a0b057b1f8fe3c", null);
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__25d2428a._.js.map
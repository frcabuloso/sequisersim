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
"[project]/app/api/changelog/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
// Changelog data - in production this would come from a database
const changelogs = [
    {
        id: "cl_2.5.0",
        version: "2.5.0",
        date: "2026-01-20",
        title: "Suporte a Criptomoedas",
        description: "Lancamos suporte completo para depositos e transferencias em criptomoedas. Agora voce pode usar BTC, ETH, USDT e LTC na sua carteira fluxpay.",
        changes: [
            {
                type: "feature",
                title: "Carteira Crypto",
                description: "Nova carteira separada para criptomoedas com suporte a BTC, ETH, USDT e LTC"
            },
            {
                type: "feature",
                title: "Depositos em Crypto",
                description: "Deposite criptomoedas diretamente na sua carteira com endereco dedicado"
            },
            {
                type: "feature",
                title: "Transferencias Crypto",
                description: "Envie criptomoedas para qualquer endereco com validacao de rede"
            },
            {
                type: "improvement",
                title: "Interface unificada",
                description: "Alterne facilmente entre carteira PIX e Crypto no dashboard"
            }
        ]
    },
    {
        id: "cl_2.4.0",
        version: "2.4.0",
        date: "2026-01-15",
        title: "PWA e Aplicativo Instalavel",
        description: "Transformamos o fluxpay em um Progressive Web App. Agora voce pode instalar o fluxpay como aplicativo no seu celular ou computador.",
        changes: [
            {
                type: "feature",
                title: "Aplicativo instalavel",
                description: "Instale o fluxpay direto da tela inicial do seu dispositivo"
            },
            {
                type: "feature",
                title: "Funciona offline",
                description: "Consulte saldo e historico mesmo sem conexao com a internet"
            },
            {
                type: "feature",
                title: "Notificacoes push",
                description: "Receba alertas em tempo real de depositos e transferencias"
            },
            {
                type: "performance",
                title: "Cache inteligente",
                description: "Carregamento ate 3x mais rapido com cache estrategico"
            }
        ]
    },
    {
        id: "cl_2.3.2",
        version: "2.3.2",
        date: "2026-01-08",
        title: "Correcoes de estabilidade",
        description: "Atualizacao focada em corrigir bugs reportados pela comunidade e melhorar a estabilidade geral da plataforma.",
        changes: [
            {
                type: "fix",
                title: "Erro no historico",
                description: "Corrigido bug que impedia visualizacao de transacoes antigas"
            },
            {
                type: "fix",
                title: "Notificacoes duplicadas",
                description: "Resolvido problema de notificacoes sendo enviadas em duplicidade"
            },
            {
                type: "improvement",
                title: "Mensagens de erro",
                description: "Mensagens de erro mais claras e informativas"
            }
        ]
    },
    {
        id: "cl_2.3.0",
        version: "2.3.0",
        date: "2025-12-20",
        title: "Favoritos e Destinatarios Recentes",
        description: "Agora voce pode salvar destinatarios favoritos e ver os ultimos destinatarios para transferencias PIX mais rapidas.",
        changes: [
            {
                type: "feature",
                title: "Destinatarios favoritos",
                description: "Salve contatos favoritos para transferencias com um clique"
            },
            {
                type: "feature",
                title: "Historico de envios",
                description: "Veja os ultimos destinatarios e reutilize dados rapidamente"
            },
            {
                type: "improvement",
                title: "Busca inteligente",
                description: "Encontre destinatarios por nome, email ou chave PIX"
            },
            {
                type: "performance",
                title: "Carregamento otimizado",
                description: "Reducao de 40% no tempo de carregamento das paginas"
            }
        ]
    },
    {
        id: "cl_2.2.0",
        version: "2.2.0",
        date: "2025-12-05",
        title: "API Publica v2",
        description: "Nova versao da nossa API com endpoints melhorados, webhooks em tempo real e documentacao interativa completa.",
        changes: [
            {
                type: "feature",
                title: "Webhooks em tempo real",
                description: "Receba notificacoes instantaneas de eventos na sua aplicacao"
            },
            {
                type: "feature",
                title: "API Key unica",
                description: "Cada usuario agora possui uma unica API Key regeneravel"
            },
            {
                type: "improvement",
                title: "Rate limits flexiveis",
                description: "Novos planos com limites de requisicoes mais generosos"
            },
            {
                type: "improvement",
                title: "Documentacao interativa",
                description: "Teste endpoints diretamente na documentacao"
            }
        ]
    },
    {
        id: "cl_2.1.0",
        version: "2.1.0",
        date: "2025-11-18",
        title: "Seguranca Avancada",
        description: "Adicionamos camadas extras de seguranca com autenticacao em duas etapas e PIN de 6 digitos para transacoes.",
        changes: [
            {
                type: "feature",
                title: "2FA via app",
                description: "Suporte para Google Authenticator, Authy e outros apps"
            },
            {
                type: "feature",
                title: "PIN de seguranca",
                description: "PIN de 6 digitos obrigatorio para confirmar transacoes"
            },
            {
                type: "improvement",
                title: "Sessoes seguras",
                description: "Gerencie e encerre sessoes ativas remotamente"
            },
            {
                type: "fix",
                title: "Sessoes expiradas",
                description: "Corrigido problema com sessoes expirando prematuramente"
            }
        ]
    },
    {
        id: "cl_2.0.0",
        version: "2.0.0",
        date: "2025-11-01",
        title: "fluxpay 2.0 - Redesign Completo",
        description: "A maior atualizacao da historia do fluxpay. Interface completamente redesenhada, novas funcionalidades e performance muito superior.",
        changes: [
            {
                type: "feature",
                title: "Nova interface",
                description: "Design moderno e intuitivo inspirado nas melhores fintechs"
            },
            {
                type: "feature",
                title: "Modo escuro",
                description: "Tema escuro para uso confortavel em qualquer ambiente"
            },
            {
                type: "feature",
                title: "Dashboard completo",
                description: "Novo dashboard com metricas, graficos e acoes rapidas"
            },
            {
                type: "performance",
                title: "App 3x mais rapido",
                description: "Otimizacoes que deixaram o app significativamente mais veloz"
            },
            {
                type: "improvement",
                title: "Acessibilidade",
                description: "Melhorias para leitores de tela e navegacao por teclado"
            }
        ]
    }
];
// Get current version
const CURRENT_VERSION = "2.5.0";
async function GET() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: true,
        currentVersion: CURRENT_VERSION,
        changelogs: changelogs,
        total: changelogs.length
    });
}
async function POST(request) {
    // In production, this would require admin authentication
    try {
        const body = await request.json();
        const { version, date, title, description, changes } = body;
        if (!version || !date || !title || !description || !changes) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Campos obrigatorios: version, date, title, description, changes"
            }, {
                status: 400
            });
        }
        // In production, this would save to database
        const newChangelog = {
            id: `cl_${version}`,
            version,
            date,
            title,
            description,
            changes
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: "Changelog criado com sucesso",
            changelog: newChangelog
        });
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Erro ao processar requisicao"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f3dda0ba._.js.map
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/auth-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const PROTECTED_ROUTES = [
    "/dashboard"
];
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    // Check if user is logged in on mount - verify token with API
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const checkAuth = {
                "AuthProvider.useEffect.checkAuth": async ()=>{
                    try {
                        const accessToken = localStorage.getItem("frcabuloso_access_token");
                        const storedUser = localStorage.getItem("frcabuloso_user");
                        if (accessToken && storedUser) {
                            // Verify token is still valid
                            try {
                                const response = await fetch("/api/auth/verify", {
                                    method: "GET",
                                    headers: {
                                        "Authorization": `Bearer ${accessToken}`
                                    }
                                });
                                if (response.ok) {
                                    const data = await response.json();
                                    setUser(data.user);
                                } else {
                                    // Token invalid, try refresh
                                    const refreshResponse = await fetch("/api/auth/login", {
                                        method: "PUT",
                                        credentials: "include"
                                    });
                                    if (refreshResponse.ok) {
                                        const refreshData = await refreshResponse.json();
                                        localStorage.setItem("frcabuloso_access_token", refreshData.accessToken);
                                        setUser(JSON.parse(storedUser));
                                    } else {
                                        // Refresh failed, clear auth
                                        localStorage.removeItem("frcabuloso_user");
                                        localStorage.removeItem("frcabuloso_access_token");
                                        setUser(null);
                                    }
                                }
                            } catch (error) {
                                // Network error or invalid token - clear auth
                                localStorage.removeItem("frcabuloso_user");
                                localStorage.removeItem("frcabuloso_access_token");
                                setUser(null);
                            }
                        } else {
                            setUser(null);
                        }
                    } catch (error) {
                        console.error("Error checking auth:", error);
                        setUser(null);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["AuthProvider.useEffect.checkAuth"];
            checkAuth();
        }
    }["AuthProvider.useEffect"], []);
    // Protect routes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if (!isLoading) {
                const isProtectedRoute = PROTECTED_ROUTES.some({
                    "AuthProvider.useEffect.isProtectedRoute": (route)=>pathname?.startsWith(route)
                }["AuthProvider.useEffect.isProtectedRoute"]);
                if (isProtectedRoute && !user) {
                    router.push("/login");
                }
            }
        }
    }["AuthProvider.useEffect"], [
        isLoading,
        user,
        pathname,
        router
    ]);
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[login]": (userData, accessToken, refreshToken)=>{
            const newUser = {
                id: userData.id || "",
                email: userData.email || "",
                name: userData.name || "",
                picture: userData.picture || "",
                cpf: userData.cpf || "",
                telefone: userData.telefone || "",
                saldo: userData.saldo ?? 0,
                pin: null,
                twoFactorEnabled: userData.twoFactorEnabled || false,
                createdAt: userData.createdAt || new Date().toISOString()
            };
            setUser(newUser);
            localStorage.setItem("frcabuloso_user", JSON.stringify(newUser));
            // Store tokens
            if (accessToken) {
                localStorage.setItem("frcabuloso_access_token", accessToken);
            }
        // Refresh token is stored in httpOnly cookie by server
        }
    }["AuthProvider.useCallback[login]"], []);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[logout]": async ()=>{
            try {
                const accessToken = localStorage.getItem("frcabuloso_access_token");
                // Call logout API
                if (accessToken) {
                    await fetch("/api/auth/login", {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${accessToken}`
                        },
                        credentials: "include"
                    }).catch({
                        "AuthProvider.useCallback[logout]": ()=>{
                        // Ignore errors on logout
                        }
                    }["AuthProvider.useCallback[logout]"]);
                }
            } catch (error) {
            // Ignore errors
            } finally{
                setUser(null);
                localStorage.removeItem("frcabuloso_user");
                localStorage.removeItem("frcabuloso_access_token");
                router.push("/");
            }
        }
    }["AuthProvider.useCallback[logout]"], [
        router
    ]);
    const updateUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[updateUser]": (data)=>{
            setUser({
                "AuthProvider.useCallback[updateUser]": (prev)=>{
                    if (!prev) return null;
                    const updated = {
                        ...prev,
                        ...data
                    };
                    localStorage.setItem("frcabuloso_user", JSON.stringify(updated));
                    return updated;
                }
            }["AuthProvider.useCallback[updateUser]"]);
        }
    }["AuthProvider.useCallback[updateUser]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            isLoading,
            isAuthenticated: !!user,
            login,
            logout,
            updateUser
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/auth-context.tsx",
        lineNumber: 166,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "d4xJ0vsVkUc9EeffSWu2aLxIaKM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/pwa-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PWAProvider",
    ()=>PWAProvider,
    "usePWA",
    ()=>usePWA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const PWAContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function PWAProvider({ children }) {
    _s();
    const [isInstallable, setIsInstallable] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isInstalled, setIsInstalled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isOnline, setIsOnline] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [notificationsEnabled, setNotificationsEnabled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [deferredPrompt, setDeferredPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PWAProvider.useEffect": ()=>{
            // Check if already installed
            if (window.matchMedia('(display-mode: standalone)').matches) {
                setIsInstalled(true);
            }
            // Check online status
            setIsOnline(navigator.onLine);
            const handleOnline = {
                "PWAProvider.useEffect.handleOnline": ()=>setIsOnline(true)
            }["PWAProvider.useEffect.handleOnline"];
            const handleOffline = {
                "PWAProvider.useEffect.handleOffline": ()=>setIsOnline(false)
            }["PWAProvider.useEffect.handleOffline"];
            window.addEventListener('online', handleOnline);
            window.addEventListener('offline', handleOffline);
            // Listen for install prompt
            const handleBeforeInstallPrompt = {
                "PWAProvider.useEffect.handleBeforeInstallPrompt": (e)=>{
                    e.preventDefault();
                    setDeferredPrompt(e);
                    setIsInstallable(true);
                }
            }["PWAProvider.useEffect.handleBeforeInstallPrompt"];
            window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            // Listen for app installed
            const handleAppInstalled = {
                "PWAProvider.useEffect.handleAppInstalled": ()=>{
                    setIsInstalled(true);
                    setIsInstallable(false);
                    setDeferredPrompt(null);
                }
            }["PWAProvider.useEffect.handleAppInstalled"];
            window.addEventListener('appinstalled', handleAppInstalled);
            // Check notifications permission
            if ('Notification' in window) {
                setNotificationsEnabled(Notification.permission === 'granted');
            }
            // Register service worker only in production
            if ('serviceWorker' in navigator && ("TURBOPACK compile-time value", "development") === 'production') //TURBOPACK unreachable
            ;
            return ({
                "PWAProvider.useEffect": ()=>{
                    window.removeEventListener('online', handleOnline);
                    window.removeEventListener('offline', handleOffline);
                    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
                    window.removeEventListener('appinstalled', handleAppInstalled);
                }
            })["PWAProvider.useEffect"];
        }
    }["PWAProvider.useEffect"], []);
    const installApp = async ()=>{
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setIsInstalled(true);
        }
        setDeferredPrompt(null);
        setIsInstallable(false);
    };
    const enableNotifications = async ()=>{
        if (!('Notification' in window)) return false;
        const permission = await Notification.requestPermission();
        const enabled = permission === 'granted';
        setNotificationsEnabled(enabled);
        if (enabled && 'serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.ready;
                // Subscribe to push notifications only if VAPID key is configured
                const vapidKey = ("TURBOPACK compile-time value", "BGjZQTkqwNNEFTpNEc3xXojbd2NgsdfosxT6s99vayryypVSJQDMckiiHhYjWnSssCGB5mo0PlNsxerYof9yCfo");
                if ("TURBOPACK compile-time truthy", 1) {
                    await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: vapidKey
                    });
                }
            } catch (error) {
                console.error('Failed to subscribe to push notifications:', error);
            }
        }
        return enabled;
    };
    const disableNotifications = ()=>{
        setNotificationsEnabled(false);
    // Note: Cannot programmatically revoke notification permission
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PWAContext.Provider, {
        value: {
            isInstallable,
            isInstalled,
            isOnline,
            notificationsEnabled,
            installApp,
            enableNotifications,
            disableNotifications
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/pwa-context.tsx",
        lineNumber: 141,
        columnNumber: 5
    }, this);
}
_s(PWAProvider, "HHo7qZ52RLjmiN+I4Iy+dsJlDtE=");
_c = PWAProvider;
function usePWA() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(PWAContext);
    if (context === undefined) {
        throw new Error('usePWA must be used within a PWAProvider');
    }
    return context;
}
_s1(usePWA, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "PWAProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_0aefcab9._.js.map
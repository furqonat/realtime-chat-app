/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_APP_FIREBASE_API_KEY: string
    readonly VITE_APP_FIREBASE_AUTH_DOMAIN: string
    readonly VITE_APP_FIREBASE_PROJECT_ID: string
    readonly VITE_APP_FIREBASE_STORAGE_BUCKET: string
    readonly VITE_APP_FIREBASE_MESSAGING_SENDER_ID: string
    readonly VITE_APP_FIREBASE_APP_ID: string
    readonly VITE_APP_FIREBASE_MEASUREMENT_ID: string,
    
    readonly VITE_APP_FB_BASE_URL: string,
    readonly VITE_APP_PHONE_NUMBER_ID: string,
    readonly VITE_APP_FB_TOKEN: string,

    readonly VITE_APP_SERVER_URL: string,

    readonly VITE_APP_SALT: string,
}
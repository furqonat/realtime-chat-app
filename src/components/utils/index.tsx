enum RoutePath {
    INDEX = '/chats',
    SIGNIN = '/signin',
    SIGNOUT = '/signout',
    CHAT_VOICE_CALL_MOBILE = '/chat/voice-call-mobile',
    VERIFY = '/signin/qr/verify',
    TRANSACTIONS = '/transactions',
    VIDEO_CALL = '/video-call/:id/:q/:callType/:receiverUid',

}

export { RoutePath }
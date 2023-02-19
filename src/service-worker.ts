export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js').then(r => {
               console.log('Service worker registered.', r.active.state);
            })
        })
    }
}

export function registerServiceWorkerNotification() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker-notification.js').then(r => {
                console.log('Service worker notification registered.', r.active.state);
            })
        })
    }
}

export function unregisterServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.unregister().then(r => {
                console.log('Service worker unregistered.');
            })
        })
    }
}
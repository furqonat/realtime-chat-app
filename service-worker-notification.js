importScripts("https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore-compat.js");
importScripts('https://momentjs.com/downloads/moment.js');
const firebaseConfig = {
    apiKey: "AIzaSyAtH-DtwY3A95-MFzrsQttMUSJw0Q7GCU0",
    authDomain: "rekberindo-2e42c.firebaseapp.com",
    projectId: "rekberindo-2e42c",
    storageBucket: "rekberindo-2e42c.appspot.com",
    messagingSenderId: "1002742390465",
    appId: "1:1002742390465:web:0bf775e70165f9275dfe40",
    measurementId: "G-P4J44N5DM3"
};
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.firestore(app);

const bc = new BroadcastChannel('messaging-channel');
console.log(bc, 'bc');
let phoneNumber = null;
bc.onmessage = (event) => {
    const {data} = event;
    phoneNumber = data.data;
    console.log(phoneNumber, 'phoneNumber');
}
const date = new Date()
database.collection('chats').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
        const ownerPhoneNumber = change.doc.data().ownerPhoneNumber
        const receiverPhoneNumber = change.doc.data().receiver.phoneNumber
        const messageAt = change.doc.data().lastMessage.createdAt
        const message = change.doc.data().lastMessage.text
        const diff = moment.duration(moment().diff(moment(messageAt))).asMinutes()
        if (change.type === 'added') {
            if (diff < 1) {
                console.log(message)
                if (phoneNumber === ownerPhoneNumber) {
                    self.registration.showNotification(`New Message from ${receiverPhoneNumber}`, {
                        body: message,
                        icon: 'https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png'
                    })
                }
                if (phoneNumber === receiverPhoneNumber) {
                    self.registration.showNotification(`New Message from ${ownerPhoneNumber}`, {
                        body: message,
                        icon: 'https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png'
                    })
                }
            }
        }
        if (change.type === 'modified') {
            if (diff < 1) {
                if (phoneNumber === ownerPhoneNumber) {
                    self.registration.showNotification(`New Message from ${receiverPhoneNumber}`, {
                        body: message,
                        icon: 'https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png'
                    })
                }
                if (phoneNumber === receiverPhoneNumber) {
                    self.registration.showNotification(`New Message from ${ownerPhoneNumber}`, {
                        body: message,
                        icon: 'https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png'
                    })
                }
            }
        }

    })
})

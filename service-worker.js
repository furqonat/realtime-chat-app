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

// get data from firestore
const bc = new BroadcastChannel('sw-messages');
database.collection('signin').orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
        const date = new Date(change.doc.data().createdAt)
        const diff = moment.duration(moment().diff(moment(date))).asMinutes()
        if (change.type === 'added') {
            if (diff < 1) {
                bc.postMessage({
                    type: 'SIGNIN',
                    data: change.doc.data()
                })
            }
        }
        if (change.type === 'modified') {

            // diff time between now and createdAt in firestore
            // if diff time is less than 1 minute, send message to client

            if (diff < 1) {
                bc.postMessage({
                    type: 'SIGNIN',
                    data: change.doc.data()
                })
            }
        }
    })
})


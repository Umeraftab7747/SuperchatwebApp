/* eslint-disable jsx-a11y/alt-text */

import React, { useRef, useState } from "react";
import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyDjuXK8o_MPQ3ve4uyVB-ANbZ8UUn09vA0",
  authDomain: "superchatapp-b2450.firebaseapp.com",
  projectId: "superchatapp-b2450",
  storageBucket: "superchatapp-b2450.appspot.com",
  messagingSenderId: "724007063754",
  appId: "1:724007063754:web:96d93ab2c747728425e433",
  measurementId: "G-VMMTHXQ6S2",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>{user ? <Chatroom /> : <Signin />}</section>
    </div>
  );
}

function Signin() {
  const SignInWithGOOGLE = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      auth.signInWithPopup(provider);
    } catch (error) {
      console.log(error);
    }
  };
  return <button onClick={SignInWithGOOGLE}>SIGN IN WITH GOOGLE</button>;
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}

function Chatroom() {
  const dummy = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
      </main>

      <span ref={dummy}></span>
      <form>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
        />

        <button type="submit" onClick={sendMessage} disabled={!formValue}>
          🕊️
        </button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  return (
    <div className={`message ${messageClass}`}>
      <img
        src={
          photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
        }
      />
      <p>{text}</p>
    </div>
  );
}

export default App;

import firebase from './firebase';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import Portal from './pages/Portal';
import SignIn from './pages/SignIn';
import './App.css';


import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";






const auth = firebase.auth();


function App() {
    const [user] = useAuthState(auth);

    return (
        <div className="App">
            {user ? <Portal /> : <SignIn />}
        </div>
    );
}

export default App;

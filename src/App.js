import firebase from './firebase';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import Portal from './pages/Portal';
import SignIn from './pages/SignIn';
import './App.css';


import { useAuthState } from 'react-firebase-hooks/auth';


import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en.json'
import { useEffect } from 'react';

TimeAgo.addDefaultLocale(en)




const auth = firebase.auth();


function App() {

    useEffect(() => {
        document.title = 'SwimXO'
    }, [])

    const [user] = useAuthState(auth);

    return (
        <div className="App">
            {user ? <Portal /> : <SignIn />}
        </div>
    );
}

export default App;

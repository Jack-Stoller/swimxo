import firebase from '../firebase';

import './nav.css';
import { useAuthState } from 'react-firebase-hooks/auth';

const auth = firebase.auth();

const Me = () => {


    const [user] = useAuthState(auth);

    return (
        <section>
            <h1>{user?.displayName ?? ''}</h1>

            Email: {user.email}
            <br />
            Uid: {user.uid}

            <br />
            <br />
            <br />

            <button onClick={() => {auth.signOut()}}>Log out</button>
        </section>
    );
}

export default Me;
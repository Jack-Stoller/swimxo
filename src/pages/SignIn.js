
import firebase from 'firebase/compat/app';
import './SignIn.css'

const auth = firebase.auth();


function SignIn() {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }

    return (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
    );
}

export default SignIn;


import firebase from 'firebase/compat/app';
import './SignIn.css'

const auth = firebase.auth();


function SignIn() {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithRedirect(provider);
    }

    return (
        <section className="card sign-in-prompt">
            <h1>
                SwimXO
            </h1>
            <h2>Login</h2>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
        </section>
    );
}

export default SignIn;


import firebase from 'firebase/compat/app';
import './SignIn.css'
import logoWithName from './../assets/logo/icon-and-name.png';


const auth = firebase.auth();


function SignIn() {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithRedirect(provider);
    }

    return (
        <section className="card sign-in-prompt">
            <header>
                <img src={logoWithName} />
            </header>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
        </section>
    );
}

export default SignIn;

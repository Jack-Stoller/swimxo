import firebase from 'firebase/compat/app';
import './addDoc.css';

import Form from './forms/form';

const AddDoc = (props) => {

    const handleSubmit = async(e) => {
        e.preventDefault();

        const firestore = firebase.firestore();
        const ref = await firestore.collection(props.sys_name);
        const auth = await firebase.auth();
        const { uid } = auth.currentUser;

        const data = getFormData(e);

        ref.add({
            ...data,
            created: {
                time: firebase.firestore.FieldValue.serverTimestamp(),
                by: uid
            }
        });
    }

    const getFormData = (formEvent) => {
        const els = formEvent.target.querySelectorAll('*[name]');
        let data = {};

        for (let i = 0; i < els.length; i++) {
            const n = els[i].getAttribute('name');
            let t = els[i].getAttribute('data-type');
            if (t == null) t = els[i].getAttribute('type');

            switch (t) {
                case 'number':
                    data[n] = parseFloat(els[i].value);
                    break;

                case 'date':
                    data[n] = new Date(els[i].value);
                    break;

                case 'bool':
                    data[n] = String(els[i].value).toLowerCase() === 'true'
                    break;

                default:
                    data[n] = els[i].value;
                    break;
            }
        }

        return data;
    }

    return (
        <>
            <h1>Add a {props.single_name}</h1>

            <Form formType={props.form} onSubmit={handleSubmit} actionText="Add"/>
        </>
    );
}
export default AddDoc;
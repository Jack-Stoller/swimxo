import firebase from 'firebase/compat/app';
import { useNavigate } from 'react-router-dom';
import { getFormData } from '../utils/form';
import './addDoc.css';

import Form from './forms/form';

const AddDoc = (props) => {

    const nav = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();

        const firestore = firebase.firestore();
        const ref = await firestore.collection(props.sys_name);
        const auth = await firebase.auth();
        const { uid } = auth.currentUser;

        const [data, refUpdates] = getFormData(e, firestore);

        await ref.add({
            ...data,
            created: {
                time: firebase.firestore.FieldValue.serverTimestamp(),
                by: uid
            },
            deleted: false
        }).then((ref) => {

            refUpdates.forEach(u => {
                u.doc.update({
                    [u.prop]: firebase.firestore.FieldValue.arrayUnion(`/${props.sys_name}/${ref.id}`)
                })
            });

            nav(`/${props.singleName}/${ref.id}`);
        });
    }

    return (
        <>
            <h1>Add a {props.singleName}</h1>

            <Form formType={props.form} onSubmit={handleSubmit} actionText="Add"/>
        </>
    );
}
export default AddDoc;
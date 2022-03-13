import firebase from 'firebase/compat/app';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFormData } from '../utils/form';
import { getObj } from '../utils/objTools';
import './addDoc.css';

import Form from './forms/form';
import Loading from './loading';

const AddDoc = (props) => {

    const nav = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault();

        setLoading(true);

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
                u.doc.update(
                    getObj(u.prop, firebase.firestore.FieldValue.arrayUnion(firestore.doc(`/${props.sys_name}/${ref.id}`)))
                )
            });

            if (props.onCreate)
                props.onCreate(ref);

            setLoading(false);


            if (props.gotoAfterCreate)
                nav(`/${props.singleName}/${ref.id}`);
        });
    }

    return (
        <>
            {
                (loading) ?
                <Loading />
                :
                <>
                    <h1>Add a {props.singleName}</h1>

                    <Form formType={props.form} data={props.defaultData} onSubmit={handleSubmit} actionText="Add"/>
                </>
            }
        </>
    );
}
export default AddDoc;
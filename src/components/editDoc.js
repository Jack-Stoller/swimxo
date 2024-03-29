import firebase from 'firebase/compat/app';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { getFormData } from '../utils/form';
import { getObj } from '../utils/objTools';
import './editDoc.css';

import Form from './forms/form';
import Loading from './loading';

const EditDoc = (props) => {

    const nav = useNavigate();

    let { id } = useParams();

    const [data, loading] = useDocumentDataOnce(
        (id || props.id) ? firebase.firestore().doc(`/${props.sys_name}/${(props.id ?? id)}`) : null
    );

    const handleSubmit = async(e) => {
        e.preventDefault();

        const firestore = firebase.firestore();
        const ref = await firebase.firestore().doc(`/${props.sys_name}/${(props.id ?? id)}`);
        const auth = await firebase.auth();
        const { uid } = auth.currentUser;

        const [formData, refUpdates] = getFormData(e, firestore);

        //Remove the old ref updates
        refUpdates.forEach(async u => {
            //Get the reference to the old referenced doc
            let oRef = data[u.name];

            if (oRef)
                firebase.firestore()
                    .collection(oRef.parent.id)
                    .doc(oRef.id)
                    .update(
                        getObj(u.prop, firebase.firestore.FieldValue.arrayRemove(firestore.doc(`/${props.sys_name}/${props.id ?? id}`)))
                    );
        });

        await ref.update({
            ...formData,
            modified: {
                time: firebase.firestore.FieldValue.serverTimestamp(),
                by: uid
            }
        }).then(() => {

            refUpdates.forEach(async u => {
                u.doc.update(
                    getObj(u.prop, firebase.firestore.FieldValue.arrayUnion(firestore.doc(`/${props.sys_name}/${props.id ?? id}`)))
                );
            });

            nav(`/${props.singleName}/${props.id ?? id}`);
        });
    }


    return (
        (loading) ?
            <Loading />
        :
        <>
            <h1>Edit {data && (data[props.nameKey ?? ''] ?? '')}</h1>

            <Form data={data} formType={props.form} onSubmit={handleSubmit} actionText="Save"/>
        </>
    );
}
export default EditDoc;
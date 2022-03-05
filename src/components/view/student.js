import firebase from 'firebase/compat/app';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Loading from '../loading';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as EditIcon } from './../../assets/icons/edit.svg';
import { ReactComponent as DeleteIcon } from './../../assets/icons/delete.svg';


import './student.css'
import './view.css';
import Popup from '../popup';
import { useEffect, useState } from 'react';
import Note from '../notes/note';
import NoteAdd from '../notes/add';

const StudentView = (props) => {

    let { id } = useParams();
    const nav = useNavigate();

    const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','??'];
    const [promptDelete, setPromptDelete] = useState(false);

    const [data, loading] = useDocumentData(
        (id || props.id) ? firebase.firestore().doc('/students/' + (props.id ?? id)) : null
    );

    const [fData, fLoading] = useDocumentData(
        (data && data.family) ? data.family : null
    )

    const [age, setAge] = useState(null);
    const [brithday, setBrithday] = useState(null);

    useEffect(() => {

        if (!data) return;

        let exactPrefix = (data.exact_birthday) ? '' : '~';

        let ageDifMs = Date.now() - new Date(data.birthday?.seconds * 1000);
        let ageDate = new Date(ageDifMs); // miliseconds from epoch
        let age = Math.abs(ageDate.getUTCFullYear() - 1970);

        setAge(exactPrefix + age);


        let birthday = data.birthday?.toDate();

        setBrithday(`${exactPrefix}${mon[birthday?.getMonth() ?? 12]} ${birthday?.getDate()} ${birthday?.getFullYear()}`);

    }, [data]);

    const deleteStudent = () => {
        setPromptDelete(false);

        firebase.firestore().doc('/students/' + (props.id ?? id)).update({
            deleted: true
        });

        nav('/browse/students');
    }

    const newNote = async(body) => {
        const auth = await firebase.auth();

        firebase.firestore().doc('/students/' + (props.id ?? id)).update({
            notes: firebase.firestore.FieldValue.arrayUnion({
                body: body,
                date: new Date(), /* Use client bc arrays and firestore don't work */
                user: auth.currentUser.displayName,
                user_id: auth.currentUser.uid
            })
        });

    }


    return (
        (loading && !data) ?
        <Loading />
        :
        (data && data.deleted === true) ?
        <h1>This is gone!</h1>
        :
        <>
        {
            (promptDelete) ?
            <Popup onClose={() => { setPromptDelete(false) }}>
                <h2>Delete {data && (data.name ?? '??')}</h2>
                <div>Are you sure you want to delete {data && (data.name ?? '??')}? This can't be undone!</div>

                <div className="actions">
                    <button onClick={() => { setPromptDelete(false) }}>No</button>
                    <button onClick={() => { deleteStudent() }}>Yes</button>
                </div>
            </Popup>
            :
            ''
        }
            <header className="view-header">
                <div>
                    <h1>{data && (data.name ?? '??')}</h1>
                    <h3 className="view-section-heading">Student</h3>
                </div>
                <div className="actions">
                    <Link to="edit"><button className="icon">
                        <EditIcon style={{ verticalAlign: 'unset' }} />
                    </button></Link>
                    <button className="icon" onClick={() => { setPromptDelete(true) }}>
                        <DeleteIcon style={{ verticalAlign: 'unset' }} />
                    </button>
                </div>
            </header>

            <h2 className="view-section-heading">Stats</h2>

            <div className="view-table">
                <div>
                    <div className="name">Family</div>
                    <div className="value">{(data && !('family' in data)) ? 'None' : (fData && (fData.lastname ?? ''))}</div>
                </div>
                <div>
                    <div className="name">Brithday</div>
                    <div className="value">{brithday ?? '?'}</div>
                </div>
                <div>
                    <div className="name">Age</div>
                    <div className="value">{age ?? '?'} years old</div>
                </div>
            </div>



            <h2 className="view-section-heading">Notes</h2>
            <NoteAdd onNewNote={newNote} />
            <br /><br />
            <div className="notes">
                {data && (data.notes ?? []).sort((a, b) => (b.date ?? new Date()) - (a.date ?? new Date())).map((n, i) => <Note key={[n, i]} data={n} />)}
            </div>
        </>
    );
}
export default StudentView;
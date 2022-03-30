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
import { idConverter } from '../../utils/firestore';
import TimeAgo from 'javascript-time-ago';
import ReactTimeAgo from 'react-time-ago';
import AddEventForm from '../forms/addEvent';
import { getFormData } from '../../utils/form';
import { getObj } from '../../utils/objTools';

const StudentView = (props) => {

    let { id } = useParams();
    const nav = useNavigate();

    const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','??'];
    const [promptDelete, setPromptDelete] = useState(false);

    const [data, loading] = useDocumentData(
        (id || props.id) ? firebase.firestore().doc('/students/' + (props.id ?? id)) : null
    );

    const [fData, fLoading] = useDocumentData(
        (data && data.family) ? data.family.withConverter(idConverter) : null
    )

    const [showingAddHistory, setShowingAddHistory] = useState(false);
    const [submittingAddHistory, setSubmittingAddHistory] = useState(false);


    //Use this to unsub from firestore events
    const [unsubs, setUnsubs] = useState([]);
    useEffect(() => () => unsubs.forEach(u => u()), []);

    const [age, setAge] = useState(null);
    const [brithday, setBrithday] = useState(null);
    const [curClass, setCurClass] = useState({});
    const [historyClasses, setHistoryClasses] = useState([]);

    useEffect(() => {
        if (!data) return;

        let exactPrefix = (data.exact_birthday) ? '' : '~';

        let ageDifMs = Date.now() - new Date(data.birthday?.seconds * 1000);
        let ageDate = new Date(ageDifMs); // miliseconds from epoch
        let age = Math.abs(ageDate.getUTCFullYear() - 1970);

        setAge(exactPrefix + age);


        let birthday = data.birthday?.toDate();

        setBrithday(`${exactPrefix}${mon[birthday?.getMonth() ?? 12]} ${birthday?.getDate()} ${birthday?.getFullYear()}`);

        setCurClass(
            (data.history) ? data.history.reduce((a, b) =>
                a.date.seconds < b.date.seconds ? a : b
            )
            :
            null
        );

        let classes = [];

        if (data.history) {

            for (let i = 0; i < data.history.length; i++) {
                if (!(data?.history?.[i].class?.id)) continue;

                let unsub = firebase.firestore()
                    .collection(data.history[i].class.parent.id)
                    .doc(data.history[i].class.id)
                    .onSnapshot(snap => {
                        historyClasses.splice(i, 1, {
                            ...snap.data(),
                            id: snap.id
                        });

                        setHistoryClasses([...historyClasses]);
                    });

                setUnsubs([...unsubs, unsub]);
                classes.push({});
            }

            setHistoryClasses(classes);
        }
    }, [data]);

    const deleteStudent = () => {
        setPromptDelete(false);

        firebase.firestore().doc('/students/' + (props.id ?? id)).update({
            deleted: true
        });

        nav('/browse/students');
    }

    const newNote = async(body) => {
        if (!body || body === '') return;
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

    const addEvent = async(e) => {
        e.preventDefault();

        setSubmittingAddHistory(true);

        const [eData, refUpdates] = getFormData(e, firebase.firestore());
        const auth = await firebase.auth();

        if (eData.shouldCharge) {
            await firebase.firestore().doc('/families/' + fData.id).update({
                transactions: firebase.firestore.FieldValue.arrayUnion({
                    amount: eData.classCost,
                    note: `Charged for "${eData.action}" for ${data.name} in class ${eData.className} at ${eData.timeName}.`,
                    date: new Date(), /* Use client bc arrays and firestore don't work */
                    user: auth.currentUser.displayName,
                    user_id: auth.currentUser.uid
                })
            });
        }

        delete eData.shouldCharge;
        delete eData.classCost;
        delete eData.className;
        delete eData.timeName;


        await firebase.firestore().doc('/students/' + (props.id ?? id)).update({
            history: firebase.firestore.FieldValue.arrayUnion({
                ...eData,
                date: new Date(), /* Use client bc arrays and firestore don't work */
                user: auth.currentUser.displayName,
                user_id: auth.currentUser.uid
            })
        }).then((ref) => {
            refUpdates.forEach(async u => {
                //I should be using subcollections but that's too hard
                await u.doc.get().then((doc) => {
                    let d = doc.data();
                    let [index, prop] = u.prop.split('.');

                    if (!d.times[index].student_info)
                        d.times[index].student_info = {};

                    if (!d.times[index].student_info[prop])
                        d.times[index].student_info[prop] = {current: [], history: []}

                    d.times[index].student_info[prop].current = [...(d.times?.[index]?.student_info?.[prop] ?? []), firebase.firestore().doc('/students/' + (props.id ?? id))];

                    //Move 

                    u.doc.update({
                        times: d.times
                    });
                });
            });

            setSubmittingAddHistory(false);
            setShowingAddHistory(false);
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
                <h2>Delete {data && (data.name ?? '?')}</h2>
                <div>Are you sure you want to delete {data && (data.name ?? '?')}? This can't be undone!</div>

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
                    <h1>{data && (data.name ?? '?')}</h1>
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
                    <div className="value">{(data && !('family' in data)) ? 'None' : (fData && fData.lastname) ? <Link to={'/family/' + fData.id}>{fData.lastname}</Link> : ''}</div>
                </div>
                <div>
                    <div className="name">Brithday</div>
                    <div className="value">{brithday ?? '?'}</div>
                </div>
                <div>
                    <div className="name">Age</div>
                    <div className="value">{age ?? '?'} years old</div>
                </div>
                <div>
                    <div className="name">Class</div>
                    <div className="value">in {(curClass) ? <Link to={'/class/' + curClass?.class?.id}>{curClass?.name ?? ''}</Link> : 'no class yet'}</div>
                </div>
            </div>

            {
                (showingAddHistory) ?
                    <Popup onClose={() => { setShowingAddHistory(false) }}>
                        {
                            (submittingAddHistory) ?
                            <Loading />
                            :
                            <>
                                <h2>Add Event</h2>

                                <form style={{position: 'relative'}} onSubmit={addEvent}>

                                    <AddEventForm lastAction={(data?.history ?? []).sort((a, b) => (b.date?.seconds ?? 0) - (a.date?.seconds ?? 0))?.[0]?.action} />

                                    <button>Add</button>

                                </form>

                            </>
                        }
                    </Popup>
                : ''
            }


            <h2 className="view-section-heading">Class History</h2>
            <button style={{width: '100%'}} onClick={() => { setShowingAddHistory(true) }}>Add</button>
            <div className="student-history">
                { (data && (data.history ?? []).sort((a, b) => (b.date ?? new Date()) - (a.date ?? new Date())).map((e, i) =>
                    <div key={[e, i]} className="event card">
                        <div className="action">{e.action ?? '?'}</div>
                        <div className="info">
                            <header>
                                <div className="date">
                                    <ReactTimeAgo date={e.date?.toDate()} locale="en-US"/>
                                </div>
                                <div className="class">Class <Link to={'/class/' + historyClasses[i]?.id}>{historyClasses[i]?.name ?? ''}</Link> at {historyClasses[i]?.times?.[(e.time ?? -1)] && (historyClasses[i].times?.[e.time].name ?? '')}</div>
                            </header>
                            <div className="note">{e.note ?? ''}</div>
                        </div>
                    </div>
                )) }
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
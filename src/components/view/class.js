import firebase from 'firebase/compat/app';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Loading from '../loading';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as EditIcon } from './../../assets/icons/edit.svg';
import { ReactComponent as DeleteIcon } from './../../assets/icons/delete.svg';


import './class.css'
import './view.css';
import Popup from '../popup';
import { useEffect, useState } from 'react';
import ClsasTimeForm from '../forms/classtime';
import { getFormData } from '../../utils/form';
import ClassTimeResult from '../results/classtime';

const ClassView = (props) => {

    let { id } = useParams();
    const nav = useNavigate();

    const [promptDelete, setPromptDelete] = useState(false);
    const [showingList, setShowingList] = useState(null);
    const [studentList, setStudentList] = useState(null);
    const [showAddTime, setShowAddTime] = useState(false);
    const [addingTime, setAddingTime] = useState(false);

    const [data, loading] = useDocumentData(
        (id || props.id) ? firebase.firestore().doc('/classes/' + (props.id ?? id)) : null
    );

    useEffect(() => {

        if (data && showingList) {
            let studentRefs = data.times?.[showingList.time].student_info?.[showingList.prop];

            if (!studentRefs) return;

            setStudentList([...Array(studentRefs.length)]);

            studentRefs.forEach((ref, i) => {
                firebase.firestore()
                    .collection(ref.parent.id)
                    .doc(ref.id)
                    .onSnapshot(snap => {
                        let studentListArray = studentList ?? [];
                        studentListArray.splice(i, 1, {
                            ...snap.data(),
                            id: ref.id
                        });

                        setStudentList([...studentListArray]);
                    });
            })
        } else {
            setStudentList(null);
        }
    }, [data, showingList]);

    const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','??'];
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat','??'];
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    const deleteClass = () => {
        setPromptDelete(false);

        firebase.firestore().doc('/classes/' + (props.id ?? id)).update({
            deleted: true
        });

        nav('/browse/classes');
    }

    const addTime = async(e) => {
        e.preventDefault();

        setAddingTime(true);

        const [tData] = getFormData(e, firebase.firestore());
        const auth = await firebase.auth();

        //Join dates
        let start = new Date(`${tData.startDate.getFullYear()}-${tData.startDate.getMonth() + 1}-${tData.startDate.getDate()} ${tData.startTime}:00`)
        let end = new Date(`${tData.endDate.getFullYear()}-${tData.endDate.getMonth() + 1}-${tData.endDate.getDate()} ${tData.endTime}:00`)

        delete tData.startDate;
        delete tData.endDate;

        await firebase.firestore().doc('/classes/' + (props.id ?? id)).update({
            times: firebase.firestore.FieldValue.arrayUnion({
                ...tData,
                start: start,
                end: end,
                date: new Date(), /* Use client bc arrays and firestore don't work */
                user: auth.currentUser.displayName,
                user_id: auth.currentUser.uid
            })
        }).then((ref) => {
            setAddingTime(false);
            setShowAddTime(false);
        });
    }


    const capFirstLetter = (word) => {
        return word.substring(0, 1).toUpperCase() + word.substring(1, word.length).toLowerCase();
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
                    <button onClick={() => { deleteClass() }}>Yes</button>
                </div>
            </Popup>
            : ''
        }
            <header className="view-header">
                <h1>Class {data && (data.name ?? '?')}</h1>
                <div className="actions">
                    <Link to="edit"><button className="icon">
                        <EditIcon style={{ verticalAlign: 'unset' }} />
                    </button></Link>
                    <button className="icon" onClick={() => { setPromptDelete(true) }}>
                        <DeleteIcon style={{ verticalAlign: 'unset' }} />
                    </button>
                </div>
            </header>

            <div>{data && (data.description ?? '??')}</div>

            {
                (studentList) ?

                <Popup onClose={() => {setShowingList(null)}}>
                    {
                        (studentList ?? []).map((s, i) =>
                            <div key={i}>{s?.name}</div>
                        )
                    }
                </Popup>

                : ''
            }

            {
                (showAddTime) ?

                <Popup onClose={() => {setShowAddTime(false)}}>

                    {
                        (addingTime) ?
                        <Loading />
                        :
                        <>
                            <h2>Add Time</h2>

                            <form onSubmit={addTime}>

                                <ClsasTimeForm />

                                <button>Add</button>

                            </form>
                        </>
                    }
                </Popup>

                : ''
            }

            <div className="action-heading">
                <h2 className="view-section-heading">Times</h2>
                <button className="icon" onClick={() => {setShowAddTime(true)}}>+</button>
            </div>
            <div className="class-times">
                {data && (data.times ?? []).map((t, i) =>
                    <ClassTimeResult key={[t, i]} data={t} onClick={() => {nav(i.toString())}} />
                )}
            </div>


            <h2 className="view-section-heading">Skills</h2>
            <div className="class-skills">
                {data && (data.skills ?? []).map((s, i) => (

                    <div className="card class-skill" key={[s, i]}>
                        <h2>{s.name ?? 'Unknown'}</h2>
                        <h4>Goal: {s.goal ?? 'Unknown'}</h4>
                        <div>{s.description ?? ''}</div>
                    </div>

                ))}
                {
                    data && ((data.skills ?? []).length === 0) ?
                    <h2 style={{textAlign: 'center'}}>No Skills</h2>
                   : ''
                }
            </div>

        </>
    );
}
export default ClassView;
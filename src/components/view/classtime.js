import firebase from 'firebase/compat/app';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Loading from '../loading';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as EditIcon } from './../../assets/icons/edit.svg';
import { ReactComponent as DeleteIcon } from './../../assets/icons/delete.svg';


import './classtime.css'
import './view.css';
import Popup from '../popup';
import { useEffect, useState } from 'react';
import { getFormData } from '../../utils/form';

const ClassTimeView = (props) => {

    let { id, index } = useParams();
    const nav = useNavigate();

    const [promptDelete, setPromptDelete] = useState(false);

    const quickActions = {
        enrolled: ['completed']
    }

    //Use this to unsub from firestore events
    const [unsubs, setUnsubs] = useState([]);
    useEffect(() => () => unsubs.forEach(u => u()), []);

    const [data, setData] = useState(null);
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [students, setStudents] = useState({});

    useEffect(() => {
        let unsub = firebase.firestore()
            .collection('/classes/')
            .doc(props.id ?? id)
            .onSnapshot(snap => {
                setData({
                    ...snap.data().times?.[props.index ?? index],
                    class: {
                        ...snap.data(),
                        id: snap.id
                    }
                });
            });

        setUnsubs([...unsubs, unsub]);
    }, [id, index, props]);


    useEffect(() => {
        if (!data) return;

        if (data.start)
            setStart(data.start.toDate());
        if (data.end)
            setEnd(data.end?.toDate());

        Object.keys(data.student_info ?? {}).forEach(k => {
            data.student_info[k].forEach((ref, i) => {
                let unsub = firebase.firestore()
                    .collection(ref.parent.id)
                    .doc(ref.id)
                    .onSnapshot(snap => {
                        let studentsArray = students[k] ?? [];
                        studentsArray.splice(i, 1, {
                            ...snap.data(),
                            id: ref.id
                        });

                        students[k] = studentsArray;

                        setStudents({...students});
                    });

                setUnsubs([...unsubs, unsub]);
            });
        })
    }, [data]);

    const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','??'];
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat','??'];
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    const deleteClassTime = () => {
        setPromptDelete(false);

        firebase.firestore().doc('/classes/' + (props.id ?? id)).update({
            deleted: true
        });

        nav('/browse/classes');
    }

    const capFirstLetter = (word) => {
        return word.substring(0, 1).toUpperCase() + word.substring(1, word.length).toLowerCase();
    }

    return (
        (!data) ?
        <Loading />
        :
        (data && (data.deleted || data.class.deleted) === true) ?
        <h1>This is gone!</h1>
        :
        <>
            {
                (promptDelete) ?
                <Popup onClose={() => { setPromptDelete(false) }}>
                    <h2>Delete {data && (data.name ?? '?')}</h2>
                    <div>Are you sure you want to delete {data && (data.name ?? '?')} for class {data?.class?.name ?? '?'}? This can't be undone!</div>

                    <div className="actions">
                        <button onClick={() => { setPromptDelete(false) }}>No</button>
                        <button onClick={() => { deleteClassTime() }}>Yes</button>
                    </div>
                </Popup>
                :
                ''
            }
            <header className="view-header">
                <div>
                    <h1>{data && (data.name ?? '?')}</h1>
                    <h3 className="view-section-heading">Class Time</h3>
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

            <h2 className="view-section-heading">Class {(data.class?.name) ? <Link to={'/class/' + data.class?.id}>{data.class.name}</Link> : ''}</h2>
            <div className="view-table">
                {
                    (data && start && end) ?
                    <>
                        <div>
                            <div className="name">Start Date</div>
                            <div className="value">{mon[start?.getMonth() ?? 12]} {start?.getDate()} {start?.getFullYear()}</div>
                        </div>
                        <div>
                            <div className="name">End Date</div>
                            <div className="value">{mon[end?.getMonth() ?? 12]} {end?.getDate()} {end?.getFullYear()}</div>
                        </div>
                        <div>
                            <div className="name">Start Time</div>
                            <div className="value">{start.getHours()}:{start.getMinutes().toString().padStart(2, '0')}</div>
                        </div>
                        <div>
                            <div className="name">End Time</div>
                            <div className="value">{end.getHours()}:{end.getMinutes().toString().padStart(2, '0')}</div>
                        </div>
                        <div>
                            <div className="name">Days</div>
                            <div className="value">{(data?.days ?? []).map(d => days[d]).join(', ')}</div>
                        </div>
                    </>
                    :''
                    }
            </div>

            <h2 className="view-section-heading">Student Interaction</h2>
            {
                (data?.student_info) ?
                    Object.keys(data?.student_info)
                        .sort((a, b) => a.localeCompare(b))
                        .map(k =>
                            <div key={k} className="category card">
                                <div className="category-name">{capFirstLetter(k)} ({data?.student_info[k].length})</div>
                                <div className="category-students">
                                    {
                                        (students[k] ?? []).map((stu, i) =>
                                            <div key={k + stu?.id.toString() + i} className="category-student">
                                                <Link to={`/student/${stu?.id}`}>{stu?.name ?? '?'}</Link>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        )
                : ''
            }
            {
                (!data?.student_info || data.student_info === {}) ?
                <h5>None yet</h5>
                : ''
            }

        </>
    );
}
export default ClassTimeView;
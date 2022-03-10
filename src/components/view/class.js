import firebase from 'firebase/compat/app';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Loading from '../loading';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as EditIcon } from './../../assets/icons/edit.svg';
import { ReactComponent as DeleteIcon } from './../../assets/icons/delete.svg';


import './class.css'
import './view.css';
import Popup from '../popup';
import { useState } from 'react';

const ClassView = (props) => {

    let { id } = useParams();
    const nav = useNavigate();

    const [promptDelete, setPromptDelete] = useState(false);

    const [data, loading] = useDocumentData(
        (id || props.id) ? firebase.firestore().doc('/classes/' + (props.id ?? id)) : null
    );

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
            :
            ''
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

            <h2 className="view-section-heading">Times</h2>
            <div className="class-times">

                <button>Add Time</button>

                {data && (data.times ?? []).map((t, i) => {
                    let start = t.start?.toDate();
                    let end =  t.end?.toDate();

                    return (
                        <div className="card class-time" key={[t, i]}>
                            <div>
                                <h2 className="name">
                                    {t.name ?? 'Unknown'}
                                </h2>
                                <div className="cost">
                                    {formatter.format(t.cost ?? 0)}
                                </div>
                            </div>
                            <div>
                                <div className="date">
                                    {mon[start?.getMonth() ?? 12]} {start?.getDate()} {start?.getFullYear()}
                                    &nbsp;to&nbsp;
                                    {mon[end?.getMonth() ?? 12]} {end?.getDate()} {end?.getFullYear()}
                                </div>
                                <div className="time">
                                    {
                                        (start && end) ?
                                            `${start.getHours()}:${start.getMinutes().toString().padStart(2, '0')} to ${end.getHours()}:${end.getMinutes().toString().padStart(2, '0')}`
                                        :
                                            'Unknown'
                                    }
                                </div>
                                <div className="days">
                                    {(t.days ?? []).map(d => days[d]).join(', ')}
                                </div>
                            </div>
                            <div className="view-table">
                                {
                                    (t?.student_info) ?
                                        Object.keys(t.student_info).map(k => 
                                            <div key={k}>
                                                <div className="name">{capFirstLetter(k)}</div>
                                                <div className="value">{t.student_info[k].length}</div>
                                            </div>
                                        )
                                    : ''
                                }
                                {
                                    (!t?.student_info || t.student_info === {}) ?
                                    <h3>No student interaction yet</h3>
                                    : ''
                                }
                            </div>
                        </div>
                    )
                })}
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
                   :
                   ''
                }
            </div>

        </>
    );
}
export default ClassView;
import firebase from 'firebase/compat/app';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Loading from '../loading';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as EditIcon } from './../../assets/icons/edit.svg';
import { ReactComponent as DeleteIcon } from './../../assets/icons/delete.svg';
import StudentResult from './../results/student';
import ParentResult from './../results/parent';
import AddDoc from '../addDoc';

import './family.css'
import './view.css';
import Popup from '../popup';
import { useEffect, useState } from 'react';
import Note from '../notes/note';
import NoteAdd from '../notes/add';
import ReactTimeAgo from 'react-time-ago';
import TransactionForm from '../forms/transaction';
import { getFormData } from '../../utils/form';
import StudentForm from '../forms/student';
import ParentForm from '../forms/parent';

const FamilyView = (props) => {

    let { id } = useParams();
    const nav = useNavigate();

    const [promptDelete, setPromptDelete] = useState(false);
    const [showAddTrans, setShowAddTrans] = useState(false);
    const [addingTrans, setAddingTrans] = useState(false);

    const [showAddStudent, setShowAddStudent] = useState(false);

    const [showAddParent, setShowAddParent] = useState(false);

    const [data, loading] = useDocumentData(
        (id || props.id) ? firebase.firestore().doc('/families/' + (props.id ?? id)) : null
    );

    const deleteFamily = () => {
        setPromptDelete(false);

        firebase.firestore().doc('/families/' + (props.id ?? id)).update({
            deleted: true
        });

        nav('/browse/families');
    }

    const capFirstLetter = (word) => {
        return word.substring(0, 1).toUpperCase() + word.substring(1, word.length).toLowerCase();
    }

    const newNote = async(body) => {
        const auth = await firebase.auth();

        firebase.firestore().doc('/families/' + (props.id ?? id)).update({
            notes: firebase.firestore.FieldValue.arrayUnion({
                body: body,
                date: new Date(), /* Use client bc arrays and firestore don't work */
                user: auth.currentUser.displayName,
                user_id: auth.currentUser.uid
            })
        });
    }

    const addTransaction = async(e) => {
        e.preventDefault();

        setAddingTrans(true);

        const [data] = getFormData(e, firebase.firestore());
        const auth = await firebase.auth();

        await firebase.firestore().doc('/families/' + (props.id ?? id)).update({
            transactions: firebase.firestore.FieldValue.arrayUnion({
                ...data,
                date: new Date(), /* Use client bc arrays and firestore don't work */
                user: auth.currentUser.displayName,
                user_id: auth.currentUser.uid
            })
        }).then((ref) => {
            setAddingTrans(false);
            setShowAddTrans(false);
        });
    }


    //Use this to unsub from firestore events
    const [unsubs, setUnsubs] = useState([]);
    useEffect(() => () => unsubs.forEach(u => u()), []);

    const [students, setStudents] = useState([]);
    const [parents, setParents] = useState([]);


    useEffect(() => {
        if (!data) return;

        if (data.students) {

            setStudents(new Array(data.students.length));

            for (let i = 0; i < data.students.length; i++) {
                if (!(data?.students?.[i])) continue;

                let unsub = firebase.firestore()
                    .collection(data.students[i].parent.id)
                    .doc(data.students[i].id)
                    .onSnapshot(snap => {
                        students.splice(i, 1, {
                            ...snap.data(),
                            id: data.students[i].id
                        });

                        setStudents([...students]);
                    });
                
                setUnsubs([...unsubs, unsub]);
            }
        }

        if (data.parents) {
            for (let i = 0; i < data.parents.length; i++) {
                if (!(data?.parents?.[i])) continue;

                let unsub = firebase.firestore()
                    .collection(data.parents[i].parent.id)
                    .doc(data.parents[i].id)
                    .onSnapshot(snap => {
                        parents.splice(i, 1, {
                            ...snap.data(),
                            id: data.parents[i].id
                        });
                        
                        setParents([...parents]);
                    });
                setUnsubs([...unsubs, unsub]);
            }
        }
    }, [data]);

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

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
                <h2>Delete the {data && (data.lastname ?? '?')} family</h2>
                <div>Are you sure you want to delete the {data && (data.lastname ?? '?')} family? This can't be undone!</div>

                <div className="actions">
                    <button onClick={() => { setPromptDelete(false) }}>No</button>
                    <button onClick={() => { deleteFamily() }}>Yes</button>
                </div>
            </Popup>
            :
            ''
        }
            <header className="view-header">
                <div>
                    <h1>{data && (data.lastname ?? '?')}</h1>
                    <h3 className="view-section-heading">Family</h3>
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

            <h2 className="view-section-heading">Contact</h2>
            <div className="view-table">
                <div>
                    <div className="name">Preferred Contact Method</div>
                    <div className="value">{capFirstLetter(data.preferred_contact_method ?? '')}</div>
                </div>
                <div>
                    <div className="name">Email</div>
                    <div className="value">
                        <a href={'mailto:' + (data.email ?? '')}>{(data.email ?? '')}</a>
                    </div>
                </div>
                <div>
                    <div className="name">Phone</div>
                    <div className="value">
                        <a href={'tel:' +(data.phone ?? '')}>{(data.phone ?? '')}</a>
                    </div>
                </div>
            </div>


            {
                (showAddTrans) ?
                <Popup onClose={() => {setShowAddTrans(false)}}>
                    {
                        (addingTrans) ?
                        <Loading />
                        :
                        <>
                            <h2>Add a transaction {data?.lastname && ('for ' + data.lastname)}</h2>

                            <form onSubmit={addTransaction}>
                                <TransactionForm />

                                <button>Add</button>
                            </form>
                        </>
                    }
                </Popup>
                : ''
            }

            <div className="action-heading">
                <h2 className="view-section-heading">Transaction History</h2>
                <button className="icon" onClick={() => {setShowAddTrans(true)}}>+</button>
            </div>
            <h3 className="subheading">
                Owes: {
                    formatter.format((data.transactions ?? []).map(p => p.amount).reduce((a, b) => a + b, 0))
                }
            </h3>
            <div className="transactions">
                {
                    (data?.transactions) ? data.transactions.sort((a, b) => (b.date ?? new Date()) - (a.date ?? new Date())).map(t =>
                        <div key={t.date.seconds.toString() + t.amount.toString()} className="transaction">
                            <div className="action">
                                {(!t.amount) ? '' : (t.amount >= 0) ? 'Charged' : 'Paid'}
                            </div>
                            <div className="amount">
                                {formatter.format(Math.abs(t.amount))}
                            </div>
                            <div className="date">
                                <ReactTimeAgo date={(t.date) ? t.date.toDate() : new Date()} locale="en-US"/>
                            </div>
                            <div className="desc">
                                {t.note ?? ''}
                            </div>
                        </div>
                    ) : ''
                }

                {
                    (!data?.transactions || data.transactions.length === 0) ?
                    <div style={{textAlign: 'center', color: 'grey', padding: '16px 0px'}}>No transactions yet</div>
                    : ''
                }
            </div>


            {
            (showAddStudent) ?
                <Popup onClose={() => {setShowAddStudent(false)}}>
                    <AddDoc
                        singleName="student"
                        sys_name="students"
                        form={StudentForm}
                        defaultData={{family: firebase.firestore().doc('/families/' + (props.id ?? id))}}
                        gotoAfterCreate={false}
                        onCreate={() => {setShowAddStudent(false)}}
                    />
                </Popup>
                : ''
            }


            <div className="action-heading">
                <h2 className="view-section-heading">Students {students ? `(${students.length})` : ''}</h2>
                <button className="icon" onClick={() => {setShowAddStudent(true)}}>+</button>
            </div>
            {
                (students ?? []).map(s =>
                    <StudentResult onClick={() => {nav('/student/' + s.id)}} key={s.id} data={s} />
                )
            }


            {
            (showAddParent) ?
                <Popup onClose={() => {setShowAddParent(false)}}>
                    <AddDoc
                        singleName="parent"
                        sys_name="parents"
                        form={ParentForm}
                        defaultData={{family: firebase.firestore().doc('/families/' + (props.id ?? id))}}
                        gotoAfterCreate={false}
                        onCreate={() => {setShowAddParent(false)}}
                    />
                </Popup>
                : ''
            }

            <div className="action-heading">
                <h2 className="view-section-heading">Parents {parents ? `(${parents.length})` : ''}</h2>
                <button className="icon" onClick={() => {setShowAddParent(true)}}>+</button>
            </div>
            {
                (parents ?? []).map(p =>
                    <ParentResult onClick={() => {nav('/parent/' + p.id)}} key={p.id} data={p} />
                )
            }


            <h2 className="view-section-heading">Notes</h2>
            <NoteAdd onNewNote={newNote} />
            <br /><br />
            <div className="notes">
                {data && (data.notes ?? []).sort((a, b) => (b.date ?? new Date()) - (a.date ?? new Date())).map((n, i) => <Note key={[n, i]} data={n} />)}
            </div>
        </>
    );
}
export default FamilyView;
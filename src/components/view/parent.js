import firebase from 'firebase/compat/app';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Loading from '../loading';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as EditIcon } from './../../assets/icons/edit.svg';
import { ReactComponent as DeleteIcon } from './../../assets/icons/delete.svg';


import './parent.css'
import './view.css';
import Popup from '../popup';
import { useEffect, useState } from 'react';
import Note from '../notes/note';
import NoteAdd from '../notes/add';

const ParentView = (props) => {

    let { id } = useParams();
    const nav = useNavigate();

    const [promptDelete, setPromptDelete] = useState(false);
    const [owes, setOwes] = useState('$0.00');

    const [data, loading] = useDocumentData(
        (id || props.id) ? firebase.firestore().doc('/parents/' + (props.id ?? id)) : null
    );

    const [fData, fLoading] = useDocumentData(
        (data && data.family) ? data.family : null
    )

    const deleteParent = () => {
        setPromptDelete(false);

        firebase.firestore().doc('/parents/' + (props.id ?? id)).update({
            deleted: true
        });

        nav('/browse/parents');
    }

    const capFirstLetter = (word) => {
        return word.substring(0, 1).toUpperCase() + word.substring(1, word.length).toLowerCase();
    }

    const newNote = async(body) => {
        const auth = await firebase.auth();

        firebase.firestore().doc('/parents/' + (props.id ?? id)).update({
            notes: firebase.firestore.FieldValue.arrayUnion({
                body: body,
                date: new Date(), /* Use client bc arrays and firestore don't work */
                user: auth.currentUser.displayName,
                user_id: auth.currentUser.uid
            })
        });

    }

    useEffect(() => {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',

            // These options are needed to round to whole numbers if that's what you want.
            //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
            //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        });

        if (fData) {
            let lOwes = formatter.format((fData.payments ?? []).map(p => p.amount).reduce((a, b) => a + b, 0));

            if (lOwes === '$NaN') lOwes = '$0';

            setOwes(lOwes);
        }

    }, [fData]);


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
                    <button onClick={() => { deleteParent() }}>Yes</button>
                </div>
            </Popup>
            :
            ''
        }
            <header className="view-header">
                <div>
                    <h1>{data && (data.name ?? '??')}</h1>
                    <h3 className="view-section-heading">Parent</h3>
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
                    <div className="method">Phone</div>
                    <div className="value">
                        <a href={'tel:' +(data.phone ?? '')}>{(data.phone ?? '')}</a>
                    </div>
                </div>
            </div>


            <h2 className="view-section-heading">Family {(fData && fData.lastname) ? `(${fData && (fData.lastname ?? '')})` : ''}</h2>
            {
                (data && !('family' in data)) ?
                <div>No Family</div>
                :
                <div className="view-table">
                    <div>
                        <div className="name">Parents</div>
                        <div className="value">{fData && (fData.parents?.length ?? '0')}</div>
                    </div>
                    <div>
                        <div className="name">Kids</div>
                        <div className="value">{fData && (fData.students?.length ?? '0')}</div>
                    </div>
                    <div>
                        <div className="name">Owes</div>
                        <div className="value">{owes}</div>
                    </div>
                </div>
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
export default ParentView;
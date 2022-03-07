
import { useState } from 'react';
import './add.css';

const NoteAdd = (props) => {

    const [body, setBody] = useState(props.defaultValue ?? '');

    const submit = (e) => {
        e.preventDefault();

        props.onNewNote(body);
        setBody('');
    }

    return (
        <div className="note-add">
            <form onSubmit={submit}>
                <textarea className="add-note-input" rows="4" placeholder="Note content..." value={body} onChange={(e) => setBody(e.target.value)} required></textarea>
                <button className="add-note-btn">Add</button>
            </form>
        </div>
    );
}
export default NoteAdd;
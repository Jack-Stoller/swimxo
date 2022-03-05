import ReactTimeAgo from 'react-time-ago';

import './note.css';

const Note = (props) => {

    let date = props.data?.date?.toDate()

    return (
        <div className="card note">
            <div className="header">
                <div className="user">
                    {
                    (props.data?.user) ?
                    `Posted by ${props.data?.user}`
                    :
                    ''
                }
                </div>
                <div className="date">
                {
                    (date) ?
                    <ReactTimeAgo date={date} locale="en-US"/>
                    :
                    ''
                }
                </div>
            </div>
            <div className="body">
                {props.data?.body ?? ''}
            </div>
        </div>
    );
}
export default Note;
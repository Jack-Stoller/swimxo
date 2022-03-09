import SectionLink from '../sectionLink';
import './results.css';

const ClassTimeResult = (props) => {

    const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','??'];
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat','??'];

    let start = props.data.start?.toDate();
    let end = props.data.end?.toDate();

    return (
        <SectionLink onClick={(e) => {if (props.onClick) props.onClick(e)}}>
            <div className="result">
                <div className="name">{props.data?.name ?? '?'}</div>
                <div className="info">
                    <div className="name">Class {props.data.class?.name ?? '?'}</div>
                    <div className="date">
                        {
                            (start && end) ?
                            `${mon[start.getMonth() ?? 12]} ${start.getDate()} ${start.getFullYear()} to ${mon[end.getMonth() ?? 12]} ${end.getDate()} ${end.getFullYear()}`
                            : `Unknown`

                        }
                    </div>
                    <div className="time">
                        {
                            (start && end) ?
                            `${start.getHours()}:${start.getMinutes().toString().padStart(2, '0')} to ${end.getHours()}:${end.getMinutes().toString().padStart(2, '0')}`
                            : 'Unknown'
                        }
                    </div>
                    <div className="days">
                        {(props.data.days ?? []).map(d => days[d]).join(', ')}
                    </div>
                </div>
            </div>
        </SectionLink>
    );
}
export default ClassTimeResult;
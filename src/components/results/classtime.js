import SectionLink from '../sectionLink';
import './results.css';

const ClassTimeResult = (props) => {

    const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','??'];
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat','??'];

    console.log(props);

    let start = props.data.start;
    let end = props.data.end;
    
    return (
        <SectionLink onClick={(e) => {if (props.onClick) props.onClick(e)}}>
            <div className="result">
                <div className="name">{props.data?.name ?? '?'}</div>
                <div className="info">
                    <div className="name">Class {props.data.class?.name ?? '?'}</div>
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
                        {(props.data.days ?? []).map(d => days[d]).join(', ')}
                    </div>    
                </div>
            </div>
        </SectionLink>
    );
}
export default ClassTimeResult;
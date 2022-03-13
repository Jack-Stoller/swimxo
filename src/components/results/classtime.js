import SectionLink from '../sectionLink';
import './classtime.css';
import './results.css';

const ClassTimeResult = (props) => {

    const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','??'];
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat','??'];

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    const capFirstLetter = (word) => {
        return word.substring(0, 1).toUpperCase() + word.substring(1, word.length).toLowerCase();
    }


    let start = props.data.start?.toDate();
    let end = props.data.end?.toDate();

    return (
        <SectionLink onClick={(e) => {if (props.onClick) props.onClick(e)}}>
            <div className="class-time result">
                <div className="class-time-header">
                    <div>
                        <h2 className="name">
                            {props.data?.name ?? '?'}
                        </h2>
                        <div className="cost">
                            {formatter.format(props.data?.cost ?? 0)}
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
                                    '?'
                            }
                        </div>
                        <div className="days">
                            {(props.data?.days ?? []).map(d => days[d]).join(', ')}
                        </div>
                    </div>
                </div>

                <div className="view-table student-interaction">
                <h4>Student Interaction</h4>
                    {
                        (props.data?.student_info) ?
                            Object.keys(props.data?.student_info)
                                .sort((a, b) => a.localeCompare(b))
                                .map(k =>
                                    <div key={k} /* onClick={() => {setShowingList({prop: k, time: i})}}*/>
                                        <div className="name">{capFirstLetter(k)}</div>
                                        <div className="value">{props.data?.student_info[k].length}</div>
                                    </div>
                                )
                        : ''
                    }
                    {
                        (!props.data?.student_info || props.data.student_info === {}) ?
                        <h5>None yet</h5>
                        : ''
                    }
                </div>
            </div>
        </SectionLink>
    );
}
export default ClassTimeResult;

/*
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

*/
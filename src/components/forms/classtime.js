import './forms.css';
import MultiSelect from '../inputs/multiselect';
import { useState } from 'react';

const ClsasTimeForm = (props) => {

    const [days, setDays] = useState(props.days ?? [1, 2, 3, 4, 5]);

    return (
        <>
            <label htmlFor="name">Name</label>
            <input type="text" name="name" defaultValue={props.data?.name ?? ''} placeholder="Name" required />

            <label htmlFor="cost">Cost</label>
            <input type="number" name="cost" defaultValue={props.data?.cost ?? ''} placeholder="Cost" required />

            <label htmlFor="startDate">Start Date</label>
            <input type="date" name="startDate" defaultValue={props.data?.startDate ?? ''} required />

            <label htmlFor="endDate">End Date</label>
            <input type="date" name="endDate" defaultValue={props.data?.endDate ?? ''} required />

            <label htmlFor="startTime">Start Time</label>
            <input type="time" name="startTime" defaultValue={props.data?.startTime ?? ''} required />

            <label htmlFor="endTime">End Time</label>
            <input type="time" name="endTime" defaultValue={props.data?.endTime ?? ''} required />

            <label>Days</label>
            <MultiSelect
                defaultValue={days}
                onChange={setDays}
                options={[
                    {
                        label: 'Sun',
                        value: 0
                    },
                    {
                        label: 'Mon',
                        value: 1
                    },
                    {
                        label: 'Tue',
                        value: 2
                    },
                    {
                        label: 'Wed',
                        value: 3
                    },
                    {
                        label: 'Thr',
                        value: 4
                    },
                    {
                        label: 'Fri',
                        value: 5
                    },
                    {
                        label: 'Sat',
                        value: 6
                    }
                ]}
            />
            <input type="hidden" name="days" data-type="json" value={JSON.stringify(days)} />
        </>
    );
}
export default ClsasTimeForm;
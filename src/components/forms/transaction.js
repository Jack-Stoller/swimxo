import React, { useEffect, useState } from 'react';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import SwitchSelector from "react-switch-selector";
import { idConverter } from '../../utils/firestore';
import BrowseCollection from '../browse/collection';
import Popup from '../popup';
import ClassTimeResult from '../results/classtime';
import SectionLink from '../sectionLink';
import ClassResult from '../results/class';

import './forms.css';

const TransactionForm = (props) => {

    const [amount, setAmount] = useState(props.data?.amount ?? 0);
    const [isCharge, setIsCharge] = useState(props.data?.amount ? props.data?.amount <= 0 : true);

    useEffect(() => {

        console.log(amount, isCharge);
    }, [amount, isCharge])


    return (
        <>
            <label>Action</label>
            <div className="input-sized">
                <SwitchSelector
                    options={[
                        {
                            label: "Paid",
                            value: true
                        },
                        {
                            label: "Charged",
                            value: false
                        }
                    ]}
                    initialSelectedIndex={[true, false].indexOf(isCharge)}
                    onChange={setIsCharge}
                    backgroundColor="#eceaf0"
                    selectedBackgroundColor="#3F00FF"
                />
            </div>

            <input type="hidden" data-type="number" name="amount" value={parseFloat(amount) * (isCharge ? -1 : 1)} />

            <label htmlFor="absAmount">Amount</label>
            <input type="text" data-type="ignored" name="absAmount" value={(amount) ? amount : ''} onChange={(e) => setAmount(e.target.value.replaceAll(/[^(\d|.)]/g, ''))} placeholder="Amount" />

            <label htmlFor="note">Notes</label>
            <textarea name="note" defaultValue={props.data?.note ?? ''} placeholder="Notes"></textarea>
        </>
    );
}
export default TransactionForm;
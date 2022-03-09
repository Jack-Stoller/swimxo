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
                    initialSelectedIndex={[true, false].indexOf(props.data?.action ?? 0)}
                    onChange={(v) => {
                        setAmount(Math.abs(amount) * (v) ? 1 : -1);
                    }}
                    backgroundColor="#eceaf0"
                    selectedBackgroundColor="#3F00FF"
                />
            </div>

            <input type="hidden" data-type="number" name="amount" value={amount} />
            <input type="hidden" data-type="date" name="date" value={new Date()} />


            <label htmlFor="absAmount">Amount</label>
            <input type="number" data-type="ignored" name="absAmount" value={Math.abs(amount)} onChange={(e) => {setAmount(Math.abs(e.target.value))}} placeholder="Amount" />

            <label htmlFor="note">Notes</label>
            <textarea name="note" defaultValue={props.data?.note ?? ''} placeholder="Notes"></textarea>
        </>
    );
}
export default TransactionForm;

import { useEffect, useState } from 'react';
import { Portal } from 'react-portal';
import { ReactComponent as XIcon } from './../assets/icons/x.svg';
import './popup.css';

const Popup = (props) => {

    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
    }, []);

    const close = (reason) => {
        setShow(false);

        window.setTimeout(() => {
            if (props.onClose) props.onClose(reason);
        }, 300);
    }

    return (
        <Portal>
            <section className="popup-backdrop" onClick={() => {close('backdrop')}}>

                <section className={show ? 'popup active' : 'popup'} onClick={(e) => {e.stopPropagation();}}>
                    <div className="popup-x" onClick={() => {close('x')}}><XIcon /></div>
                    {props.children}
                </section>

            </section>
        </Portal>
    )
}

export default Popup;
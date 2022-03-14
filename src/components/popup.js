
import { useEffect, useState } from 'react';
import { Portal } from 'react-portal';
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
                    {props.children}
                </section>

            </section>
        </Portal>
    )
}

export default Popup;
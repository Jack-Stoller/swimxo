
import { Portal } from 'react-portal';
import './popup.css';

const Popup = (props) => {
    return (
        <Portal>
            <section className="popup">
                {props.children}
            </section>
            <section className="backdrop" onClick={() => {
                if (props.onClose) props.onClose('backdrop');
            }}>

            </section>
        </Portal>
    )
}

export default Popup;
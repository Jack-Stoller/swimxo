
import { Portal } from 'react-portal';
import './popup.css';

const Popup = (props) => {
    return (
        <Portal>
            <section className="popup-backdrop" onClick={() => {
                if (props.onClose) props.onClose('backdrop');
            }}>

                <section className="popup" onClick={(e) => {e.stopPropagation();}}>
                    {props.children}
                </section>

            </section>
        </Portal>
    )
}

export default Popup;
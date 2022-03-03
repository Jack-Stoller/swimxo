
import './popup.css';

const Popup = (props) => {
    return (
        <>
            <section className="popup">
                {props.children}
            </section>
            <section className="backdrop" onClick={() => {
                if (props.onClose) props.onClose('backdrop');
            }}>

            </section>
        </>
    )
}

export default Popup;
import { useNavigate } from "react-router-dom";

import './forms.css';


const Form = (props) => {

    const nav = useNavigate();

    return (
        <form onSubmit={props.onSubmit} >

            <props.formType data={props.data} />

            <br />

            <button type="button" className="secondary" onClick={() => nav(-1)}>Back</button>
            <button>{props.actionText}</button>
        </form>
    );
}


export default Form;
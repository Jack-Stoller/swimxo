import './forms.css';

const FamilyForm = (props) => {

    return (
        <>
            <label htmlFor="lastname">Last Name</label>
            <input type="text" name="lastname" placeholder="Last Name" defaultValue={props.data?.lastname ?? ''} required />

            <label htmlFor="priority">Order / Priority (Optional)</label>
            <input type="number" name="priority" placeholder="Order / Priority" defaultValue={props.data?.priority ?? ''} />
        </>
    );
}
export default FamilyForm;
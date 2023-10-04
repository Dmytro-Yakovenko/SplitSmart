import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import logo from './splitsmart-logo.png';
import * as friendActions from '../../store/friend';
import './AddFriend.css'

function AddFriendModal() {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await dispatch(friendActions.createFriendship(email));
        if (data && data.message) {
            setErrors([`email : ${data.message}`]);
            dispatch(friendActions.fetchFriendships());
        } else if (data) {
            setErrors(data);
        } else {
            closeModal();
        }
    };

    return (
        <>
            <form className="add-friend-form" onSubmit={handleSubmit}>
                <h2><img className="add-friend-logo" src={logo} alt="add-friend-logo" />Invite friends</h2>
                {errors.length > 0 && <ul>
                    {errors.map((error, idx) => (
                        <li key={idx} className="error-msg">{error}</li>
                    ))}
                </ul>}
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                />
                <textarea
                    placeholder="Include an optional message"
                />
                <button className="add-friend-button accent">Send invites and add friends</button>
            </form>
        </>
    );
}

export default AddFriendModal;

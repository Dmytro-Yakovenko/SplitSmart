import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { createPayment } from '../../store/payment';
import './SettleUp.css';

function SettleUpModal({ billAmount }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const [amount, setAmount] = useState('');
  const location = useLocation();
  const friendshipId = Number(location.pathname.split('/')[2]);
  const friendships = useSelector((state) => Object.values(state.friend.friendships));
  const friendship = friendships.find((friendship) => friendship.id === friendshipId);
  const friend = friendship?.friend;
  const friendName = friend?.name || '';
  const totalBillAmount = friendship?.bill

  useEffect(() => {
    setAmount(Number(totalBillAmount).toFixed(2));
  }, [totalBillAmount]);
  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(createPayment(amount, friendshipId));
    closeModal();
  };

  return (
    <form className="settle-up-form" onSubmit={handleSubmit}>
      <h2>Settle up</h2>
      <div>
        <label>You paid {friendName}</label>
      </div>
      <div className="form-group">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          disabled={true}
          placeholder={billAmount || '0.00'}
        />
      </div>
      <div className="form-actions">
        <button type="button" onClick={closeModal}>
          Cancel
        </button>
        <button className="primary" type="submit">Save</button>
      </div>
    </form>
  );
}

export default SettleUpModal;

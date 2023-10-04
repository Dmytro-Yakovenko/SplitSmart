import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import SettleUpModal from '../SettleUpModal';
import OpenModalButton from '../OpenModalButton';
import AddEditExpenseModal from '../AddEditExpenseModal';
import './MainHeader.css';

const MainHeader = () => {
  const location = useLocation();
  const friendships = useSelector((state) => Object.values(state.friend.friendships));
  let friendship;

  const currentPage = (() => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return 'Dashboard';
      case '/all':
        return 'All expenses';
      default:
        if (path.startsWith('/friends/')) {
          const friendshipId = Number(path.split('/')[2]);
          friendship = friendships.find(
            (friendship) => friendship.id === friendshipId
          );
          return friendship?.friend?.name || '';
        }
        return '';
    }
  })();

  return (
    <div className="main-header">
      <div className="main-header-title">
        {friendship && true && <img className="main-header-img" src={friendship?.friend?.image_url} alt={friendship?.friend?.name} />}
        <div>{currentPage}</div>
      </div>
      <div className="main-header-buttons">
        <OpenModalButton modalComponent={<AddEditExpenseModal />} buttonText={'Add expenses'} />
        {!(friendship?.bill <= 0 || currentPage === 'Dashboard' || currentPage === 'All expenses') && <OpenModalButton
          modalComponent={<SettleUpModal />}
          buttonText="Settle Up"
        />}
        </div>
    </div>
  );
};

export default MainHeader;

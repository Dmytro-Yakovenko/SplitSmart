import * as expenseActions from './expense';
import * as friendActions from './friend';


// Action types
const SET_RECEIVED_PAYMENTS = 'payment/SET_RECEIVED_PAYMENTS';
const SET_SENT_PAYMENTS = 'payment/SET_SENT_PAYMENTS';
const ADD_PAYMENT = 'payment/ADD_PAYMENT';
const DELETE_PAYMENT = 'payment/DELETE_PAYMENT';

// Action creators
const setReceivedPayments = (payments) => ({
  type: SET_RECEIVED_PAYMENTS,
  payload: payments,
});

const setSentPayments = (payments) => ({
  type: SET_SENT_PAYMENTS,
  payload: payments,
});

const addPayment = (payment) => ({
  type: ADD_PAYMENT,
  payload: payment,
});

const deletePayment = (paymentId) => ({
  type: DELETE_PAYMENT,
  payload: paymentId,
});


// Async action: Fetch received payments
export const fetchReceivedPayments = () => async (dispatch) => {
  try {
    const response = await fetch('/api/payments/received');
    if (!response.ok) {
      throw new Error('Failed to fetch received payments');
    }
    const data = await response.json();
    dispatch(setReceivedPayments(data.received));
  } catch (error) {
    console.error('Error fetching received payments:', error.message);
  }
};

// Async action: Fetch sent payments
export const fetchSentPayments = () => async (dispatch) => {
  try {
    const response = await fetch('/api/payments/sent');
    if (!response.ok) {
      throw new Error('Failed to fetch sent payments');
    }
    const data = await response.json();
    dispatch(setSentPayments(data.sent));
  } catch (error) {
    console.error('Error fetching sent payments:', error.message);
  }
};

// Async action: Create a payment
export const createPayment = (amount, friendshipId) => async (dispatch) => {
  try {
    const response = await fetch('/api/payments/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        friendship: friendshipId,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to create payment');
    }
    const data = await response.json();
    dispatch(addPayment(data));
    dispatch(fetchReceivedPayments());
    dispatch(fetchSentPayments());
    dispatch(expenseActions.getCreatedExpenses());
    dispatch(expenseActions.getSettledExpenses());
    dispatch(expenseActions.getUnsettledExpenses());
    dispatch(expenseActions.getSummary());
    dispatch(friendActions.fetchFriendships());
  } catch (error) {
    console.error('Error creating payment:', error.message);
  }
};

// Async action: Delete a payment
export const fetchDeletePayment = (paymentId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/payments/${paymentId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete payment');
    }
    dispatch(deletePayment(paymentId));
    dispatch(fetchReceivedPayments());
    dispatch(fetchSentPayments());
    dispatch(expenseActions.getCreatedExpenses());
    dispatch(expenseActions.getSettledExpenses());
    dispatch(expenseActions.getUnsettledExpenses());
    dispatch(expenseActions.getSummary());
    dispatch(friendActions.fetchFriendships());
  } catch (error) {
    console.error('Error deleting payment:', error.message);
  }
};

// Reducer
const initialState = {
  receivedPayments: {},
  sentPayments: {}
};

export default function paymentReducer(state = initialState, action) {
  switch (action.type) {
    case SET_RECEIVED_PAYMENTS:
      const receivedPayments = {};
      action.payload.forEach((payment) => {
        receivedPayments[payment.id] = payment;
      });
      return {
        ...state,
        receivedPayments,
      };
    case SET_SENT_PAYMENTS:
      const sentPayments = {};
      action.payload.forEach((payment) => {
        sentPayments[payment.id] = payment;
      });
      return {
        ...state,
        sentPayments,
      };
    case ADD_PAYMENT:
      return {
        ...state,
        sentPayments: {
          ...state.sentPayments,
          [action.payload.id]: action.payload,
        },
      };
    case DELETE_PAYMENT:
      const { [action.payload]: deletedPayment, ...updatedSentPayments } =
        state.sentPayments;
      return {
        ...state,
        sentPayments: updatedSentPayments,
      };
    default:
      return state;
  }
}

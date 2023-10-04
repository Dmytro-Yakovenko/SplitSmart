import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import * as expenseActions from '../../store/expense';
import * as paymentActions from '../../store/payment';
import PaymentDetailsSection from "../PaymentDetailsSection"
import "./AllExpenses.css"
import receipt from "./receipt.jpeg"
import dollar from "./dollar.jpeg"
import LeftNavigationBar from "../LeftNavigationBar";
import TopNavigationBar from "../TopNavigationBar"
import MainHeader from "../MainHeader"
import RightSummaryBar from '../RightSummaryBar';
import ExpenseDetailsSection from "../ExpenseDetailsSection"


function AllExpensesPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const createdExpenses = useSelector((state) =>
    Object.values(state.expense.createdExpenses)
  );
  const unsettledExpenses = useSelector((state) =>
    Object.values(state.expense.unsettledExpenses)
  );
  const settledExpenses = useSelector((state) =>
    Object.values(state.expense.settledExpenses)
  );
  const sentPayments = useSelector((state) =>
    Object.values(state.payment.sentPayments)
  );
  const receivedPayments = useSelector((state) =>
    Object.values(state.payment.receivedPayments)
  );

  const [isInitialRender, setIsInitialRender] = useState(true);
  const [isCreatedExpensesLoaded, setIsCreatedExpensesLoaded] = useState(false);
  const [isUnsettledExpensesLoaded, setIsUnsettledExpensesLoaded] =
    useState(false);
  const [isSettledExpensesLoaded, setIsSettledExpensesLoaded] = useState(false);
  const [isSentPaymentsLoaded, setIsSentPaymentsLoaded] = useState(false);
  const [isReceivedPaymentsLoaded, setIsReceivedPaymentsLoaded] =
    useState(false);
  // const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(expenseActions.getCreatedExpenses()).then(() =>
        setIsCreatedExpensesLoaded(true)
      );
      await dispatch(expenseActions.getUnsettledExpenses()).then(() =>
        setIsUnsettledExpensesLoaded(true)
      );
      await dispatch(expenseActions.getSettledExpenses()).then(() =>
        setIsSettledExpensesLoaded(true)
      );
      await dispatch(paymentActions.fetchSentPayments()).then(() =>
        setIsSentPaymentsLoaded(true)
      );
      await dispatch(paymentActions.fetchReceivedPayments()).then(() =>
        setIsReceivedPaymentsLoaded(true)
      );
    };
    fetchData();
  }, [dispatch]);

  let items = [];

  if (isCreatedExpensesLoaded && isSettledExpensesLoaded && isUnsettledExpensesLoaded && isSentPaymentsLoaded && isReceivedPaymentsLoaded) {
    const userExpenses = createdExpenses.map((expenseObj) => {
      return { ...expenseObj, type: 'created' };
    });
    const friendExpenses = [...unsettledExpenses, ...settledExpenses].map((expenseObj) => {
      return { ...expenseObj, type: 'charged' };
    });
    const userSentPayments = sentPayments.map((paymentObj) => {
      return { ...paymentObj, type: 'sent' };
    });
    const userReceivedPayments = receivedPayments.map((paymentObj) => {
      return { ...paymentObj, type: 'received' };
    });

    items = [...userExpenses, ...friendExpenses, ...userSentPayments, ...userReceivedPayments].sort((e1, e2) => {
      return new Date(e2.created_at).getTime() - new Date(e1.created_at).getTime()
    });
  }

  const formatMoney = (amount) => {
    return (
      "$" +
      String(
        Number(amount)
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, "$&,")
      )
    );
  };

  const deleteExpense = (expenseId, type) => {
    let answer = window.confirm(
      "Are you sure you want to delete this expense? This will completely remove this expense for ALL people involved, not just you."
    );
    if (answer) {
      dispatch(expenseActions.deleteExpense(expenseId));
      document.getElementById(`expense-details-${expenseId}`).classList.add('hidden');
      if (type === "created") {
        items =
          items.filter((obj) => {
            return !(!obj.expense && obj.id == expenseId);
          });
      } else if (type === "charged") {
        items =
          items.filter((obj) => {
            return !(obj.expense_id == expenseId);
          });
      }
    }
  };

  function deletePayment(paymentId) {
    let answer = window.confirm(
      "Are you sure you want to delete this payment?"
    );
    if (answer) {
      dispatch(paymentActions.fetchDeletePayment(paymentId));
      document.getElementById(`payment-details-${paymentId}`).classList.add('hidden');

      items =
        items.filter((obj) => {
          return !(
            (obj.type === "sent" || obj.type === "received") &&
            obj.id == paymentId
          );
        });
    }
  }

  if (!sessionUser) return <Redirect to="/" />;

  return (
    <>
      <LeftNavigationBar />
      <TopNavigationBar />
      <MainHeader />
      <RightSummaryBar />
      <div id="all-expenses">
        {items.map((obj) => {
          const dateStr = new Date(obj.created_at).toDateString();
          const dateMonth = `${dateStr.split(" ")[1].toUpperCase()}`;
          const dateDay = `${dateStr.split(" ")[2]}`;
          switch (obj.type) {
            case 'created':
              return (
                <>
                  <div className="expense-header"
                    onMouseEnter={() => document.getElementById(`expense-${obj.id}`).classList.remove('hidden')}
                    onMouseLeave={() => document.getElementById(`expense-${obj.id}`).classList.add('hidden')}
                    onClick={() => document.getElementById(`expense-details-${obj.id}`).classList.toggle('hidden')}
                  >
                    <div className="expense-header-date">
                      <p className="expense-header-month">{dateMonth}</p>
                      <p className="expense-header-day">{dateDay}</p>
                    </div>
                    <img className="expense-header-logo" src={receipt} alt="receipt-logo" />
                    <div className="expense-header-description">
                      {obj.description}
                    </div>
                    <div className="expense-header-A">
                      <p>you paid</p>
                      <p>{formatMoney(obj.amount)}</p>
                    </div>
                    <div className="expense-header-B teal-amount">
                      {obj.participants.length > 1 && <p>you lent</p>}
                      {obj.participants.length === 1 && <p>you lent {obj.participants[0].friendship.friend.short_name}</p>}
                      <p>{formatMoney(obj.amount - obj.participants[0].amount_due)}</p>
                    </div>
                    <button id={`expense-${obj.id}`} className="delete-expense hidden" onClick={(e) => {
                      deleteExpense(obj.id, obj.type);
                      e.stopPropagation();
                    }}>
                      &#x2715;
                    </button>
                  </div>
                  <ExpenseDetailsSection expenseId={obj.id} />
                </>

              );
            case 'charged':
              return (
                <>
                  <div className="expense-header"
                    onMouseEnter={() => document.getElementById(`expense-${obj.expense.id}`).classList.remove('hidden')}
                    onMouseLeave={() => document.getElementById(`expense-${obj.expense.id}`).classList.add('hidden')}
                    onClick={() => document.getElementById(`expense-details-${obj.expense.id}`).classList.toggle('hidden')}
                  >
                    <div className="expense-header-date">
                      <p className="expense-header-month">{dateMonth}</p>
                      <p className="expense-header-day">{dateDay}</p>
                    </div>
                    <img className="expense-header-logo" src={receipt} alt="receipt-logo" />
                    <div className="expense-header-description">
                      {obj.expense.description}
                    </div>
                    <div className="expense-header-A">
                      <p>{obj.friendship.user.short_name} paid</p>
                      <p>{formatMoney(obj.expense.amount)}</p>
                    </div>
                    <div className="expense-header-B orange-amount">
                      <p>{obj.friendship.user.short_name} lent you</p>
                      <p>{formatMoney(obj.amount_due)}</p>
                    </div>
                    <button id={`expense-${obj.expense.id}`} className="delete-expense hidden" onClick={(e) => {
                      deleteExpense(obj.expense.id, obj.type);
                      e.stopPropagation();
                    }}>
                      &#x2715;
                    </button>
                  </div>
                  <ExpenseDetailsSection expenseId={obj.expense.id} />
                </>

              );
            case 'sent':
              return (
                <>
                  <div className="payment-header"
                    onMouseEnter={() => document.getElementById(`payment-${obj.id}`).classList.remove('hidden')}
                    onMouseLeave={() => document.getElementById(`payment-${obj.id}`).classList.add('hidden')}
                    onClick={() => document.getElementById(`payment-details-${obj.id}`).classList.toggle('hidden')}
                  >
                    <img className="payment-header-logo" src={dollar} alt="dollar-logo" />
                    <div className="payment-header-description">
                      {sessionUser.short_name} paid {obj.friendship.friend.short_name} {formatMoney(obj.amount)}
                    </div>
                    <div className="payment-header-A">
                      you paid
                    </div>
                    <div className="payment-header-B teal-amount">
                      {formatMoney(obj.amount)}
                    </div>
                    <button id={`payment-${obj.id}`} className="delete-payment hidden" onClick={(e) => {
                      deletePayment(obj.id);
                      e.stopPropagation();
                    }}>
                      &#x2715;
                    </button>
                  </div>
                  <PaymentDetailsSection paymentId={obj.id} />
                </>
              );
            case 'received':
              return (
                <>
                  <div className="payment-header"
                    onMouseEnter={() => document.getElementById(`payment-${obj.id}`).classList.remove('hidden')}
                    onMouseLeave={() => document.getElementById(`payment-${obj.id}`).classList.add('hidden')}
                    onClick={() => document.getElementById(`payment-details-${obj.id}`).classList.toggle('hidden')}
                  >
                    <img className="payment-header-logo" src={dollar} alt="dollar-logo" />
                    <div className="payment-header-description">
                      {obj.friendship.user.short_name} paid {sessionUser.short_name} {formatMoney(obj.amount)}
                    </div>
                    <div className="payment-header-A">
                      you received
                    </div>
                    <div className="payment-header-B orange-amount">
                      {formatMoney(obj.amount)}
                    </div>
                    <button id={`payment-${obj.id}`} className="delete-payment hidden" onClick={(e) => {
                      deletePayment(obj.id);
                      e.stopPropagation();
                    }}>
                      &#x2715;
                    </button>
                  </div>
                  <PaymentDetailsSection paymentId={obj.id} />
                </>

              );
            default:
              return <></>;
          }
        })}
      </div>
    </>
  );
}

export default AllExpensesPage;

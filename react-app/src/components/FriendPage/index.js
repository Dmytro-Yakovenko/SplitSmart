import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as friendActions from "../../store/friend";
import * as expenseActions from "../../store/expense";
import * as paymentActions from "../../store/payment";
import LeftNavigationBar from "../LeftNavigationBar";
import TopNavigationBar from "../TopNavigationBar";
import MainHeader from "../MainHeader";
import RightSummaryBar from '../RightSummaryBar';
import UnsettledItems from "./UnsettledItems";
import SettledItems from "./SettledItems";
import checkmark from "./checkmark.png";
import "./FriendPage.css";

function FriendPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const friendship = useSelector((state) => state.friend.selectedFriendship);
  const userExpenses = useSelector((state) => {
    let settledExpenses = Object.values(state.expense.createdExpenses).filter(
      (expense) => {
        const friendOnly = expense.participants.filter(
          (participant) =>
            participant.friendship_id == id && participant.is_settled
        );
        return friendOnly.length > 0;
      }
    );
    let unsettledExpenses = Object.values(state.expense.createdExpenses).filter(
      (expense) => {
        const friendOnly = expense.participants.filter(
          (participant) =>
            participant.friendship_id == id && !participant.is_settled
        );
        return friendOnly.length > 0;
      }
    );
    return {
      settled: settledExpenses,
      unsettled: unsettledExpenses,
    };
  });
  const unsettledExpenses = useSelector((state) => {
    let expenses = Object.values(state.expense.unsettledExpenses).filter(
      (expense) => {
        return expense.friendship.user_id == friendship.friend_id;
      }
    );
    return expenses;
  });
  const settledExpenses = useSelector((state) => {
    let expenses = Object.values(state.expense.settledExpenses).filter(
      (expense) => {
        return expense.friendship.user_id == friendship.friend_id;
      }
    );
    return expenses;
  });
  const sentPayments = useSelector((state) => {
    let payments = Object.values(state.payment.sentPayments).filter(
      (payment) => {
        return payment.friendship_id == id;
      }
    );
    return payments;
  });
  const receivedPayments = useSelector((state) => {
    let payments = Object.values(state.payment.receivedPayments).filter(
      (payment) => {
        return payment.friendship.user_id == friendship.friend_id;
      }
    );
    return payments;
  });

  const [isFriendshipLoaded, setIsFriendshipLoaded] = useState(false);
  const [isUserExpensesLoaded, setIsUserExpensesLoaded] = useState(false);
  const [isUnsettledExpensesLoaded, setIsUnsettledExpensesLoaded] =
    useState(false);
  const [isSettledExpensesLoaded, setIsSettledExpensesLoaded] = useState(false);
  const [isSentPaymentsLoaded, setIsSentPaymentsLoaded] = useState(false);
  const [isReceivedPaymentsLoaded, setIsReceivedPaymentsLoaded] =
    useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(friendActions.fetchFriendshipById(id)).then(() =>
        setIsFriendshipLoaded(true)
      );
      await dispatch(expenseActions.getCreatedExpenses()).then(() =>
        setIsUserExpensesLoaded(true)
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

    return () => {
      Object.values(document.getElementsByClassName("expense-details")).forEach((el) => el.classList.add("hidden"));
      Object.values(document.getElementsByClassName("payment-details")).forEach((el) => el.classList.add("hidden"));
      document.getElementById("show-container")?.classList.remove("hidden");
      setIsVisible(false);
    };
  }, [dispatch, id]);

  let unsettledItems = [];
  let settledItems = [];

  if (
    isFriendshipLoaded &&
    isUserExpensesLoaded &&
    isSettledExpensesLoaded &&
    isUnsettledExpensesLoaded &&
    isSentPaymentsLoaded &&
    isReceivedPaymentsLoaded
  ) {
    const userUnsettledExpenses = userExpenses.unsettled.map((expenseObj) => {
      return { ...expenseObj, type: "created" };
    });
    const friendUnsettledExpenses = unsettledExpenses.map((expenseObj) => {
      return { ...expenseObj, type: "charged" };
    });

    unsettledItems = [
      ...userUnsettledExpenses,
      ...friendUnsettledExpenses,
    ].sort((e1, e2) => {
      return (
        new Date(e2.created_at).getTime() - new Date(e1.created_at).getTime()
      );
    });

    const userSettledExpenses = userExpenses.settled.map((expenseObj) => {
      return { ...expenseObj, type: "created" };
    });
    const friendSettledExpenses = settledExpenses.map((expenseObj) => {
      return { ...expenseObj, type: "charged" };
    });
    const userSentPayments = sentPayments.map((paymentObj) => {
      return { ...paymentObj, type: "sent" };
    });
    const userReceivedPayments = receivedPayments.map((paymentObj) => {
      return { ...paymentObj, type: "received" };
    });

    settledItems = [
      ...userSettledExpenses,
      ...friendSettledExpenses,
      ...userSentPayments,
      ...userReceivedPayments,
    ].sort((e1, e2) => {
      return (
        new Date(e2.created_at).getTime() - new Date(e1.created_at).getTime()
      );
    });
  }

  const deleteExpense = (expenseId, settled, type) => {
    let answer = window.confirm(
      "Are you sure you want to delete this expense? This will completely remove this expense for ALL people involved, not just you."
    );
    if (answer) {
      dispatch(expenseActions.deleteExpense(expenseId));
      if (settled) {
        if (type === "created") {
          settledItems = settledItems.filter((obj) => {
            return !(!obj.expense && obj.id == expenseId);
          });
        } else if (type === "charged") {
          settledItems = settledItems.filter((obj) => {
            return !(obj.expense.id == expenseId);
          });
        }
      } else {
        if (type === "created") {
          unsettledItems = unsettledItems.filter((obj) => {
            return !(!obj.expense && obj.id == expenseId);
          });
        } else if (type === "charged") {
          unsettledItems = unsettledItems.filter((obj) => {
            return !(obj.expense.id == expenseId);
          });
        }
      }
    }
  };

  const deletePayment = (paymentId) => {
    let answer = window.confirm(
      "Are you sure you want to delete this payment?"
    );
    if (answer) {
      dispatch(paymentActions.fetchDeletePayment(paymentId));
      settledItems = settledItems.filter((obj) => {
        return !(
          (obj.type === "sent" || obj.type === "received") &&
          obj.id == paymentId
        );
      });
    }
  };

  if (!sessionUser) return <Redirect to="/" />;

  return (isFriendshipLoaded &&
    <>
      <LeftNavigationBar />
      <TopNavigationBar />
      <MainHeader />
      <RightSummaryBar />
      <div id="friend-items">
        <UnsettledItems items={unsettledItems} friendship={friendship} deleteExpense={deleteExpense} />
        <div id="show-container">
          {unsettledItems.length === 0 &&
            <>
              <img id="settled-up-logo" src={checkmark} alt="checkmark-logo" />
              <div id="show-button-description">You and {friendship.friend.name} are all settled up.</div>
            </>
          }
          {(unsettledItems.length > 0 && settledItems.length > 0) &&
            <div id="show-button-description">All expenses before this date have been settled up.</div>
          }
          {settledItems.length > 0 && <button id="show-button" onClick={() => {
            document.getElementById("show-container").classList.add("hidden");
            setIsVisible(true);
          }}>
            Show settled expenses
          </button>}
        </div>
        {isVisible && <SettledItems items={settledItems} user={sessionUser} friendship={friendship} deleteExpense={deleteExpense} deletePayment={deletePayment} />}
      </div>
    </>
  );
}

export default FriendPage;

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReceivedPayments, fetchSentPayments } from "../../store/payment";
// import { fetchFriendshipById } from "../../store/friend";
import "./PaymentDetailsSection.css";

const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
function PaymentDetailsSection({ paymentId }) {
  const dispatch = useDispatch();
  const allPayments = useSelector((state) => [...Object.values(state.payment.sentPayments), ...Object.values(state.payment.receivedPayments)]);
  const payment = allPayments.filter(payment => payment.id === paymentId)[0];
  const date = new Date(payment?.created_at);
  const createdDate = `${month[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()} `;
  // const selectedFriendship = useSelector(
  //   (state) => state.friend?.selectedFriendship
  // );
  const user = payment.friendship.user;
  const friend = payment.friendship.friend;

  useEffect(() => {
    dispatch(fetchReceivedPayments());
    dispatch(fetchSentPayments());
  }, [dispatch]);

  // useEffect(() => {
  //   if (payment?.friendship_id) {
  //     dispatch(fetchFriendshipById(payment?.friendship_id));
  //   }
  // }, [dispatch, payment?.friendship_id]);

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

  return (
    <div id={`payment-details-${paymentId}`} className="payment-details payment-payments-wrapper hidden">
      <section className="payment-subheader">
        <div className="payment-image-wrapper">
          <img
            src="https://assets.splitwise.com/assets/api/payment_icon/square/large/offline.png"
            alt="dollar sign"
          />
        </div>
        <div className="payment-subheader-text-wrapper">
          <p className="payment-subheader-description">Payment</p>
          <p className="payment-subheader-amount">{formatMoney(payment?.amount)}</p>
          <p className="payment-subheader-date">
            Added by {user.short_name} on {createdDate}
          </p>

          {/* <button
            className="payment-btn payment-edit-btn"
            onClick={() => alert("feature coming soon")}
          >
            Edit payment
          </button> */}
        </div>
      </section>
      <hr style={{width:"95%"}} />
      <main className="payment-main">
        <section className="payment-main-content">
          <div className="payment-content-wrapper">
            <div className="payment-main-content-wrapper">
              <img src={user?.image_url} alt={friend?.short_name} />
              <p>
                <span>{user?.short_name}</span> paid{" "}
                <span> {formatMoney(payment?.amount)} </span>
              </p>
            </div>

            <div className="payment-main-content-wrapper">
              <img src={friend?.image_url} alt={user?.short_name} />
              <p>
                <span> {friend?.short_name} </span> recieved{" "}
                <span> {formatMoney(payment?.amount)}</span>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default PaymentDetailsSection;

import receipt from "./receipt.jpeg";
import ExpenseDetailsSection from "../ExpenseDetailsSection";


function UnsettledItems({ items, friendship, deleteExpense }) {

    const formatMoney = (amount) => {
        return "$" + String(Number(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    };

    return (
        <div id="unsettled-items">
            {items.map((obj) => {
                const dateStr = new Date(obj.created_at).toDateString();
                const dateMonth = `${dateStr.split(" ")[1].toUpperCase()}`;
                const dateDay = `${dateStr.split(" ")[2]}`;
                switch (obj.type) {
                    case 'created':
                        return (
                            <>
                                <div className="expense-header"
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
                                        <p>you lent {friendship.friend.short_name}</p>
                                        <p>{formatMoney(obj.participants[0].amount_due)}</p>
                                    </div>
                                </div>
                                <ExpenseDetailsSection expenseId={obj.id} />
                            </>

                        );
                    case 'charged':
                        return (
                            <>
                                <div className="expense-header"
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
                                        <p>{friendship.friend.short_name} paid</p>
                                        <p>{formatMoney(obj.expense.amount)}</p>
                                    </div>
                                    <div className="expense-header-B orange-amount">
                                        <p>{friendship.friend.short_name} lent you</p>
                                        <p>{formatMoney(obj.amount_due)}</p>
                                    </div>
                                </div>
                                <ExpenseDetailsSection expenseId={obj.expense.id} />
                            </>

                        );
                    default:
                        return <></>;
                }
            })}
        </div>
    );
}

export default UnsettledItems;

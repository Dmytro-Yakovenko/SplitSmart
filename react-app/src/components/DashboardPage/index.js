import { NavLink, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getSummary } from "../../store/expense";
import { fetchFriendships } from "../../store/friend";
import LeftNavigationBar from "../LeftNavigationBar";
import TopNavigationBar from "../TopNavigationBar";
import MainHeader from "../MainHeader";
import RightSummaryBar from "../RightSummaryBar";
import settled from './all-settled-up.png';
import "./DashboardPage.css";

function DashboardPage() {
  //dispatch
  const dispatch = useDispatch();

  //states selector
  const sessionUser = useSelector((state) => state.session.user);
  const summary = useSelector((state) => state.expense.summary);
  const friend = useSelector((state) => state.friend);

  //variables
  const friendship = Object.values(friend.friendships);

  //useEffect
  useEffect(() => {
    dispatch(getSummary());
    dispatch(fetchFriendships());
  }, [dispatch]);

  //utils function
  const youOwe = friendship.filter((item) => item.bill > 0);
  const youAreOwed = friendship.filter((item) => item.bill < 0);
  const formatMoney = (amount) => {
    if (amount || amount === 0) {
      const balance = amount[0] === "-" ? amount.substring(1) : amount;
      return (
        "$" +
        String(
          Number(balance)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,")
        )
      );
    }
  };

  //redirect if not auth
  if (!sessionUser) return <Redirect to="/" />;

  if (Number(summary?.balance) == 0) {
    return (
      <>
        <LeftNavigationBar />
        <TopNavigationBar />
        <MainHeader />
        <RightSummaryBar />
        <div className="dashboard-main">
          <img src={settled} className="dashboard-settled-img" alt="all-settled-up" />
        </div>
      </>
    );
  } else {
    return (
      <>
        <LeftNavigationBar />
        <TopNavigationBar />
        <MainHeader />
        <RightSummaryBar />
        <main className="dashboard-main">
          <section className="dashboard-subheader">
            <ul className="dashboard-subheader-list">
              <li>
                <p className="dashboard-subheader-list-text">total balance </p>

                {Number(summary["you owe"]) > Number(summary["you are owed"]) ? (
                  <p
                    className={`dashboard-subheader-text dashboard-subheader-text-orange`}
                  >
                    -{formatMoney(summary?.balance)}
                  </p>
                ) : (
                  <p
                    className={`dashboard-subheader-text ${summary?.balance
                      ? "dashboard-subheader-text-green"
                      : "dashboard-subheader-text-grey"
                      }`}
                  >
                    +{formatMoney(summary?.balance)}
                  </p>


                )}
              </li>
              <div className="border-box">
              </div>
              <li className="dashboard-subheader-item">
                <p className="dashboard-subheader-list-text">you owe </p>

                <p
                  className={`dashboard-subheader-text ${summary["you owe"]
                    ? "dashboard-subheader-text-orange"
                    : "dashboard-subheader-text-grey"
                    }`}
                >
                  {formatMoney(summary["you owe"])}
                </p>
              </li>
              <div className="border-box">
              </div>
              <li>
                <p className="dashboard-subheader-list-text">you are owed </p>

                <p
                  className={`dashboard-subheader-text ${summary["you are owed"]
                    ? "dashboard-subheader-text-green"
                    : "dashboard-subheader-text-grey"
                    }`}
                >
                  {formatMoney(summary["you are owed"])}
                </p>
              </li>
            </ul>
          </section>

          <section className="dashboard-owed-section">
            <div className="dashboard-owed-wrapper">
              <h4 className="dashboard-owed-title">YOU OWE</h4>
              {youOwe.length !== 0 ? (
                <ul className="dashboard-owed-list">
                  {youOwe.map((item) => (
                    <li className="dashboard-owed-item" key={item.id}>
                      <NavLink to={`/friends/${item.id}`}>
                        <img src={item.friend.image_url} alt={item.friend.name} />
                        <div>
                          <p>{item.friend.name}</p>
                          <p className="dashboard-subheader-text-orange">
                            you owe {formatMoney(item.bill)}
                          </p>
                        </div>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="dashboard-no-owe">You don't owe anything</p>
              )}
            </div>
            <div className="dashboard-owed-wrapper dashboard-owed-wrapper-right">
              <h4 className="dashboard-owed-title dashboard-owed-title-right ">
                YOU ARE OWED
              </h4>
              {youAreOwed.length !== 0 ? (
                <ul className="dashboard-owed-list">
                  {youAreOwed.map((item) => (
                    <li className="dashboard-owed-item" key={item.id}>
                      <NavLink to={`/friends/${item.id}`}>
                        <img src={item.friend.image_url} alt={item.friend.name} />
                        <div>
                          <p>{item.friend.name}</p>
                          <p className="dashboard-subheader-text-green">
                            owes you {formatMoney(item.bill)}
                          </p>
                        </div>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="dashboard-no-owe dashboard-no-owe-right">You are not owed anything</p>
              )}
            </div>
          </section>
        </main>
      </>
    );
  }
}

export default DashboardPage;

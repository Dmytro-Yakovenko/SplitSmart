import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import './AboutPage.css';
import img_one from './img_one.png'
import img_two from './img_two.png'
import img_three from './img_three.png'
import TopNavigationBar from "../TopNavigationBar";

function AboutPage() {
    const history = useHistory();
    const sessionUser = useSelector((state) => state.session.user);

    if (sessionUser) return <Redirect to="/dashboard" />;

    return (
        <>
            <TopNavigationBar />
            <div className="about-page-container">
                <div className="slideshow">
                    <h1>Less stress when sharing expenses<span id="swap-text"> </span></h1>
                    <h3>Keep track of your shared expenses and balances with housemates, trips, groups, friends, and family.</h3>
                    <button className="signup-button" onClick={() => {
                        history.push('/signup');
                    }}>Sign up</button>
                </div>
                <div className="about-page-images">
                    <div>
                        <h2>Add Expenses Easily</h2>
                        <img src={img_one} alt="img_one" />
                    </div>
                    <div>
                        <h2>Converse with Friends</h2>
                        <img src={img_two} alt="img_two" />
                    </div>
                    <div>
                        <h2>Track Balances</h2>
                        <img src={img_three} alt="img_three" />
                    </div>
                </div>
            </div>
        </>

    );
}

export default AboutPage;

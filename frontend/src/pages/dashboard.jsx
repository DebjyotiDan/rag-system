import { Link } from "react-router-dom";
import '../index.css';

function Dashboard() {
    return (
        <>

            <div className="home-container">

                <h1>Dashboard</h1>

            </div>
            <div className="logout">
                <Link to="/login">
                    <button className="out">
                        Log out
                    </button>
                </Link>
            </div>
            <div className="rag-container">
                <p>Welcome to Rag System</p>
            </div>
            <div className="chat">
                <button className="out">
                    Start Chat
                </button>

            </div>
        </>
    );
}

export default Dashboard;
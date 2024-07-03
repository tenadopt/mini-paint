import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from '../pages/Auth/SignIn';
import SignUp from '../pages/Auth/SignUp';

const App: React.FC = () => {

    return (
            <Router>
                <Routes>
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                </Routes>
            </Router>
    );
};

export default App;

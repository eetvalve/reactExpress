import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import WeatherList from './components/WeatherList'
import Hello from './components/Hellotext'

function Header() {
    return(
        <Router>
            <div>

                <ul className="link_list">
                    <li className="linkTo"><Link to={'/'}>Home</Link></li>
                    <li className="linkTo"><Link to={'/weather'}>weather</Link></li>
                </ul>






                <Switch>
                    <Route exact path='/' component={Hello} />
                    <Route exact path='/weather' component={WeatherList} />
                </Switch>

            </div>
        </Router>
    )
}

export default Header;

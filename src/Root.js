import React from 'react';
import {createStore, applyMiddleware, compose} from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import App from './App';
import todoApp from './reducers/index';


const Root = (props) => {

    let store = createStore(todoApp,
        compose(
            applyMiddleware(thunk),
            window.devToolsExtension ? window.devToolsExtension() : f => f // connect to redux devtools
        )
    );

    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

export default Root;
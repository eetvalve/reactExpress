import {combineReducers} from 'redux'
import {weathers, weatherInitialState} from './items'

const todoApp = combineReducers({
    weathers,
    weatherInitialState
})

export default todoApp;
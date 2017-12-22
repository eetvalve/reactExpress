import * as actionTypes from '../actionTypes'

export const weatherInitialState = {
    bool: false,
    items: []
}

export const weathers = (state = weatherInitialState, action) => {
    switch (action.type){
        case actionTypes.ITEMS_HAS_ERRORED:
            return {
                ...state,
                bool: action.hasErrored
            }
        case actionTypes.ITEMS_IS_LOADING:
            return{
                ...state,
                bool: action.hasErrored
            }
        case actionTypes.ITEMS_FETCH_DATA_SUCCESS:
            return{
                ...state,
                items: action.items
            }
        default:
            return state
    }
}

export default weathers;
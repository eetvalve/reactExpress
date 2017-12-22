import * as actionTypes from '../actionTypes'

export const itemsHasErrored = bool => {
    return{
        type: actionTypes.ITEMS_HAS_ERRORED,
        hasErrored: bool
    }
}

export const itemsIsLoading = bool => {
    return{
        type: actionTypes.ITEMS_IS_LOADING,
        hasErrored: bool
    }
}

export const itemsFetchDataSuccess = items => {
    return{
        type: actionTypes.ITEMS_FETCH_DATA_SUCCESS,
        items
    }
}

export const itemsFetchData = url => {
    return (dispatch) => {
        dispatch(itemsIsLoading(true));

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }

                dispatch(itemsIsLoading(false));

                return response;
            })
            .then(response => response.json())
            .then(items => dispatch(itemsFetchDataSuccess(items)))
            .catch(() => dispatch(itemsHasErrored(true)));
    }
}
import {handleError} from './actions/ErrorActions';

const crashReporter = store => next => async action => {
    try {
        return await next(action);
    } catch (e) {
        store.dispatch(handleError(e.message));
    }
};

export default crashReporter;

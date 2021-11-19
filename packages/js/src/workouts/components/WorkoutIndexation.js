import Indexation from "../../components/Indexation";
import PropTypes from "prop-types";

const preIndexingActions = {};
const indexingActions = {};

window.yoast = window.yoast || {};
window.yoast.indexing = window.yoast.indexing || {};

/**
 * A wrapped Indexation for the configuration workout.
 *
 * @param {function} indexingStateCallback   The function to call back on state updates.
 * @returns {WPElement} A wrapped Indexation for the configuration workout.
 */
export function WorkoutIndexation( { indexingStateCallback } ) {
	return <Indexation
		preIndexingActions={ preIndexingActions }
		indexingActions={ indexingActions }
		indexingStateCallback={ indexingStateCallback }
	/>;
}

/**
 * Registers a pre-indexing action on the given indexing endpoint.
 *
 * This action is executed before the endpoint is first called with the indexing
 * settings as its first argument.
 *
 * @param {string}   endpoint The endpoint on which to register the action.
 * @param {function} action   The action to register.
 *
 * @returns {void}
 */
window.yoast.indexing.registerPreIndexingAction = ( endpoint, action ) => {
	preIndexingActions[ endpoint ] = action;
};

/**
 * Registers an action on the given indexing endpoint.
 *
 * This action is executed each time after the endpoint is called, with the objects
 * returned from the endpoint as its first argument and the indexing settings as its second argument.
 *
 * @param {string}                       endpoint The endpoint on which to register the action.
 * @param {function(Object[], Object[])} action   The action to register.
 *
 * @returns {void}
 */
window.yoast.indexing.registerIndexingAction = ( endpoint, action ) => {
	indexingActions[ endpoint ] = action;
};

WorkoutIndexation.propTypes = {
	indexingStateCallback: PropTypes.any,
};

WorkoutIndexation.defaultProps = {
	indexingStateCallback: null,
};

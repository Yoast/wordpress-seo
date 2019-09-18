const INITIAL_STATE = {
	installing: false,
	singlePluginInstallation: false,
	tasks: [],
};

/**
 * Updates an object in an existing array and returns a new array.
 *
 * @param {Array}  array         The array to update the object in.
 * @param {number} itemIndex     The item's index.
 * @param {Object} updatedValues The updated values.
 *
 * @returns {Array} The new array.
 */
function updateObjectInArray( array, itemIndex, updatedValues ) {
	return array.map( ( item, index ) => {
		if ( index !== itemIndex ) {
			// This isn't the item we care about - keep it as-is
			return item;
		}

		// Otherwise, this is the one we want - return an updated value
		return {
			...item,
			...updatedValues,
		};
	} );
}

export default ( state = INITIAL_STATE, action ) => {
	switch ( action.type ) {
		case "SET_QUEUE":
			return {
				...INITIAL_STATE,
				tasks: action.tasks,
				singlePluginInstallation: action.singlePluginInstallation,
			};
		case "SET_INSTALLING":
			return {
				...state,
				installing: action.installing,
			};
		case "TASK_STARTED":
			return {
				...state,
				tasks: updateObjectInArray(
					state.tasks,
					action.taskIndex,
					{
						status: "running",
					}
				),
			};
		case "TASK_FAILED":
			return {
				...state,
				tasks: updateObjectInArray(
					state.tasks,
					action.taskIndex,
					{
						status: "failed",
					}
				),
			};
		case "TASK_SUCCESS":
			return {
				...state,
				tasks: updateObjectInArray(
					state.tasks,
					action.taskIndex,
					{
						status: "finished",
					}
				),
			};
	}
	return state;
};

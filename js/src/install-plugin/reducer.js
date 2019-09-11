const INITIAL_STATE = {
	installing: false,
	tasks: [],
};

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

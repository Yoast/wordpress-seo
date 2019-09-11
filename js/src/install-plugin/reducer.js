const INITIAL_STATE = {
	installing: false,
	plugins: {},
};

export default ( state = INITIAL_STATE, action ) => {
	switch ( action.type ) {
		case "PLUGIN_INSTALLATION_INIT":
			return {
				installing: true,
				...INITIAL_STATE,
			};
		case "PLUGIN_INSTALLATION_STARTED":
			return {
				...state,
				plugins: {
					...state.plugins,
					[ action.plugin ]: {
						status: "downloading",
					},
				},
			};
		case "PLUGIN_INSTALLATION_FAILED":
			return {
				...state,
				plugins: {
					...state.plugins,
					[ action.plugin ]: {
						status: "failed",
					},
				},
			};
		case "PLUGIN_INSTALLATION_SUCCESS":
			return {
				...state,
				plugins: {
					...state.plugins,
					[ action.plugin ]: {
						status: "activating",
					},
				},
			};
		case "PLUGIN_ACTIVATION_SUCCESS":
			return {
				...state,
				plugins: {
					...state.plugins,
					[ action.plugin ]: {
						status: "success",
					},
				},
			};
	}
	return state;
};

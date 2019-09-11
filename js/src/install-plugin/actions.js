// External dependencies.
import apiFetch from "@wordpress/api-fetch";

export function setQueue( tasks ) {
	for ( let i = 0; i < tasks.length; i++ ) {
		tasks[ i ].status = "pending";
	}

	return {
		type: "SET_QUEUE",
		tasks,
	};
}

export function startInstallation() {
	return async function( dispatch, getState ) {
		const state = getState().pluginInstallation;

		if ( state.installing ) {
			return;
		}

		dispatch( {
			type: "SET_INSTALLING",
			installing: true,
		} );

		for ( let i = 0; i < state.tasks.length; i++ ) {
			const task = state.tasks[ i ];

			try {
				switch ( task.type ) {
					case "ACTIVATE_PLUGIN":
						await activatePlugin( task, i, dispatch );
						break;
					case "INSTALL_PLUGIN":
						await installPlugin( task, i, dispatch );
						break;
				}
			} catch ( e ) {
				dispatch( {
					type: "TASK_FAILED",
					task,
					i,
				} );
			}
		}

		dispatch( {
			type: "SET_INSTALLING",
			installing: false,
		} );
	};
}

/**
 * Install plugin.
 *
 * @param {array} plugins List of plugin slugs.
 *
 * @returns {function} Plugin install thunk.
 */
async function installPlugin( task, taskIndex, dispatch ) {
	const { plugin } = task;

	dispatch( {
		type: "TASK_STARTED",
		task,
		taskIndex,
	} );

	await apiFetch( {
		path: `/yoast/v1/myyoast/download/install?slug=${plugin}`,
	} );

	dispatch( {
		type: "TASK_SUCCESS",
		task,
		taskIndex,
	} );
}

async function activatePlugin( task, taskIndex, dispatch ) {
	const { plugin } = task;

	dispatch( {
		type: "TASK_STARTED",
		task,
		taskIndex,
	} );

	await apiFetch( {
		path: `/yoast/v1/myyoast/download/activate?slug=${plugin}`,
	} );

	dispatch( {
		type: "TASK_SUCCESS",
		task,
		taskIndex,
	} );
}

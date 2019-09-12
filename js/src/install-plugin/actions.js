// External dependencies.
import apiFetch from "@wordpress/api-fetch";

/**
 * Set tasks queue.
 *
 * @param {array} tasks The tasks.
 *
 * @returns {Object} Redux action.
 */
export function setQueue( tasks ) {
	for ( let i = 0; i < tasks.length; i++ ) {
		tasks[ i ].status = "pending";
	}

	return {
		type: "SET_QUEUE",
		tasks,
	};
}

/**
 * Install plugin.
 *
 * @param {string} pluginSlug Slug of the plugin to install.
 *
 * @returns {void}
 */
async function installPlugin( pluginSlug ) {
	await apiFetch( {
		path: `/yoast/v1/myyoast/download/install?slug=${ pluginSlug }`,
	} );
}

/**
 * Activate plugin.
 *
 * @param {string} pluginSlug Slug of the plugin to activate.
 *
 * @returns {void}
 */
async function activatePlugin( pluginSlug ) {
	await apiFetch( {
		path: `/yoast/v1/myyoast/download/activate?slug=${ pluginSlug }`,
	} );
}

/**
 * Execute a single task.
 *
 * @param {function} dispatch  Dispatch function.
 * @param {object}   task      Task to be executed.
 * @param {number}   taskIndex Task index in queue.
 *
 * @returns {void}
 */
async function runTask( dispatch, task, taskIndex ) {
	dispatch( {
		type: "TASK_STARTED",
		task,
		taskIndex,
	} );

	try {
		switch ( task.type ) {
			case "ACTIVATE_PLUGIN":
				await activatePlugin( task.plugin );
				break;
			case "INSTALL_PLUGIN":
				await installPlugin( task.plugin );
				break;
		}
	} catch ( e ) {
		dispatch( {
			type: "TASK_FAILED",
			task,
			taskIndex,
		} );

		return;
	}

	dispatch( {
		type: "TASK_SUCCESS",
		task,
		taskIndex,
	} );
}

/**
 * Execute the queued tasks.
 *
 * @returns {function} Redux thunk.
 */
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
			await runTask( dispatch, state.tasks[ i ], i );
		}

		dispatch( {
			type: "SET_INSTALLING",
			installing: false,
		} );
	};
}

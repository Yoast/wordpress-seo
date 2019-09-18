// External dependencies.
import apiFetch from "@wordpress/api-fetch";

/**
 * Set tasks queue.
 *
 * @param {array} tasks  The tasks.
 * @param {bool}  single Whether or not this is a single plugin installation queue.
 *
 * @returns {Object} Redux action.
 */
function setQueue( tasks, single ) {
	return {
		type: "SET_QUEUE",
		singlePluginInstallation: single,
		tasks,
	};
}

/**
 * Que multiple plugins for installation and activation.
 *
 * @param {array<string>} pluginSlugs The plugin slugs.
 *
 * @returns {Object} Redux action.
 */
export function queueMultiplePluginInstallations( pluginSlugs ) {
	const queue = [];

	for ( let i = 0; i < pluginSlugs.length; i++ ) {
		queue.push( {
			status: "pending",
			type: "INSTALL_PLUGIN",
			plugin: pluginSlugs[ i ],
		} );
		queue.push( {
			status: "pending",
			type: "ACTIVATE_PLUGIN",
			plugin: pluginSlugs[ i ],
		} );
	}

	return setQueue( queue, pluginSlugs.length === 1 ? pluginSlugs[ 0 ] : false );
}

/**
 * Queue a single plugin for installation and activation.
 *
 * @param {string} pluginSlug The plugin slugs.
 *
 * @returns {Object} Redux action.
 */
export function queuePluginInstallation( pluginSlug ) {
	return queueMultiplePluginInstallations( [ pluginSlug ] );
}

/**
 * Install plugin.
 *
 * @param {string} pluginSlug Slug of the plugin to install.
 *
 * @returns {void}
 */
async function installPluginCall( pluginSlug ) {
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
async function activatePluginCall( pluginSlug ) {
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
 * @returns {boolean} Whether the task succeeded.
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
				await activatePluginCall( task.plugin );
				break;
			case "INSTALL_PLUGIN":
				await installPluginCall( task.plugin );
				break;
		}
	} catch ( e ) {
		dispatch( {
			type: "TASK_FAILED",
			task,
			taskIndex,
		} );

		return false;
	}

	dispatch( {
		type: "TASK_SUCCESS",
		task,
		taskIndex,
	} );

	return true;
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
			if ( ! await runTask( dispatch, state.tasks[ i ], i ) ) {
				break;
			}
		}

		dispatch( {
			type: "SET_INSTALLING",
			installing: false,
		} );
	};
}

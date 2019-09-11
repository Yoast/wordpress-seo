// External dependencies.
import apiFetch from "@wordpress/api-fetch";

export const INSTALL_PLUGINS = "WPSEO_INSTALL_PLUGINS";

/**
 * Install plugins.
 *
 * @param {array} plugins List of plugin slugs.
 *
 * @returns {function} Plugin install thunk.
 */
export function installPlugins( plugins ) {
	if ( plugins.length === 0 ) {
		return;
	}

	return async function( dispatch ) {
		dispatch( {
			type: "PLUGIN_INSTALLATION_INIT",
			plugins: plugins,
		} );

		for ( let i = 0; i < plugins.length; i++ ) {
			const plugin = plugins[ i ];

			dispatch( {
				type: "PLUGIN_INSTALLATION_STARTED",
				plugin: plugin,
			} );

			try {
				await apiFetch( {
					path: `/yoast/v1/myyoast/download/install?slug=${plugin}`,
				} );

				dispatch( {
					type: "PLUGIN_INSTALLATION_SUCCESS",
					plugin: plugin,
				} );

				await apiFetch( {
					path: `/yoast/v1/myyoast/download/activate?slug=${plugin}`,
				} );

				dispatch( {
					type: "PLUGIN_ACTIVATION_SUCCESS",
					plugin: plugin,
				} );
			} catch ( e ) {
				dispatch( {
					type: "PLUGIN_INSTALLATION_FAILED",
					plugin: plugin,
					error: "SOMETHING WENT WRONG!",
				} );
			}
		}
	};
}

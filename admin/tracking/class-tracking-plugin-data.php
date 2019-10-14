<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Tracking
 */

/**
 * Represents the plugin data.
 */
class WPSEO_Tracking_Plugin_Data implements WPSEO_Collection {

	/**
	 * Returns the collection data.
	 *
	 * @return array The collection data.
	 */
	public function get() {
		return array(
			'plugins' => $this->get_plugin_data(),
		);
	}

	/**
	 * Returns all plugins.
	 *
	 * @return array The formatted plugins.
	 */
	protected function get_plugin_data() {

		if ( ! function_exists( 'get_plugin_data' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		$plugins = wp_get_active_and_valid_plugins();
		$plugins = array_map( 'get_plugin_data', $plugins );
		$plugins = array_map( array( $this, 'format_plugin' ), $plugins );

		$plugin_data = array();
		foreach ( $plugins as $plugin ) {
			$plugin_key = sanitize_title( $plugin['name'] );
			$plugin_data[ $plugin_key ] = $plugin;
		}

		return $plugin_data;
	}

	/**
	 * Formats the plugin array.
	 *
	 * @param array $plugin The plugin details.
	 *
	 * @return array The formatted array.
	 */
	protected function format_plugin( array $plugin ) {
		return array(
			'name'    => $plugin['Name'],
			'version' => $plugin['Version'],
		);
	}
}

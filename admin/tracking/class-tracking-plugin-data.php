<?php
/**
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

		return $plugins;
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
			'url'     => $plugin['PluginURI'],
			'version' => $plugin['Version'],
			'author'  => array(
				'name' => wp_strip_all_tags( $plugin['Author'], true ),
				'url'  => $plugin['AuthorURI'],
			),
		);
	}
}

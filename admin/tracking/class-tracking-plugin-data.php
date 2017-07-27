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
	 * @return array
	 */
	protected function get_plugin_data() {

		$plugins = array();

		if ( ! function_exists( 'get_plugin_data' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		foreach ( wp_get_active_and_valid_plugins() as $plugin ) {
			$plugins[] = $this->format_plugin( get_plugin_data( $plugin ) );
		}

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
				'name' => $plugin['Author'],
				'url'  => $plugin['AuthorURI'],
			),
		);
	}
}

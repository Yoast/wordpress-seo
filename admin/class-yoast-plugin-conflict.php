<?php

/**
 * @package Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( ! class_exists( 'Yoast_Plugin_Conflict' ) ) {

	class Yoast_Plugin_Conflict {

		/**
		 * The plugins must be grouped per section.
		 *
		 * It's possible to check for each section if there are conflicting plugin
		 *
		 * @var array
		 */
		protected $plugins = array( );

		/**
		 * All the current active plugins will be stored in this private var
		 *
		 * @var array
		 */
		protected $all_active_plugins = array();

		/**
		 * After searching for active plugins that are in $this->plugins the active plugins will be stored in this
		 * property
		 *
		 * @var array
		 */
		protected $active_plugins = array();

		/**
		 * Property for holding instance of itself
		 *
		 * @var Yoast_Plugin_Conflict
		 */
		protected static $instance;

		/**
		 * For the use of singleton pattern. Create instance of itself and return his instance
		 *
		 * @return Yoast_Plugin_Conflict
		 */
		public static function instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}

		/**
		 * Setting instance, all active plugins and search for active plugins
		 */
		public function __construct() {

			if ( is_null( self::$instance ) ) {
				self::$instance = $this;
			}

			// Set active plugins
			$this->all_active_plugins = get_option( 'active_plugins' );

			// Search for active plugins
			$this->search_active_plugins();
		}

		/**
		 * Check if there are conflicting plugins for given $plugin_section
		 *
		 * @param string $plugin_section
		 *
		 * @return bool
		 */
		public static function check_for_conflicts( $plugin_section ) {
			$has_conflicts = ( ! empty( self::instance()->active_plugins[$plugin_section] ) );

			return $has_conflicts;
		}

		/**
		 * Getting all the conflicting plugins and return them as a string.
		 *
		 * This method will loop through all conflicting plugins to get the details of each plugin. The plugin name
		 * will be taken from the details to parse a comma separated string, which can be use for by example a notice
		 *
		 * @param string $plugin_section
		 *
		 * @return string
		 */
		public static function get_conflicting_plugins_as_string( $plugin_section ) {
			if ( ! function_exists( 'get_plugin_data' ) ) {
				require_once( ABSPATH . '/wp-admin/includes/plugin.php' );
			}

			// Getting the active plugins by given section
			$plugins = self::instance()->active_plugins[$plugin_section];

			$plugin_names = array();
			foreach ( $plugins AS $plugin ) {
				$plugin_details = get_plugin_data( ABSPATH . '/wp-content/plugins/' . $plugin );

				if ( $plugin_details['Name'] != '' ) {
					$plugin_names[] = $plugin_details['Name'];
				}
			}

			if ( ! empty( $plugin_names ) ) {
				return implode( ', ', $plugin_names );
			}
		}

		/**
		 * Loop through the $this->plugins to check if one of the plugins is active.
		 *
		 * This method will store the active plugins in $this->active_plugins.
		 */
		protected function search_active_plugins() {
			foreach ( $this->plugins AS $plugin_category => $plugins ) {
				$this->check_plugins_active( $plugins, $plugin_category );
			}
		}

		/**
		 * Loop through plugins and check if each plugin is active
		 *
		 * @param array  $plugins
		 * @param string $plugin_category
		 */
		protected function check_plugins_active( $plugins, $plugin_category ) {
			foreach ( $plugins AS $plugin ) {
				if ( $this->check_plugin_is_active( $plugin ) ) {
					$this->add_active_plugin( $plugin_category, $plugin );
				}
			}
		}

		/**
		 * Check if given plugin exists in array with all_active_plugins
		 *
		 * @param string $plugin
		 *
		 * @return bool
		 */
		protected function check_plugin_is_active( $plugin ) {

			$is_plugin_active = in_array( $plugin, $this->all_active_plugins );

			return $is_plugin_active;
		}

		/**
		 * Add plugin to the list of active plugins.
		 *
		 * This method will check first if key $plugin_category exists, if not it will create an empty array
		 * If $plugin itself doesn't exist it will be added.
		 *
		 * @param string $plugin_category
		 * @param string $plugin
		 */
		protected function add_active_plugin( $plugin_category, $plugin ) {

			if ( ! array_key_exists( $plugin_category, $this->active_plugins ) ) {
				$this->active_plugins[$plugin_category] = array();
			}

			if ( ! in_array( $plugin, $this->active_plugins[$plugin_category] ) ) {
				$this->active_plugins[$plugin_category][] = $plugin;
			}


		}

	}

}
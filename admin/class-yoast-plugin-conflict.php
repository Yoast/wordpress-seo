<?php
/**
 * @package    WPSEO\Admin
 * @since      1.7.0
 */

/**
 * Base class for handling plugin conflicts.
 */
class Yoast_Plugin_Conflict {

	/**
	 * The plugins must be grouped per section.
	 *
	 * It's possible to check for each section if there are conflicting plugin
	 *
	 * @var array
	 */
	protected $plugins = array();

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
	 * @param string $class_name Give the classname to initialize. If classname is false (empty) it will use it's own
	 *                           __CLASS__.
	 *
	 * @return Yoast_Plugin_Conflict
	 */
	public static function get_instance( $class_name = '' ) {

		if ( is_null( self::$instance ) ) {
			if ( ! is_string( $class_name ) || $class_name === '' ) {
				$class_name = __CLASS__;
			}

			self::$instance = new $class_name();
		}

		return self::$instance;
	}

	/**
	 * Setting instance, all active plugins and search for active plugins
	 *
	 * Protected constructor to prevent creating a new instance of the
	 * *Singleton* via the `new` operator from outside of this class.
	 */
	protected function __construct() {
		// Set active plugins.
		$this->all_active_plugins = get_option( 'active_plugins' );

		if ( filter_input( INPUT_GET, 'action' ) === 'deactivate' ) {
			$this->remove_deactivated_plugin();
		}

		// Search for active plugins.
		$this->search_active_plugins();
	}

	/**
	 * Check if there are conflicting plugins for given $plugin_section
	 *
	 * @param string $plugin_section Type of plugin conflict (such as Open Graph or sitemap).
	 *
	 * @return bool
	 */
	public function check_for_conflicts( $plugin_section ) {

		static $sections_checked;

		if ( $sections_checked === null ) {
			$sections_checked = array();
		}

		if ( ! in_array( $plugin_section, $sections_checked ) ) {
			$sections_checked[] = $plugin_section;
			$has_conflicts      = ( ! empty( $this->active_plugins[ $plugin_section ] ) );

			return $has_conflicts;
		}

		return false;
	}

	/**
	 * Getting all the conflicting plugins and return them as a string.
	 *
	 * This method will loop through all conflicting plugins to get the details of each plugin. The plugin name
	 * will be taken from the details to parse a comma separated string, which can be use for by example a notice
	 *
	 * @param string $plugin_section Plugin conflict type (such as Open Graph or sitemap).
	 *
	 * @return string
	 */
	public function get_conflicting_plugins_as_string( $plugin_section ) {
		if ( ! function_exists( 'get_plugin_data' ) ) {
			require_once( ABSPATH . '/wp-admin/includes/plugin.php' );
		}

		// Getting the active plugins by given section.
		$plugins = $this->active_plugins[ $plugin_section ];

		$plugin_names = array();
		foreach ( $plugins as $plugin ) {
			if ( $name = WPSEO_Utils::get_plugin_name( $plugin ) ) {
				$plugin_names[] = '<em>' . $name . '</em>';
			}
		}
		unset( $plugins, $plugin );

		if ( ! empty( $plugin_names ) ) {
			return implode( ' &amp; ', $plugin_names );
		}
	}

	/**
	 * Checks for given $plugin_sections for conflicts
	 *
	 * @param array $plugin_sections Set of sections.
	 */
	public function check_plugin_conflicts( $plugin_sections ) {
		$notification_center = Yoast_Notification_Center::get();
		foreach ( $plugin_sections as $plugin_section => $readable_plugin_section ) {
			$notification_center->register_notifier( new Yoast_Plugin_Conflict_Notifier( $this, $plugin_section, $readable_plugin_section ) );
		}
	}

	/**
	 * Loop through the $this->plugins to check if one of the plugins is active.
	 *
	 * This method will store the active plugins in $this->active_plugins.
	 */
	protected function search_active_plugins() {
		foreach ( $this->plugins as $plugin_section => $plugins ) {
			$this->check_plugins_active( $plugins, $plugin_section );
		}
	}

	/**
	 * Loop through plugins and check if each plugin is active
	 *
	 * @param array  $plugins        Set of plugins.
	 * @param string $plugin_section Type of conflict group (such as Open Graph or sitemap).
	 */
	protected function check_plugins_active( $plugins, $plugin_section ) {
		$plugins = $this->filter_already_dismissed( $plugin_section, $plugins );
		foreach ( $plugins as $plugin ) {
			if ( $this->check_plugin_is_active( $plugin ) ) {
				$this->add_active_plugin( $plugin_section, $plugin );
			}
		}
	}

	/**
	 * Filter the already dismissed plugins
	 *
	 * @param string $plugin_section Type of conflict group (such as Open Graph or sitemap).
	 * @param array  $plugins        Set of plugins.
	 *
	 * @return array
	 */
	protected function filter_already_dismissed( $plugin_section, array $plugins ) {
		$already_dismissed = get_user_option( 'wpseo_dismissed_conflicts', get_current_user_id() );

		if ( ! empty( $already_dismissed[ $plugin_section ] ) ) {
			foreach ( $plugins as $array_key => $plugin ) {
				if ( in_array( $plugin, $already_dismissed[ $plugin_section ] ) ) {
					unset( $plugins[ $array_key ] );
				}
			}
		}

		return $plugins;
	}

	/**
	 * Check if given plugin exists in array with all_active_plugins
	 *
	 * @param string $plugin Plugin basename string.
	 *
	 * @return bool
	 */
	protected function check_plugin_is_active( $plugin ) {
		return in_array( $plugin, $this->all_active_plugins );
	}

	/**
	 * Add plugin to the list of active plugins.
	 *
	 * This method will check first if key $plugin_section exists, if not it will create an empty array
	 * If $plugin itself doesn't exist it will be added.
	 *
	 * @param string $plugin_section Type of conflict group (such as Open Graph or sitemap).
	 * @param string $plugin         Plugin basename string.
	 */
	protected function add_active_plugin( $plugin_section, $plugin ) {

		if ( ! array_key_exists( $plugin_section, $this->active_plugins ) ) {
			$this->active_plugins[ $plugin_section ] = array();
		}

		if ( ! in_array( $plugin, $this->active_plugins[ $plugin_section ] ) ) {
			$this->active_plugins[ $plugin_section ][] = $plugin;
		}
	}

	/**
	 * Search in $this->plugins for the given $plugin
	 *
	 * If there is a result it will return the plugin category
	 *
	 * @param string $plugin Plugin basename string.
	 *
	 * @return int|string
	 */
	protected function find_plugin_category( $plugin ) {

		foreach ( $this->plugins as $plugin_section => $plugins ) {
			if ( in_array( $plugin, $plugins ) ) {
				return $plugin_section;
			}
		}

	}

	/**
	 * When being in the deactivation process the currently deactivated plugin has to be removed.
	 */
	private function remove_deactivated_plugin() {
		$deactivated_plugin = filter_input( INPUT_GET, 'plugin' );
		$key_to_remove      = array_search( $deactivated_plugin, $this->all_active_plugins );

		if ( $key_to_remove !== false ) {
			unset( $this->all_active_plugins[ $key_to_remove ] );
		}
	}

	/**
	 * Get the active plugins
	 *
	 * @since 3.2
	 *
	 * @return array Of active plugins.
	 */
	public function get_active_plugins() {
		return $this->active_plugins;
	}
}

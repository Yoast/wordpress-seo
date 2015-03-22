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
	 * @param string $class_name Give the classname to initialize. If classname is false (empty) it will use it's own __CLASS__
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
	 *
	 */
	protected function __construct() {
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
	public function check_for_conflicts( $plugin_section ) {

		static $sections_checked;

		if ( $sections_checked == null ) {
			$sections_checked = array();
		}

		if ( ! in_array( $plugin_section, $sections_checked ) ) {
			$sections_checked[] = $plugin_section;
			$has_conflicts      = ( ! empty( $this->active_plugins[ $plugin_section ] ) );

			return $has_conflicts;
		}
		else {
			return false;
		}
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
	public function get_conflicting_plugins_as_string( $plugin_section ) {
		if ( ! function_exists( 'get_plugin_data' ) ) {
			require_once( ABSPATH . '/wp-admin/includes/plugin.php' );
		}

		// Getting the active plugins by given section
		$plugins = $this->active_plugins[ $plugin_section ];

		$plugin_names = array();
		foreach ( $plugins as $plugin ) {
			$plugin_details = get_plugin_data( ABSPATH . '/wp-content/plugins/' . $plugin );

			if ( $plugin_details['Name'] != '' ) {
				$plugin_names[] = $plugin_details['Name'];
			}
		}
		unset( $plugins, $plugin, $plugin_details );

		if ( ! empty( $plugin_names ) ) {
			return implode( ', ', $plugin_names );
		}
	}

	/**
	 * Checks for given $plugin_sections for conflicts
	 *
	 * @param array $plugin_sections
	 */
	public function check_plugin_conflicts( $plugin_sections ) {
		foreach ( $plugin_sections as $plugin_section => $readable_plugin_section ) {
			// Check for conflicting plugins and show error if there are conflicts
			if ( $this->check_for_conflicts( $plugin_section ) ) {
				$this->set_error( $plugin_section, $readable_plugin_section );
			}
		}
	}

	/**
	 * Setting an error on the screen
	 *
	 * @param string $plugin_section
	 * @param string $readable_plugin_section This is the value for the translation
	 */
	protected function set_error( $plugin_section, $readable_plugin_section ) {

		$plugins_as_string = $this->get_conflicting_plugins_as_string( $plugin_section );
		$error_message     = sprintf( __( 'The following plugins might cause (%1s) issues with Yoast WordPress SEO: %2s', 'wordpress-seo' ), $readable_plugin_section, $plugins_as_string );

		// Add the message to the notifications center
		Yoast_Notification_Center::get()->add_notification( new Yoast_Notification( $error_message, 'error' ) );
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
	 * @param array  $plugins
	 * @param string $plugin_section
	 */
	protected function check_plugins_active( $plugins, $plugin_section ) {
		foreach ( $plugins as $plugin ) {
			if ( $this->check_plugin_is_active( $plugin ) ) {
				$this->add_active_plugin( $plugin_section, $plugin );
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
		return in_array( $plugin, $this->all_active_plugins );
	}

	/**
	 * Add plugin to the list of active plugins.
	 *
	 * This method will check first if key $plugin_section exists, if not it will create an empty array
	 * If $plugin itself doesn't exist it will be added.
	 *
	 * @param string $plugin_section
	 * @param string $plugin
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
	 * @param string $plugin
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

}

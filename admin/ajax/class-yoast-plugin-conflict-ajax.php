<?php
/**
 * @package WPSEO\admin|ajax
 */

/**
 * Class Yoast_Plugin_Conflict_Ajax
 */
class Yoast_Plugin_Conflict_Ajax {

	/**
	 * @var string
	 */
	private $option_name = 'wpseo_dismissed_conflicts';

	/**
	 * @var array
	 */
	private $dismissed_conflicts = array();

	/**
	 * Initialize the hooks for the AJAX request
	 */
	public function __construct() {
		add_action( 'wp_ajax_wpseo_dismiss_plugin_conflict', array( $this, 'dismiss_notice' ) );
	}

	/**
	 * Handles the dismiss notice request
	 */
	public function dismiss_notice() {
		check_ajax_referer( 'dismiss-plugin-conflict' );

		$conflict_data = filter_input( INPUT_POST, 'data', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );

		$this->dismissed_conflicts = $this->get_dismissed_conflicts( $conflict_data['section'] );

		$this->compare_plugins( $conflict_data['plugins'] );

		$this->save_dismissed_conflicts( $conflict_data['section'] );

		wp_die( 'true' );
	}

	/**
	 * Getting the user option from the database
	 *
	 * @return bool|array
	 */
	private function get_dismissed_option() {
		return get_user_meta( get_current_user_id(), $this->option_name, false );
	}

	/**
	 * Getting the dismissed conflicts from the database
	 *
	 * @param string $plugin_section
	 *
	 * @return array
	 */
	private function get_dismissed_conflicts( $plugin_section ) {
		$dismissed_conflicts = $this->get_dismissed_option();

		if ( is_array( $dismissed_conflicts ) &&  array_key_exists( $plugin_section, $dismissed_conflicts ) ) {
			return $dismissed_conflicts[ $plugin_section ];
		}

		return array();
	}

	/**
	 * Storing the conflicting plugins as an user option in the database
	 *
	 * @param string $plugin_section
	 */
	private function save_dismissed_conflicts( $plugin_section ) {
		$dismissed_conflicts = $this->get_dismissed_option();

		$dismissed_conflicts[ $plugin_section ] = $this->dismissed_conflicts;

		update_user_meta( get_current_user_id(), $this->option_name, $dismissed_conflicts );
	}

	/**
	 * Loop through the plugins to compare them with the already stored dismissed plugin conflicts
	 *
	 * @param array $posted_plugins
	 */
	public function compare_plugins( array $posted_plugins ) {
		foreach ( $posted_plugins as $posted_plugin ) {
			$this->compare_plugin( $posted_plugin );
		}
	}

	/**
	 * Check if plugin is already dismissed, if not store it in the array that will be saved later
	 *
	 * @param string $posted_plugin
	 */
	private function compare_plugin( $posted_plugin ) {
		if ( ! in_array( $posted_plugin, $this->dismissed_conflicts ) ) {
			$this->dismissed_conflicts[] = $posted_plugin;
		}
	}

}

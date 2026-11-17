<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Ajax
 */

/**
 * Class Yoast_Plugin_Conflict_Ajax.
 */
class Yoast_Plugin_Conflict_Ajax {

	/**
	 * Option identifier where dismissed conflicts are stored.
	 *
	 * @var string
	 */
	private $option_name = 'wpseo_dismissed_conflicts';

	/**
	 * List of notification identifiers that have been dismissed.
	 *
	 * @var string[]
	 */
	private $dismissed_conflicts = [];

	/**
	 * Initialize the hooks for the AJAX request.
	 */
	public function __construct() {
		add_action( 'wp_ajax_wpseo_dismiss_plugin_conflict', [ $this, 'dismiss_notice' ] );
	}

	/**
	 * Handles the dismiss notice request.
	 *
	 * @return void
	 */
	public function dismiss_notice() {
		check_ajax_referer( 'dismiss-plugin-conflict' );

		if ( ! isset( $_POST['data']['section'], $_POST['data']['plugins'] )
			|| ! is_string( $_POST['data']['section'] )
			|| ! is_array( $_POST['data']['plugins'] )
		) {
			wp_die( '[]' );
		}

		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- Reason: $conflict_data is getting sanitized later.
		$conflict_data = wp_unslash( $_POST['data'] );

		if ( count( array_filter( $conflict_data['plugins'], 'is_string' ) ) !== count( $conflict_data['plugins'] ) ) {
			wp_die( '[]' );
		}

		$conflict_data = [
			'section' => sanitize_text_field( $conflict_data['section'] ),
			'plugins' => array_map( 'sanitize_text_field', $conflict_data['plugins'] ),
		];

		$this->dismissed_conflicts = $this->get_dismissed_conflicts( $conflict_data['section'] );

		$this->compare_plugins( $conflict_data['plugins'] );

		$this->save_dismissed_conflicts( $conflict_data['section'] );

		wp_die( 'true' );
	}

	/**
	 * Getting the user option from the database.
	 *
	 * @return array<string, string[]>
	 */
	private function get_dismissed_option() {
		$dismissed_conflicts = get_user_meta( get_current_user_id(), $this->option_name, true );

		return is_array( $dismissed_conflicts ) ? $dismissed_conflicts : [];
	}

	/**
	 * Getting the dismissed conflicts from the database
	 *
	 * @param string $plugin_section Type of conflict group (such as Open Graph or sitemap).
	 *
	 * @return string[]
	 */
	private function get_dismissed_conflicts( $plugin_section ) {
		$dismissed_conflicts = $this->get_dismissed_option();

		if ( isset( $dismissed_conflicts[ $plugin_section ] ) && is_array( $dismissed_conflicts[ $plugin_section ] ) ) {
			return $dismissed_conflicts[ $plugin_section ];
		}

		return [];
	}

	/**
	 * Storing the conflicting plugins as an user option in the database.
	 *
	 * @param string $plugin_section Plugin conflict type (such as Open Graph or sitemap).
	 *
	 * @return void
	 */
	private function save_dismissed_conflicts( $plugin_section ) {
		$dismissed_conflicts = $this->get_dismissed_option();

		$dismissed_conflicts[ $plugin_section ] = $this->dismissed_conflicts;

		update_user_meta( get_current_user_id(), $this->option_name, $dismissed_conflicts );
	}

	/**
	 * Loop through the plugins to compare them with the already stored dismissed plugin conflicts.
	 *
	 * @param string[] $posted_plugins Plugin set to check.
	 *
	 * @return void
	 */
	public function compare_plugins( array $posted_plugins ) {
		foreach ( $posted_plugins as $posted_plugin ) {
			$this->compare_plugin( $posted_plugin );
		}
	}

	/**
	 * Check if plugin is already dismissed, if not store it in the array that will be saved later.
	 *
	 * @param string $posted_plugin Plugin to check against dismissed conflicts.
	 *
	 * @return void
	 */
	private function compare_plugin( $posted_plugin ) {
		if ( ! in_array( $posted_plugin, $this->dismissed_conflicts, true ) ) {
			$this->dismissed_conflicts[] = $posted_plugin;
		}
	}
}

<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * This class handles enqueuing the required JS files for the courses overview.
 */
class WPSEO_Courses_Overview implements WPSEO_WordPress_Integration {

	private $script_handle = '';
	public function __construct() {
		$this->script_handle = WPSEO_Admin_Asset_Manager::PREFIX . 'courses-overview';
	}

	/**
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		global $pagenow;
		$current_page = filter_input( INPUT_GET, 'page' );

		if ( $pagenow === 'admin.php' && $current_page === 'wpseo_courses' ) {
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		}
	}

	private function get_version() {
		if ( WPSEO_Utils::is_yoast_seo_premium() ) {
			return array( 'version' => 'premium' );
		} else {
			return array( 'version' => 'free' );
		}
	}

	/**
	 * Enqueue the relevant script.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		wp_enqueue_script( $this->script_handle );
		wp_localize_script( $this->script_handle, 'wpseoCoursesOverviewL10n', $this->get_version() );
	}
}

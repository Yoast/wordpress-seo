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

	/**
	 * Returns the Yoast SEO version the user currently is using.
	 *
	 * @return string The version: Free or Premium.
	 */
	private function get_version() {
		if ( WPSEO_Utils::is_yoast_seo_premium() ) {
			return 'premium';
		}

		return 'free';
	}

	/**
	 * Enqueue the relevant script.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		wp_enqueue_script( WPSEO_Admin_Asset_Manager::PREFIX . 'courses-overview' );

		$localizations = array(
			'version' => $this->get_version(),
			'isRtl'   => is_rtl(),
		);
		wp_localize_script(
			WPSEO_Admin_Asset_Manager::PREFIX . 'courses-overview',
			'wpseoCoursesOverviewL10n',
			$localizations
		);
	}
}

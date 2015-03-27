<?php
/**
 * @package    WPSEO\Internal
 */

/**
 * This code handles the option upgrades
 */
class WPSEO_Upgrade {

	private $options = array();
	
	public function __construct() {
		$this->options = WPSEO_Options::get_all();
		
		WPSEO_Options::maybe_set_multisite_defaults( false );

		if ( version_compare( $this->options['version'], '1.5.0', '<' ) ) {
			$this->upgrade_15( $this->options['version'] );
		}

		if ( version_compare( $this->options['version'], '2.0', '<' ) ) {
			$this->upgrade_20();
		}

		$this->clean_up();
	}

	/**
	 * Run the WP SEO 1.5 upgrade routine
	 *
	 * @param string $version
	 */
	private function upgrade_15( $version ) {
		// Clean up options and meta
		WPSEO_Options::clean_up( null, $version );
		WPSEO_Meta::clean_up();

		// Add new capabilities on upgrade
		wpseo_add_capabilities();
	}

	/**
	 * Moves options that moved position in WPSEO 2.0
	 */
	private function upgrade_20() {
		/*  Clean up stray wpseo_ms options from the options table, option should only exist in the sitemeta table
			This could have been caused in many version of WP SEO, so deleting it for everything below 2.0 */
		delete_option( 'wpseo_ms' );

		$this->move_hide_links_options();
		$this->move_pinterest_option();
	}

	/**
	 * Moves the hide- links options from the permalinks option to the titles option
	 */
	private function move_hide_links_options() {
		$options_titles     = get_option( 'wpseo_titles' );
		$options_permalinks = get_option( 'wpseo_permalinks' );

		foreach ( array( 'hide-feedlinks', 'hide-rsdlink', 'hide-shortlink', 'hide-wlwmanifest' ) as $hide ) {
			if ( isset( $options_titles[ $hide ] ) ) {
				$options_permalinks[ $hide ] = $options_titles[ $hide ];
				unset( $options_titles[ $hide ] );
				update_option( 'wpseo_permalinks', $options_permalinks );
				update_option( 'wpseo_titles', $options_titles );
			}
		}
	}

	/**
	 * Move the pinterest verification option from the wpseo option to the wpseo_social option
	 */
	private function move_pinterest_option() {
		$options_social = get_option( 'wpseo_social' );

		if ( isset( $option_wpseo['pinterestverify'] ) ) {
			$options_social['pinterestverify'] = $option_wpseo['pinterestverify'];
			unset( $option_wpseo['pinterestverify'] );
			update_option( 'wpseo_social', $options_social );
			update_option( 'wpseo', $option_wpseo );
		}
	}

	/**
	 * Runs the needed cleanup
	 */
	private function clean_up() {
		// Make sure version nr gets updated for any version without specific upgrades
		$this->options = get_option( 'wpseo' ); // re-get to make sure we have the latest version
		update_option( 'wpseo', $this->options );
		add_action( 'admin_footer', array( $this, 'redirect_to_about' ) );

		// Just flush rewrites, always, to at least make them work after an upgrade.
		add_action( 'shutdown', 'flush_rewrite_rules' );
		WPSEO_Utils::clear_sitemap_cache();

		// Make sure all our options always exist - issue #1245
		WPSEO_Options::ensure_options_exist();
	}

	/**
	 * Run some functions that run when we first run or when we upgrade WP SEO from < 1.4.13
	 */
	private function init() {
		if ( $this->options['version'] === '' || version_compare( $this->options['version'], '1.4.13', '<' ) ) {
			/* Make sure title_test and description_test functions are available */
			require_once( WPSEO_PATH . 'inc/wpseo-non-ajax-functions.php' );

			// Run description test once theme has loaded
			add_action( 'init', 'wpseo_description_test' );
		}
	}

	/**
	 * Redirect to the about page
	 */
	private function redirect_to_about() {
		echo '<script>window.location ="', admin_url( 'admin.php?page=wpseo_dashboard&intro=1' ), '";</script>';
	}
}
<?php
/**
 * @package WPSEO\Admin\Import\External
 */

/**
 * Class with functionality to import Yoast SEO settings from All In One SEO.
 */
class WPSEO_Import_AIOSEO implements WPSEO_External_Importer {
	/**
	 * Holds the AOIOSEO options
	 *
	 * @var array
	 */
	private $aioseo_options;

	/**
	 * @var wpdb Holds the WPDB instance.
	 */
	protected $db;

	/**
	 * Holds the import status object.
	 *
	 * @var WPSEO_Import_Status
	 */
	private $status;

	/**
	 * WPSEO_Import_AIOSEO constructor.
	 */
	public function __construct() {
		global $wpdb;

		$this->db = $wpdb;
	}
	
	/**
	 * Returns the plugin name.
	 *
	 * @return string
	 */
	public function plugin_name() {
		return 'All In One SEO Pack';
	}

	/**
	 * Imports the All in one SEO Pack settings.
	 * 
	 * @return WPSEO_Import_Status
	 */
	public function import() {
		$this->status = new WPSEO_Import_Status( 'import', false );

		$affected_rows = $this->db->query( "SELECT COUNT(*) FROM $this->db->postmeta WHERE meta_key LIKE '_aioseop_%'" );
		if ( $affected_rows === 0 ) {
			return $this->status;
		}

		$this->status->set_status( true );

		$this->aioseo_options = get_option( 'aioseop_options' );

		$this->success = true;
		$this->import_metas();
		$this->import_ga();

		return $this->status;
	}

	/**
	 * Removes the All in one SEO pack data from the database.
	 *
	 * @return WPSEO_Import_Status
	 */
	public function cleanup() {
		$this->status = new WPSEO_Import_Status( 'cleanup', false );
		$affected_rows = $this->db->query( "DELETE FROM $this->db->postmeta WHERE meta_key LIKE '_aioseop_%'" );
		if ( $affected_rows > 0 ) {
			$this->status->set_status( true );
		}

		return $this->status;
	}

	/**
	 * Import All In One SEO meta values.
	 */
	private function import_metas() {
		WPSEO_Meta::replace_meta( '_aioseop_description', WPSEO_Meta::$meta_prefix . 'metadesc', false );
		WPSEO_Meta::replace_meta( '_aioseop_keywords', WPSEO_Meta::$meta_prefix . 'metakeywords', false );
		WPSEO_Meta::replace_meta( '_aioseop_title', WPSEO_Meta::$meta_prefix . 'title', false );
	}

	/**
	 * Import the Google Analytics settings.
	 *
	 * These values are used in Google Analytics for WordPress by MonsterInsights and will be converted in the plugin
	 * to usable settings when a user installs the Google Analytics plugin for the first time.
	 */
	private function import_ga() {
		if ( ! isset( $this->aioseo_options['aiosp_google_analytics_id'] ) ) {
			return;
		}

		if ( get_option( 'yst_ga' ) === false ) {
			update_option( 'yst_ga', $this->determine_ga_settings() );
		}

		$plugin_install_nonce = wp_create_nonce( 'install-plugin_google-analytics-for-wordpress' ); // Use the old name because that's the WordPress.org repo.

		$this->status->set_msg( sprintf(
			/* translators: 1,2: link open tag; 3: link close tag. */
			$this->status->get_msg() . __( 'Would you like to %1$sdisable the All in One SEO plugin%3$s? You\'ve had Google Analytics enabled in All in One SEO, would you like to install the %2$sGoogle Analytics plugin%3$s?', 'wordpress-seo' ),
			'<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_tools&tool=import-export&deactivate_aioseo=1#top#import-seo' ) ) . '">',
			'<a href="' . esc_url( admin_url( 'update.php?action=install-plugin&plugin=google-analytics-for-wordpress&_wpnonce=' . $plugin_install_nonce ) ) . '">',
			'</a>'
		) );
	}

	/**
	 * Determine the appropriate GA settings for this site.
	 *
	 * @return array $ga_settings The imported settings.
	 */
	private function determine_ga_settings() {
		$ga_universal = 0;
		if ( $this->aioseo_options['aiosp_ga_use_universal_analytics'] === 'on' ) {
			$ga_universal = 1;
		}

		$ga_track_outbound = 0;
		if ( $this->aioseo_options['aiosp_ga_track_outbound_links'] === 'on' ) {
			$ga_track_outbound = 1;
		}

		$ga_anonymize_ip = 0;
		if ( $this->aioseo_options['aiosp_ga_anonymize_ip'] === 'on' ) {
			$ga_anonymize_ip = 1;
		}

		return array(
			'ga_general' => array(
				'manual_ua_code'       => (int) 1,
				'manual_ua_code_field' => $this->aioseo_options['aiosp_google_analytics_id'],
				'enable_universal'     => $ga_universal,
				'track_outbound'       => $ga_track_outbound,
				'ignore_users'         => (array) $this->aioseo_options['aiosp_ga_exclude_users'],
				'anonymize_ips'        => (int) $ga_anonymize_ip,
			),
		);
	}
}

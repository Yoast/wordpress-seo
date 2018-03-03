<?php
/**
 * @package WPSEO\Admin\Import\External
 */

/**
 * Class WPSEO_Import_WooThemes_SEO
 *
 * Class with functionality to import Yoast SEO settings from WooThemes SEO
 */
class WPSEO_Import_WooThemes_SEO implements WPSEO_External_Importer {
	/**
	 * @var wpdb Holds the WPDB instance.
	 */
	protected $wpdb;

	/**
	 * Holds the import status object.
	 *
	 * @var WPSEO_Import_Status
	 */
	private $status;

	/**
	 * WPSEO_Import_WooThemes_SEO constructor.
	 */
	public function __construct() {
		global $wpdb;
		$this->wpdb = $wpdb;
	}

	/**
	 * Detect whether there is post meta data to import.
	 *
	 * @return WPSEO_Import_Status
	 */
	public function detect() {
		$this->status = new WPSEO_Import_Status( 'detect', false );
		if ( ! $this->detect_helper() ) {
			return $this->status;
		}
		return $this->status->set_status( true );
	}

	/**
	 * Returns the plugin name.
	 *
	 * @return string
	 */
	public function plugin_name() {
		return 'WooThemes SEO';
	}

	/**
	 * Import WooThemes SEO settings.
	 *
	 * @return WPSEO_Import_Status
	 */
	public function import() {
		$this->status = new WPSEO_Import_Status( 'import', false );
		if ( ! $this->detect_helper() ) {
			return $this->status;
		}

		$this->import_custom_values( 'seo_woo_meta_home_desc', 'metadesc-home-wpseo' );
		$this->import_metas();

		return $this->status->set_status( true );
	}

	/**
	 * Cleans up the WooThemes SEO settings.
	 *
	 * @return WPSEO_Import_Status
	 */
	public function cleanup() {
		$this->status = new WPSEO_Import_Status( 'cleanup', false );
		if ( ! $this->detect_helper() ) {
			return $this->status;
		}

		$this->cleanup_options();
		$this->cleanup_meta();

		return $this->status->set_status( true );
	}

	/**
	 * Detect whether there is post meta data to import.
	 *
	 * @return bool
	 */
	private function detect_helper() {
		$count = $this->wpdb->get_var( "SELECT COUNT(*) FROM {$this->wpdb->postmeta} WHERE meta_key = 'seo_title'" );
		if ( $count === '0' ) {
			return false;
		}
		return true;
	}

	/**
	 * Removes the Woo Options from the database.
	 */
	private function cleanup_options() {
		foreach (
			array(
				'seo_woo_archive_layout',
				'seo_woo_single_layout',
				'seo_woo_page_layout',
				'seo_woo_wp_title',
				'seo_woo_meta_single_desc',
				'seo_woo_meta_single_key',
				'seo_woo_home_layout',
			) as $option
		) {
			delete_option( $option );
		}
	}

	/**
	 * Removes the post meta fields from the database.
	 */
	private function cleanup_meta() {
		foreach ( array( 'seo_follow', 'seo_noindex', 'seo_title', 'seo_description', 'seo_keywords' ) as $key ) {
			$this->cleanup_meta_key( $key );
		}
	}

	/**
	 * Removes a single meta field from the postmeta table in the database.
	 *
	 * @param string $key The meta_key to delete.
	 */
	private function cleanup_meta_key( $key ) {
		$this->wpdb->query( $this->wpdb->prepare( "DELETE FROM {$this->wpdb->postmeta} WHERE meta_key = %s", $key ) );
	}

	/**
	 * Import custom descriptions and meta keys
	 *
	 * @param string $option Option key.
	 * @param string $key    Internal key to import over.
	 */
	private function import_custom_values( $option, $key ) {
		// Import the custom homepage description.
		if ( 'c' === get_option( $option ) ) {
			WPSEO_Options::set( $key, get_option( $option . '_custom' ) );
		}
	}

	/**
	 * Import meta values if they're applicable
	 */
	private function import_metas() {
		WPSEO_Meta::replace_meta( 'seo_follow', WPSEO_Meta::$meta_prefix . 'meta-robots-nofollow', false );
		WPSEO_Meta::replace_meta( 'seo_noindex', WPSEO_Meta::$meta_prefix . 'meta-robots-noindex', false );

		// If WooSEO is set to use the Woo titles, import those.
		if ( 'true' == get_option( 'seo_woo_wp_title' ) ) {
			WPSEO_Meta::replace_meta( 'seo_title', WPSEO_Meta::$meta_prefix . 'title', false );
		}

		// If WooSEO is set to use the Woo meta descriptions, import those.
		if ( 'b' === get_option( 'seo_woo_meta_single_desc' ) ) {
			WPSEO_Meta::replace_meta( 'seo_description', WPSEO_Meta::$meta_prefix . 'metadesc', false );
		}

		// If WooSEO is set to use the Woo meta keywords, import those.
		if ( 'b' === get_option( 'seo_woo_meta_single_key' ) ) {
			WPSEO_Meta::replace_meta( 'seo_keywords', WPSEO_Meta::$meta_prefix . 'metakeywords', false );
		}
	}
}

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
	protected $db;

	/**
	 * Holds the import status object.
	 *
	 * @var WPSEO_Import_Status
	 */
	private $status;

	/**
	 * Holds the Yoast SEO Title options.
	 *
	 * @var array
	 */
	private $options;

	/**
	 * WPSEO_Import_WooThemes_SEO constructor.
	 */
	public function __construct() {
		global $wpdb;

		$this->db = $wpdb;
	}

	/**
	 * Detect whether there is post meta data to import.
	 *
	 * @return bool True when there is data, false when there's no data.
	 */
	public function detect() {
		$affected_rows = $this->db->query( $this->db->prepare( "SELECT  FROM $this->db->postmeta WHERE meta_key = %s", 'seo_title' ) );
		if ( $affected_rows === 0 ) {
			return false;
		}

		return true;
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

		WPSEO_Options::initialize();
		$this->options = WPSEO_Options::get_all();

		$this->import_home();
		$this->import_option( 'seo_woo_single_layout', 'post' );
		$this->import_option( 'seo_woo_page_layout', 'page' );
		$this->import_archive_option();
		$this->import_custom_values( 'seo_woo_meta_home_desc', 'metadesc-home-wpseo' );
		$this->import_custom_values( 'seo_woo_meta_home_key', 'metakey-home-wpseo' );
		$this->import_metas();

		update_option( 'wpseo_titles', $this->options );

		return $this->status;
	}

	/**
	 * Cleans up the WooThemes SEO settings.
	 *
	 * @return WPSEO_Import_Status
	 */
	public function cleanup() {
		$this->status = new WPSEO_Import_Status( 'cleanup', false );

		$this->cleanup_options();
		$this->cleanup_meta();
		return $this->status;
	}

	/**
	 * Removes the Woo Options from the database.
	 */
	private function cleanup_options() {
		foreach ( array( 'seo_woo_archive_layout', 'seo_woo_single_layout', 'seo_woo_page_layout', 'seo_woo_wp_title', 'seo_woo_meta_single_desc', 'seo_woo_meta_single_key', 'seo_woo_home_layout' ) as $option ) {
			$success = delete_option( $option );
			if ( $success ) {
				$this->status->set_status( true );
			}
		}
	}

	/**
	 * Removes the post meta fields from the database.
	 */
	private function cleanup_meta() {
		foreach( array( 'seo_follow', 'seo_noindex', 'seo_title', 'seo_description', 'seo_keywords' ) as $key ) {
			$this->cleanup_meta_key( $key );
		}
	}

	/**
	 * Removes a single meta field from the postmeta table in the database.
	 *
	 * @param string $key The meta_key to delete.
	 */
	private function cleanup_meta_key( $key ) {
		$affected_rows = $this->db->query( $this->db->prepare( "DELETE FROM $this->db->postmeta WHERE meta_key = %s", $key ) );
		if ( $affected_rows > 0 ) {
			$this->status->set_status( true );
		}
	}

	/**
	 * Import options.
	 *
	 * @param string $option    Option key.
	 * @param string $post_type Post type name to import for.
	 */
	private function import_option( $option, $post_type ) {
		switch ( get_option( $option ) ) {
			case 'a':
				$this->options[ 'title-' . $post_type ] = '%%title%% %%sep%% %%sitename%%';
				break;
			case 'b':
				$this->options[ 'title-' . $post_type ] = '%%title%%';
				break;
			case 'c':
				$this->options[ 'title-' . $post_type ] = '%%sitename%% %%sep%% %%title%%';
				break;
			case 'd':
				$this->options[ 'title-' . $post_type ] = '%%title%% %%sep%% %%sitedesc%%';
				break;
			case 'e':
				$this->options[ 'title-' . $post_type ] = '%%sitename%% %%sep%% %%title%% %%sep%% %%sitedesc%%';
				break;
		}
	}

	/**
	 * Import the archive layout for all taxonomies
	 */
	private function import_archive_option() {
		$taxonomies = get_taxonomies( array( 'public' => true ), 'names' );
		if ( is_array( $taxonomies ) && $taxonomies !== array() ) {
			foreach ( $taxonomies as $tax ) {
				$this->import_option( 'seo_woo_archive_layout', 'tax-' . $tax );
			}
		}
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
			$this->options[ $key ] = get_option( $option . '_custom' );
		}
	}

	/**
	 * Imports the WooThemes SEO homepage settings
	 */
	private function import_home() {
		switch ( get_option( 'seo_woo_home_layout' ) ) {
			case 'a':
				$this->options['title-home-wpseo'] = '%%sitename%% %%sep%% %%sitedesc%%';
				break;
			case 'b':
				$this->options['title-home-wpseo'] = '%%sitename%% ' . get_option( 'seo_woo_paged_var' ) . ' %%pagenum%%';
				break;
			case 'c':
				$this->options['title-home-wpseo'] = '%%sitedesc%%';
				break;
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

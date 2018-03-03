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
	protected $wpdb;

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

		$this->wpdb = $wpdb;

		$this->status = new WPSEO_Import_Status( 'detect', false );
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
	 * Detect whether there is post meta data to import.
	 *
	 * @return WPSEO_Import_Status
	 */
	public function detect() {
		$count = $this->wpdb->get_var( "SELECT COUNT(*) FROM {$this->wpdb->postmeta} WHERE meta_key LIKE '\_aioseop\_%'" );
		if ( $count === '0' ) {
			return $this->status;
		}

		return $this->status->set_status( true );
	}

	/**
	 * Imports the All in one SEO Pack settings.
	 * 
	 * @return WPSEO_Import_Status
	 */
	public function import() {
		$this->status->set_action( 'import' );

		if ( ! $this->detect() ) {
			return $this->status;
		}

		$this->aioseo_options = get_option( 'aioseop_options' );

		$this->import_metas();

		return $this->status->set_status( true );
	}

	/**
	 * Removes the All in one SEO pack data from the database.
	 *
	 * @return WPSEO_Import_Status
	 */
	public function cleanup() {
		$this->status->set_action( 'cleanup' );
		$affected_rows = $this->wpdb->query( "DELETE FROM {$this->wpdb->postmeta} WHERE meta_key LIKE '_aioseop_%'" );
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
}

<?php
/**
 * @package WPSEO\Admin\Import\External
 */

/**
 * Class with functionality to import Yoast SEO settings from All In One SEO.
 */
class WPSEO_Import_AIOSEO implements WPSEO_External_Importer {
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
	 * Return whether there is post meta data to import.
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
	 * Imports the All in one SEO Pack settings.
	 *
	 * @return WPSEO_Import_Status
	 */
	public function import() {
		$this->status = new WPSEO_Import_Status( 'import', false );

		if ( ! $this->detect_helper() ) {
			return $this->status;
		}

		$this->import_metas();

		return $this->status->set_status( true );
	}

	/**
	 * Removes the All in one SEO pack data from the database.
	 *
	 * @return WPSEO_Import_Status
	 */
	public function cleanup() {
		$this->status = new WPSEO_Import_Status( 'cleanup', false );
		if ( ! $this->detect_helper() ) {
			return $this->status;
		}

		$this->wpdb->query( "DELETE FROM {$this->wpdb->postmeta} WHERE meta_key LIKE '_aioseop_%'" );
		return $this->status->set_status( true );
	}

	/**
	 * Detect whether there is post meta data to import.
	 *
	 * @return bool
	 */
	private function detect_helper() {
		$result = $this->wpdb->get_var( "SELECT COUNT(*) AS `count` FROM {$this->wpdb->postmeta} WHERE meta_key LIKE '_aioseop_%'" );
		if ( $result === '0' ) {
			return false;
		}

		return true;
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

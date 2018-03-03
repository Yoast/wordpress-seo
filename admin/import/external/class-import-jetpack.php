<?php
/**
 * @package WPSEO\Admin\Import\External
 */

/**
 * Class WPSEO_Import_Jetpack_SEO
 *
 * Class with functionality to import Yoast SEO settings from Jetpack Advanced SEO
 */
class WPSEO_Import_Jetpack_SEO implements WPSEO_External_Importer {
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
	 * WPSEO_Import_Jetpack_SEO constructor.
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
		return 'Jetpack';
	}

	/**
	 * Detect whether there is post meta data to import.
	 *
	 * @return WPSEO_Import_Status
	 */
	public function detect() {
		$count = $this->wpdb->get_var( "SELECT COUNT(*) FROM {$this->wpdb->postmeta} WHERE meta_key = 'advanced\_seo\_description'" );
		if ( $count === '0' ) {
			return $this->status;
		}

		return $this->status->set_status( true );
	}

	/**
	 * Removes the Jetpack SEO data from the database.
	 *
	 * @return WPSEO_Import_Status
	 */
	public function cleanup() {
		$this->status->set_action( 'cleanup' );
		$affected_rows = $this->wpdb->query( "DELETE FROM {$this->wpdb->postmeta} WHERE meta_key = 'advanced_seo_description'" );
		if ( $affected_rows > 0 ) {
			return $this->status;
		}

		return $this->status->set_status( true );
	}

	/**
	 * Import Jetpack SEO meta values
	 *
	 * @return WPSEO_Import_Status
	 */
	public function import() {
		$this->status->set_action( 'import' );

		if ( ! $this->detect() ) {
			return $this->status;
		}

		WPSEO_Meta::replace_meta( 'advanced_seo_description', WPSEO_Meta::$meta_prefix . 'metadesc', false );
		return $this->status->set_status( true );
	}
}

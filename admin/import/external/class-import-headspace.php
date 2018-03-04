<?php
/**
 * @package WPSEO\Admin\Import\External
 */

/**
 * Class WPSEO_Import_HeadSpace
 *
 * Class with functionality to import Yoast SEO settings from other plugins
 */
class WPSEO_Import_HeadSpace implements WPSEO_External_Importer {
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
	 * WPSEO_Import_HeadSpace constructor.
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
		return 'HeadSpace SEO';
	}

	/**
	 * Detect whether there is post meta data to import.
	 *
	 * @return WPSEO_Import_Status
	 */
	public function detect() {
		$this->status = new WPSEO_Import_Status( 'detect', false );

		if ( ! $this->detect_helper() ) {
			return $this->status->set_status( false );
		}

		return $this->status->set_status( true );
	}

	/**
	 * Import HeadSpace SEO settings.
	 *
	 * @return WPSEO_Import_Status
	 */
	public function import() {
		$this->status = new WPSEO_Import_Status( 'import', false );

		if ( ! $this->detect_helper() ) {
			return $this->status->set_status( false );
		}

		$this->replace_metas();

		return $this->status->set_status( true );
	}

	/**
	 * Removes the HeadSpace data from the database.
	 *
	 * @return WPSEO_Import_Status
	 */
	public function cleanup() {
		$this->status = new WPSEO_Import_Status( 'cleanup', false );
		$affected_rows = $this->wpdb->query( "DELETE FROM {$this->wpdb->postmeta} WHERE meta_key LIKE '\_headspace\_%'" );
		if ( $affected_rows > 0 ) {
			return $this->status->set_status( true );
		}

		return $this->status;
	}

	/**
	 * Detect whether there is post meta data to import.
	 *
	 * @return bool
	 */
	private function detect_helper() {
		$result = $this->wpdb->get_var( "SELECT COUNT(*) AS `count` FROM {$this->wpdb->postmeta} WHERE meta_key LIKE '_headspace_%'" );
		if ( $result === '0' ) {
			return false;
		}

		return true;
	}

	/**
	 * Imports the simple meta fields
	 */
	private function replace_metas() {
		WPSEO_Meta::replace_meta( '_headspace_description', WPSEO_Meta::$meta_prefix . 'metadesc', false );
		WPSEO_Meta::replace_meta( '_headspace_keywords', WPSEO_Meta::$meta_prefix . 'metakeywords', false );
		WPSEO_Meta::replace_meta( '_headspace_page_title', WPSEO_Meta::$meta_prefix . 'title', false );

		/**
		 * @todo [JRF => whomever] verify how headspace sets these metas ( 'noindex', 'nofollow', 'noarchive', 'noodp', 'noydir' )
		 * and if the values saved are concurrent with the ones we use (i.e. 0/1/2)
		 */
		WPSEO_Meta::replace_meta( '_headspace_noindex', WPSEO_Meta::$meta_prefix . 'meta-robots-noindex', false );
		WPSEO_Meta::replace_meta( '_headspace_nofollow', WPSEO_Meta::$meta_prefix . 'meta-robots-nofollow', false );
	}

}

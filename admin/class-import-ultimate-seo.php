<?php
/**
 * @package WPSEO\Admin\Import\External
 */

/**
 * Class with functionality to import Yoast SEO settings from Ultimate SEO.
 */
class WPSEO_Import_Ultimate_SEO extends WPSEO_Import_External {

	/**
	 * Constructs the import SEO Ultimate settings.
	 *
	 * @param boolean $replace Boolean replace switch.
	 */
	public function __construct( $replace = false ) {
		parent::__construct( $replace );

		$this->import_metas();
		$this->cleanup();

		$this->success = true;
		$this->set_msg( __( 'SEO Ultimate data successfully imported.', 'wordpress-seo' ) );

	}

	/**
	 * Imports the Ultimate SEO  meta values.
	 *
	 * @returns void
	 */
	private function import_metas() {
		WPSEO_Meta::replace_meta( '_su_description', WPSEO_Meta::$meta_prefix . 'metadesc', $this->replace );
		WPSEO_Meta::replace_meta( '_su_meta_robots_nofollow', WPSEO_Meta::$meta_prefix . 'meta-robots-nofollow', $this->replace );
		WPSEO_Meta::replace_meta( '_su_meta_robots_noindex', WPSEO_Meta::$meta_prefix . 'meta-robots-nofollow', $this->replace );
		WPSEO_Meta::replace_meta( '_su_og_title', WPSEO_Meta::$meta_prefix . 'opengraph-title', $this->replace );
		WPSEO_Meta::replace_meta( '_su_og_description', WPSEO_Meta::$meta_prefix . 'opengraph-description', $this->replace );
		WPSEO_Meta::replace_meta( '_su_og_image', WPSEO_Meta::$meta_prefix . 'opengraph-image', $this->replace );
		WPSEO_Meta::replace_meta( '_su_title', WPSEO_Meta::$meta_prefix . 'title', $this->replace );
	}

	/**
	 * Removes all leftover SEO ultimate data from the database.
	 *
	 * @return void
	 */
	private function cleanup() {
		if ( ! $this->replace ) {
			return;
		}
		global $wpdb;
		$wpdb->query( "DELETE FROM {$wpdb->prefix}postmeta WHERE meta_key LIKE '_su_%'" );
	}
}

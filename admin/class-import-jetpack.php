<?php
/**
 * @package WPSEO\Admin\Import\External
 */

/**
 * Class WPSEO_Import_Jetpack_SEO
 *
 * Class with functionality to import Yoast SEO settings from Jetpack Advanced SEO
 */
class WPSEO_Import_Jetpack_SEO extends WPSEO_Import_External {

	/**
	 * Import Jetpack Advanced SEO settings
	 *
	 * @param boolean $replace Boolean replace switch.
	 */
	public function __construct( $replace = false ) {
		parent::__construct( $replace );

		$this->success = true;
		$this->import_metas();
	}

	/**
	 * Import All In One SEO meta values
	 */
	private function import_metas() {
		WPSEO_Meta::replace_meta( 'advanced_seo_description', WPSEO_Meta::$meta_prefix . 'metadesc', $this->replace );
	}
}

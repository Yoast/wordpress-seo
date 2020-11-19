<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * This class parses all the values for the general tab in the Yoast SEO settings metabox.
 */
class WPSEO_Taxonomy_Settings_Fields {

	/**
	 * Returns array with the fields for the General tab.
	 *
	 * @deprecated 14.9
	 * @return array Fields to be used on the General tab.
	 */
	public function get() {
		_deprecated_function( __METHOD__, '14.9', 'WPSEO_Taxonomy_Fields::get' );

		$fields = new WPSEO_Taxonomy_Fields();
		return $fields->get( 'social' );
	}
}

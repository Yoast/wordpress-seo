<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * This class parses all the values for the social tab in the Yoast SEO settings metabox.
 */
class WPSEO_Taxonomy_Social_Fields {

	/**
	 * Returning the fields for the social media tab.
	 *
	 * @deprecated 14.9
	 * @return array
	 */
	public function get() {
		_deprecated_function( __METHOD__, '14.9', 'WPSEO_Taxonomy_Fields::get' );

		$fields = new WPSEO_Taxonomy_Fields();
		return $fields->get( 'social' );
	}
}

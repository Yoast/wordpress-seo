<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * This class parses all the values for the general tab in the Yoast SEO settings metabox.
 */
class WPSEO_Taxonomy_Settings_Fields extends WPSEO_Taxonomy_Fields {
	/**
	 * The WPSEO_Taxonomy_Settings_Fields class constructor.
	 *
	 * @param stdClass $term The current taxonomy.
	 */
	public function __construct( $term ) {
		parent::__construct( $term );
	}

	/**
	 * Returns array with the fields for the General tab.
	 *
	 * @return array Fields to be used on the General tab.
	 */
	public function get() {
		$fields = [
			'noindex'   => $this->get_field_config(
				'',
				'',
				'hidden',
				''
			),
			'bctitle'   => $this->get_field_config(
				'',
				'',
				'hidden',
				'',
				( WPSEO_Options::get( 'breadcrumbs-enable' ) !== true )
			),
			'canonical' => $this->get_field_config(
				'',
				'',
				'hidden'
			),
		];

		return $this->filter_hidden_fields( $fields );
	}
}

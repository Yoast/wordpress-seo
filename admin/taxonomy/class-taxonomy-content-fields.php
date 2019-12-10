<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * This class parses all the values for the general tab in the Yoast SEO settings metabox.
 */
class WPSEO_Taxonomy_Content_Fields extends WPSEO_Taxonomy_Fields {

	/**
	 * Returns array with the fields for the general tab.
	 *
	 * @return array
	 */
	public function get() {
		$fields = [
			'title' => $this->get_field_config(
				'',
				'',
				'hidden',
				''
			),
			'desc' => $this->get_field_config(
				'',
				'',
				'hidden',
				''
			),
			'linkdex' => $this->get_field_config(
				'',
				'',
				'hidden',
				''
			),
			'content_score' => $this->get_field_config(
				'',
				'',
				'hidden',
				''
			),
			'focuskw' => $this->get_field_config(
				'',
				'',
				'hidden',
				''
			),
		];
		/**
		 * Filter: 'wpseo_taxonomy_content_fields' - Adds the possibility to register additional content fields.
		 *
		 * @api array - The additional fields.
		 */
		$additional_fields = apply_filters( 'wpseo_taxonomy_content_fields', [] );

		return $this->filter_hidden_fields( array_merge( $fields, $additional_fields ) );
	}
}

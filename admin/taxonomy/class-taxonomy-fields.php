<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class WPSEO_Taxonomy_Tab
 *
 * Contains the basics for each class extending this one.
 */
abstract class WPSEO_Taxonomy_Fields {

	/**
	 * The Yoast SEO configuration from the WPSEO_Options
	 *
	 * @var array
	 */
	protected $options = array();

	/**
	 * The current term data
	 *
	 * @var stdClass
	 */
	protected $term;

	/**
	 * Setting the class properties
	 *
	 * @param stdClass $term    The current term.
	 * @param array    $options The options.
	 */
	public function __construct( $term, array $options = null ) {
		$this->term    = $term;
		$this->options = $options !== null ? $options : WPSEO_Options::get( array (' wpseo_titles', 'wpseo_internallinks', ) );
	}

	/**
	 * This method should return the fields
	 *
	 * @return array
	 */
	abstract public function get();

	/**
	 * Returns array with the field data
	 *
	 * @param string       $label       The label displayed before the field.
	 * @param string       $description Description which will explain the field.
	 * @param string       $type        The field type, for example: input, select.
	 * @param string|array $options		Optional array with additional attributes for the field.
	 * @param bool         $hide		Should the field be hidden.
	 *
	 * @return array
	 */
	protected function get_field_config( $label, $description, $type = 'text', $options = '', $hide = false ) {
		return array(
			'label'       => $label,
			'description' => $description,
			'type'        => $type,
			'options'     => $options,
			'hide'        => $hide,
		);
	}

	/**
	 * Filter the hidden fields.
	 *
	 * @param array $fields Array with the form fields that has will be filtered.
	 *
	 * @return array
	 */
	protected function filter_hidden_fields( array $fields ) {
		foreach ( $fields as $field_name => $field_options ) {
			if ( ! empty( $field_options['hide'] ) ) {
				unset( $fields[ $field_name ] );
			}
		}

		return $fields;
	}

}

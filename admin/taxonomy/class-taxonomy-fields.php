<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Class WPSEO_Taxonomy_Tab.
 *
 * Contains the basics for each class extending this one.
 */
abstract class WPSEO_Taxonomy_Fields {

	/**
	 * The current term data.
	 *
	 * @var stdClass
	 */
	protected $term;

	/**
	 * Setting the class properties.
	 *
	 * @param stdClass $term The current term.
	 */
	public function __construct( $term ) {
		$this->term = $term;
	}

	/**
	 * This method should return the fields.
	 *
	 * @return array
	 */
	abstract public function get();

	/**
	 * Returns array with the field data.
	 *
	 * @param string       $label       The label displayed before the field.
	 * @param string       $description Description which will explain the field.
	 * @param string       $type        The field type, for example: input, select.
	 * @param string|array $options     Optional. Array with additional options.
	 * @param bool         $hide        Should the field be hidden.
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

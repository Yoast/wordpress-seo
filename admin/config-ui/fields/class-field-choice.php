<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Choice.
 */
class WPSEO_Config_Field_Choice extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Choice constructor.
	 *
	 * @param string $field Field name to use.
	 */
	public function __construct( $field ) {
		parent::__construct( $field, 'Choice' );

		$this->properties['choices'] = [];
	}

	/**
	 * Add a choice to the properties.
	 *
	 * @param string $value      Value op the option.
	 * @param string $label      Label to display for the value.
	 * @param string $aria_label Optional. Aria label text to use.
	 */
	public function add_choice( $value, $label, $aria_label = '' ) {
		$choice = [
			'label' => $label,
		];

		if ( $aria_label ) {
			$choice['screenReaderText'] = $aria_label;
		}

		$this->properties['choices'][ $value ] = $choice;
	}
}

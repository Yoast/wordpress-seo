<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

class WPSEO_Config_Field_Choice extends WPSEO_Config_Field {

	public function __construct( $field ) {
		parent::__construct( $field, 'Choice' );

		$this->properties['choices'] = array();
	}

	public function add_choice( $value, $label, $screen_reader_text = '' ) {
		$choice = array(
			'label' => $label
		);

		if ( $screen_reader_text ) {
			$choice['screenReaderText'] = $screen_reader_text;
		}

		$this->properties['choices'][ $value ] = $choice;
	}
}

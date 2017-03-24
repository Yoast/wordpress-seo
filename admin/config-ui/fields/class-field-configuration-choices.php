<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Choice
 */
class WPSEO_Config_Field_Configuration_Choices extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Choice constructor.
	 */
	public function __construct() {
		parent::__construct( 'configurationChoices', 'ConfigurationChoices' );

		$this->properties['choices'] = array();
	}

	/**
	 * Add a choice to the properties
	 *
	 * @param string $action
	 * @param string $title
	 * @param string $copy
	 * @param string $button_type
	 * @param string $button_text
	 */
	public function add_choice( $title, $copy, $button ) {
		$choice = array(
			'title' => $title,
			'copy' => $copy,
			'button' => $button,
		);

		$this->properties['choices'][] = $choice;
	}
}

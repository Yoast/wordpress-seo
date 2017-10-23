<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Holds the choices for the Configuration method to be chosen in the first step of the wizard
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
	 * Adds a choice to the properties
	 *
	 * @param string      $title  The title of the choice.
	 * @param string      $copy   The text explaining the choice.
	 * @param array       $button The button details.
	 * @param null|string $image  The image accompanying the choice.
	 */
	public function add_choice( $title, $copy, $button, $image = null ) {
		$choice = array(
			'title'  => $title,
			'copy'   => $copy,
			'button' => $button,
		);

		if ( ! empty( $image ) ) {
			$choice['image'] = $image;
		}

		$this->properties['choices'][] = $choice;
	}
}

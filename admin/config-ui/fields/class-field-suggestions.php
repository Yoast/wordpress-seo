<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Suggestions
 */
class WPSEO_Config_Field_Suggestions extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Choice constructor.
	 */
	public function __construct() {
		parent::__construct( 'suggestions', 'Suggestions' );

		$this->properties['suggestions'] = array();
	}

	/**
	 * Adds a suggestion to the properties
	 *
	 * @param string      $title  The title of the choice.
	 * @param string      $copy   The text explaining the choice.
	 * @param array       $button The button details.
	 * @param null|string $video  The video accompanying the choice.
	 */
	public function add_suggestion( $title, $copy, $button, $video = null ) {
		$suggestion = array(
			'title'  => $title,
			'copy'   => $copy,
			'button' => $button,
		);

		if ( ! empty( $video ) ) {
			$suggestion['video'] = $video;
		}

		$this->properties['suggestions'][] = $suggestion;
	}
}


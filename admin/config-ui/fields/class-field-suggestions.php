<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Holds the suggestions for the 'You might also like' page in the wizard.
 */
class WPSEO_Config_Field_Suggestions extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Suggestions constructor.
	 */
	public function __construct() {
		parent::__construct( 'suggestions', 'Suggestions' );

		$this->properties['suggestions'] = [];
	}

	/**
	 * Adds a suggestion to the properties.
	 *
	 * @param string $title  The title of the choice.
	 * @param string $copy   The text explaining the choice.
	 * @param array  $button The button details.
	 * @param array  $video  URL and title of the video accompanying the choice.
	 */
	public function add_suggestion( $title, $copy, $button, array $video = [] ) {
		$suggestion = [
			'title'  => $title,
			'copy'   => $copy,
			'button' => $button,
		];

		if ( ! empty( $video ) ) {
			$suggestion['video'] = $video;
		}

		$this->properties['suggestions'][] = $suggestion;
	}
}

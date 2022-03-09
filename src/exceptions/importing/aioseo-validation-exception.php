<?php

namespace Yoast\WP\SEO\Exceptions\Importing;

use Exception;

/**
 * Class Aioseo_Validation_Exception
 */
class Aioseo_Validation_Exception extends Exception {

	/**
	 * Aioseo_Validation_Exception constructor.
	 */
	public function __construct() {
		parent::__construct( $this->get_validation_failure_text() );
	}

	/**
	 * Gets the validation failure text.
	 *
	 * @return string The validation failure text.
	 */
	protected function get_validation_failure_text() {
		$content = \esc_html__( 'The AIOSEO import was cancelled because some AIOSEO data is missing. Please try and take the following steps to fix this:', 'wordpress-seo' );

		$content .= '<br/>';
		$content .= '<ol><li>';
		$content .= \esc_html__( 'If you have never saved any AIOSEO \'Search Appearance\' settings, please do that first and run the import again.', 'wordpress-seo' );
		$content .= '</li>';
		$content .= '<li>';
		$content .= \esc_html__( 'If you already have saved AIOSEO \'Search Appearance\' settings and the issue persists, please contact our support team so we can take a closer look.', 'wordpress-seo' );
		$content .= '</li></ol>';

		return $content;
	}
}

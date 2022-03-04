<?php

namespace Yoast\WP\SEO\Validators;

/**
 * The Wp_Kses_Post_Validator class.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Wp_Kses_Post_Validator extends String_Validator {

	/**
	 * Calls WordPress `wp_kses_post`.
	 *
	 * @param mixed $value    The value to validate.
	 * @param array $settings The settings.
	 *
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception If the value is not a string.
	 *
	 * @return string A valid string.
	 */
	public function validate( $value, array $settings = null ) {
		$string = parent::validate( $value, $settings );

		return \wp_kses_post( $string );
	}
}

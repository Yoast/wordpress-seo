<?php

namespace Yoast\WP\SEO\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception;

/**
 * The news sitemap content type array validator class.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class News_Sitemap_Content_Type_Validator extends Array_Validator {

	/**
	 * Validates if the value is an array.
	 * Sets the passed content types to 'on'
	 *
	 * @param mixed $value    The value to validate.
	 * @param array $settings Optional settings.
	 *
	 * @throws Invalid_Type_Exception When the value is not an array.
	 *
	 * @return array Array with the content type keys set to value 'on'.
	 */
	public function validate( $value, array $settings = null ) {
		parent::validate( $value );

		$new_value = [];

		foreach ( $value as $name => $posted_value ) {
			if ( \is_string( $name ) ) {
				$new_value[ $name ] = 'on';
			}
		}

		return $new_value;
	}
}

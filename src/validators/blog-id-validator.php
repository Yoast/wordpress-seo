<?php

namespace Yoast\WP\SEO\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Invalid_Blog_ID_Exception;


/**
 * The blog ID validator class.
 */
class Blog_ID_Validator extends Integer_Validator {

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- Reason: The parent validate can throw too.

	/**
	 * Validates if a value is a valid blog ID.
	 *
	 * @param mixed $value    The value to validate.
	 * @param array $settings Optional settings.
	 *
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception When the value is not an integer.
	 * @throws Invalid_Blog_ID_Exception When the value is an invalid blog id.
	 *
	 * @return integer The blog ID.
	 */
	public function validate( $value, array $settings = null ) {
		$blog_id = parent::validate( $value );

		if ( $blog_id === 0 ) {
			throw new Invalid_Blog_ID_Exception( $blog_id );
		}

		$blog_details = \get_blog_details( $blog_id, false );

		if ( ! $blog_details || $blog_details->deleted === '1' ) {
			throw new Invalid_Blog_ID_Exception( $blog_id );
		}

		return $blog_id;
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber
}

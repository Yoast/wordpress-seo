<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Given it's a very specific case.
namespace Yoast\WP\SEO\Indexables\Domain\Exceptions;

use Exception;

/**
 * The No_Verification_Action_Left_Exception exception.
 */
class No_Verification_Action_Left_Exception extends Exception {

	/**
	 * Named constructor to create this exception for when there are no verification actions left.
	 *
	 * @return No_Verification_Action_Left_Exception The exception.
	 */
	public static function because_out_of_bounds(): self {
		return new self(
			'No verification actions left process is done.'
		);
	}

	/**
	 * Named constructor to create this exception for when there are no verification actions left.
	 *
	 * @param string $verification_action The not found verification action.
	 *
	 * @return No_Verification_Action_Left_Exception The exception.
	 */
	public static function because_unidentified_action_given( string $verification_action ): self {
		return new self(
			"The passed verification action $verification_action is not found"
		);
	}
}

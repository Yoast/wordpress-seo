<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Given it's a very specific case.
namespace Yoast\WP\SEO\Indexables\Domain\Actions;

use Yoast\WP\SEO\Indexables\Domain\Current_Verification_Action;
use Yoast\WP\SEO\Indexables\Domain\Exceptions\No_Verification_Action_Left_Exception;
use Yoast\WP\SEO\Indexables\Domain\Exceptions\Verify_Action_Not_Found_Exception;

/**
 * The Verify_Indexables_Action_Factory_Interface interface.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
interface Verify_Indexables_Action_Factory_Interface {

	/**
	 * Finds the correct verification action for the given domain object.
	 *
	 * @param Current_Verification_Action $verification_action The Verification action.
	 *
	 * @throws Verify_Action_Not_Found_Exception When the given verification action does not exists.
	 * @return Verify_Indexables_Action_Interface
	 */
	public function get( Current_Verification_Action $verification_action ): Verify_Indexables_Action_Interface;

	/**
	 * Determines the next verification action that needs to be taken.
	 *
	 * @param Current_Verification_Action $current_verification_action_object The current verification object to
	 *                                                                        determine the next one for.
	 *
	 * @throws No_Verification_Action_Left_Exception Throws when there are no verification actions left.
	 * @return Current_Verification_Action
	 */
	public function determine_next_verify_action( Current_Verification_Action $current_verification_action_object
	): Current_Verification_Action;
}

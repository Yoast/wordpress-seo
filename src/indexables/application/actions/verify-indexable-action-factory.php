<?php

namespace Yoast\WP\SEO\Indexables\Application\actions;

use Yoast\WP\SEO\Indexables\Domain\Actions\Verify_Indexable_Action_Factory_Interface;
use Yoast\WP\SEO\Indexables\Domain\Actions\Verify_Indexables_Action_Interface;
use Yoast\WP\SEO\Indexables\Domain\Current_Verification_Action;
use Yoast\WP\SEO\Indexables\Domain\Exceptions\No_Verification_Action_Left_Exception;
use Yoast\WP\SEO\Indexables\Domain\Exceptions\Verify_Action_Not_Found_Exception;
use Yoast\WP\SEO\Indexables\Infrastructure\Actions\Verify_Term_Indexables_Action;

class Verify_Indexable_Action_Factory implements Verify_Indexable_Action_Factory_Interface {

	private const VERIFICATION_MAPPING = [
		'terms',
		'general',
		'term_links',
		'post_links',
		'post-type-archives',
	];

	/**
	 * @throws Verify_Action_Not_Found_Exception
	 */
	public function get( Current_Verification_Action $verification_action ): Verify_Indexables_Action_Interface {
		switch ( $verification_action->get_action() ) {
			case 'terms':
				return new Verify_Term_Indexables_Action();
			case 'general':
				break;
			default:
				throw new Verify_Action_Not_Found_Exception();
		}
	}

	/**
	 * @param Current_Verification_Action $current_verification_action_object
	 *
	 * @throws No_Verification_Action_Left_Exception
	 * @return Current_Verification_Action
	 */
	public function determine_next_verify_action( Current_Verification_Action $current_verification_action_object
	): Current_Verification_Action {
		$current_verification_action = $current_verification_action_object->get_action();

		if ( \in_array( $current_verification_action, self::VERIFICATION_MAPPING ) ) {
			$key = array_search( $current_verification_action, self::VERIFICATION_MAPPING );
			if ( isset( self::VERIFICATION_MAPPING[ ++$key ] ) ) {
				return new Current_Verification_Action( self::VERIFICATION_MAPPING[ ++$key ] );
			}

			throw No_Verification_Action_Left_Exception::because_out_of_bounds();
		}

		throw No_Verification_Action_Left_Exception::because_unidentified_action_given( $current_verification_action );
	}
}

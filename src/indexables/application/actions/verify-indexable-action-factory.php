<?php

namespace Yoast\WP\SEO\Indexables\Application\actions;

use Yoast\WP\SEO\Indexables\Domain\Actions\Verify_Indexable_Action_Factory_Interface;
use Yoast\WP\SEO\Indexables\Domain\Actions\Verify_Indexables_Action_Interface;
use Yoast\WP\SEO\Indexables\Domain\Current_Verification_Action;
use Yoast\WP\SEO\Indexables\Domain\Exceptions\No_Verification_Action_Left_Exception;
use Yoast\WP\SEO\Indexables\Domain\Exceptions\Verify_Action_Not_Found_Exception;
use Yoast\WP\SEO\Indexables\Infrastructure\Actions\Verify_General_Indexables_Action;
use Yoast\WP\SEO\Indexables\Infrastructure\Actions\Verify_Post_Links_Indexables_Action;
use Yoast\WP\SEO\Indexables\Infrastructure\Actions\Verify_Post_Type_Archives_Indexables_Action;
use Yoast\WP\SEO\Indexables\Infrastructure\Actions\Verify_Term_Indexables_Action;
use Yoast\WP\SEO\Indexables\Infrastructure\Actions\Verify_Term_Links_Indexables_Action;

/**
 *
 */
class Verify_Indexable_Action_Factory implements Verify_Indexable_Action_Factory_Interface {

	/**
	 * The list of verification options.
	 */
	private const VERIFICATION_MAPPING = [
		'term',
		'general',
		'post-type-archives',
		'term_links',
		'post_links',
	];
	/**
	 * The Verify Term Indexable action instance.
	 *
	 * @var Verify_Term_Indexables_Action
	 */
	private $verify_term_indexables_action;

	/**
	 * The Verify General Indexables Action instance.
	 *
	 * @var Verify_General_Indexables_Action
	 */
	private $verify_general_indexables_action;

	/**
	 * The Verify Post Type Archives Indexables Action instance.
	 *
	 * @var Verify_Post_Type_Archives_Indexables_Action
	 */
	private $verify_post_type_archives_indexables_action;

	/**
	 * The Verify Term Links Indexables Action instance.
	 *
	 * @var Verify_Term_Links_Indexables_Action
	 */
	private $verify_term_links_indexables_action;


	/**
	 * @param Verify_Term_Indexables_Action               $verify_term_indexables_action The instance.
	 * @param Verify_General_Indexables_Action            $verify_general_indexables_action The instance.
	 * @param Verify_Post_Type_Archives_Indexables_Action $verify_post_type_archives_indexables_action The instance.
	 * @param Verify_Term_Links_Indexables_Action         $verify_term_links_indexables_action The instance.
	 */
	public function __construct(
		Verify_Term_Indexables_Action $verify_term_indexables_action,
		Verify_General_Indexables_Action $verify_general_indexables_action,
		Verify_Post_Type_Archives_Indexables_Action $verify_post_type_archives_indexables_action,
		Verify_Term_Links_Indexables_Action $verify_term_links_indexables_action
	) {
		$this->verify_term_indexables_action               = $verify_term_indexables_action;
		$this->verify_general_indexables_action            = $verify_general_indexables_action;
		$this->verify_post_type_archives_indexables_action = $verify_post_type_archives_indexables_action;
		$this->verify_term_links_indexables_action         = $verify_term_links_indexables_action;
	}

	/**
	 * Finds the correct verification action for the given domain object.
	 *
	 * @param Current_Verification_Action $verification_action The Verification action.
	 *
	 * @throws Verify_Action_Not_Found_Exception
	 * @return Verify_Indexables_Action_Interface
	 */
	public function get( Current_Verification_Action $verification_action ): Verify_Indexables_Action_Interface {
		switch ( $verification_action->get_action() ) {
			case 'term':
				return $this->verify_term_indexables_action;
			case 'general':
				return $this->verify_general_indexables_action;
			case'post-type-archives':
				return $this->verify_post_type_archives_indexables_action;
			case 'term-links':
				return $this->verify_term_links_indexables_action;
			default:
				throw new Verify_Action_Not_Found_Exception();
		}
	}

	/**
	 * Determines the next verification action that needs to be taken.
	 *
	 * @param Current_Verification_Action $current_verification_action_object The current verification object to determine the next one for.
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
				return new Current_Verification_Action( self::VERIFICATION_MAPPING[ $key ] );
			}

			throw No_Verification_Action_Left_Exception::because_out_of_bounds();
		}

		throw No_Verification_Action_Left_Exception::because_unidentified_action_given( $current_verification_action );
	}
}

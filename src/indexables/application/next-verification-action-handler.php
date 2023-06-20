<?php

namespace Yoast\WP\SEO\Indexables\Application;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Indexables\Domain\Current_Verification_Action;

/**
 * The Next_Verification_Action_Handler class.
 */
class Next_Verification_Action_Handler {

	/**
	 * The options helper instance.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * The constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Gets the cron_verify_current_action option.
	 *
	 * @return string
	 */
	public function get_current_verification_action(): string {
		return $this->options_helper->get( 'cron_verify_current_action', 'term' );
	}

	/**
	 * Sets the cron_verify_current_action based on the current action.
	 *
	 * @param Current_Verification_Action $current_verification_action The current verification action.
	 *
	 * @return void
	 */
	public function set_current_verification_action( Current_Verification_Action $current_verification_action ): void {
		$this->options_helper->set( 'cron_verify_current_action', $current_verification_action->get_action() );
	}
}

<?php

namespace Yoast\WP\SEO\Indexables\Application;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Indexables\Domain\Batch_Size;
use Yoast\WP\SEO\Indexables\Domain\Current_Verification_Action;
use Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count;

class Next_Verification_Action_Handler {

	/**
	 * @var Options_Helper
	 */
	protected $options_helper;

	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	public function get_current_verification_action():int {
		return $this->options_helper->get( 'cron_verify_current_action', 'term' );
	}

	public function set_current_verification_action( Current_Verification_Action $current_verification_action ) {
		$this->options_helper->set( 'cron_verify_current_action', $current_verification_action->get_action() );
	}
}

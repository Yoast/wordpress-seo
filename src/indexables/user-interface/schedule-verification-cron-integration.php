<?php

namespace Yoast\WP\SEO\Indexables\User_Interface;

use Yoast\WP\SEO\Conditionals\Traits\Admin_Conditional_Trait;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Indexables\application\Verification_Cron_Schedule_Handler;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * This integration schedules the verification cron tasks.
 */
class Schedule_Verification_Cron_Integration implements Integration_Interface {

	use Admin_Conditional_Trait;

	private $options_helper;

	/**
	 * The constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		if ( $this->options_helper->get( 'first_time_install', false ) !== false ) {
			\add_action( 'wpseo_activate', [ Verification_Cron_Schedule_Handler::class, 'schedule_indexable_verification' ] );
		}
	}
}

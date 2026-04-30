<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Cron_Integration class.
 */
class Cron_Integration implements Integration_Interface, LoggerAwareInterface {

	use LoggerAwareTrait;

	/**
	 * The indexing notification integration.
	 *
	 * @var Date_Helper
	 */
	protected $date_helper;

	/**
	 * {@inheritDoc}
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Cron_Integration constructor
	 *
	 * @param Date_Helper $date_helper The date helper.
	 */
	public function __construct( Date_Helper $date_helper ) {
		$this->date_helper = $date_helper;
		$this->logger      = new NullLogger();
	}

	/**
	 * {@inheritDoc}
	 */
	public function register_hooks() {
		if ( ! \wp_next_scheduled( Indexing_Notification_Integration::NOTIFICATION_ID ) ) {
			\wp_schedule_event(
				$this->date_helper->current_time(),
				'daily',
				Indexing_Notification_Integration::NOTIFICATION_ID,
			);
			$this->logger->info( 'Scheduled daily indexing-notification cron.' );
		}
	}
}

<?php

namespace Yoast\WP\SEO\Indexables\Application;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * The Verification_Cron_Schedule_Handler class.
 */
class Verification_Cron_Schedule_Handler {

	/**
	 * The name of the cron job.
	 */
	public const INDEXABLE_VERIFY_POST_INDEXABLES_NAME = 'wpseo_indexable_verify_post_indexables';

	/**
	 * The name of the cron job.
	 */
	public const INDEXABLE_VERIFY_NON_TIMESTAMPED_INDEXABLES_NAME = 'wpseo_indexable_verify_non_timestamped_indexables';

	/**
	 * The Cron_Verification_Gate instance.
	 *
	 * @var Cron_Verification_Gate
	 */
	private $cron_verification_gate;

	/**
	 * The Options_Helper instance.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The constructor.
	 *
	 * @param Cron_Verification_Gate $cron_verification_gate The cron verification gate.
	 * @param Options_Helper         $options_helper         The options helper.
	 */
	public function __construct( Cron_Verification_Gate $cron_verification_gate, Options_Helper $options_helper ) {
		$this->cron_verification_gate = $cron_verification_gate;
		$this->options_helper         = $options_helper;
	}

	/**
	 * Schedules the indexable verification crons.
	 *
	 * @return void
	 */
	public function schedule_indexable_verification(): void {
		if ( $this->options_helper->get( 'activation_redirect_timestamp_free', 0 ) === 0 ) {
			return;
		}

		if ( $this->cron_verification_gate->should_verify_on_cron() && ! \wp_next_scheduled( self::INDEXABLE_VERIFY_POST_INDEXABLES_NAME ) ) {
			\wp_schedule_event( ( \time() + \HOUR_IN_SECONDS ), 'fifteen_minutes', self::INDEXABLE_VERIFY_POST_INDEXABLES_NAME );
		}

		if ( $this->cron_verification_gate->should_verify_on_cron() && ! \wp_next_scheduled( self::INDEXABLE_VERIFY_NON_TIMESTAMPED_INDEXABLES_NAME ) ) {
			\wp_schedule_event( ( \time() + \HOUR_IN_SECONDS ), 'fifteen_minutes', self::INDEXABLE_VERIFY_NON_TIMESTAMPED_INDEXABLES_NAME );
		}
	}

	/**
	 * Unschedules the indexable post verification cron.
	 *
	 * @return void
	 */
	public function unschedule_verify_post_indexables_cron() {
		$scheduled = \wp_next_scheduled( self::INDEXABLE_VERIFY_POST_INDEXABLES_NAME );
		if ( $scheduled ) {
			\wp_unschedule_event( $scheduled, self::INDEXABLE_VERIFY_POST_INDEXABLES_NAME );
		}
	}

	/**
	 * Unschedules the non timestamped cron.
	 *
	 * @return void
	 */
	public function unschedule_verify_non_timestamped_indexables_cron() {
		$scheduled = \wp_next_scheduled( self::INDEXABLE_VERIFY_NON_TIMESTAMPED_INDEXABLES_NAME );
		if ( $scheduled ) {
			\wp_unschedule_event( $scheduled, self::INDEXABLE_VERIFY_NON_TIMESTAMPED_INDEXABLES_NAME );
		}
	}
}

<?php

namespace Yoast\WP\SEO\Indexables\Application;

class Verification_Cron_Schedule_Handler {

	public const INDEXABLE_VERIFY_POST_INDEXABLES_NAME            = 'wpseo_indexable_verify_post_indexables';
	public const INDEXABLE_VERIFY_NON_TIMESTAMPED_INDEXABLES_NAME = 'wpseo_indexable_verify_non_timestamped_indexables';

	/**
	 * @var Cron_Verification_Gate
	 */
	private $cron_verification_gate;

	/**
	 * @param \Yoast\WP\SEO\Indexables\Application\Cron_Verification_Gate $cron_verification_gate
	 */
	public function __construct( Cron_Verification_Gate $cron_verification_gate ) {
		$this->cron_verification_gate = $cron_verification_gate;
	}

	public function schedule_indexable_verification(): void {

		if ( ! \wp_next_scheduled( self::INDEXABLE_VERIFY_POST_INDEXABLES_NAME ) && $this->cron_verification_gate->should_verify_on_cron() ) {
			\wp_schedule_event( ( \time() + \HOUR_IN_SECONDS ), 'fifteen_minutes', self::INDEXABLE_VERIFY_POST_INDEXABLES_NAME );
		}

		if ( ! \wp_next_scheduled( self::INDEXABLE_VERIFY_NON_TIMESTAMPED_INDEXABLES_NAME ) && $this->cron_verification_gate->should_verify_on_cron() ) {
			\wp_schedule_event( ( \time() + \HOUR_IN_SECONDS ), 'fifteen_minutes', self::INDEXABLE_VERIFY_NON_TIMESTAMPED_INDEXABLES_NAME );
		}
	}

	public function unschedule_verify_post_indexables_cron() {
		$scheduled = \wp_next_scheduled( self::INDEXABLE_VERIFY_POST_INDEXABLES_NAME );
		if ( $scheduled ) {
			\wp_unschedule_event( $scheduled, self::INDEXABLE_VERIFY_POST_INDEXABLES_NAME );
		}
	}

	public function unschedule_verify_non_timestamped_indexables_cron() {
		$scheduled = \wp_next_scheduled( self::INDEXABLE_VERIFY_NON_TIMESTAMPED_INDEXABLES_NAME );
		if ( $scheduled ) {
			\wp_unschedule_event( $scheduled, self::INDEXABLE_VERIFY_NON_TIMESTAMPED_INDEXABLES_NAME );
		}
	}
}

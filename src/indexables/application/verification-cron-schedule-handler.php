<?php

namespace Yoast\WP\SEO\Indexables\Application;

class Verification_Cron_Schedule_Handler {

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
		if ( ! \wp_next_scheduled( 'wpseo_indexable_verify_post_indexables' ) && $this->cron_verification_gate->should_verify_on_cron() ) {
			\wp_schedule_event( ( \time() + \HOUR_IN_SECONDS ), 'fifteen_minutes', 'wpseo_indexable_verify_post_indexables' );
		}

		if ( ! \wp_next_scheduled( 'wpseo_indexable_verify_non_timestamped_indexables' ) && $this->cron_verification_gate->should_verify_on_cron() ) {
			\wp_schedule_event( ( \time() + \HOUR_IN_SECONDS ), 'fifteen_minutes', 'wpseo_indexable_verify_non_timestamped_indexables' );
		}
	}


}

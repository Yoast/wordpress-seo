<?php

namespace Yoast\WP\SEO\Indexables\User_Interface;

use Yoast\WP\SEO\Indexables\Application\Cron_Verification_Gate;
use Yoast\WP\SEO\Integrations\Integration_Interface;

class Verification_Cron_Callback_Integration implements Integration_Interface {


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
	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_action( 'wpseo_indexable_verify_post_indexables', [ $this, 'start_verify_posts' ] );
		\add_action( 'wpseo_indexable_verify_non_timestamped_indexables', [ $this, 'start_verify_non_timestamped_indexables' ] );
	}

	public function start_verify_posts(  ) {
		if ( \wp_doing_cron() && ! $this->cron_verification_gate->should_verify_on_cron() ) {
			$scheduled = \wp_next_scheduled( 'wpseo_indexable_verify_post_indexables' );
			if ( $scheduled ) {
				\wp_unschedule_event( $scheduled, 'wpseo_indexable_verify_post_indexables' );
			}
			return;
		}






	}
	public function start_verify_non_timestamped_indexables(  ) {
		if ( \wp_doing_cron() && ! $this->cron_verification_gate->should_verify_on_cron() ) {
			$scheduled = \wp_next_scheduled( 'wpseo_indexable_verify_non_timestamped_indexables' );
			if ( $scheduled ) {
				\wp_unschedule_event( $scheduled, 'wpseo_indexable_verify_non_timestamped_indexables' );
			}
			return;
		}



	}


}

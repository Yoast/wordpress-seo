<?php

namespace Yoast\WP\SEO\MyYoast_Client\User_Interface;

use Exception;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareInterface;
use YoastSEO_Vendor\Psr\Log\LoggerAwareTrait;
use YoastSEO_Vendor\Psr\Log\NullLogger;

/**
 * Registers wp-cron for registration key rotation.
 */
class MyYoast_Client_Integration implements Integration_Interface, LoggerAwareInterface {
	use No_Conditionals;
	use LoggerAwareTrait;

	private const CRON_HOOK         = 'Yoast\WP\SEO\myyoast_key_rotation';
	private const ROTATION_INTERVAL = 'Yoast\WP\SEO\myyoast_90days';

	/**
	 * The registration manager.
	 *
	 * @var Client_Registration_Interface
	 */
	private $client_registration;

	/**
	 * MyYoast_Client_Integration constructor.
	 *
	 * @param Client_Registration_Interface $client_registration The registration manager.
	 */
	public function __construct( Client_Registration_Interface $client_registration ) {
		$this->client_registration = $client_registration;
		$this->logger              = new NullLogger();
	}

	/**
	 * Registers hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'admin_init', [ $this, 'schedule_key_rotation' ] );
		\add_action( self::CRON_HOOK, [ $this, 'handle_key_rotation' ] );
		\add_filter( 'cron_schedules', [ $this, 'add_cron_schedule' ] );
	}

	/**
	 * Adds a 90-day cron schedule.
	 *
	 * @param array<string, array<string, string|int>> $schedules Existing cron schedules.
	 *
	 * @return array<string, array<string, string|int>> Modified schedules.
	 */
	public function add_cron_schedule( array $schedules ): array {
		$schedules[ self::ROTATION_INTERVAL ] = [
			'interval' => ( 90 * 86_400 ), // 90 days in seconds.
			'display'  => \esc_html__( 'Every 90 days', 'wordpress-seo' ),
		];

		return $schedules;
	}

	/**
	 * Schedules the key rotation cron job if not already scheduled.
	 *
	 * @return void
	 */
	public function schedule_key_rotation(): void {
		if ( ! \wp_next_scheduled( self::CRON_HOOK ) ) {
			\wp_schedule_event( ( \time() + ( 90 * 86_400 ) ), self::ROTATION_INTERVAL, self::CRON_HOOK );
		}
	}

	/**
	 * Handles the key rotation cron event.
	 *
	 * @return void
	 */
	public function handle_key_rotation(): void {
		try {
			$this->client_registration->rotate_registration_keys();
		}
		catch ( Exception $e ) {
			// Best-effort — log but don't crash cron.
			$this->logger->warning( 'Yoast MyYoast key rotation failed: {error}', [ 'error' => $e->getMessage() ] );
		}
	}
}

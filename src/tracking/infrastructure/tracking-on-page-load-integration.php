<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tracking\Infrastructure;

use WPSEO_Option_Tracking_Only;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Conditionals\Tracking_Enabled_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Handles registering post type tasks.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Tracking_On_Page_Load_Integration implements Integration_Interface {

	/**
	 * Holds the options helper instance.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct(
		Options_Helper $options_helper
	) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Returns the needed conditionals.
	 *
	 * @return array<string> The conditionals that must be met to load this.
	 */
	public static function get_conditionals(): array {
		return [
			Tracking_Enabled_Conditional::class,
		];
	}

	/**
	 * Registers action hook.
	 *
	 * @return void
	 */
	public function register_hooks(): void {
		\add_action( 'admin_init', [ $this, 'store_version_for_tracking' ] );
	}

	/**
	 * Stores the tracking option taken from the URL.
	 *
	 * @return void
	 */
	public function store_version_for_tracking() {
		// @TODO: Verify that we can't use nonces.
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reason: We are only going to do a string comparison.
		if ( isset( $_GET['wpseo_tracked_version'] ) && \is_string( $_GET['wpseo_tracked_version'] ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reason: We are only going to do a string comparison.
			$option_to_store = sanitize_text_field( wp_unslash( $_GET['wpseo_tracked_version'] ) );

			// Verify that the option to store is one of our tracking options.
			if ( ! in_array( $option_to_store, \array_keys( WPSEO_Option_Tracking_Only::get_instance()->get_defaults() ), true ) ) {
				return;
			}

			$this->options_helper->set( $option_to_store, \WPSEO_VERSION );
		}
	}
}

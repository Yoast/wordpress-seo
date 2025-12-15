<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tracking\Infrastructure;

use WPSEO_Option_Tracking_Only;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
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
	 * Holds the capability helper instance.
	 *
	 * @var Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The constructor.
	 *
	 * @param Options_Helper    $options_helper    The options helper.
	 * @param Capability_Helper $capability_helper The capability helper.
	 */
	public function __construct(
		Options_Helper $options_helper,
		Capability_Helper $capability_helper
	) {
		$this->options_helper    = $options_helper;
		$this->capability_helper = $capability_helper;
	}

	/**
	 * Returns the needed conditionals.
	 *
	 * @return array<string> The conditionals that must be met to load this.
	 */
	public static function get_conditionals(): array {
		return [
			Admin_Conditional::class,
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
		if ( ! isset( $_GET['wpseo_tracked_option'] ) || ! \is_string( $_GET['wpseo_tracked_option'] ) ) {
			return;
		}

		if ( $this->capability_helper->current_user_can( 'wpseo_manage_options' ) !== true ) {
			return;
		}

		if ( ! isset( $_GET['_wpnonce'] ) || ! \wp_verify_nonce( \sanitize_text_field( \wp_unslash( $_GET['_wpnonce'] ) ), 'wpseo_tracking_nonce' ) ) {
			return;
		}

		$option_to_store = \sanitize_text_field( \wp_unslash( $_GET['wpseo_tracked_option'] ) );

		// Verify that the option to store is one of our tracking options.
		if ( ! \in_array( $option_to_store, \array_keys( WPSEO_Option_Tracking_Only::get_instance()->get_defaults() ), true ) ) {
			return;
		}

		$this->options_helper->set( $option_to_store, \WPSEO_VERSION );
	}
}

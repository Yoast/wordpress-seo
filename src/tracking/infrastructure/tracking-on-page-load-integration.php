<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tracking\Infrastructure;

use WPSEO_Option_Tracking_Only;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Tracking\Application\Action_Tracker;

/**
 * Handles tracking on page load.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Tracking_On_Page_Load_Integration implements Integration_Interface {

	/**
	 * Holds the action tracker instance.
	 *
	 * @var Action_Tracker
	 */
	private $action_tracker;

	/**
	 * Holds the capability helper instance.
	 *
	 * @var Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The constructor.
	 *
	 * @param Action_Tracker    $action_tracker    The action tracker.
	 * @param Capability_Helper $capability_helper The capability helper.
	 */
	public function __construct(
		Action_Tracker $action_tracker,
		Capability_Helper $capability_helper
	) {
		$this->action_tracker    = $action_tracker;
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
		\add_action( 'admin_init', [ $this, 'store_version_on_page_load' ] );
	}

	/**
	 * Stores the current version for the tracking option taken from the URL.
	 *
	 * @return void
	 */
	public function store_version_on_page_load() {
		if ( ! isset( $_GET['wpseo_tracked_action'] ) || ! \is_string( $_GET['wpseo_tracked_action'] ) ) {
			return;
		}

		if ( $this->capability_helper->current_user_can( 'wpseo_manage_options' ) !== true ) {
			return;
		}

		if ( ! isset( $_GET['wpseo_tracking_nonce'] ) || ! \wp_verify_nonce( \sanitize_text_field( \wp_unslash( $_GET['wpseo_tracking_nonce'] ) ), 'wpseo_tracking_nonce' ) ) {
			return;
		}

		$action_to_track = \sanitize_text_field( \wp_unslash( $_GET['wpseo_tracked_action'] ) );

		// Verify that the option to store is one of our tracking options.
		if ( ! \in_array( $action_to_track, \array_keys( WPSEO_Option_Tracking_Only::get_instance()->get_defaults() ), true ) ) {
			return;
		}

		$this->action_tracker->track_version_for_performed_action( $action_to_track );
	}
}

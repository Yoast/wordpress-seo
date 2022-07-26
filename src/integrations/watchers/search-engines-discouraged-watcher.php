<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use WPSEO_Capability_Utils;
use WPSEO_Options;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Notification_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Presenters\Admin\Search_Engines_Discouraged_Presenter;
use Yoast_Notification;
use Yoast_Notification_Center;

/**
 * Shows a notification for users who have WordPress auto updates enabled but not Yoast SEO auto updates.
 */
class Search_Engines_Discouraged_Watcher implements Integration_Interface {

	use No_Conditionals;

	/**
	 * The notification ID.
	 */
	const NOTIFICATION_ID = 'wpseo-search-engines-discouraged';

	/**
	 * The Yoast notification center.
	 *
	 * @var Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * The notification helper.
	 *
	 * @var Notification_Helper
	 */
	protected $notification_helper;

	/**
	 * Auto_Update constructor.
	 *
	 * @param Yoast_Notification_Center $notification_center The notification center.
	 * @param Notification_Helper       $notification_helper The notification helper.
	 */
	public function __construct(
		Yoast_Notification_Center $notification_center,
		Notification_Helper $notification_helper
	) {
		$this->notification_center = $notification_center;
		$this->notification_helper = $notification_helper;
	}

	/**
	 * Initializes the integration.
	 *
	 * On admin_init, it is checked whether the notification about search engines being discouraged should be shown.
	 * On admin_notices, the notice about the search engines being discouraged will be shown when necessary.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'admin_init', [ $this, 'manage_search_engines_discouraged_notification' ] );

		/*
		 * The `admin_notices` hook fires on single site admin pages vs.
		 * `network_admin_notices` which fires on multisite admin pages and
		 * `user_admin_notices` which fires on multisite user admin pagss.
		 */
		\add_action( 'admin_notices', [ $this, 'maybe_show_search_engines_discouraged_notice' ] );
	}

	/**
	 * Checks whether search engines are discouraged from indexing the site.
	 *
	 * @return bool Whether search engines are discouraged from indexing the site.
	 */
	private function search_engines_are_discouraged() {
		return (string) get_option( 'blog_public' ) === '0';
	}

	/**
	 * Helper to verify if the user is currently visiting one of our admin pages.
	 *
	 * @return bool
	 */
	private function on_wpseo_admin_page() {
		return $GLOBALS['pagenow'] === 'admin.php' && strpos( filter_input( INPUT_GET, 'page' ), 'wpseo' ) === 0;
	}

	/**
	 * Whether the search engines discouraged notification should be shown.
	 *
	 * @return bool
	 */
	protected function should_show_search_engines_discouraged_notification() {
		return $this->search_engines_are_discouraged() && WPSEO_Options::get( 'ignore_search_engines_discouraged_notice', false ) === false;
	}

	/**
	 * Whether the search engines notice should be shown.
	 *
	 * @return bool
	 */
	protected function should_show_search_engines_discouraged_notice() {
		$discouraged_pages = [
			'index.php',
			'plugins.php',
			'update-core.php',
		];

		return (
			$this->search_engines_are_discouraged()
			&& WPSEO_Capability_Utils::current_user_can( 'manage_options' )
			&& WPSEO_Options::get( 'ignore_search_engines_discouraged_notice', false ) === false
			&& (
				$this->on_wpseo_admin_page()
				|| in_array( $GLOBALS['pagenow'], $discouraged_pages, true )
			)
		);
	}

	/**
	 * Show the search engines discouraged notice.
	 *
	 * @return void
	 */
	public function show_search_engines_discouraged_notice() {
		$presenter = new Search_Engines_Discouraged_Presenter();

		printf(
			'<div id="robotsmessage" class="notice notice-error"> %1$s </div>',
			esc_html( $presenter->present() )
		);
	}

	/**
	 * Show the search engine discouraged notice when needed.
	 *
	 * @return void
	 */
	public function maybe_show_search_engines_discouraged_notice() {
		if ( ! $this->should_show_search_engines_discouraged_notice() ) {
			return;
		}
		$this->show_search_engines_discouraged_notice();
	}

	/**
	 * Remove the search engines discouraged notification if it exists.
	 *
	 * @return void
	 */
	protected function remove_search_engines_discouraged_notification_if_exists() {
		$this->notification_center->remove_notification_by_id( self::NOTIFICATION_ID );
	}

	/**
	 * Add the search engines discouraged notification if it does not exist yet.
	 *
	 * @return void
	 */
	protected function maybe_add_search_engines_discouraged_notification() {
		if ( ! $this->notification_center->get_notification_by_id( self::NOTIFICATION_ID ) ) {
			$notification = $this->notification();
			$this->notification_helper->restore_notification( $notification );
			$this->notification_center->add_notification( $notification );
		}
	}

	/**
	 * Manage the search engines discouraged notification.
	 *
	 * Shows the notification if needed and deletes it if needed.
	 *
	 * @return void
	 */
	public function manage_search_engines_discouraged_notification() {
		if ( ! $this->should_show_search_engines_discouraged_notification() ) {
			$this->remove_search_engines_discouraged_notification_if_exists();
		}
		else {
			$this->maybe_add_search_engines_discouraged_notification();
		}
	}

	/**
	 * Returns an instance of the notification.
	 *
	 * @return Yoast_Notification The notification to show.
	 */
	protected function notification() {
		$presenter = new Search_Engines_Discouraged_Presenter();

		return new Yoast_Notification(
			$presenter->present(),
			[
				'type'         => Yoast_Notification::ERROR,
				'id'           => self::NOTIFICATION_ID,
				'capabilities' => 'wpseo_manage_options',
				'priority'     => 1,
			]
		);
	}
}

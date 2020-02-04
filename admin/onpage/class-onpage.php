<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Handles the request for getting the Ryte status.
 */
class WPSEO_OnPage implements WPSEO_WordPress_Integration {

	/**
	 * The name of the user meta key for storing the dismissed status.
	 *
	 * @var string
	 */
	const USER_META_KEY = 'wpseo_dismiss_onpage';

	/**
	 * Is the request started by pressing the fetch button.
	 *
	 * @var bool
	 */
	private $is_manual_request = false;

	/**
	 * Constructs the object.
	 */
	public function __construct() {
		$this->catch_redo_listener();
	}

	/**
	 * Sets up the hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		// Adds admin notice if necessary.
		add_filter( 'admin_init', [ $this, 'show_notice' ] );

		if ( ! self::is_active() ) {
			return;
		}

		// Adds weekly schedule to the cron job schedules.
		add_filter( 'cron_schedules', [ $this, 'add_weekly_schedule' ] );

		// Sets the action for the Ryte fetch.
		add_action( 'wpseo_onpage_fetch', [ $this, 'fetch_from_onpage' ] );
	}

	/**
	 * Shows a notice when the website is not indexable.
	 *
	 * @return void
	 */
	public function show_notice() {
		$notification        = $this->get_indexability_notification();
		$notification_center = Yoast_Notification_Center::get();

		if ( $this->should_show_notice() ) {
			$notification_center->add_notification( $notification );

			return;
		}

		$notification_center->remove_notification( $notification );
	}

	/**
	 * Determines if we can use the functionality.
	 *
	 * @return bool True if this functionality can be used.
	 */
	public static function is_active() {
		if ( wp_doing_ajax() ) {
			return false;
		}

		if ( ! WPSEO_Options::get( 'onpage_indexability' ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Hooks to run on plugin activation.
	 */
	public function activate_hooks() {
		if ( $this->get_option()->is_enabled() ) {
			$this->schedule_cron();

			return;
		}

		$this->unschedule_cron();
	}

	/**
	 * Adds a weekly cron schedule.
	 *
	 * @param array $schedules Currently scheduled items.
	 *
	 * @return array Enriched list of schedules.
	 */
	public function add_weekly_schedule( $schedules ) {
		if ( ! is_array( $schedules ) ) {
			$schedules = [];
		}

		$schedules['weekly'] = [
			'interval' => WEEK_IN_SECONDS,
			'display'  => __( 'Once Weekly', 'wordpress-seo' ),
		];

		return $schedules;
	}

	/**
	 * Fetches the data from Ryte.
	 *
	 * @return bool True if this has been run.
	 */
	public function fetch_from_onpage() {
		$onpage_option = $this->get_option();
		if ( ! $onpage_option->should_be_fetched() ) {
			return false;
		}

		$new_status = $this->request_indexability();
		if ( $new_status === false ) {
			return false;
		}

		// Updates the timestamp in the option.
		$onpage_option->set_last_fetch( time() );

		// The currently indexability status.
		$old_status = $onpage_option->get_status();

		$onpage_option->set_status( $new_status );
		$onpage_option->save_option();

		// Check if the status has been changed.
		if ( $old_status !== $new_status && $new_status !== WPSEO_OnPage_Option::CANNOT_FETCH ) {
			$this->notify_admins();
		}

		return true;
	}

	/**
	 * Retrieves the option to use.
	 *
	 * @return WPSEO_OnPage_Option The option.
	 */
	protected function get_option() {
		return new WPSEO_OnPage_Option();
	}

	/**
	 * Builds the indexability notification.
	 *
	 * @return Yoast_Notification The notification.
	 */
	private function get_indexability_notification() {
		$notice = sprintf(
			/* translators: 1: opens a link to a related knowledge base article. 2: closes the link */
			__( '%1$sYour homepage cannot be indexed by search engines%2$s. This is very bad for SEO and should be fixed.', 'wordpress-seo' ),
			'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/onpageindexerror' ) . '" target="_blank">',
			'</a>'
		);

		return new Yoast_Notification(
			$notice,
			[
				'type'         => Yoast_Notification::ERROR,
				'id'           => 'wpseo-dismiss-onpageorg',
				'capabilities' => 'wpseo_manage_options',
			]
		);
	}

	/**
	 * Sends a request to Ryte to get the indexability.
	 *
	 * @return int|bool The indexability value.
	 */
	protected function request_indexability() {
		$parameters = [];
		if ( $this->wordfence_protection_enabled() ) {
			$parameters['wf_strict'] = 1;
		}

		$request  = new WPSEO_OnPage_Request();
		$response = $request->do_request( get_option( 'home' ), $parameters );

		if ( isset( $response['is_indexable'] ) ) {
			return (int) $response['is_indexable'];
		}

		return WPSEO_OnPage_Option::CANNOT_FETCH;
	}

	/**
	 * Should the notice being given?
	 *
	 * @return bool True if a notice should be shown.
	 */
	protected function should_show_notice() {
		if ( ! $this->get_option()->is_enabled() ) {
			return false;
		}

		// If development mode is on or the blog is not public, just don't show this notice.
		if ( WPSEO_Utils::is_development_mode() || ( get_option( 'blog_public' ) === '0' ) ) {
			return false;
		}

		return $this->get_option()->get_status() === WPSEO_OnPage_Option::IS_NOT_INDEXABLE;
	}

	/**
	 * Notifies the admins.
	 *
	 * @return void
	 */
	protected function notify_admins() {
		/*
		 * Let's start showing the notices to all admins by removing the hide-notice meta data for each admin resulting
		 * in popping up the notice again.
		 */
		delete_metadata( 'user', 0, self::USER_META_KEY, '', true );
	}

	/**
	 * Schedules the cronjob to get the new indexibility status.
	 *
	 * @return void
	 */
	private function schedule_cron() {
		if ( wp_next_scheduled( 'wpseo_onpage_fetch' ) ) {
			return;
		}

		wp_schedule_event( time(), 'weekly', 'wpseo_onpage_fetch' );
	}

	/**
	 * Unschedules the cronjob to get the new indexibility status.
	 *
	 * @return void
	 */
	private function unschedule_cron() {
		if ( ! wp_next_scheduled( 'wpseo_onpage_fetch' ) ) {
			return;
		}

		wp_clear_scheduled_hook( 'wpseo_onpage_fetch' );
	}

	/**
	 * Redo the fetch request for Ryte.
	 *
	 * @return void
	 */
	private function catch_redo_listener() {
		if ( ! self::is_active() ) {
			return;
		}

		if ( filter_input( INPUT_GET, 'wpseo-redo-onpage' ) === '1' ) {
			$this->is_manual_request = true;

			add_action( 'admin_init', [ $this, 'fetch_from_onpage' ] );
		}
	}

	/**
	 * Checks if WordFence protects the site against 'fake' Google crawlers.
	 *
	 * @return boolean True if WordFence protects the site.
	 */
	private function wordfence_protection_enabled() {
		if ( ! class_exists( 'wfConfig' ) ) {
			return false;
		}

		if ( ! method_exists( 'wfConfig', 'get' ) ) {
			return false;
		}

		return (bool) wfConfig::get( 'blockFakeBots' );
	}
}

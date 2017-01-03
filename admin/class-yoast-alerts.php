<?php
/**
 * @package WPSEO\Admin\Notifications
 */

/**
 * Class Yoast_Alerts
 */
class Yoast_Alerts {

	const ADMIN_PAGE = 'wpseo_dashboard';

	/** @var int Total notifications count */
	private static $notification_count = 0;

	/** @var array All error notifications */
	private static $errors = array();
	/** @var array Active errors */
	private static $active_errors = array();
	/** @var array Dismissed errors */
	private static $dismissed_errors = array();

	/** @var array All warning notifications */
	private static $warnings = array();
	/** @var array Active warnings */
	private static $active_warnings = array();
	/** @var array Dismissed warnings */
	private static $dismissed_warnings = array();

	/**
	 * Yoast_Alerts constructor.
	 */
	public function __construct() {

		$this->add_hooks();
	}

	/**
	 * Adds hooks.
	 */
	private function add_hooks() {

		$page = filter_input( INPUT_GET, 'page' );
		if ( self::ADMIN_PAGE === $page ) {
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		}

		// Needed for adminbar and Alerts page.
		add_action( 'admin_init', array( __CLASS__, 'collect_alerts' ), 99 );

		// Add AJAX hooks.
		add_action( 'wp_ajax_yoast_dismiss_alerts', array( $this, 'ajax_dismiss_alerts' ) );
		add_action( 'wp_ajax_yoast_dismiss_alert', array( $this, 'ajax_dismiss_alert' ) );
		add_action( 'wp_ajax_yoast_restore_alert', array( $this, 'ajax_restore_alert' ) );
	}

	/**
	 * Enqueues assets.
	 */
	public function enqueue_assets() {

		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_style( 'alerts' );
	}

	/**
	 * Handles ajax request to dismiss an alert.
	 */
	public function ajax_dismiss_alert() {

		$notification = $this->get_notification_from_ajax_request();
		if ( $notification ) {
			$notification_center = Yoast_Notification_Center::get();
			$notification_center->maybe_dismiss_notification( $notification );

			$this->output_ajax_response( $notification->get_type() );
		}

		wp_die();
	}

	/**
	 * Handles ajax request to dismiss all alerts.
	 */
	public function ajax_dismiss_alerts() {

		$notifications = json_decode( filter_input( INPUT_POST, 'data' ), true );

		if ( count( $notifications !== 0 ) ) {
			$responses = array();
			$notification_center = Yoast_Notification_Center::get();

			foreach ( $notifications as $notification ) {

				$nonce = $notification['nonce'];

				$notification = $notification_center->get_notification_by_id( $notification['id'] );
				$notification_center->maybe_dismiss_notification( $notification, 'seen', $notification->get_id(), $nonce );

				$responses[] = $notification;
			}

			// Only return the last response.
			$this->output_ajax_responses( array_unique( $responses ) );
		}

		wp_die();
	}

	/**
	 * Handles ajax request to restore an alert.
	 */
	public function ajax_restore_alert() {

		$notification = $this->get_notification_from_ajax_request();
		if ( $notification ) {
			delete_user_meta( get_current_user_id(), $notification->get_dismissal_key() );

			$this->output_ajax_response( $notification->get_type() );
		}

		wp_die();
	}

	/**
	 * Creates AJAX response data.
	 *
	 * @param array $responses Responses to parse.
	 */
	private function output_ajax_responses( $responses ) {
		$html = array();

		foreach ( $responses as $response ) {

			$type = $response->get_type();

			if ( $type === 'updated' ) {
				$type = 'warning';
			}

			$html[ $type ] = array(
				'html' => $this->get_view_html( $response->get_type() ),
				'container' => '.' . $this->determine_container( $type ),
			);
		}

		echo wp_json_encode(
			array(
				'html'  => $html,
				'total' => self::get_active_alert_count(),
			)
		);
	}

	/**
	 * Determines what kind of container CSS class to use.
	 *
	 * @param string $type The message type.
	 *
	 * @return string The CSS class to apply to the container.
	 */
	private function determine_container( $type ) {
		if ( $type === 'error' ) {
			return 'yoast-container__alert';
		}

		return 'yoast-container__warning';
	}

	/**
	 * Creates AJAX response data.
	 *
	 * @param string $type Alert type.
	 */
	private function output_ajax_response( $type ) {

		$html = $this->get_view_html( $type );
		echo wp_json_encode(
			array(
				'html'  => $html,
				'total' => self::get_active_alert_count(),
			)
		);
	}

	/**
	 * Gets the HTML to return in the AJAX request.
	 *
	 * @param string $type Alert type.
	 *
	 * @return string Returns the proper view to display.
	 */
	private function get_view_html( $type ) {

		switch ( $type ) {
			case 'error':
				$view = 'errors';
				break;

			case 'warning':
			default:
				$view = 'warnings';
				break;
		}

		// Re-collect alerts.
		self::collect_alerts();

		/** @noinspection PhpUnusedLocalVariableInspection */
		$alerts_data = self::get_template_variables();

		ob_start();
		include WPSEO_PATH . 'admin/views/partial-alerts-' . $view . '.php';
		$html = ob_get_clean();

		return $html;
	}

	/**
	 * Extracts the Yoast Notification from the AJAX request.
	 *
	 * @return null|Yoast_Notification The Yoast_Notification object or null if none is found.
	 */
	private function get_notification_from_ajax_request() {

		$notification_center = Yoast_Notification_Center::get();
		$notification_id     = filter_input( INPUT_POST, 'notification' );

		return $notification_center->get_notification_by_id( $notification_id );
	}

	/**
	 * Shows the alerts overview page.
	 */
	public static function show_overview_page() {

		/** @noinspection PhpUnusedLocalVariableInspection */
		$alerts_data = self::get_template_variables();

		include WPSEO_PATH . 'admin/views/alerts-dashboard.php';
	}

	/**
	 * Collects the alerts and group them together.
	 */
	public static function collect_alerts() {

		$notification_center = Yoast_Notification_Center::get();

		$notifications            = $notification_center->get_sorted_notifications();
		self::$notification_count = count( $notifications );

		self::$errors           = array_filter( $notifications, array( __CLASS__, 'filter_error_alerts' ) );
		self::$dismissed_errors = array_filter( self::$errors, array( __CLASS__, 'filter_dismissed_alerts' ) );
		self::$active_errors    = array_diff( self::$errors, self::$dismissed_errors );

		self::$warnings           = array_filter( $notifications, array( __CLASS__, 'filter_warning_alerts' ) );
		self::$dismissed_warnings = array_filter( self::$warnings, array( __CLASS__, 'filter_dismissed_alerts' ) );
		self::$active_warnings    = array_diff( self::$warnings, self::$dismissed_warnings );
	}

	/**
	 * Gets the variables needed in the views.
	 *
	 * @return array Array containing the variables for the template.
	 */
	public static function get_template_variables() {

		return array(
			'metrics'  => array(
				'total'    => self::$notification_count,
				'active'   => self::get_active_alert_count(),
				'errors'   => count( self::$errors ),
				'warnings' => count( self::$warnings ),
			),
			'errors'   => array(
				'dismissed' => self::$dismissed_errors,
				'active'    => self::$active_errors,
			),
			'warnings' => array(
				'dismissed' => self::$dismissed_warnings,
				'active'    => self::$active_warnings,
			),
		);
	}

	/**
	 * Gets the number of active alerts.
	 *
	 * @return int The amount of active alerts.
	 */
	public static function get_active_alert_count() {

		return ( count( self::$active_errors ) + count( self::$active_warnings ) );
	}

	/**
	 * Filters out any non-errors.
	 *
	 * @param Yoast_Notification $notification Notification to test.
	 *
	 * @return bool Whether or not the notification type equals to error.
	 */
	private static function filter_error_alerts( Yoast_Notification $notification ) {

		return $notification->get_type() === 'error';
	}

	/**
	 * Filters out any non-warnings.
	 *
	 * @param Yoast_Notification $notification Notification to test.
	 *
	 * @return bool
	 */
	private static function filter_warning_alerts( Yoast_Notification $notification ) {

		return $notification->get_type() !== 'error';
	}

	/**
	 * Filters out any dismissed notifications.
	 *
	 * @param Yoast_Notification $notification Notification to test.
	 *
	 * @return bool
	 */
	private static function filter_dismissed_alerts( Yoast_Notification $notification ) {

		return Yoast_Notification_Center::is_notification_dismissed( $notification );
	}
}

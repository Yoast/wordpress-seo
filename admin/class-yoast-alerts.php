<?php
/**
 * @package WPSEO\Admin\Notifications
 */

/**
 * @todo make dismissing of alerts ajax independent.
 * @todo add new unit tests.
 * @todo adjust colors of alerts.
 * @todo add a11y code
 */

/**
 * Class Yoast_Alerts
 */
class Yoast_Alerts {

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
	 * Add hooks
	 */
	private function add_hooks() {
		$page = filter_input( INPUT_GET, 'page' );
		if ( 'wpseo_alerts' === $page ) {
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		}

		// Needed for adminbar and Alerts page.
		add_action( 'admin_init', array( __CLASS__, 'collect_alerts' ), 99 );

		// Add AJAX hooks.
		add_action( 'wp_ajax_yoast_dismiss_alert', array( $this, 'ajax_dismiss_alert' ) );
		add_action( 'wp_ajax_yoast_restore_alert', array( $this, 'ajax_restore_alert' ) );
	}

	/**
	 * Enqueue assets
	 */
	public function enqueue_assets() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_style( 'alerts' );
	}

	/**
	 * Handle ajax request to dismiss an alert
	 */
	public function ajax_dismiss_alert() {

		$notification = $this->get_notification_from_ajax_request();
		if ( $notification ) {
			$notification_center = Yoast_Notification_Center::get();
			$notification_center->maybe_dismiss_notification( $notification );

			$this->output_ajax_response( $notification->get_type() );
		}
		die();
	}

	/**
	 * Handle ajax request to restore an alert
	 */
	public function ajax_restore_alert() {

		$notification = $this->get_notification_from_ajax_request();
		if ( $notification ) {
			delete_user_meta( get_current_user_id(), $notification->get_dismissal_key() );

			$this->output_ajax_response( $notification->get_type() );
		}

		die();
	}

	/**
	 * Create AJAX response data
	 *
	 * @param string $type Alert type.
	 */
	private function output_ajax_response( $type ) {
		$html = $this->get_view_html( $type );
		echo json_encode(
			array(
				'html'  => $html,
				'total' => count( self::$active_errors ) + count( self::$active_warnings ),
			)
		);
	}

	/**
	 * Get the HTML to return in the AJAX request
	 *
	 * @param string $type Alert type.
	 *
	 * @return bool|string
	 */
	private function get_view_html( $type ) {

		switch ( $type ) {
			case 'error':
			case 'warning':
				$view = $type . 's';
				break;
			default:
				return false;
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
	 * Extract the Yoast Notification from the AJAX request
	 *
	 * @return null|Yoast_Notification
	 */
	private function get_notification_from_ajax_request() {

		$notification_center = Yoast_Notification_Center::get();
		$notification_id     = filter_input( INPUT_POST, 'notification' );

		return $notification_center->get_notification_by_id( $notification_id );
	}

	/**
	 * Show the alerts overview page
	 */
	public static function show_overview_page() {
		/** @noinspection PhpUnusedLocalVariableInspection */
		$alerts_data = self::get_template_variables();

		include WPSEO_PATH . 'admin/views/alerts-dashboard.php';
	}

	/**
	 * Collect the alerts
	 */
	public static function collect_alerts() {
		$notification_center = Yoast_Notification_Center::get();

		$notifications            = $notification_center->get_notifications();
		self::$notification_count = count( $notifications );

		self::$errors   = array_filter( $notifications, array( __CLASS__, 'filter_error_alerts' ) );
		self::$warnings = array_filter( $notifications, array( __CLASS__, 'filter_warning_alerts' ) );

		self::$dismissed_errors = array_filter( self::$errors, array( __CLASS__, 'filter_dismissed_alerts' ) );
		self::$active_errors    = array_diff( self::$errors, self::$dismissed_errors );

		self::$dismissed_warnings = array_filter( self::$warnings, array( __CLASS__, 'filter_dismissed_alerts' ) );
		self::$active_warnings    = array_diff( self::$warnings, self::$dismissed_warnings );
	}

	/**
	 * Get the variables needed in the views
	 *
	 * @return array
	 */
	public static function get_template_variables() {
		return array(
			'metrics'  => array(
				'total'    => self::$notification_count,
				'active'   => count( self::$active_errors ) + count( self::$active_warnings ),
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
	 * Filter out any non-errors
	 *
	 * @param Yoast_Notification $notification Notification to test.
	 *
	 * @return bool
	 */
	private static function filter_error_alerts( Yoast_Notification $notification ) {
		return $notification->get_type() === 'error';
	}

	/**
	 * Filter out any non-warnings
	 *
	 * @param Yoast_Notification $notification Notification to test.
	 *
	 * @return bool
	 */
	private static function filter_warning_alerts( Yoast_Notification $notification ) {
		return $notification->get_type() !== 'error';
	}

	/**
	 * Filter out any dismissed notifications
	 *
	 * @param Yoast_Notification $notification Notification to test.
	 *
	 * @return bool
	 */
	private static function filter_dismissed_alerts( Yoast_Notification $notification ) {
		return Yoast_Notification_Center::is_notification_dismissed( $notification );
	}
}

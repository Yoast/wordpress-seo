<?php
/**
 * @package WPSEO\Admin\Notifications
 */

class Yoast_Alerts {

	/** @var self Singleton instance */
	private static $instance;

	/** @var int Total notifications count */
	private $notification_count = 0;
	
	/** @var array All error notifications */
	private $errors = array();
	/** @var array Active errors */
	private $active_errors = array();
	/** @var array Dismissed errors */
	private $dismissed_errors = array();

	/** @var array All warning notifications */
	private $warnings = array();
	/** @var array Active warnings */
	private $active_warnings = array();
	/** @var array Dismissed warnings */
	private $dismissed_warnings = array();

	/**
	 * Yoast_Alerts constructor.
	 */
	private function __construct() {
		$this->add_hooks();
	}

	/**
	 * Get singleton
	 *
	 * @return Yoast_Alerts
	 */
	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Add hooks
	 */
	private function add_hooks() {
		$page = filter_input( INPUT_GET, 'page' );
		if ( 'wpseo_alerts' === $page ) {
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		}

		add_action( 'admin_init', array( $this, 'collect_alerts' ), 99 );

		// Add AJAX hooks
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

			$this->ajax_response( $notification->get_type() );
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

			$this->ajax_response( $notification->get_type() );
		}

		die();
	}

	/**
	 * Create AJAX response data
	 *
	 * @param string $type Alert type.
	 */
	private function ajax_response( $type ) {
		$html = $this->get_view_html( $type );
		echo json_encode( array( 'html' => $html, 'total' => count( $this->active_errors ) + count( $this->active_warnings ) ) );
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
		$this->collect_alerts();

		/** @noinspection PhpUnusedLocalVariableInspection */
		$alerts_data = $this->get_template_variables();
		
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

		$notification_id = filter_input( INPUT_POST, 'notification' );
		return $notification_center->get_notification_by_id( $notification_id );
	}

	/**
	 * Collect the alerts
	 */
	public function collect_alerts() {
		$notification_center = Yoast_Notification_Center::get();

		$notifications = $notification_center->get_sorted_notifications( true );
		$this->notification_count = count($notifications);

		$this->errors   = array_filter( $notifications, array( $this, 'filter_error_alerts' ) );
		$this->warnings = array_filter( $notifications, array( $this, 'filter_warning_alerts' ) );

		$this->dismissed_errors     = array_filter( $this->errors, array( $this, 'filter_dismissed_alerts' ) );
		$this->active_errors = array_diff( $this->errors, $this->dismissed_errors );

		$this->dismissed_warnings     = array_filter( $this->warnings, array( $this, 'filter_dismissed_alerts' ) );
		$this->active_warnings = array_diff( $this->warnings, $this->dismissed_warnings );
	}

	/**
	 * Get the variables needed in the views
	 *
	 * @return array
	 */
	public function get_template_variables() {
		return array(
			'metrics' => array(
				'total' => $this->notification_count,
				'active' => count( $this->active_errors ) + count( $this->active_warnings ),
				'errors' => count( $this->errors ),
				'warnings' => count( $this->warnings ),
			),
			'errors' => array(
				'dismissed' => $this->dismissed_errors,
				'active' => $this->active_errors,
			),
			'warnings' => array(
				'dismissed' => $this->dismissed_warnings,
				'active' => $this->active_warnings,
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
	private function filter_error_alerts( Yoast_Notification $notification ) {
		return $notification->get_type() === 'error';
	}

	/**
	 * Filter out any non-warnings
	 *
	 * @param Yoast_Notification $notification Notification to test.
	 *
	 * @return bool
	 */
	private function filter_warning_alerts( Yoast_Notification $notification ) {
		return $notification->get_type() !== 'error';
	}

	/**
	 * Filter out any dismissed notifications
	 *
	 * @param Yoast_Notification $notification Notification to test.
	 *
	 * @return bool
	 */
	private function filter_dismissed_alerts( Yoast_Notification $notification ) {
		return Yoast_Notification_Center::is_notification_dismissed( $notification );
	}
}

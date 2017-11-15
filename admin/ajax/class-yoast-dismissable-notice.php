<?php
/**
 * @package WPSEO\admin|ajax
 */

/**
 * This class will catch the request to dismiss the target notice (set by notice_name) and will store the dismiss status as an user meta
 * in the database
 */
class Yoast_Dismissable_Notice_Ajax {

	/**
	 * @var string Notice type toggle value for user notices.
	 */
	const FOR_USER = 'user_meta';

	/**
	 * @var string Notice type toggle value for network notices.
	 */
	const FOR_NETWORK = 'site_option';

	/**
	 * @var string Notice type toggle value for site notices.
	 */
	const FOR_SITE = 'option';


	/**
	 * @var string Name of the notice that will be dismissed.
	 */
	private $notice_name;

	/**
	 * @var string
	 */
	private $notice_type;

	/**
	 * Initialize the hooks for the AJAX request
	 *
	 * @param string $notice_name The name for the hook to catch the notice.
	 * @param string $notice_type The notice type.
	 */
	public function __construct( $notice_name, $notice_type = self::FOR_USER ) {
		$this->notice_name = $notice_name;
		$this->notice_type = $notice_type;

		add_action( 'wp_ajax_wpseo_dismiss_' . $notice_name, array( $this, 'dismiss_notice' ) );
	}

	/**
	 * Handles the dismiss notice request
	 */
	public function dismiss_notice() {
		check_ajax_referer( 'wpseo-dismiss-' . $this->notice_name );

		$this->save_dismissed();

		wp_die( 'true' );
	}

	/**
	 * Storing the dismissed value in the database. The target location is based on the set notification type.
	 */
	private function save_dismissed() {
		if ( $this->notice_type === self::FOR_SITE ) {
			update_option( 'wpseo_dismiss_' . $this->notice_name, 1 );

			return;
		}

		if ( $this->notice_type === self::FOR_NETWORK ) {
			update_site_option( 'wpseo_dismiss_' . $this->notice_name, 1 );

			return;
		}

		update_user_meta( get_current_user_id(), 'wpseo_dismiss_' . $this->notice_name, 1 );
	}
}

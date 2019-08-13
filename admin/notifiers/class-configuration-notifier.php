<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Notifiers
 */

/**
 * Represents the logic for showing the notification.
 */
class WPSEO_Configuration_Notifier implements WPSEO_Listener {

	/**
	 * Option name use to determine whether the notice has been dismissed.
	 *
	 * @var string
	 */
	const META_NAME = 'wpseo-dismiss-configuration-notice';

	/**
	 * Default value.
	 *
	 * @var string
	 */
	const META_VALUE = 'yes';

	/**
	 * Should the notification be shown.
	 *
	 * @var bool
	 */
	protected $show_notification;

	/**
	 * Constructs the object by setting the show notification property based the given options.
	 */
	public function __construct() {
		$this->show_notification = WPSEO_Options::get( 'show_onboarding_notice', false );
	}

	/**
	 * Returns the content of the notification.
	 *
	 * @return string A string with the notification HTML, or empty string when no notification is needed.
	 */
	public function notify() {
		if ( ! $this->show_notification() ) {
			return $this->re_run_notification();
		}

		return $this->first_time_notification();
	}

	/**
	 * Listens to an argument in the request URL. When triggered just set the notification to dismissed.
	 *
	 * @return void
	 */
	public function listen() {
		if ( ! $this->show_notification() || ! $this->dismissal_is_triggered() ) {
			return;
		}

		$this->set_dismissed();
	}

	/**
	 * Checks if the dismissal should be triggered.
	 *
	 * @return bool True when action has been triggered.
	 */
	protected function dismissal_is_triggered() {
		return filter_input( INPUT_GET, 'dismiss_get_started' ) === '1';
	}

	/**
	 * Checks if the current user has dismissed the notification.
	 *
	 * @return bool True when the notification has been dismissed.
	 */
	protected function is_dismissed() {
		return get_user_meta( get_current_user_id(), self::META_NAME, true ) === self::META_VALUE;
	}

	/**
	 * Sets the dismissed state for the current user.
	 *
	 * @return void
	 */
	protected function set_dismissed() {
		update_user_meta( get_current_user_id(), self::META_NAME, self::META_VALUE );
	}

	/**
	 * Checks if the notification should be shown.
	 *
	 * @return bool True when notification should be shown.
	 */
	protected function show_notification() {
		return $this->show_notification && ! $this->is_dismissed();
	}

	/**
	 * Returns the notification to re-run the config wizard.
	 *
	 * @return string The notification.
	 */
	private function re_run_notification() {
		/* translators: %1$s is a checkmark icon. */
		$title = sprintf(
			esc_html__( 'SEO settings configured%1$s', 'wordpress-seo' ),
			'<span class="dashicons dashicons-yes"></span>'
		);

		$content = sprintf(
			/* translators: %1$s expands to Yoast SEO, %2$s is a link start tag to the Onboarding Wizard, %3$s is the link closing tag. */
			esc_html__( 'If you want to double-check your %1$s settings, or change something, you can always %2$sre-open the configuration wizard%3$s.', 'wordpress-seo' ),
			'Yoast SEO',
			'<a href="' . esc_url( admin_url( 'admin.php?page=' . WPSEO_Configuration_Page::PAGE_IDENTIFIER ) ) . '">',
			'</a>'
		);

		return $this->notification( $title, $content );
	}

	/**
	 * Returns the notification to start the config wizard for the first time.
	 *
	 * @return string The notification.
	 */
	private function first_time_notification() {
		$title = __( 'First-time SEO configuration', 'wordpress-seo' );

		$content = sprintf(
			/* translators: %1$s expands to Yoast SEO, %2$s is a link start tag to the Onboarding Wizard, %3$s is the link closing tag. */
			esc_html__( 'Get started quickly with the %1$s %2$sconfiguration wizard%3$s!', 'wordpress-seo' ),
			'Yoast SEO',
			'<a href="' . esc_url( admin_url( 'admin.php?page=' . WPSEO_Configuration_Page::PAGE_IDENTIFIER ) ) . '">',
			'</a>'
		);

		return $this->notification( $title, $content, true );
	}

	/**
	 * Returns a styled notification.
	 *
	 * @param string $title          Title for the notification.
	 * @param string $content        Content for the notification.
	 * @param bool   $show_dismissal Whether to show the dismiss button or not.
	 *
	 * @return string The styled notification.
	 */
	private function notification( $title, $content, $show_dismissal = false ) {
		$notification  = '<div class="yoast-container yoast-container__configuration-wizard">';
		$notification .= sprintf(
			'<img src="%1$s" height="%2$s" width="%3$d" alt="" />',
			esc_url( plugin_dir_url( WPSEO_FILE ) . 'images/new-to-configuration-notice.svg' ),
			60,
			60
		);
		$notification .= '<div class="yoast-container__configuration-wizard--content">';
		$notification .= '<h3>' . $title . '</h3>';

		$notification .= '<p>';
		$notification .= $content;
		$notification .= '</p>';

		$notification .= '</div>';
		if ( $show_dismissal ) {
			$notification .= sprintf(
				'<a href="%1$s" style="" class="button dismiss yoast-container__configuration-wizard--dismiss"><span class="screen-reader-text">%2$s</span><span class="dashicons dashicons-no-alt"></span></a>',
				esc_url( admin_url( 'admin.php?page=wpseo_dashboard&amp;dismiss_get_started=1' ) ),
				esc_html__( 'Dismiss this item.', 'wordpress-seo' )
			);
		}
		$notification .= '</div>';

		return $notification;
	}
}

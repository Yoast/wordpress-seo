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
		$content = sprintf(
		/* translators: %1$s expands to Yoast SEO */
			esc_html__( 'If you want to double-check your %1$s settings, or change something, you can always reopen the configuration wizard.', 'wordpress-seo' ),
			'Yoast SEO'
		);
		$button = sprintf(
			esc_html__( 'Reopen configuration wizard' )
		);
		return $this->notification( __( 'SEO settings configured', 'wordpress-seo' ), $content, $button );
	}

	/**
	 * Returns the notification to start the config wizard for the first time.
	 *
	 * @return string The notification.
	 */
	private function first_time_notification() {
		$content = sprintf(
		/* translators: %1$s expands to Yoast SEO */
			esc_html__( 'Get started quickly with the %1$s configuration wizard!', 'wordpress-seo' ),
			'Yoast SEO'
		);
		$button = sprintf(
			esc_html__( 'Start configuration wizard' )
		);

		return $this->notification( __( 'First-time SEO configuration', 'wordpress-seo' ), $content, $button, true );
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
	private function notification( $title, $content, $button, $show_dismissal = false ) {
		$notification  = '<div class="yoast-paper">';

		$notification .= '<div class="yoast-paper__configuration-wizard">';

		$notification .= '<div class="yoast-paper__configuration-wizard-content">';

		$notification .= sprintf(
			'<h2>%s</h2>',
			esc_html( $title )
		);

		$notification .= '<p>';
		$notification .= $content;
		$notification .= '</p>';

		$notification .= '<a href="' . esc_url( admin_url( 'admin.php?page=' . WPSEO_Configuration_Page::PAGE_IDENTIFIER ) ) . '" class="yoast-button yoast-button--primary">';
		$notification .= $button;
		$notification .= '</a>';

		$notification .= '</div>';

		$notification .= sprintf(
			'<img src="%1$s" alt="" />',
			esc_url( plugin_dir_url( WPSEO_FILE ) . 'images/new-to-configuration-notice.svg' )
		);

		$notification .= '</div>';
		if ( $show_dismissal ) {
			$notification .= sprintf(
				'<a href="%1$s" style="" class="yoast-close">
					<span class="screen-reader-text">
						%2$s
					</span>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" role="img" aria-hidden="true" focusable="false">
						<path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/>
					</svg>
				</a>',
				esc_url( admin_url( 'admin.php?page=wpseo_dashboard&amp;dismiss_get_started=1' ) ),
				esc_html__( 'Dismiss this item.', 'wordpress-seo' )
			);
		}
		$notification .= '</div>';

		return $notification;
	}
}

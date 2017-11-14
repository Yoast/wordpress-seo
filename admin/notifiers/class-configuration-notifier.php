<?php
/**
 * @package WPSEO\Admin\Notifiers
 */

/**
 * Represents the logic for showing the notification.
 */
class WPSEO_Configuration_Notifier implements WPSEO_Listener {

	/**
	 * Returns the content of the notification.
	 *
	 * @return string
	 */
	public function notify() {
		$notification  = '<div class="yoast-container yoast-container__configuration-wizard">';
		$notification .= sprintf(
			'<img src="%1$s" height="%2$s" width="%3$d"  />',
			esc_url( plugin_dir_url( WPSEO_FILE ) . 'images/new-to-configuration-notice.svg' ),
			60,
			60
		);
		$notification .= '<div class="yoast-container__configuration-wizard--content">';
		$notification .= '<h3>' . esc_html__( 'First-time SEO configuration', 'wordpress-seo' ) . '</h3>';
		$notification .= '<p>';
		$notification .= sprintf(
			esc_html__( 'Get started quickly with the %1$s %2$sconfiguration wizard%3$s!', 'wordpress-seo' ),
			'Yoast SEO',
			'<a href="' . esc_url( admin_url( 'admin.php?page=' . WPSEO_Configuration_Page::PAGE_IDENTIFIER ) ) . '">',
			'</a>'
		);
		$notification .= '</p>';
		$notification .= '</div>';
		$notification .= sprintf(
			'<a href="%1$s" style="" class="yoast-container__configuration-wizard--dismiss alignright"><span class="screen-reader-text">%2$s</span><span class="dashicons dashicons-no-alt"></span></a>',
			esc_url(  admin_url( 'admin.php?page=wpseo_dashboard&amp;dismiss_get_started=1' ) ),
			esc_html__( 'Dismiss this item.', 'wordpress-seo' )
		);
		$notification .= '</div>';

		return $notification;
	}

	/**
	 * Listens to an argument in the request URL, when triggered just set the notification to dismissed.
	 *
	 * @return void
	 */
	public function listen() {
		if ( ! $this->is_triggered()  ) {
			return;
		}

		WPSEO_Configuration_Notification::set_dismissed( get_current_user_id() );
	}

	/**
	 * Checks if the request url contains the required argument.
	 *
	 * @return bool True when action has been triggered.
	 */
	protected function is_triggered() {
		return filter_input( INPUT_GET, 'dismiss_get_started' ) !== '1';
	}
}

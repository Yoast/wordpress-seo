<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Class for handling the different types of wizard notifications.
 */
class Wizard_Notification {

	/**
	 * Admin page identifier.
	 *
	 * @var string
	 */
	const PAGE_IDENTIFIER = 'wpseo_configurator';

	/**
	 * Gets the notification message.
	 *
	 * @param string $state Describes the state of the message that should be returned.
	 *
	 * @return string The notification message.
	 */
	public function get_notification_message( $state ) {
		/*
		 * We divide the wizard notification in 3 different categories:
		 * - start: The wizard has not been started and the notification is a call to action to open it.
		 * - continue: The wizard has been opened but has not been finished, the notification is a call to action to open it.
		 * - finish: The wizard has been finished and the notification hints that you can reopen it to change some settings with a call to action.
		 */
		$message = '';

		if ( $state === 'start' ) {
			$message = $this->get_start_notification();
		}
		if ( $state === 'continue' ) {
			$message = $this->get_continue_notification();
		}
		if ( $state === 'finish' ) {
			$message = $this->get_finished_notification();
		}

		return $message;
	}

	/**
	 * Returns the first time notification message.
	 *
	 * @return string The first time notification message.
	 */
	private function get_start_notification() {
		return sprintf(
			/* translators: 1: Expands to Yoast SEO, 2: Link start tag to the configuration wizard, 3: Link closing tag. */
			esc_html__( 'Looks like you haven\'t used our quick-and-easy configuration wizard yet. It\'ll help you set up %1$s with the optimal settings for your site. %2$sStart the configuration wizard now%3$s!', 'wordpress-seo' ),
			'Yoast SEO',
			'<a href="' . esc_url( admin_url( 'admin.php?page=' . self::PAGE_IDENTIFIER ) ) . '">',
			'</a>'
		);
	}

	/**
	 * Returns the continue notification message.
	 *
	 * @return string The continue  notification message.
	 */
	private function get_continue_notification() {
		$message  = esc_html__( 'The configuration wizard helps you to easily configure your site to have the optimal SEO settings.', 'wordpress-seo' );
		$message .= '<br/>';
		$message .= sprintf(
			/* translators: 1: Expands to Yoast SEO, 2: Link start tag to the configuration wizard, 3: Link closing tag. */
			esc_html__( 'We have detected that you have not finished this wizard yet, so we recommend you to %2$sstart the configuration wizard to configure %1$s%3$s.', 'wordpress-seo' ),
			'Yoast SEO',
			'<a href="' . esc_url( admin_url( 'admin.php?page=' . self::PAGE_IDENTIFIER ) ) . '">',
			'</a>'
		);
		return $message;
	}

	/**
	 * Returns the finished notification message.
	 *
	 * @return string The finished notification message.
	 */
	private function get_finished_notification() {
		$message  = esc_html__( 'You have successfully completed the configuration wizard, good job!', 'wordpress-seo' );
		$message .= '<br/>';
		$message .= sprintf(
			/* translators: 1: Expands to Yoast SEO, 2: Link start tag to the configuration wizard, 3: Link closing tag. */
			esc_html__( 'If you want to double-check your %1$s settings, or change something, you can always %2$sreopen the configuration wizard%3$s.', 'wordpress-seo' ),
			'Yoast SEO',
			'<a href="' . esc_url( admin_url( 'admin.php?page=' . WPSEO_Configuration_Page::PAGE_IDENTIFIER ) ) . '">',
			'</a>'
		);
		return $message;
	}
}

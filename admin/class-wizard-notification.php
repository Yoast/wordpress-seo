<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 * @since   14.1
 */

/**
 * Class for handling the different types of wizard notifications
 */
class Wizard_Notification {


	/**
	 * Admin page identifier.
	 *
	 * @var string
	 */
	const PAGE_IDENTIFIER = 'wpseo_configurator';


	/**
	 * Gets the notification string.
	 *
	 * @param string $state Describes the state of the message that should be returned.
	 * @return string
	 */
	public function get_notification_message( $state ) {
		/*
		 * We divide the wizard notification in 3 different categories:
		 * start - The wizard has not been started and the notification is a call to action to open it
		 * continue - The wizard has been opened but has not been finished, the notification is a call to action to open it
		 * finish - The wizard has been finished and the notification hints that you can reopen it to change some settings with a call to action
		 */

		switch ( $state ) {
			case 'start':
				$message  = __( 'Get started quickly with the configuration wizard!', 'wordpress-seo' );
				$message .= '<br/>';
				$message .= sprintf(
				/* translators: %1$s resolves to Yoast SEO, %2$s resolves to the starting tag of the link to the wizard, %3$s resolves to the closing link tag */
					__( 'We have detected that you have not started this wizard yet, so we recommend you to %2$sstart the configuration wizard to configure %1$s%3$s.', 'wordpress-seo' ),
					'Yoast SEO',
					'<a href="' . admin_url( '?page=' . self::PAGE_IDENTIFIER ) . '">',
					'</a>'
				);
				return $message;
			case 'continue':
				$message  = __( 'The configuration wizard helps you to easily configure your site to have the optimal SEO settings.', 'wordpress-seo' );
				$message .= '<br/>';
				$message .= sprintf(
				/* translators: %1$s resolves to Yoast SEO, %2$s resolves to the starting tag of the link to the wizard, %3$s resolves to the closing link tag */
					__( 'We have detected that you have not finished this wizard yet, so we recommend you to %2$sstart the configuration wizard to configure %1$s%3$s.', 'wordpress-seo' ),
					'Yoast SEO',
					'<a href="' . admin_url( '?page=' . self::PAGE_IDENTIFIER ) . '">',
					'</a>'
				);
				return $message;
			case 'finish':
				$message  = __( 'You have successfully completed the notification wizard, good job!', 'wordpress-seo' );
				$message .= '<br/>';
				$message .= sprintf(
				/* translators: %1$s expands to Yoast SEO, %2$s is a link start tag to the Onboarding Wizard, %3$s is the link closing tag. */
					esc_html__( 'If you want to double-check your %1$s settings, or change something, you can always %2$sreopen the configuration wizard%3$s.', 'wordpress-seo' ),
					'Yoast SEO',
					'<a href="' . esc_url( admin_url( 'admin.php?page=' . WPSEO_Configuration_Page::PAGE_IDENTIFIER ) ) . '">',
					'</a>'
				);
				return $message;
		}
	}

}

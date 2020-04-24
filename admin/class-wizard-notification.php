<?php


class Wizard_Notification
{

	/**
	 * Admin page identifier.
	 *
	 * @var string
	 */
	const PAGE_IDENTIFIER = 'wpseo_configurator';


	/**
	 * Gets the notification.
	 *
	 * @return Yoast_Notification
	 */
	public function get_notification($state) {

		$message = $this->set_notification($state);

		$notification = new Yoast_Notification(
			$message,
			[
				'type'         => Yoast_Notification::WARNING,
				'id'           => 'wpseo-dismiss-onboarding-notice',
				'capabilities' => 'wpseo_manage_options',
				'priority'     => 0.8,
			]
		);

		return $notification;
	}

	private function set_notification($state)
	{

		switch ($state) {
			case 0:
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
			case 1:
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
			case 2:
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

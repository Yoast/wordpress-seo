<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Links
 */

/**
 * Represents compatibility with php version 5.3.
 */
class WPSEO_Link_Compatibility_Notifier {

	const NOTIFICATION_ID = 'wpseo-links-compatibility';

	/**
	 * Adds the notification to the notification center.
	 */
	public function add_notification() {
		Yoast_Notification_Center::get()->add_notification( $this->get_notification() );
	}

	/**
	 * Removes the notification from the notification center.
	 */
	public function remove_notification() {
		Yoast_Notification_Center::get()->remove_notification( $this->get_notification() );
	}

	/**
	 * Returns the notification when the version is incompatible
	 *
	 * @return Yoast_Notification The notification.
	 */
	protected function get_notification() {
		return new Yoast_Notification(
			sprintf(
				/* translators: %1$s: Yoast SEO. %2$s: Version number of Yoast SEO. %3$s: PHP version %4$s: The current PHP versione. %5$s link to knowledge base article about solving PHP issue. %6$s: is anchor closing. */
				__(
					'The <strong>Text link counter</strong> feature (introduced in %1$s %2$s) is currently disabled. For this feature to work %1$s requires at least PHP version %3$s. We have detected PHP version %4$s on this website.
					Please read the following %5$sknowledge base article%6$s to find out how to resolve this problem.',
					'wordpress-seo'
				),
				'Yoast SEO',
				'5.0',
				'5.3',
				phpversion(),
				'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/16f' ) . '" target="_blank">',
				'</a>'
			),
			array(
				'type'         => Yoast_Notification::WARNING,
				'id'           => self::NOTIFICATION_ID,
				'capabilities' => 'wpseo_manage_options',
				'priority'     => 0.8,
			)
		);
	}
}

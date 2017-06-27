<?php
/**
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the notice when the table is not accessible.
 */
class WPSEO_Link_Table_Accessible_Notifier {

	const NOTIFICATION_ID = 'wpseo-links-table-not-accessible';

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
	 * Returns the notification when the table is not accessible.
	 *
	 * @return Yoast_Notification The notification.
	 */
	protected function get_notification() {
		return new Yoast_Notification(
			sprintf(
				/* translators: %1$s: Yoast SEO. %2$s: Version number of Yoast SEO. %3$s: link to knowledge base article about solving table issue. %4$s: is anchor closing. */
				__(
					'The <strong>Text link counter</strong> feature (introduced in %1$s %2$s) is currently disabled. For this feature to work %1$s needs to create a table in your database. We were unable to create this table automatically.
					Please read the following %3$sknowledge base article%4$s to find out how to resolve this problem.',
					'wordpress-seo'
				),
				'Yoast SEO',
				'5.0',
				'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/15o' ) . '">',
				'</a>'
			),
			array(
				'type'         => Yoast_Notification::WARNING,
				'id'           => self::NOTIFICATION_ID,
				'capabilities' => 'manage_options',
				'priority'     => 0.8,
			)
		);
	}
}

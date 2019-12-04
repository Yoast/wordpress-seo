<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the notice when the table is not accessible.
 */
class WPSEO_Link_Table_Accessible_Notifier {

	/**
	 * Notification id.
	 *
	 * @var string
	 */
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
				/* translators: %1$s: Yoast SEO. %2$s: Version number of Yoast SEO. %3$s: strong opening tag, %4$s: strong closing tag  */
				esc_html__( 'The %3$sText link counter%4$s feature (introduced in %1$s %2$s) is currently disabled.', 'wordpress-seo' ),
				'Yoast SEO',
				'5.0',
				'<strong>',
				'</strong>'
			) . ' ' .
			sprintf(
				/* translators: %1$s: Yoast SEO. */
				esc_html__( 'For this feature to work, %1$s needs to create a table in your database. We were unable to create this table automatically.', 'wordpress-seo' ),
				'Yoast SEO'
			) . '<br><br>' .
			sprintf(
				/* translators: %1$s: link to knowledge base article about solving table issue. %2$s: is anchor closing. */
				esc_html__( 'Please read the following %1$sknowledge base article%2$s to find out how to resolve this problem.', 'wordpress-seo' ),
				'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/15o' ) . '">',
				'</a>'
			),
			[
				'type'         => Yoast_Notification::WARNING,
				'id'           => self::NOTIFICATION_ID,
				'capabilities' => 'wpseo_manage_options',
				'priority'     => 0.8,
			]
		);
	}
}

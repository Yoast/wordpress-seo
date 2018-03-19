<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Repressents the notifier for adding link indexing notification to the dashboard.
 */
class WPSEO_Link_Notifier {

	const NOTIFICATION_ID = 'wpseo-reindex-links';

	/**
	 * Registers all hooks to WordPress
	 */
	public function register_hooks() {
		if ( filter_input( INPUT_GET, 'page' ) === 'wpseo_dashboard' ) {
			add_action( 'admin_init', array( $this, 'cleanup_notification' ) );
		}

		if ( ! wp_next_scheduled( self::NOTIFICATION_ID ) ) {
			wp_schedule_event( time(), 'daily', self::NOTIFICATION_ID );
		}

		add_action( self::NOTIFICATION_ID, array( $this, 'manage_notification' ) );
	}

	/**
	 * Removes the notification when it is set and the amount of unindexed items is lower than the threshold.
	 */
	public function cleanup_notification() {
		if ( ! $this->has_notification() || $this->requires_notification() ) {
			return;
		}

		$this->remove_notification( $this->get_notification() );
	}

	/**
	 * Adds the notification when it isn't set already and the amount of unindexed items is greater than the set.
	 * threshold.
	 */
	public function manage_notification() {
		if ( $this->has_notification() || ! $this->requires_notification() ) {
			return;
		}

		$this->add_notification( $this->get_notification() );
	}

	/**
	 * Checks if the notification has been set already.
	 *
	 * @return bool True when there is a notification.
	 */
	public function has_notification() {
		$notification = Yoast_Notification_Center::get()->get_notification_by_id( self::NOTIFICATION_ID );

		return $notification instanceof Yoast_Notification;
	}

	/**
	 * Adds a notification to the notification center.
	 *
	 * @param Yoast_Notification $notification The notification to add.
	 */
	protected function add_notification( Yoast_Notification $notification ) {
		Yoast_Notification_Center::get()->add_notification( $notification );
	}

	/**
	 * Removes the notification from the notification center.
	 *
	 * @param Yoast_Notification $notification The notification to remove.
	 */
	protected function remove_notification( Yoast_Notification $notification ) {
		Yoast_Notification_Center::get()->remove_notification( $notification );
	}

	/**
	 * Returns an instance of the notification.
	 *
	 * @return Yoast_Notification The notification to show.
	 */
	protected function get_notification() {
		return new Yoast_Notification(
			sprintf(
				/* translators: 1: link to yoast.com post about internal linking suggestion. 2: is anchor closing. 3: button to the recalculation option. 4: closing button */
				__(
					'To make sure all the links in your texts are counted, we need to analyze all your texts.
					All you have to do is press the following button and we\'ll go through all your texts for you.

					%3$sCount links%4$s

					The Text link counter feature provides insights in how many links are found in your text and how many links are referring to your text. This is very helpful when you are improving your %1$sinternal linking%2$s.',
					'wordpress-seo'
				),
				'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/15m' ) . '" target="_blank">',
				'</a>',
				'<button type="button" id="noticeRunLinkIndex" class="button">',
				'</button>'
			),
			array(
				'type'         => Yoast_Notification::WARNING,
				'id'           => self::NOTIFICATION_ID,
				'capabilities' => 'wpseo_manage_options',
				'priority'     => 0.8,
			)
		);
	}

	/**
	 * Checks if the unindexed threshold is exceeded.
	 *
	 * @return bool True when the threshold is exceeded.
	 */
	protected function requires_notification() {
		$post_types = apply_filters( 'wpseo_link_count_post_types', WPSEO_Post_Type::get_accessible_post_types() );
		if ( ! is_array( $post_types ) ) {
			return false;
		}

		return WPSEO_Link_Query::has_unprocessed_posts( $post_types );
	}
}

<?php


class WPSEO_Premium_Orphaned_Content_Notifier implements WPSEO_WordPress_Integration {

	/** @var Yoast_Notification_Center */
	protected $notification_center;

	/**
	 * WPSEO_Premium_Orphaned_Content_Notifier constructor.
	 *
	 * @param Yoast_Notification_Center $notification_center
	 */
	public function __construct( Yoast_Notification_Center $notification_center ) {
		$this->notification_center = $notification_center;
	}

	/**
	 * Registers the hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		if ( filter_input( INPUT_GET, 'page' ) === 'wpseo_dashboard' ) {
			add_action( 'admin_init', array( $this, 'notify' ) );
		}

		// @todo: Schedule a task for checking the notification.

	}

	/**
	 * Handles the notifications for all post types.
	 *
	 * @return void
	 */
	public function notify() {
		// @todo: Set the counts per post type, for further use in 'requires' notification.

		// Loops over the posts types and handle the notification.
		foreach( $this->get_post_types() as $post_type ) {
			$this->notify_post_type( get_post_type_object( $post_type ) );
		}
	}

	/**
	 * Handles the notification for the given post type.
	 *
	 * @param WP_Post_Type $post_type The post type.
	 *
	 * @returns void
	 */
	protected function notify_post_type( WP_Post_Type $post_type ) {
		$notification_id = sprintf( 'wpseo-premium-orphaned-content-%1$s', $post_type->name );
		$message         = $this->get_message( $notification_id, $post_type );

		if ( $this->requires_notification( $post_type ) ) {
			if ( $this->has_notification( $notification_id ) ) {
				return;
			}

			Yoast_Notification_Center::get()->add_notification( $message );

			return;
		}

		Yoast_Notification_Center::get()->remove_notification( $message );
	}

	/**
	 * Checks if the notification is required.
	 *
	 * @return bool True when notification is required
	 */
	protected function requires_notification( WP_Post_Type $post_type ) {

		return true;
	}

	/**
	 * Checks if the notification has been set already.
	 *
	 * @param string $notification_id The id of the notification.
	 *
	 * @return bool True when there is a notification.
	 */
	protected function has_notification( $notification_id ) {
		$notification = $this->notification_center->get_notification_by_id( $notification_id );

		return $notification instanceof Yoast_Notification;
	}

	/**
	 * Returns the notification.
	 *
	 * @param string       $notification_id The id for the notification.
	 * @param WP_Post_Type $post_type       The post type to generate the message for.
	 *
	 * @return Yoast_Notification The notification.
	 */
	protected function get_message( $notification_id, $post_type ) {
		/* translators: %1$1: amount of orphaned pages, %2$s: plural form of post type  */
		$message = sprintf(
			__(
				'Yoast SEO detected %1$i \'orphaned\' %2$s (no inbound and no outbound links). Consider adding links to these posts or removing them entirely.',
				'wordpress-seo-premium'
			),
			 2,
			strtolower( $post_type->labels->name )
		);

		return new Yoast_Notification(
			$message,
			array(
				'type'         => Yoast_Notification::WARNING,
				'id'           => $notification_id,
				'capabilities' => 'wpseo_manage_options',
				'priority'     => 0.8,
			)
		);

	}

	/**
	 * Returns the supported post types.
	 *
	 * @return array
	 */
	protected function get_post_types() {
		return array( 'post', 'page' );
	}

}
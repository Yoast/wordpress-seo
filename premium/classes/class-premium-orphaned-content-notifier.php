<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Represents the notifier when there is orphaned content present for one of the post types.
 */
class WPSEO_Premium_Orphaned_Content_Notifier implements WPSEO_WordPress_Integration {

	/** @var Yoast_Notification_Center */
	protected $notification_center;

	/** @var array */
	protected $post_type_counts = array();

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
		if ( ! wp_next_scheduled( 'wpseo-premium-orphaned-content' ) ) {
			wp_schedule_event( time(), 'daily', 'wpseo-premium-orphaned-content' );
		}

		add_action( 'wpseo-premium-orphaned-content', array( $this, 'notify' ) );

	}

	/**
	 * Handles the notifications for all post types.
	 *
	 * @return void
	 */
	public function notify() {
		$this->set_post_type_counts();

		// Loops over the posts types and handle the notification.
		foreach( $this->get_post_types() as $post_type ) {
			$this->notify_post_type( get_post_type_object( $post_type ) );
		}
	}

	/**
	 * Sets the counts for the supported post types.
	 *
	 * @return void
	 */
	protected function set_post_type_counts() {
		$this->post_type_counts  = WPSEO_Premium_Orphaned_Content_Query::get_post_type_counts();
	}

	/**
	 * Handles the notification for the given post type.
	 *
	 * @param WP_Post_Type $post_type The post type.
	 *
	 * @return void
	 */
	protected function notify_post_type( WP_Post_Type $post_type ) {
		$notification_id = sprintf( 'wpseo-premium-orphaned-content-%1$s', $post_type->name );
		$message         = $this->get_message( $notification_id, $post_type );

		if ( $this->requires_notification( $post_type ) ) {
			Yoast_Notification_Center::get()->add_notification( $message );

			return;
		}

		Yoast_Notification_Center::get()->remove_notification( $message );
	}

	/**
	 * Checks if the notification is required.
	 *
	 * @param WP_Post_Type $post_type The post type.
	 *
	 * @return bool True when notification is required.
	 */
	protected function requires_notification( WP_Post_Type $post_type ) {
		return $this->get_post_type_count( $post_type->name ) > 0;
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
		/* translators: %1$s: Link to the filter page, %2$d: amount of orphaned items, %3$s: plural form of post type, %4$s closing tag.  */
		$message = sprintf(
			__(
				'Yoast SEO detected %1$s%2$d \'orphaned\' %3$s%4$s (no inbound and no outbound links). Consider adding links to these %3$s so search engines can find them.',
				'wordpress-seo-premium'
			),
			 '<a href="' . $this->get_filter_url( $post_type->name ) . '">',
			$this->get_post_type_count( $post_type->name ),
			strtolower( $post_type->labels->name ),
			'</a>'
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
	 * @return array The supported post types.
	 */
	protected function get_post_types() {
		return array( 'post', 'page' );
	}

	/**
	 * Returns the total number of orphaned items for given post type name.
	 *
	 * @param string $post_type_name The name of the post type.
	 *
	 * @return int Total orphaned items.
	 */
	protected function get_post_type_count( $post_type_name ) {
		if ( array_key_exists( $post_type_name, $this->post_type_counts ) ) {
			return (int) $this->post_type_counts[ $post_type_name ];
		}

		return 0;
	}

	/**
	 * Returns the url to the page with the filtered items for given post type.
	 *
	 * @param string $post_type_name The name of the post type.
	 *
	 * @return string The url containing the required filter.
	 */
	protected function get_filter_url( $post_type_name ) {
		$query_args = array(
			'post_type'    => $post_type_name,
			'yoast_filter' => 'orphaned',
		);

		return add_query_arg( $query_args, admin_url( 'edit.php' ) );
	}
}

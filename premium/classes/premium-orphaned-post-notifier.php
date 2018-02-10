<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Classes
 */

/**
 * Represents the notifier when there is orphaned content present for one of the post types.
 */
class WPSEO_Premium_Orphaned_Post_Notifier implements WPSEO_WordPress_Integration {

	/**
	 * @var Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * WPSEO_Premium_Orphaned_Content_Notifier constructor.
	 *
	 * @param array                     $post_types          Unused. The supported post types.
	 * @param Yoast_Notification_Center $notification_center The notification center object.
	 */
	public function __construct( array $post_types, Yoast_Notification_Center $notification_center ) {
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
		// Force re-check if it is not accessible.
		if ( ! WPSEO_Link_Table_Accessible::is_accessible() ) {
			WPSEO_Link_Table_Accessible::cleanup();
		}

		// Force re-check if it is not accessible.
		if ( ! WPSEO_Meta_Table_Accessible::is_accessible() ) {
			WPSEO_Meta_Table_Accessible::cleanup();
		}

		$post_types = $this->get_post_types();
		$post_types = $this->format_post_types( $post_types );

		// Walks over the posts types and handle the notification.
		array_walk( $post_types, array( $this, 'notify_for_post_type' ) );
	}


	/**
	 * Returns the post types to which this filter should be added.
	 *
	 * @return array The post types to which this filter should be added.
	 */
	protected function get_post_types() {
		$orphaned_content_support = new WPSEO_Premium_Orphaned_Content_Support();

		return $orphaned_content_support->get_supported_post_types();
	}

	/**
	 * Formats the array with post types as an array with post type objects.
	 *
	 * It also filters out the null values, because these are unknown post types.
	 *
	 * @param array $post_types Array with post type names.
	 *
	 * @return WP_Post_Type[] The formatted posttypes.
	 */
	protected function format_post_types( array $post_types ) {
		// First convert the array to post type objects.
		$post_type_objects = array_map( 'get_post_type_object', $post_types );

		// The unknown post types will have a value of null, filter these.
		return array_filter( $post_type_objects );
	}

	/**
	 * Handles the notification for the given post type.
	 *
	 * @param WP_Post_Type $post_type The post type.
	 *
	 * @return void
	 */
	protected function notify_for_post_type( WP_Post_Type $post_type ) {
		$notification_id = sprintf( 'wpseo-premium-orphaned-content-%1$s', $post_type->name );
		$message         = $this->get_notification( $notification_id, $post_type );

		$show_notification = WPSEO_Premium_Orphaned_Content_Utils::is_feature_enabled() && ! WPSEO_Premium_Orphaned_Content_Utils::has_unprocessed_content();
		if ( $show_notification && $this->requires_notification( $post_type ) ) {
			Yoast_Notification_Center::get()->add_notification( $message );

			return;
		}

		Yoast_Notification_Center::get()->remove_notification( $message );
	}

	/**
	 * Checks if the notification is required for the passed post type.
	 *
	 * @param WP_Post_Type $post_type The post type.
	 *
	 * @return bool True if a notification is required.
	 */
	protected function requires_notification( WP_Post_Type $post_type ) {
		return $this->get_count_by_post_type( $post_type->name ) > 0;
	}

	/**
	 * Returns the notification for the passed post type.
	 *
	 * @param string       $notification_id The id for the notification.
	 * @param WP_Post_Type $post_type       The post type to generate the message for.
	 *
	 * @return Yoast_Notification The notification.
	 */
	protected function get_notification( $notification_id, $post_type ) {
		$total_orphaned  = $this->get_count_by_post_type( $post_type->name );
		$post_type_value = ( $total_orphaned === 1 ) ? $post_type->labels->singular_name : $post_type->labels->name;

		$message = sprintf(
			/* translators: %1$s: Link to the filter page, %2$d: amount of orphaned items, %3$s: plural/singular form of post type, %4$s closing tag.  */
			_n(
				'We\'ve detected %1$s%2$d \'orphaned\' %3$s%4$s (no inbound links). Consider adding links towards this %3$s.',
				'We\'ve detected %1$s%2$d \'orphaned\' %3$s%4$s (no inbound links). Consider adding links towards these %3$s.',
				$total_orphaned,
				'wordpress-seo-premium'
			),
			'<a href="' . $this->get_filter_url( $post_type->name ) . '">',
			$total_orphaned,
			strtolower( $post_type_value ),
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
	 * Returns the total number of orphaned items for given post type name.
	 *
	 * @param string $post_type_name The name of the post type.
	 *
	 * @return int Total orphaned items.
	 */
	protected function get_count_by_post_type( $post_type_name ) {
		static $post_type_counts;

		if ( ! is_array( $post_type_counts ) ) {
			$post_type_counts = WPSEO_Premium_Orphaned_Post_Query::get_counts( $this->get_post_types() );
		}

		if ( array_key_exists( $post_type_name, $post_type_counts ) ) {
			return (int) $post_type_counts[ $post_type_name ];
		}

		return 0;
	}

	/**
	 * Returns the URL to the page with the filtered items for the given post type.
	 *
	 * @param string $post_type_name The name of the post type.
	 *
	 * @return string The URL containing the required filter.
	 */
	protected function get_filter_url( $post_type_name ) {
		$query_args = array(
			'post_type'    => $post_type_name,
			'yoast_filter' => 'orphaned',
		);

		return add_query_arg( $query_args, admin_url( 'edit.php' ) );
	}
}

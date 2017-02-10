<?php
/**
 * @package WPSEO\Premium
 */

/**
 * Handles adding site wide analysis UI to the WordPress admin.
 */
class WPSEO_Premium_Prominent_Words_Recalculation_Notifier implements WPSEO_WordPress_Integration {

	const NOTIFICATION_ID = 'wpseo-premium-prominent-words-recalculate';

	const UNINDEXED_THRESHOLD = 10;

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
		add_action( 'wp_ajax_wpseo_premium_complete_recalculation', array( $this, 'complete_recalculation' ) );
		add_action( 'update_option_wpseo', array( $this, 'handle_option_change' ), 10, 2 );

		$this->add_notification( $this->get_notification() );
	}

	/**
	 * Removes the notification when it is set and the amount of unindexed items is lower than the threshold.
	 */
	public function cleanup_notification() {
		if ( ! $this->has_notification() ) {
			return;
		}

		if ( $this->is_unindexed_treshold_exceeded() ) {
			return;
		}

		$this->remove_notification( $this->get_notification() );
	}

	/**
	 * Adds the notification when it isn't set already and the amount of unindexed items is greater than the set.
	 * threshold.
	 */
	public function manage_notification() {
		if ( $this->has_notification() ) {
			return;
		}

		if ( ! $this->is_unindexed_treshold_exceeded() ) {
			return;
		}

		$this->add_notification( $this->get_notification() );
	}

	/**
	 * Sets the notice.
	 */
	public function complete_recalculation() {
		check_ajax_referer( 'wpseo_complete_recalculation' );

		$this->cleanup_notification();

		wp_die( true );
	}

	/**
	 * Handles the option change, to make sure the notification will be removed when link suggestions are disabled.
	 *
	 * @param mixed $old_value The old value.
	 * @param mixed $new_value The new value.
	 */
	public function handle_option_change( $old_value, $new_value ) {
		if ( ! empty( $old_value['enable_link_suggestions'] ) && empty( $new_value['enable_link_suggestions'] ) ) {
			$this->remove_notification( $this->get_notification() );
		}
	}

	/**
	 * Adds a notication to the notification center.
	 *
	 * @param Yoast_Notification $notification The notification to add.
	 */
	protected function add_notification( Yoast_Notification $notification ) {
		if ( ! $this->has_enabled_link_suggestions() ) {
			return;
		}

		Yoast_Notification_Center::get()->add_notification( $notification );
	}

	/**
	 * Removes the notification from the notification center..
	 *
	 * @param Yoast_Notification $notification The notification to remove.
	 */
	protected function remove_notification( Yoast_Notification $notification ) {
		Yoast_Notification_Center::get()->remove_notification( $notification );
	}

	/**
	 * Returns an instance of the notification.
	 *
	 * @return Yoast_Notification
	 */
	protected function get_notification() {
		return new Yoast_Notification(
			__(
				'A significant amount of posts and/or pages have not been analyzed for prominent words yet.
				Because of this, these links will not appear in our link suggestions feature.
	
				Run the analysis to analyse the missing items and optimize the link suggestions.',
				'wordpress-seo-premium'
			),
			array(
				'type'         => Yoast_Notification::WARNING,
				'id'           => self::NOTIFICATION_ID,
				'capabilities' => 'manage_options',
				'priority'     => 0.8,
			)
		);
	}

	/**
	 * Checks if the notification has been set already.
	 *
	 * @return bool
	 */
	protected function has_notification() {
		$notification = Yoast_Notification_Center::get()->get_notification_by_id( self::NOTIFICATION_ID );

		return $notification instanceof Yoast_Notification;
	}

	/**
	 * Checks if the unindexed threshold is exceeded.
	 *
	 * @return bool
	 */
	protected function is_unindexed_treshold_exceeded() {
		$post_query  = new WPSEO_Premium_Prominent_Words_Unindexed_Post_Query();
		$total_posts = $post_query->get_query( 'post', array( 'offset' => self::UNINDEXED_THRESHOLD + 1 ) )->found_posts;
		$total_pages = $post_query->get_query( 'page', array( 'offset' => self::UNINDEXED_THRESHOLD + 1 ) )->found_posts;

		return ( $total_posts + $total_pages ) > self::UNINDEXED_THRESHOLD;
	}

	/**
	 * Whether the user has insights enabled or not.
	 *
	 * @return bool
	 */
	protected function has_enabled_link_suggestions() {
		$options = WPSEO_Options::get_option( 'wpseo' );

		return ( isset( $options['enable_metabox_insights'] ) && $options['enable_metabox_insights'] );
	}
}

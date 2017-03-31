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
		add_action( 'update_option_wpseo', array( $this, 'handle_option_change' ), 10, 2 );
	}

	/**
	 * Removes the notification when it is set and the amount of unindexed items is lower than the threshold.
	 */
	public function cleanup_notification() {
		if ( ! $this->has_notification() || $this->requires_notification()  ) {
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
	 * Handles the option change to make sure the notification will be removed when link suggestions are disabled.
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
	 * Checks if the notification has been set already.
	 *
	 * @return bool True when there is a notification.
	 */
	public function has_notification() {
		$notification = Yoast_Notification_Center::get()->get_notification_by_id( self::NOTIFICATION_ID );

		return $notification instanceof Yoast_Notification;
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
					'You need to analyze your posts and/or pages in order to receive the best %1$slink suggestions%2$s.

					%3$sAnalyze the content%4$s to generate the missing link suggestions.',
					'wordpress-seo-premium'
				),
				'<a href="https://yoa.st/notification-internal-link">',
				'</a>',
				'<button type="button" id="noticeRunAnalysis" class="button">',
				'</button>'
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
	 * Checks if the unindexed threshold is exceeded.
	 *
	 * @return bool True when the threshold is exceeded.
	 */
	protected function requires_notification() {
		$post_query  = new WPSEO_Premium_Prominent_Words_Unindexed_Post_Query();

		return $post_query->exceeds_limit( self::UNINDEXED_THRESHOLD );
	}

	/**
	 * Determines whether the user has enabled the links suggestions or not.
	 *
	 * @return bool True when link suggestions are enabled.
	 */
	protected function has_enabled_link_suggestions() {
		$options = WPSEO_Options::get_option( 'wpseo' );

		return ( isset( $options['enable_link_suggestions'] ) && $options['enable_link_suggestions'] );
	}
}

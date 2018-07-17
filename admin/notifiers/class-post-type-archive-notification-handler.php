<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Notifiers
 */

/**
 * Represents the logic for showing the post type archive notification.
 */
class WPSEO_Post_Type_Archive_Notification_Handler implements WPSEO_Listener, WPSEO_Notification_Handler {

	/**
	 * The identifier for the notification.
	 *
	 * @var string
	 */
	protected $notification_identifier = 'post-type-archive-notification';

	/**
	 * Defaults for the title option.
	 *
	 * @var array
	 */
	protected $option_defaults = array();

	/**
	 * Listens to an argument in the request URL and triggers an action.
	 *
	 * @return void
	 */
	public function listen() {
		if ( $this->get_listener_value() !== $this->notification_identifier ) {
			return;
		}

		$this->set_dismissal_state();
		$this->redirect_to_dashboard();
	}

	/**
	 * Adds the notification if applicable, otherwise removes it.
	 *
	 * @param Yoast_Notification_Center $notification_center The notification center object.
	 *
	 * @return void
	 */
	public function handle( Yoast_Notification_Center $notification_center ) {
		if ( ! $this->is_applicable() ) {
			$notification_center->remove_notification_by_id( 'wpseo-' . $this->notification_identifier );

			return;
		}

		$notification = $this->get_notification( $this->get_post_types() );
		$notification_center->add_notification( $notification );
	}

	/**
	 * Retrevies the value where listener is listening for.
	 *
	 * @return string The listener value.
	 *
	 * @coveCoverageIgnore
	 */
	protected function get_listener_value() {
		return filter_input( INPUT_GET, 'yoast_dismiss' );
	}

	/**
	 * Redirects the user back to the dashboard.
	 *
	 * @return void
	 *
	 * @coveCoverageIgnore
	 */
	protected function redirect_to_dashboard() {
		wp_safe_redirect( admin_url( 'admin.php?page=wpseo_dashboard' ) );
		exit;
	}

	/**
	 * Returns the notification.
	 *
	 * @param array $post_types The post types that needs an other check.
	 *
	 * @return Yoast_Notification The notification for the notification center.
	 *
	 * @codeCoverageIgnore
	 */
	protected function get_notification( array $post_types ) {
		$message  = esc_html__(
			'We\'ve recently improved the functionality of the Search Appearance settings. Unfortunately, we\'ve discovered that for some edge-cases, saving the settings for specific post type archives might have gone wrong.',
			'wordpress-seo'
		);
		$message .= PHP_EOL . PHP_EOL;
		$message .= sprintf(
			_n(
				/* translators: %1$s is the archive template link start tag, %2$s is the link closing tag, %3$s is a comma separated string with content types. */
				'Please check the %1$sarchive template%2$s for the following content type: %3$s.',
				' Please check the %1$sarchive templates%2$s for the following content types: %3$s.',
				count( $post_types ),
				'wordpress-seo'
			),
			'<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_titles#top#post-types' ) ) . '">',
			'</a>',
			implode( ', ', $post_types )
		);
		$message .= PHP_EOL . PHP_EOL;
		$message .= sprintf(
		/* translators: %1$s is the notification dismissal link start tag, %2$s is the link closing tag. */
			__( '%1$sRemove this message%2$s', 'wordpress-seo' ),
			'<a class="button" href="' . admin_url( '?page=' . WPSEO_Admin::PAGE_IDENTIFIER . '&yoast_dismiss=' . $this->notification_identifier ) . '">',
			'</a>'
		);

		$notification_options = array(
			'type'         => Yoast_Notification::WARNING,
			'id'           => 'wpseo-' . $this->notification_identifier,
			'priority'     => 1.0,
			'capabilities' => 'wpseo_manage_options',
		);

		return new Yoast_Notification( $message, $notification_options );
	}

	/**
	 * Checks if the noticiation should be shown.
	 *
	 * @return bool True when applicable.
	 */
	protected function is_applicable() {
		if ( $this->is_notice_dismissed() ) {
			return false;
		}

		if ( $this->is_new_install() ) {
			return false;
		}

		return $this->get_post_types() !== array();
	}

	/**
	 * Checks whether the notification has been dismissed.
	 *
	 * @return bool True when notification is dismissed.
	 *
	 * @codeCoverageIgnore
	 */
	protected function is_notice_dismissed() {
		return get_user_meta( get_current_user_id(), 'wpseo-remove-' . $this->notification_identifier, true ) === '1';
	}

	/**
	 * Dismisses the notification.
	 *
	 * @return void
	 *
	 * @codeCoverageIgnore
	 */
	protected function set_dismissal_state() {
		update_user_meta( get_current_user_id(), 'wpseo-remove-' . $this->notification_identifier, true );
	}

	/**
	 * Checks if the first activation is done before the release of 7.9.
	 *
	 * @return bool True whether the install is 'new'.
	 *
	 * @codeCoverageIgnore
	 */
	protected function is_new_install() {
		return WPSEO_Options::get( 'first_activated_on' ) >= strtotime( '2018-07-24' );
	}

	/**
	 * Returns all the post types which might have wrong archive settings.
	 *
	 * @return array The post types.
	 *
	 * @codeCoverageIgnore
	 */
	protected function get_post_types() {
		static $post_types;

		if ( $post_types === null ) {
			$this->option_defaults = WPSEO_Option_Titles::get_instance()->get_defaults();

			$post_types = get_post_types( array( 'public' => true ) );
			$post_types = WPSEO_Post_Type::filter_attachment_post_type( $post_types );
			$post_types = $this->filter_woocommerce_product_type( $post_types );
			$post_types = array_filter( $post_types, array( $this, 'has_custom_archive_slug' ) );
			$post_types = array_filter( $post_types, array( $this, 'has_default_templates_set' ) );
		}

		return $post_types;
	}

	/**
	 * Filters the WooCommerce product, when Woocommerce is active.
	 *
	 * @param array $post_types The post types to filter.
	 *
	 * @return array The filtere post types.
	 *
	 * @codeCoverageIgnore
	 */
	public function filter_woocommerce_product_type( $post_types ) {
		if ( WPSEO_Utils::is_woocommerce_active() ) {
			unset( $post_types['product'] );
		}

		return $post_types;
	}

	/**
	 * Checks if the archive slug for the post type is overridden.
	 *
	 * @param string $post_type_name The post type's name.
	 *
	 * @return bool True whether the archive slug is overridden.
	 *
	 * @codeCoverageIgnore
	 */
	protected function has_custom_archive_slug( $post_type_name ) {
		$post_type = get_post_type_object( $post_type_name );
		if ( $post_type === null || ! WPSEO_Post_Type::has_archive( $post_type ) ) {
			return false;
		}

		// When the archive value is not TRUE it will be a custom archive slug.
		return ( $post_type->has_archive !== true );
	}

	/**
	 * Checks if the default templates are set for given post type.
	 *
	 * @param string $post_type_name The post type name.
	 *
	 * @return bool True whether the default templates are set.
	 *
	 * @codeCoverageIgnore
	 */
	protected function has_default_templates_set( $post_type_name ) {
		$title_option_name    = 'title-ptarchive-' . $post_type_name;
		$metadesc_option_name = 'metadesc-ptarchive-' . $post_type_name;

		return ( $this->is_equal_to_default( $title_option_name ) && $this->is_equal_to_default( $metadesc_option_name ) );
	}

	/**
	 * Checks if value for given option name is equal to the default value.
	 *
	 * @param string $option_name The option name to check.
	 *
	 * @return bool True whethere the option value is equal to the default value.
	 *
	 * @codeCoverageIgnore
	 */
	protected function is_equal_to_default( $option_name ) {
		if ( ! isset( $this->option_defaults[ $option_name ] ) ) {
			return false;
		}

		return ( WPSEO_Options::get( $option_name ) === $this->option_defaults[ $option_name ] );
	}
}

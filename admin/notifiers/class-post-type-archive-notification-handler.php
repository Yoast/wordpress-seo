<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Notifiers
 */

/**
 * Represents the logic for showing the post type archive notification.
 */
class WPSEO_Post_Type_Archive_Notification_Handler extends WPSEO_Dismissible_Notification {

	/**
	 * Defaults for the title option.
	 *
	 * @var array
	 */
	protected $option_defaults = array();

	/**
	 * Sets the notification identifier.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function __construct() {
		$this->notification_identifier = 'post-type-archive-notification';
	}

	/**
	 * Checks if the notice should be shown.
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
	 * Returns the notification.
	 *
	 * @return Yoast_Notification The notification for the notification center.
	 *
	 * @codeCoverageIgnore
	 */
	protected function get_notification() {
		$post_types = $this->get_post_types();

		$message  = esc_html__(
			'We\'ve recently improved the functionality of the Search Appearance settings. Unfortunately, we\'ve discovered that for some edge-cases, saving the settings for specific post type archives might have gone wrong.',
			'wordpress-seo'
		);
		$message .= PHP_EOL . PHP_EOL;
		$message .= sprintf(
			/* translators: %1$s is the archive template link start tag, %2$s is the link closing tag, %3$s is a comma separated string with content types. */
			_n(
				'Please check the %1$sarchive template%2$s for the following content type: %3$s.',
				'Please check the %1$sarchive templates%2$s for the following content types: %3$s.',
				count( $post_types ),
				'wordpress-seo'
			),
			'<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_titles#top#post-types' ) ) . '">',
			'</a>',
			implode( ', ', $post_types )
		);
		$message .= PHP_EOL . PHP_EOL;
		$message .= '<a class="button" href="' . admin_url( '?page=' . WPSEO_Admin::PAGE_IDENTIFIER . '&yoast_dismiss=' . $this->notification_identifier ) . '">' . __( 'Remove this message', 'wordpress-seo' ) . '</a>';

		$notification_options = array(
			'type'         => Yoast_Notification::WARNING,
			'id'           => 'wpseo-' . $this->notification_identifier,
			'priority'     => 1.0,
			'capabilities' => 'wpseo_manage_options',
		);

		return new Yoast_Notification( $message, $notification_options );
	}

	/**
	 * Checks if the first activation is done before the release of 7.9.
	 *
	 * @return bool True when the install is 'new'.
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
	protected function filter_woocommerce_product_type( $post_types ) {
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
	 * @return bool True when the archive slug is overridden.
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
	 * @return bool True when the default templates are set.
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
	 * @return bool True when the option value is equal to the default value.
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

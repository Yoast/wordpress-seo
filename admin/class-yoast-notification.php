<?php
/**
 * @package    WPSEO\Admin\Notifications
 * @since      1.5.3
 */

/**
 * Implements individual notification.
 */
class Yoast_Notification {

	const MATCH_ALL = 'all';
	const MATCH_ANY = 'any';

	const ERROR = 'error';
	const WARNING = 'warning';
	const UPDATED = 'updated';

	/**
	 * Contains optional arguments:
	 *
	 * -             type: The notification type, i.e. 'updated' or 'error'
	 * -               id: The ID of the notification
	 * -            nonce: Security nonce to use in case of dismissible notice.
	 * -         priority: From 0 to 1, determines the order of Notifications.
	 * -    dismissal_key: Option name to save dismissal information in, ID will be used if not supplied.
	 * -     capabilities: Capabilities that a user must have for this Notification to show.
	 * - capability_check: How to check capability pass: all or any.
	 * -  wpseo_page_only: Only display on wpseo page or on every page.
	 *
	 * @var array Options of this Notification.
	 */
	private $options = array();

	/** @var array Contains default values for the optional arguments */
	private $defaults = array(
		'type'             => self::UPDATED,
		'id'               => '',
		'nonce'            => null,
		'priority'         => 0.5,
		'data_json'        => array(),
		'dismissal_key'    => null,
		'capabilities'     => array(),
		'capability_check' => self::MATCH_ALL,
	);

	/**
	 * Notification class constructor.
	 *
	 * @param string $message Message string.
	 * @param array  $options Set of options.
	 */
	public function __construct( $message, $options = array() ) {
		$this->message = $message;
		$this->options = $this->normalize_options( $options );
	}

	/**
	 * Retrieve notification ID string.
	 *
	 * @return string
	 */
	public function get_id() {
		return $this->options['id'];
	}

	/**
	 * Retrieve nonce identifier.
	 *
	 * @return null|string Nonce for this Notification.
	 */
	public function get_nonce() {
		if ( $this->options['id'] && empty( $this->options['nonce'] ) ) {
			$this->options['nonce'] = wp_create_nonce( $this->options['id'] );
		}

		return $this->options['nonce'];
	}

	/**
	 * Make sure the nonce is up to date
	 */
	public function refresh_nonce() {
		if ( $this->options['id'] ) {
			$this->options['nonce'] = wp_create_nonce( $this->options['id'] );
		}
	}

	/**
	 * Get the type of the notification
	 *
	 * @return string
	 */
	public function get_type() {
		return $this->options['type'];
	}

	/**
	 * Priority of the notification
	 *
	 * Relative to the type.
	 *
	 * @return float Returns the priority between 0 and 1.
	 */
	public function get_priority() {
		return $this->options['priority'];
	}

	/**
	 * Get the User Meta key to check for dismissal of notification
	 *
	 * @return string User Meta Option key that registers dismissal.
	 */
	public function get_dismissal_key() {
		if ( empty( $this->options['dismissal_key'] ) ) {
			return $this->options['id'];
		}

		return $this->options['dismissal_key'];
	}

	/**
	 * Is this Notification persistent
	 *
	 * @return bool True if persistent, False if fire and forget.
	 */
	public function is_persistent() {
		$id = $this->get_id();

		return ! empty( $id );
	}

	/**
	 * Check if the notification is relevant for the current user
	 *
	 * @return bool True if a user needs to see this Notification, False if not.
	 */
	public function display_for_current_user() {
		// If the notification is for the current page only, always show.
		if ( ! $this->is_persistent() ) {
			return true;
		}

		// If the current user doesn't match capabilities.
		return $this->match_capabilities();
	}

	/**
	 * Does the current user match required capabilities
	 *
	 * @return bool
	 */
	public function match_capabilities() {
		// Super Admin can do anything.
		if ( is_multisite() && is_super_admin() ) {
			return true;
		}

		/**
		 * Filter capabilities that enable the displaying of this notification.
		 *
		 * @since 3.2
		 *
		 * @param array              $capabilities The capabilities that must be present for this Notification.
		 * @param Yoast_Notification $notification The notification object.
		 *
		 * @return array of capabilities or empty for no restrictions.
		 */
		$capabilities = apply_filters( 'wpseo_notification_capabilities', $this->options['capabilities'], $this );

		// Should be an array.
		if ( ! is_array( $capabilities ) ) {
			$capabilities = array();
		}

		/**
		 * Filter capability check to enable all or any capabilities.
		 *
		 * @since 3.2
		 *
		 * @param string             $capability_check The type of check that will be used to determine if an capability is present.
		 * @param Yoast_Notification $notification     The notification object.
		 *
		 * @return string self::MATCH_ALL or self::MATCH_ANY.
		 */
		$capability_check = apply_filters( 'wpseo_notification_capability_check', $this->options['capability_check'], $this );

		if ( ! in_array( $capability_check, array( self::MATCH_ALL, self::MATCH_ANY ), true ) ) {
			$capability_check = self::MATCH_ALL;
		}

		if ( ! empty( $capabilities ) ) {

			$has_capabilities = array_filter( $capabilities, array( $this, 'has_capability' ) );

			switch ( $capability_check ) {
				case self::MATCH_ALL:
					return $has_capabilities === $capabilities;
				case self::MATCH_ANY:
					return ! empty( $has_capabilities );
			}
		}

		return true;
	}

	/**
	 * Array filter function to find matched capabilities
	 *
	 * @param string $capability Capability to test.
	 *
	 * @return bool
	 */
	private function has_capability( $capability ) {
		return current_user_can( $capability );
	}

	/**
	 * Return the object properties as an array
	 *
	 * @return array
	 */
	public function to_array() {
		return array(
			'message' => $this->message,
			'options' => $this->options,
		);
	}

	/**
	 * Adds string (view) behaviour to the Notification
	 *
	 * @return string
	 */
	public function __toString() {
		$attributes = array();

		// Default notification classes.
		$classes = array(
			'yoast-alert',
		);

		// Maintain WordPress visualisation of alerts when they are not persistent.
		if ( ! $this->is_persistent() ) {
			$classes[] = 'notice';
			$classes[] = $this->get_type();
		}

		if ( ! empty( $classes ) ) {
			$attributes['class'] = implode( ' ', $classes );
		}

		// Combined attribute key and value into a string.
		array_walk( $attributes, array( $this, 'parse_attributes' ) );

		// Build the output DIV.
		return '<div ' . implode( ' ', $attributes ) . '>' . wpautop( $this->message ) . '</div>' . PHP_EOL;
	}

	/**
	 * Get the JSON if provided
	 *
	 * @return false|string
	 */
	public function get_json() {
		if ( empty( $this->options['data_json'] ) ) {
			return '';
		}

		return wp_json_encode( $this->options['data_json'] );
	}

	/**
	 * Make sure we only have values that we can work with
	 *
	 * @param array $options Options to normalize.
	 *
	 * @return array
	 */
	private function normalize_options( $options ) {
		$options = wp_parse_args( $options, $this->defaults );

		// Should not exceed 0 or 1.
		$options['priority'] = min( 1, max( 0, $options['priority'] ) );

		return $options;
	}

	/**
	 * Format HTML element attributes
	 *
	 * @param string $value Attribute value.
	 * @param string $key   Attribute name.
	 */
	private function parse_attributes( & $value, $key ) {
		$value = sprintf( '%s="%s"', $key, esc_attr( $value ) );
	}
}

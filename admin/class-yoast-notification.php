<?php
/**
 * @package    WPSEO\Admin\Notifications
 * @since      1.5.3
 */

/**
 * Implements individual notification.
 */
class Yoast_Notification {
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
		'type'             => 'updated',
		'id'               => '',
		'nonce'            => null,
		'priority'         => 0.5,
		'data_json'        => array(),
		'dismissal_key'    => null,
		'capabilities'     => array(),
		'capability_check' => 'all',
		'wpseo_page_only'  => false,
	);

	/**
	 * Notification class constructor.
	 *
	 * @param string $message Message string.
	 * @param array  $options Set of options.
	 */
	public function __construct( $message, $options = array() ) {
		$this->message = $message;
		$this->options = wp_parse_args( $options, $this->defaults );

		$this->verify_options();
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
	 * Relative to the type
	 *
	 * @return float 0-1
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

		// If we are not on a WPSEO page and this is required.
		if ( true === $this->options['wpseo_page_only'] && ! WPSEO_Utils::is_yoast_seo_page() ) {
			return false;
		}

		// If the current user doesn't match capabilities.
		if ( ! $this->match_capabilities() ) {
			return false;
		}

		return true;
	}

	/**
	 * Does the current user match required capabilities
	 *
	 * @return bool
	 */
	public function match_capabilities() {
		if ( is_multisite() ) {
			return WPSEO_Utils::grant_access();
		}

		if ( ! empty( $this->options['capabilities'] ) ) {

			// Type of check: all or one is enough.
			$any_or_all = $this->options['capability_check'];

			foreach ( $this->options['capabilities'] as $capability ) {
				$user_can = current_user_can( $capability );
				if ( 'all' === $any_or_all ) {
					if ( ! $user_can ) {
						return false;
					}
				}

				if ( 'any' === $any_or_all ) {
					if ( $user_can ) {
						return true;
					}
				}
			}
		}

		return true;
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
			'yoast-notice',
			'notice',
		);

		if ( ! empty( $this->options['type'] ) ) {
			$classes[] = $this->options['type'];
		}

		if ( $this->is_persistent() ) {
			$attributes['id'] = $this->options['id'];

			$classes[] = 'yoast-dismissible';
			$classes[] = 'is-dismissible';
		}

		if ( ! empty( $classes ) ) {
			$attributes['class'] = implode( ' ', $classes );
		}

		$nonce = $this->get_nonce();
		if ( ! empty( $nonce ) ) {
			$attributes['data-nonce'] = $nonce;
		}

		if ( ! empty( $this->options['data_json'] ) ) {
			$attributes['data-json'] = WPSEO_Utils::json_encode( $this->options['data_json'] );
		}

		// Combined attribute key and value into a string.
		array_walk( $attributes, array( $this, 'parse_attributes' ) );

		// Build the output DIV.
		return '<div ' . implode( ' ', $attributes ) . '>' . wpautop( $this->message ) . '</div>' . PHP_EOL;
	}

	/**
	 * Make sure we only have values that we can work with
	 */
	private function verify_options() {
		/**
		 * Filter capabilities that enable the displaying of this notification.
		 *
		 * @since 3.2
		 *
		 * @param array              $capabilities The capabilities that must be present for this Notification.
		 * @param string             $id           The ID of the notification.
		 * @param Yoast_Notification $notification The notification object.
		 *
		 * @return array of capabilities or empty for no restrictions.
		 */
		$this->options['capabilities'] = apply_filters( 'wpseo_notification_capabilities', $this->options['capabilities'], $this->options['id'], $this );
		if ( is_string( $this->options['capabilities'] ) ) {
			$this->options['capabilities'] = array( $this->options['capabilities'] );
		}

		// Should be an array.
		if ( ! is_array( $this->options['capabilities'] ) ) {
			$this->options['capabilities'] = array();
		}

		/**
		 * Filter capability check to enable 'all' or 'any' capabilities.
		 *
		 * @since 3.2
		 *
		 * @param string             $capability_check The type of check that will be used to determine if an capability is present.
		 * @param string             $id               The ID of the notification.
		 * @param Yoast_Notification $notification     The notification object.
		 *
		 * @return string 'all' or 'any'.
		 */
		$this->options['capability_check'] = apply_filters( 'wpseo_notification_capability_check', $this->options['capability_check'], $this->options['id'], $this );
		if ( ! in_array( $this->options['capability_check'], array( 'all', 'any' ) ) ) {
			$this->options['capability_check'] = 'all';
		}

		// Should not exceed 0 or 1.
		$this->options['priority'] = min( 1, max( 0, $this->options['priority'] ) );
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

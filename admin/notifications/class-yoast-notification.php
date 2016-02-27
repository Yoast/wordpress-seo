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
	 * -  type: The notification type, i.e. 'updated' or 'error'
	 * -    id: The ID of the notification
	 * - nonce: Security nonce to use in case of dismissible notice.
	 *
	 * @var array
	 */
	private $options;

	/**
	 * Contains default values for the optional arguments
	 *
	 * @var array
	 */
	private $defaults = array(
		'type'            => 'updated',
		'id'              => '',
		'nonce'           => null,
		'data_json'       => array(),
		'dismissal_key'   => null,
		'capabilities'    => array(),
		'wpseo_page_only' => false,
	);

	/**
	 * Notification class constructor.
	 *
	 * @param string $message Message string.
	 * @param array  $options Set of options.
	 */
	public function __construct( $message, $options = array() ) {
		$this->options = wp_parse_args( $options, $this->defaults );
		$this->message = $message;
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
			foreach ( $this->options['capabilities'] as $capability ) {
				$user_can = current_user_can( $capability );
				if ( ! $user_can ) {
					return false;
				}
			}
		}

		return true;
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

		$classes = array(
			'yoast-notice',
			'notice',
		);

		if ( ! empty( $this->options['type'] ) ) {
			$classes[] = $this->options['type'];
		}

		if ( $this->options['id'] ) {
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

		array_walk( $attributes, array( $this, 'parse_attributes' ) );

		return '<div ' . implode( ' ', $attributes ) . '>' . wpautop( $this->message ) . '</div>' . PHP_EOL;
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

<?php
/**
 * @package    WPSEO\Admin
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
		'type'      => 'updated',
		'id'        => '',
		'nonce'     => null,
		'data_json' => array(),
	);

	/**
	 * Notification class constructor.
	 *
	 * @param string $message Message string.
	 * @param array  $options Set of options.
	 */
	public function __construct( $message, $options = array() ) {
		$this->options         = wp_parse_args( $options, $this->defaults );
		$this->message         = $message;
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
		return '<div class="yoast-notice notice is-dismissible ' . esc_attr( $this->options['type'] ) . '" id="' . esc_attr( $this->options['id'] ) . '"' . $this->parse_data_attributes() . '>' . wpautop( $this->message ) . '</div>' . PHP_EOL;
	}

	/**
	 * Parsing the data attributes
	 *
	 * @return string
	 */
	private function parse_data_attributes() {
		return $this->parse_nonce_attribute() . '' . $this->parse_data_json_attribute();
	}

	/**
	 * Returns a data attribute containing the nonce if present
	 *
	 * @return string
	 */
	private function parse_nonce_attribute() {
		return ( ! empty( $this->options['nonce'] ) ? ' data-nonce="' . $this->options['nonce'] . '"' : '' );
	}

	/**
	 * Make it possible to pass some JSON data
	 *
	 * @return string
	 */
	private function parse_data_json_attribute() {
		if ( empty( $this->options['data_json'] ) ) {
			return '';
		}

		return " data-json='" . WPSEO_Utils::json_encode( $this->options['data_json'] ) . "'";
	}

}

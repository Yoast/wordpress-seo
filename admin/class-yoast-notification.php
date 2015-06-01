<?php
/**
 * @package WPSEO\Admin
 * @since      1.5.3
 */

/**
 * Implements individual notification.
 */
class Yoast_Notification {

	/**
	 * @var string The notification message
	 */
	private $message;

	/**
	 * @var string The notification type, i.e. 'updated' or 'error'
	 */
	private $type;

	/**
	 * @var string Security nonce to use in case of dismissible notice.
	 */
	private $nonce;

	/**
	 * The Constructor
	 *
	 * @param String $message
	 * @param String $type
	 * @param String $nonce
	 */
	public function __construct( $message, $type = 'updated', $nonce = null ) {
		$this->message = $message;
		$this->type    = $type;
		$this->nonce   = $nonce;
	}

	/**
	 * @return String
	 */
	public function get_message() {
		return $this->message;
	}

	/**
	 * @param String $message
	 */
	public function set_message( $message ) {
		$this->message = $message;
	}

	/**
	 * @return String
	 */
	public function get_type() {
		return $this->type;
	}

	/**
	 * @return null|string
	 */
	public function get_nonce() {
		return $this->nonce;
	}

	/**
	 * @param String $type
	 */
	public function set_type( $type ) {
		$this->type = $type;
	}

	/**
	 * Return the object properties as an array
	 *
	 * @return array
	 */
	public function to_array() {
		return array(
			'message' => $this->get_message(),
			'type'    => $this->get_type(),
		);
	}

	/**
	 * Output the message
	 */
	public function output() {
		$nonce = $this->get_nonce();
		$nonce_attribute = ! empty( $nonce ) ? ' data-nonce="' . $this->get_nonce() . '"' : '';
		echo '<div class="yoast-notice ', esc_attr( $this->get_type() ), '"', $nonce_attribute , '>', wpautop( $this->get_message() ), '</div>', PHP_EOL;
	}
}

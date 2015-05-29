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
	 * @var string The notification message
	 */
	private $message;

	/**
	 * @var string The notification type, i.e. 'updated' or 'error'
	 */
	private $type;

	/**
	 * @var string The ID of the notification
	 */
	private $id;

	/**
	 * The Constructor
	 *
	 * @param string $message
	 * @param string $type
	 * @param string $id
	 */
	public function __construct( $message, $type = 'updated', $id = '' ) {
		$this->message = $message;
		$this->type    = $type;
		$this->id      = $id;
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
	 * @return string $id
	 */
	public function get_id() {
		return $this->id;
	}

	/**
	 * @return String
	 */
	public function get_type() {
		return $this->type;
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
			'id'      => $this->get_id(),
		);
	}

	/**
	 * Output the message
	 */
	public function output() {
		echo '<div class="yoast-notice notice is-dismissible ', esc_attr( $this->get_type() ), '" id="', esc_attr( $this->get_id() ), '">', wpautop( $this->get_message() ), '</div>', PHP_EOL;
	}

}
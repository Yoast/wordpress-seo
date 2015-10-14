<?php
/**
 * @package WPSEO\Admin
 */

/**
 * This class is the presenter for the email. Based on the given parameters and data it will parse the email message
 * that will be send
 */
class WPSEO_OnPage_Email_Presenter {

	/**
	 * @var string The generated messsage.
	 */
	private $message;

	/**
	 * @var array The old and the new status as an array.
	 */
	private $statuses;

	/**
	 * @var array The translated values for the indexability statuses.
	 */
	private $status_values;

	/**
	 * Constructing the object
	 *
	 * @param array $statuses Array with the statusses, normally it are the old and the new status.
	 */
	public function __construct( array $statuses ) {
		$this->status_values = $this->get_status_values();
		$this->statuses      = $statuses;
		$this->message       = $this->generate_message();

	}

	public function get_message() {
		return $this->message;
	}

	/**
	 * Mapping the statusses to translated values
	 */
	private function get_status_values() {
		return array(
			'0' =>__( 'not indexable', 'wordpress-seo' ),
			'1' => __( 'indexable', 'wordpress-seo' ),
		);
	}

	/**
	 * Generates the body message for the email.
	 *
	 * @return string
	 */
	private function generate_message() {
		if ( $this->statuses['old_status'] !== null ) {
			return $this->get_change_message();
		}

		return $this->get_new_message();
	}

	/**
	 * In case of the status has been changed
	 *
	 * @return string
	 */
	private function get_change_message() {
		return sprintf(
			__( 'The indexability from your website %1$s, went from %2$s to %3$s.' ),
			home_url(),
			$this->status_values[ $this->statuses['old_status'] ],
			$this->status_values[ $this->statuses['new_status'] ]
		);
	}

	/**
	 * The status is fetched for the first time
	 *
	 * @return string
	 */
	private function get_new_message() {
		return sprintf(
			__( 'The indexability from your website %1$s is %2$s at the moment.' ),
			home_url(),
			$this->status_values[ $this->statuses['new_status'] ]
		);

	}

}

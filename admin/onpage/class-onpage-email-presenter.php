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
	 * @param array $statuses Array with the statuses, normally it contains the old and the new status.
	 */
	public function __construct( array $statuses ) {
		$this->status_values = $this->get_status_values();
		$this->statuses      = $statuses;
	}

	public function get_subject() {
		if ( $this->statuses['old_status'] !== null ) {
			return $this->get_change_subject();
		}

		return $this->get_new_subject();
	}

	/**
	 * Generates and returns the body message for the email.
	 *
	 * @return string
	 */
	public function get_message() {
		if ( $this->statuses['old_status'] !== null ) {
			return $this->get_change_message();
		}

		return $this->get_new_message();
	}

	/**
	 * Mapping the statuses to translated values
	 */
	private function get_status_values() {
		return array(
			'0' => __( 'not indexable', 'wordpress-seo' ),
			'1' => __( 'indexable', 'wordpress-seo' ),
		);
	}

	/**
	 * In case the status has been changed
	 *
	 * @return string
	 */
	private function get_change_message() {
		return sprintf(
			__( 'The indexability of %1$s, went from %2$s to %3$s.' ),
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
			__( 'We\'ve collaborated with our friends from Onpage.Org to do a weekly check of The indexability of %1$s is %2$s.', 'wordpress-seo' ),
			home_url(),
			$this->status_values[ $this->statuses['new_status'] ]
		);

	}

	/**
	 * In case the status has been changed
	 *
	 * @return string
	 */
	private function get_change_subject() {
		return sprintf(
			sprintf( __( 'Yoast SEO alert: the indexability of %1$s has changed.', 'wordpress-seo' ), home_url() ),
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
	private function get_new_subject() {
		return sprintf(
			sprintf( __( 'Yoast SEO alert: %1$s is %2$s.', 'wordpress-seo' ), home_url() ),
			home_url(),
			$this->status_values[ $this->statuses['new_status'] ]
		);

	}

}

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

	/**
	 * Generates and returns the subject of the email.
	 *
	 * @return string
	 */
	public function get_subject() {
		if ( $this->statuses['old_status'] !== null ) {
			return $this->get_change_subject();
		}

		return $this->get_new_subject();
	}

	/**
	 * Generates and returns the message body of the email.
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
	 * In case the status has been changed
	 *
	 * @return string
	 */
	private function get_change_message() {
		$subjects = array(
			'0' => sprintf(
				__( 'Yoast SEO has detected that %1$s is no longer indexable. Please note that this will make it impossible for search engines like Google and Bing to index your site.', 'wordpress-seo' ),
				home_url()
			),
			'1' => sprintf(
				__( 'Yoast SEO has detected that %1$s is indexable again.', 'wordpress-seo' ),
				home_url()
			),
		);

		return $subjects[ $this->statuses['new_status'] ];
	}

	/**
	 * The status is fetched for the first time
	 *
	 * @return string
	 */
	private function get_new_message() {
		$subjects = array(
			'0' => sprintf(
				__( 'Yoast SEO has detected that %1$s is not indexable. Please note that this will make it impossible for search engines like Google and Bing to index your site.', 'wordpress-seo' ),
				home_url()
			),
			'1' => sprintf(
				__( 'Yoast SEO has detected that %1$s is indexable again.', 'wordpress-seo' ),
				home_url()
			),
		);

		return $subjects[ $this->statuses['new_status'] ];
	}

	/**
	 * In case the status has been changed
	 *
	 * @return string
	 */
	private function get_change_subject() {
		$subjects = array(
			'0' => sprintf(
				__( 'Yoast SEO alert: %1$s is no longer indexable!', 'wordpress-seo' ),
				home_url()
			),
			'1' => sprintf(
				__( 'Yoast SEO notification: %1$s is now indexable.', 'wordpress-seo' ),
				home_url()
			),
		);

		return $subjects[ $this->statuses['new_status'] ];
	}

	/**
	 * The status is fetched for the first time
	 *
	 * @return string
	 */
	private function get_new_subject() {
		$subjects = array(
			'0' => sprintf(
				__( 'Yoast SEO alert: %1$s is not indexable!', 'wordpress-seo' ),
				home_url()
			),
			'1' => sprintf(
				__( 'Yoast SEO notification: %1$s is indexable.', 'wordpress-seo' ),
				home_url()
			),
		);

		return $subjects[ $this->statuses['new_status'] ];
	}

}

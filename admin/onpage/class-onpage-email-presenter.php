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
	 * Constructing the object
	 *
	 * @param array $statuses Array with the statuses, normally it contains the old and the new status.
	 */
	public function __construct( array $statuses ) {
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
			$message = $this->get_change_message();
		}
		else {
			$message = $this->get_new_message();
		}

		$powered_by = sprintf(
			/* translators: 1: opens a link to yoast.com. 2: closes the link 3: opens a link to onpage.org */
			__( 'Indexing powered by %1$sYoast%2$s and %3$sOnPage.org%2$s.', 'wordpress-seo' ),
			'<a href="https://yoast.com" target="_blank">',
			'</a>',
			'<a href="https://en.onpage.org/lp/yoast/?op_campaign=638516a5c963f978&utm_campaign=free&utm_medium=link&utm_source=yoast&offer_id=2&aff_id=872&op_language=en&op_country=-" target="_blank">'
		);

		return $message . '<br /><br />' . $powered_by;
	}

	/**
	 * In case the status has been changed
	 *
	 * @return string
	 */
	private function get_change_message() {
		$subjects = array(
			'0' => sprintf(
				/* translators: 1: expands to home_url(). 2: opens a link to a related knowledge base article. 3: closes the link */
				__( 'Yoast SEO has detected that %1$s can no longer be indexed. Please note that this will make it impossible for search engines like Google and Bing to index your site. %2$sRead more about this error on our knowledge base%3$s.', 'wordpress-seo' ),
				home_url(),
				'<a href="http://yoa.st/onpage-index-error" target="_blank">',
				'</a>'
			),
			'1' => sprintf(
				/* translators: 1: expands to home_url(). */
				__( 'Yoast SEO has detected that %1$s can be indexed again.', 'wordpress-seo' ),
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
				/* translators: 1: expands to home_url(). 2: opens a link to a related knowledge base article. 3: closes the link */
				__( 'Yoast SEO has detected that %1$s can not be indexed. Please note that this will make it impossible for search engines like Google and Bing to index your site. %2$sRead more about this error on our knowledge base%3$s.', 'wordpress-seo' ),
				home_url(),
				'<a href="http://yoa.st/onpage-index-error" target="_blank">',
				'</a>'
			),
			'1' => sprintf(
				/* translators: 1: expands to home_url(). */
				__( 'Yoast SEO has detected that %1$s can be indexed.', 'wordpress-seo' ),
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
				/* translators: 1: expands to home_url(). */
				__( 'Yoast SEO alert: Search engines can no longer index %1$s!', 'wordpress-seo' ),
				home_url()
			),
			'1' => sprintf(
				/* translators: 1: expands to home_url(). */
				__( 'Yoast SEO alert fixed: Search engines can index %1$s again.', 'wordpress-seo' ),
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
				/* translators: 1: expands to home_url(). */
				__( 'Yoast SEO alert: Search engines cannot index %1$s!', 'wordpress-seo' ),
				home_url()
			),
			'1' => sprintf(
				/* translators: 1: expands to home_url(). */
				__( 'Yoast SEO alert fixed: Search engines can index %1$s.', 'wordpress-seo' ),
				home_url()
			),
		);

		return $subjects[ $this->statuses['new_status'] ];
	}

}

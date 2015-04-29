<?php
/**
 * @package    WPSEO
 * @subpackage Premium
 */

/**
 * Class WPSEO_Crawl_Issue
 *
 * @todo Might want to create a class that accepts the raw Google response as construct parameter.
 */
class WPSEO_Crawl_Issue {

	// Post Meta related constants
	const PM_CI_URL           = 'wpseo_ci_url';
	const PM_CI_PLATFORM      = 'wpseo_ci_platform';
	const PM_CI_CATEGORY      = 'wpseo_ci_category';
	const PM_CI_DATE_DETECTED = 'wpseo_ci_date_detected';
	const PM_CI_RESPONSE_CODE = 'wpseo_ci_response_code';

	/**
	 * @var string
	 */
	private $url;

	/**
	 * @var string
	 */
	private $crawl_type;

	/**
	 * @var string
	 */
	private $issue_type;

	/**
	 * @var DateTime
	 */
	private $date_detected;

	/**
	 * @var string
	 */
	private $response_code;

	/**
	 * Constructor
	 *
	 * @param string   $url
	 * @param string   $crawl_type
	 * @param string   $issue_type
	 * @param DateTime $date_detected
	 * @param string   $response_code
	 */
	function __construct( $url, $crawl_type, $issue_type, DateTime $date_detected, $response_code ) {
		$this->url           = $url;
		$this->crawl_type    = $crawl_type;
		$this->date_detected = $date_detected;
		$this->response_code = $response_code;
		$this->issue_type    = $issue_type;
	}

	/**
	 * Put class properties in array
	 *
	 * @return array
	 */
	public function to_array() {
		return array(
			'url'             => $this->url,
			'crawl_type'      => $this->crawl_type,
			'issue_category'  => $this->issue_type,
			'date_detected'   => strftime( '%x', strtotime( $this->date_detected->format( 'Y-m-d H:i:s' ) ) ),
			'response_code'   => $this->response_code,
		);
	}

	/**
	 * Saving the crawl issue
	 */
	public function save() {
		$ci_post_id = post_exists( $this->url );

		// Check if the post exists
		if ( 0 === $ci_post_id ) {
			// Create the post
			$ci_post_id = wp_insert_post( array(
				'post_type'   => WPSEO_Crawl_Issue_Manager::PT_CRAWL_ISSUE,
				'post_title'  => ( $this->url ),
				'post_status' => 'publish',
			) );
		}

		$this->save_post_meta( $ci_post_id );
	}

	/**
	 * Saving the post meta
	 *
	 * @param integer $ci_post_id
	 */
	private function save_post_meta( $ci_post_id ) {
		// Update all the meta data
		update_post_meta( $ci_post_id, self::PM_CI_PLATFORM, $this->crawl_type );
		update_post_meta( $ci_post_id, self::PM_CI_CATEGORY, $this->issue_type );
		update_post_meta( $ci_post_id, self::PM_CI_DATE_DETECTED, (string) strftime( '%x', strtotime( $this->date_detected->format( 'Y-m-d H:i:s' ) ) ) );
		update_post_meta( $ci_post_id, self::PM_CI_RESPONSE_CODE, $this->response_code );
	}


}
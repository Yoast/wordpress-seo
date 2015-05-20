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

	// Post Type related constants
	const PT_CRAWL_ISSUE = 'wpseo_crawl_issue';

	// Post Meta related constants
	const PM_CI_URL            = 'wpseo_ci_url';
	const PM_CI_FIRST_DETECTED = 'wpseo_ci_first_detected';
	const PM_CI_LAST_CRAWLED   = 'wpseo_ci_last_crawled';
	const PM_CI_RESPONSE_CODE  = 'wpseo_ci_response_code';

	/**
	 * @var string
	 */
	private $url;

	/**
	 * @var DateTime
	 */
	private $first_detected;

	/**
	 * @var DateTime
	 */
	private $last_crawled;

	/**
	 * @var string
	 */
	private $response_code;

	/**
	 * Constructor
	 *
	 * @param string   $url
	 * @param DateTime $first_detected
	 * @param DateTime $last_crawled
	 * @param string   $response_code
	 */
	function __construct( $url, DateTime $first_detected, DateTime $last_crawled, $response_code ) {
		$this->url            = $url;
		$this->first_detected = $first_detected;
		$this->last_crawled   = $last_crawled;
		$this->response_code  = $response_code;
	}

	/**
	 * Put class properties in array
	 *
	 * @return array
	 */
	public function to_array() {
		return array(
			'url'             => $this->url,
			'first_detected'  => $this->to_date_format( $this->first_detected ),
			'last_crawled'    => $this->to_date_format( $this->last_crawled ),
			'response_code'   => $this->response_code,
		);
	}

	/**
	 * @param DateTime $date_to_convert
	 * @param string   $format
	 *
	 * @return string
	 */
	private function to_date_format( DateTime $date_to_convert, $format = 'Y-m-d H:i:s' ) {
		return (string) strftime( '%x', strtotime( $date_to_convert->format( $format ) ) );
	}


}
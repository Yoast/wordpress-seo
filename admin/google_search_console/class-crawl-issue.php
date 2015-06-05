<?php
/**
 * @package WPSEO\Admin|Google_Search_Console
 */

/**
 * Class WPSEO_Crawl_Issue
 *
 * @todo Might want to create a class that accepts the raw Google response as construct parameter.
 */
class WPSEO_Crawl_Issue {

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
	public function __construct( $url, DateTime $first_detected, DateTime $last_crawled, $response_code ) {
		$this->url            = $url;
		$this->first_detected = $first_detected;
		$this->last_crawled   = $last_crawled;
		$this->response_code  = $response_code;
	}

	/**
	 * Put the class properties in array
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
	 * Converting the date to a date format
	 *
	 * @param DateTime $date_to_convert
	 * @param string   $format
	 *
	 * @return string
	 */
	private function to_date_format( DateTime $date_to_convert, $format = 'Y-m-d H:i:s' ) {
		return (string) strftime( '%x', strtotime( $date_to_convert->format( $format ) ) );
	}

}

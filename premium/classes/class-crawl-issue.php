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
	 * @var array
	 */
	private $linked_from;

	/**
	 * Constructor
	 *
	 * @param string   $url
	 * @param string   $crawl_type
	 * @param string   $issue_type
	 * @param datetime $date_detected
	 * @param string   $response_code
	 * @param string   $linked_from
	 * @param string   $ignored
	 */
	function __construct( $url, $crawl_type, $issue_type, $date_detected, $response_code, $linked_from, $ignored ) {
		$this->crawl_type    = $crawl_type;
		$this->date_detected = $date_detected;
		$this->response_code = $response_code;
		$this->issue_type    = $issue_type;
		$this->linked_from   = $linked_from;
		$this->url           = $url;
	}

	/**
	 * @return String
	 */
	public function get_crawl_type() {
		return $this->crawl_type;
	}

	/**
	 * @return \DateTime
	 */
	public function get_date_detected() {
		return $this->date_detected;
	}

	/**
	 * @return String
	 */
	public function get_response_code() {
		return ! ( empty( $this->response_code ) ) ? $this->response_code : '';
	}

	/**
	 * @return String
	 */
	public function get_issue_type() {
		return $this->issue_type;
	}

	/**
	 * @return Array
	 */
	public function get_linked_from() {
		return $this->linked_from;
	}

	/**
	 * @return String
	 */
	public function get_url() {
		return $this->url;
	}

	/**
	 * Put class properties in array
	 *
	 * @return array
	 */
	public function to_array() {

		// Get first linked from
		$linked_from = '';
		if ( is_array( $this->linked_from ) && count( $this->linked_from ) > 0 ) {
			$copy        = $this->linked_from;
			$linked_from = array_shift( $copy );
		}

		return array(
			'url'             => $this->url,
			'crawl_type'      => $this->crawl_type,
			'issue_category'  => $this->issue_type,
			'date_detected'   => strftime( '%x', strtotime( $this->date_detected->format( 'Y-m-d H:i:s' ) ) ),
			'response_code'   => $this->get_response_code(),
			'linked_from'     => $linked_from,
		);
	}

}
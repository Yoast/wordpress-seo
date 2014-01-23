<?php

class WPSEO_Crawl_Issue {

	/**
	 * @var String
	 */
	private $url;

	/**
	 * @var String
	 */
	private $crawl_type;

	/**
	 * @var String
	 */
	private $issue_type;

	/**
	 * @var DateTime
	 */
	private $date_detected;

	/**
	 * @var String
	 */
	private $detail;

	/**
	 * @var Array
	 */
	private $linked_from;

	/**
	 * Constructor
	 *
	 * @param $url
	 * @param $crawl_type
	 * @param $issue_type
	 * @param $date_detected
	 * @param $detail
	 * @param $linked_from
	 */
	function __construct( $url, $crawl_type, $issue_type, $date_detected, $detail, $linked_from ) {
		$this->crawl_type    = $crawl_type;
		$this->date_detected = $date_detected;
		$this->detail        = $detail;
		$this->issue_type    = $issue_type;
		$this->linked_from   = $linked_from;
		$this->url           = $url;
	}

	/**
	 * @param String $crawl_type
	 */
	public function set_crawl_type( $crawl_type ) {
		$this->crawl_type = $crawl_type;
	}

	/**
	 * @return String
	 */
	public function get_crawl_type() {
		return $this->crawl_type;
	}

	/**
	 * @param \DateTime $date_detected
	 */
	public function set_date_detected( $date_detected ) {
		$this->date_detected = $date_detected;
	}

	/**
	 * @return \DateTime
	 */
	public function get_date_detected() {
		return $this->date_detected;
	}

	/**
	 * @param String $detail
	 */
	public function set_detail( $detail ) {
		$this->detail = $detail;
	}

	/**
	 * @return String
	 */
	public function get_detail() {
		return $this->detail;
	}

	/**
	 * @param String $issue_type
	 */
	public function set_issue_type( $issue_type ) {
		$this->issue_type = $issue_type;
	}

	/**
	 * @return String
	 */
	public function get_issue_type() {
		return $this->issue_type;
	}

	/**
	 * @param Array $linked_from
	 */
	public function set_linked_from( $linked_from ) {
		$this->linked_from = $linked_from;
	}

	/**
	 * @return Array
	 */
	public function get_linked_from() {
		return $this->linked_from;
	}

	/**
	 * @param String $url
	 */
	public function set_url( $url ) {
		$this->url = $url;
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
		return array( 'url' => $this->url, 'crawl_type' => $this->crawl_type, 'issue_type' => $this->issue_type, 'date_detected' => strftime( '%x', $this->date_detected->getTimestamp() ), 'detail' => $this->detail, 'linked_from' => $this->linked_from );
	}

}
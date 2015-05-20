<?php
/**
 * @package Premium\Redirect
 * @subpackage Premium
 */

/**
 * Class WPSEO_Crawl_Issue_Table_Data
 */
class WPSEO_Crawl_Issue_Table_Data {

	/**
	 * @var array
	 */
	private $arguments;

	/**
	 * @var array
	 */
	private $crawl_issues;

	/**
	 * @var integer
	 */
	private $total_rows;

	/**
	 * @var current category
	 */
	private $category;

	/**
	 * Setting the properties and load the crawl issues from the database
	 *
	 * @param string $category
	 * @param array  $ci_args
	 */
	public function __construct( $category, array $ci_args ) {
		$this->arguments     = $ci_args;
		$this->category      = $category;
		$this->crawl_issues  = $this->get_issues();
	}

	/**
	 * Getting all the crawl issues
	 *
	 * @return array
	 */
	public function parse_crawl_issues() {
		$return = array();
		if ( is_array( $this->crawl_issues ) && count( $this->crawl_issues ) > 0 ) {
			foreach ( $this->crawl_issues as $crawl_issue ) {
				$return[] = $crawl_issue->to_array();
			}
		}

		return $return;
	}

	/**
	 * Get the total items
	 *
	 * @return mixed
	 */
	public function get_total_items() {
		return $this->issue_count->get_total_issues();
	}

}
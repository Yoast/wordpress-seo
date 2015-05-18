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
		return $this->total_rows;
	}

	/**
	 * Parses the crawl issues from the database
	 *
	 *
	 * @return array<WPSEO_Crawl_Issue>
	 */
	private function get_issues( ) {
		$crawl_issues_db = $this->get_issues_from_db();
		$crawl_issues = array();

		// Convert WP posts to WPSEO_Crawl_Issue objects
		if ( count( $crawl_issues_db ) > 0 ) {
			foreach ( $crawl_issues_db as $crawl_issues_db_item ) {
				$crawl_issues[] = new WPSEO_Crawl_Issue(
					$crawl_issues_db_item->post_title,
					get_post_meta( $crawl_issues_db_item->ID, WPSEO_Crawl_Issue::PM_CI_PLATFORM, true ),
					get_post_meta( $crawl_issues_db_item->ID, WPSEO_Crawl_Issue::PM_CI_CATEGORY, true ),
					new DateTime( (string) get_post_meta( $crawl_issues_db_item->ID, WPSEO_Crawl_Issue::PM_CI_FIRST_DETECTED, true ) ),
					new DateTime( (string) get_post_meta( $crawl_issues_db_item->ID, WPSEO_Crawl_Issue::PM_CI_LAST_CRAWLED, true ) ),
					get_post_meta( $crawl_issues_db_item->ID, WPSEO_Crawl_Issue::PM_CI_RESPONSE_CODE, true )
				);
			}
		}

		return $crawl_issues;
	}


	/**
	 * Getting the issues from the database
	 *
	 * @return mixed
	 */
	private function get_issues_from_db() {
		global $wpdb;

		$subquery = $this->filter_issues();

		$this->total_rows = $wpdb->get_var(
			'
				SELECT COUNT(ID)
				FROM ' . $wpdb->posts . '
				WHERE post_status = "' . $this->arguments['post_status'] . '" && post_type = "' . WPSEO_Crawl_Issue::PT_CRAWL_ISSUE . '" && ID IN( ' . $subquery . ' )
			'
		);

		return $wpdb->get_results(
			'
				SELECT *
				FROM ' . $wpdb->posts . '
				WHERE post_status = "' . $this->arguments['post_status'] . '" &&
					  post_type   = "' . WPSEO_Crawl_Issue::PT_CRAWL_ISSUE . '" &&
					  ID IN( ' . $subquery . ' )
				LIMIT ' . $this->arguments['offset'] . ' , ' . $this->arguments['posts_per_page'] . '
			',
			OBJECT
		);
	}

	/**
	 * Filtering the issues
	 */
	private function filter_issues() {
		// First filter the platform
		$platform = ( $platform = filter_input( INPUT_GET, 'tab' ) ) ? $platform : 'web';

		$subquery  = 'SELECT platform.post_id FROM wp_postmeta platform';
		$subquery .= ' INNER JOIN wp_postmeta category ON category.post_id = platform.post_id && category.meta_key = "'. WPSEO_Crawl_Issue::PM_CI_CATEGORY . '" AND category.meta_value = "' . WPSEO_GWT_Mapper::category( $this->category ) . '"';
		$subquery .= ' WHERE platform.meta_key = "' . WPSEO_Crawl_Issue::PM_CI_PLATFORM . '" && platform.meta_value = "' . WPSEO_GWT_Mapper::platform( $platform ) . '"';

		return $subquery;
	}

}
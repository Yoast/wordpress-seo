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
	 * @var WPSEO_Crawl_Issue_Manager
	 */
	private $issue_manager;

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
	 * @param WPSEO_Crawl_Issue_Manager $issue_manager
	 * @param array                     $ci_args
	 */
	public function __construct( WPSEO_Crawl_Issue_Manager $issue_manager, array $ci_args ) {
		$this->arguments = $ci_args;

		// Get the crawl issues
		$this->issue_manager = $issue_manager;

		$this->crawl_issues  = $this->issue_manager->get_crawl_issues( $this->get_issues() );
	}

	/**
	 * Getting the issues from the database
	 * @return mixed
	 */
	public function get_issues () {
		global $wpdb;

		$subquery = $this->filter_issues();

		$this->total_rows = $wpdb->get_var(
			'
				SELECT COUNT(ID)
				FROM ' . $wpdb->posts . '
				WHERE post_status = "' . $this->arguments['post_status'] . '" && post_type = "' . WPSEO_Crawl_Issue_Manager::PT_CRAWL_ISSUE . '" && ID IN('. $subquery .')
			'
		);

		return $wpdb->get_results(
			'
				SELECT *
				FROM ' . $wpdb->posts . '
				WHERE post_status = "' . $this->arguments['post_status'] . '" &&
					  post_type   = "' . WPSEO_Crawl_Issue_Manager::PT_CRAWL_ISSUE . '" &&
					  ID IN(' . $subquery . ' )
				LIMIT ' . $this->arguments['offset'] . ' , ' . $this->arguments['posts_per_page'] . '
			',
			OBJECT
		);

		// ORDER BY {$this->arguments['orderby']}  {$this->arguments['order']}
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
	 * Filtering the issues
	 */
	private function filter_issues() {
		// First filter the platform
		$platform = ( $platform = filter_input( INPUT_GET, 'tab' ) ) ? $platform : 'web';

		$subquery = 'SELECT platform.post_id FROM wp_postmeta platform';

		if ( $category = filter_input( INPUT_GET, 'category' ) ) {
			if ( $category !== 'all' ) {
				$subquery .= ' INNER JOIN wp_postmeta category ON category.post_id = platform.post_id && category.meta_key = " '. WPSEO_Crawl_Issue_Manager::PM_CI_CATEGORY . '" AND category.meta_value = "' . WPSEO_GWT_Mapper::category( $category ) . '"';
			}
		}

		$subquery .= ' WHERE platform.meta_key = "' . WPSEO_Crawl_Issue_Manager::PM_CI_PLATFORM . '" && platform.meta_value = "' . WPSEO_GWT_Mapper::platform( $platform ) . '"';

		return $subquery;
	}

}
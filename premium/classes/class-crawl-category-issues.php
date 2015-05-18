<?php
/**
 * @package    WPSEO
 * @subpackage Premium
 */

/**
 * Class WPSEO_Crawl_Category_Issues
 */
class WPSEO_Crawl_Category_Issues {

	/**
	 * @var string
	 */
	private $category;

	/**
	 * @var WPSEO_GWT_Service
	 */
	private $service;

	/**
	 * @var string
	 */
	private $platform;

	/**
	 * List of all current issues to compare with received issues
	 *
	 * @var array
	 */
	private $current_issues;

	/**
	 * @param string $platform
	 * @param string $category
	 */
	public function __construct( $platform, $category ) {
		$this->service  = new WPSEO_GWT_Service();
		$this->platform = $platform;
		$this->category = $category;

		$this->set_current_issues();
	}

	/**
	 * Fetching the issues for current category
	 */
	public function fetch_issues() {
		if ( $issues = $this->service->fetch_category_issues( $this->platform, $this->category ) ) {
			foreach ( $issues as $issue ) {
				if ( ! in_array( $issue->pageUrl, $this->current_issues ) ) {
					$this->save_issue(
						$this->create_issue( $issue )
					);
				}
			}
		}
	}

	/**
	 * Creates the issue
	 * @param stdClass $issue
	 *
	 * @return WPSEO_Crawl_Issue
	 */
	private function create_issue( $issue ) {
		return new WPSEO_Crawl_Issue(
			WPSEO_Redirect_Manager::format_url( (string) $issue->pageUrl ),
			(string) $this->platform,
			(string) $this->category,
			new DateTime( (string) $issue->first_detected ),
			new DateTime( (string) $issue->last_crawled ),
			(string) ( ! empty( $issue->responseCode ) ) ? $issue->responseCode : null,
			false
		);
	}

	/**
	 * Saving the crawl issue in the database
	 *
	 * @param WPSEO_Crawl_Issue $crawl_issue
	 */
	private function save_issue( WPSEO_Crawl_Issue $crawl_issue ) {
		$crawl_issue->save();
	}

	/**
	 *
	 */
	private function set_current_issues() {
		global $wpdb;

		$current_issues = $wpdb->get_results(
			'
				SELECT post_title
				FROM ' . $wpdb->posts . '
				WHERE post_type   = "' . WPSEO_Crawl_Issue_Manager::PT_CRAWL_ISSUE . '" &&
					  ID IN(
						SELECT platform.post_id FROM wp_postmeta platform
						INNER JOIN wp_postmeta category ON category.post_id = platform.post_id && category.meta_key = "'. WPSEO_Crawl_Issue::PM_CI_CATEGORY . '" AND category.meta_value = "' . $this->category . '"
						WHERE platform.meta_key = "' . WPSEO_Crawl_Issue::PM_CI_PLATFORM . '" && platform.meta_value = "' . $this->platform . '"
					  )
			',
			OBJECT
		);

		foreach ( $current_issues as $current_issue ) {
			$this->current_issues[] = $current_issue->post_title;
		}
	}

}
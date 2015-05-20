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
	private $current_issues = array();

	/**
	 * @var string
	 */
	private $option_name = '';

	/**
	 * @var array
	 */
	private $all_issues = array();

	/**
	 *
	 * @param string $platform
	 * @param string $category
	 */
	public function __construct( $platform, $category ) {
		$this->service     = new WPSEO_GWT_Service();
		$this->platform    = $platform;
		$this->category    = $category;
		$this->option_name = strtolower( 'wpseo-premium-gwt-issues-' . $platform . '-' . $category );
		$this->issues      = $this->get_issues();
	}

	/**
	 * Fetching the issues for current category
	 */
	public function fetch_issues() {
		$this->set_current_issues();

		if ( $issues = $this->service->fetch_category_issues( $this->platform, $this->category ) ) {
			$crawl_issues = $this->get_issues();
			foreach ( $issues as $issue ) {
				$issue->pageUrl = WPSEO_Redirect_Manager::format_url( (string) $issue->pageUrl );

				if ( ! in_array( $issue->pageUrl, $this->current_issues ) ) {
					array_push(
						$crawl_issues,
						$this->save_issue( $this->create_issue( $issue ) )
					);
				}
			}

			$this->save_issues( $crawl_issues );
		}
	}

	/**
	 * Getting the issues from the options
	 *
	 * @return mixed
	 */
	public function get_issues() {
		return get_option( $this->option_name, array() );
	}

	/**
	 * Creates the issue
	 * @param stdClass $issue
	 *
	 * @return WPSEO_Crawl_Issue
	 */
	private function create_issue( $issue ) {
		return new WPSEO_Crawl_Issue(
			$issue->pageUrl,
			new DateTime( (string) $issue->first_detected ),
			new DateTime( (string) $issue->last_crawled ),
			(string) ( ! empty( $issue->responseCode ) ) ? $issue->responseCode : null
		);
	}

	/**
	 * Saving the crawl issue in the database
	 *
	 * @param WPSEO_Crawl_Issue $crawl_issue
	 *
	 * @return array()
	 */
	private function save_issue( WPSEO_Crawl_Issue $crawl_issue ) {
		return $crawl_issue->to_array();
	}

	/**
	 * Saving the issues
	 *
	 * @param array $issues
	 */
	private function save_issues( array $issues ) {
		update_option( $this->option_name, $issues, false );
	}

	/**
	 *
	 */
	private function set_current_issues() {
		// First getting the issues from the option
		$current_issues = $this->get_issues();

		if ( ! empty( $current_issues ) ) {
			$this->current_issues = wp_list_pluck( $current_issues, 'url' );
		}
	}

}
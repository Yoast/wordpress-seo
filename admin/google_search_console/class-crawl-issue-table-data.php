<?php
/**
 * @package WPSEO\Admin|Google_Search_Console
 */

/**
 * Class WPSEO_Crawl_Issue_Table_Data
 */
class WPSEO_Crawl_Issue_Table_Data {

	/**
	 * @var string current platform
	 */
	private $platform;

	/**
	 * @var string current category
	 */
	private $category;

	/**
	 * Setting the properties and load the crawl issues from the database
	 *
	 * @param string            $platform
	 * @param string            $screen_id
	 * @param WPSEO_GWT_Service $service
	 */
	public function __construct( $platform, $screen_id, WPSEO_GWT_Service $service ) {
		// Setting the platform.
		$this->platform     = WPSEO_GWT_Mapper::platform( $platform );

		// Loading the category filters.
		$category_filter   = new WPSEO_GWT_Category_Filters( $this->platform, $screen_id );

		// Loading the issue counter.
		$issue_count       = new WPSEO_Crawl_Issue_Count( $service );

		// Setting the current category.
		$this->category    = WPSEO_GWT_Mapper::category( $category_filter->current_view() );

		// Fetching the issues.
		$this->issue_fetch = new WPSEO_Crawl_Issue_Fetch( $this->platform, $this->category, $issue_count, $service );
	}

	/**
	 * Getting all the crawl issues
	 *
	 * @return array
	 */
	public function get_issues() {
		return $this->issue_fetch->get_issues();
	}
	
	/**
	 * Gets the current category
	 *
	 * @return string
	 */
	public function get_category() {
		return $this->category;
	}

	/**
	 * Showing the hidden fields used by the AJAX requests
	 */
	public function show_fields() {
		echo "<input type='hidden' name='wpseo_gwt_nonce' value='" . wp_create_nonce( 'wpseo_gwt_nonce' ) . "' />";
		echo "<input id='field_platform' type='hidden' name='platform' value='{$this->platform}' />";
		echo "<input id='field_category' type='hidden' name='category' value='{$this->category}' />";
	}

}

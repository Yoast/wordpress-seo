<?php
/**
 * @package WPSEO\Admin|Google_Search_Console
 */

/**
 * Class WPSEO_GSC_Table_Data
 */
class WPSEO_GSC_Table_Data {

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
	 * @param WPSEO_GSC_Service $service
	 */
	public function __construct( $platform, $screen_id, WPSEO_GSC_Service $service ) {
		// Setting the platform.
		$this->platform    = WPSEO_GSC_Mapper::platform( $platform );

		// Loading the category filters.
		$category_filter   = new WPSEO_GSC_Category_Filters( $screen_id, $this->platform );

		// Setting the current category.
		$this->category    = WPSEO_GSC_Mapper::category( $category_filter->current_view() );

		// Loading the issue counter.
		$issue_count       = new WPSEO_GSC_Count( $service, $this->platform, $this->category );

		// Fetching the issues.
		$this->issue_fetch = new WPSEO_GSC_Issues( $this->platform, $this->category, $issue_count->get_issues() );
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
		echo "<input type='hidden' name='wpseo_gsc_nonce' value='" . wp_create_nonce( 'wpseo_gsc_nonce' ) . "' />";
		echo "<input id='field_platform' type='hidden' name='platform' value='{$this->platform}' />";
		echo "<input id='field_category' type='hidden' name='category' value='{$this->category}' />";
	}

}

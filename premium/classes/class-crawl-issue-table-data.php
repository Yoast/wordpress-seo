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
	 * @var string current platform
	 */
	private $platform;

	/**
	 * @var string current category
	 */
	private $category;

	/**
	 * @var integer
	 */
	private $total_rows;

	/**
	 * Setting the properties and load the crawl issues from the database
	 *
	 * @param string            $platform
	 * @param string            $category
	 * @param WPSEO_GWT_Service $service
	 *
	 */
	public function __construct( $platform, $category, WPSEO_GWT_Service $service ) {
		$this->platform     = WPSEO_GWT_Mapper::platform( $platform );
		$this->category     = WPSEO_GWT_Mapper::category( $category );
		$this->issue_count  = new WPSEO_Crawl_Issue_Count( $service, $this->platform, $this->category );
	}

	/**
	 * Getting all the crawl issues
	 *
	 * @return array
	 */
	public function get_issues() {
		return $this->issue_count->get_issues();
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
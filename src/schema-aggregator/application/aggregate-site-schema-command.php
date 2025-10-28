<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Page_Controls;

/**
 * Class that represents the command to aggregate site schema.
 */
class Aggregate_Site_Schema_Command {

	/**
	 * The page controls.
	 *
	 * @var Page_Controls
	 */
	private $page_controls;

	/**
	 * The constructor.
	 *
	 * @param int $page     The current page.
	 * @param int $per_page The number of items per page.
	 */
	public function __construct( int $page, int $per_page ) {
		$this->page_controls = new Page_Controls( $page, $per_page );
	}

	/**
	 * Gets the page controls.
	 *
	 * @return Page_Controls
	 */
	public function get_page_controls(): Page_Controls {
		return $this->page_controls;
	}
}

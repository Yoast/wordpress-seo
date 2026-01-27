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
	 * Whether debug mode is enabled.
	 *
	 * @var bool
	 */
	private $is_debug;

	/**
	 * The constructor.
	 *
	 * @param int    $page      The current page.
	 * @param int    $per_page  The number of items per page.
	 * @param string $post_type The post type to aggregate schema for.
	 * @param bool   $is_debug  Whether debug mode is enabled.
	 */
	public function __construct( int $page, int $per_page, string $post_type, bool $is_debug = false ) {
		$this->page_controls = new Page_Controls( $page, $per_page, $post_type );
		$this->is_debug      = $is_debug;
	}

	/**
	 * Gets the page controls.
	 *
	 * @return Page_Controls
	 */
	public function get_page_controls(): Page_Controls {
		return $this->page_controls;
	}

	/**
	 * Checks if debug mode is enabled.
	 *
	 * @return bool
	 */
	public function is_debug(): bool {
		return $this->is_debug;
	}
}

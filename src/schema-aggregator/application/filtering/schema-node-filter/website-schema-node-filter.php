<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Schema_Node_Filter;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Current_Site_URL_Provider_Interface;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece_Collection;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\WordPress_Current_Site_URL_Provider;

/**
 * WebSite schema node filter implementation.
 *
 *  The class name uses WebSite instead of Website because we need it to reflect the schema piece name.
 *  By doing so we can search for a piece-specific node filter in Default_Filter.
 */
class WebSite_Schema_Node_Filter implements Schema_Node_Filter_Interface {

	/**
	 * The site info provider.
	 *
	 * @var Current_Site_URL_Provider_Interface
	 */
	private $current_site_url_provider;

	/**
	 * Class constructor.
	 */
	public function __construct() {
		$this->current_site_url_provider = new WordPress_Current_Site_URL_Provider();
	}

	/**
	 * Filters a WebSite schema piece if it matches the site's URL.
	 *
	 * @param Schema_Piece_Collection $schema       The full schema.
	 * @param Schema_Piece            $schema_piece The schema piece to be filtered.
	 *
	 * @return bool True if the schema piece should be kept, false otherwise.
	 */
	public function filter( Schema_Piece_Collection $schema, Schema_Piece $schema_piece ): bool {
		$blog_url = $this->current_site_url_provider->get_current_site_url();
		$data     = $schema_piece->get_data();
		if ( $data['url'] === $blog_url ) {
			return false;
		}
		return true;
	}
}

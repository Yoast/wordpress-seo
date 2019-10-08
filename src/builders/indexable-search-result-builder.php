<?php
/**
 * Search result builder for the indexables.
 *
 * @package Yoast\YoastSEO\Builders
 */

namespace Yoast\WP\Free\Builders;

use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Models\Indexable;

/**
 * Formats the search result meta to indexable format.
 */
class Indexable_Search_Result_Builder {

	/**
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Indexable_Search_Result_Builder constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct(
		Options_Helper $options_helper
	) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Formats the data.
	 *
	 * @param Indexable $indexable The indexable to format.
	 *
	 * @return Indexable The extended indexable.
	 */
	public function build( Indexable $indexable ) {
		$indexable->object_type       = 'search-result';
		$indexable->title             = $this->options_helper->get( 'title-search-wpseo' );
		$indexable->is_robots_noindex = true;

		return $indexable;
	}
}

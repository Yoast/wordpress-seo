<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure;

use Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Default_Filter;
use Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Filtering_Strategy_Interface;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Elements_Context_Map\Base_Map_Loader;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Elements_Context_Map\Elements_Context_Map_Repository;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Elements_Context_Map\Filtered_Map_Loader;

/**
 * Factory for creating filtering strategy instances.
 */
class Filtering_Strategy_Factory {

	/**
	 * Creates an instance of the filtering strategy.
	 *
	 * @return Filtering_Strategy_Interface The filtering strategy instance.
	 */
	public function create(): Filtering_Strategy_Interface {
		$base_map_loader                 = new Base_Map_Loader();
		$map_loader                      = new Filtered_Map_Loader( $base_map_loader );
		$elements_context_map_repository = new Elements_Context_Map_Repository( $map_loader );
		$default_filter                  = new Default_Filter( $elements_context_map_repository );

		$filtering_strategy = \apply_filters( 'wpseo_schema_aggregator_filtering_strategy', $default_filter );

		if ( $filtering_strategy instanceof Filtering_Strategy_Interface ) {
			return $filtering_strategy;
		}

		return $default_filter;
	}
}

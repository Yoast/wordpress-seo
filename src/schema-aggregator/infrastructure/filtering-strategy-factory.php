<?php

namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure;

use Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Default_Filter;
use Yoast\WP\SEO\Schema_Aggregator\Application\Filtering\Filtering_Strategy_Interface;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Elements_Context_Map\Base_Map_Loader;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Elements_Context_Map\Elements_Context_Map_Repository;

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
		$filtering_class = \apply_filters( 'wpseo_schema_aggregator_filtering_strategy', Default_Filter::class );

		$map_loader                      = new Base_Map_Loader();
		$elements_context_map_repository = new Elements_Context_Map_Repository( $map_loader );

		if ( \is_a( $filtering_class, Filtering_Strategy_Interface::class, true ) ) {
			return new $filtering_class( $elements_context_map_repository );
		}

		return new Default_Filter( $elements_context_map_repository );
	}
}

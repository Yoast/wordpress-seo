<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Aggregator_Config;

/**
 * Properties filter
 *
 * Filters properties by removing those specified in the avoid list.
 */
class Properties_Filter {

	/**
	 * Configuration provider
	 *
	 * @var Aggregator_Config
	 */
	private $config;

	/**
	 * Constructor
	 *
	 * @param Aggregator_Config $config Configuration provider.
	 */
	public function __construct( Aggregator_Config $config ) {
		$this->config = $config;
	}

	/**
	 * Remove properties that reference filtered-out entity types
	 *
	 * Removes properties like 'breadcrumb' that reference BreadcrumbList entities
	 * which have been filtered out from the allowed types.
	 *
	 * Also removes 'potentialAction' properties (ReadAction, CommentAction, SearchAction)
	 * which are added by Yoast but not needed for schema aggregation integration.
	 *
	 * @param Schema_Piece $piece The schema piece.
	 *
	 * @return Schema_Piece Cleaned schema piece.
	 */
	public function filter( Schema_Piece $piece ): Schema_Piece {

		$properties_to_remove = $this->config->get_properties_avoid_list();
		$data                 = $piece->get_data();

		foreach ( $properties_to_remove as $property ) {
			if ( isset( $data[ $property ] ) ) {
				unset( $data[ $property ] );
			}
		}

		return new Schema_Piece( $data, $piece->get_type() );
	}
}

<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Search_Rankings;

use Google\Site_Kit_Dependencies\Google\Service\SearchConsole\ApiDataRow;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Container;
use Yoast\WP\SEO\Dashboard\Domain\Search_Rankings\Search_Data;

/**
 * This class contains all logic to parse the raw API response to usable domain objects for the rest of the system.
 */
class Organic_Sessions_Parser {

	/**
	 * Parses the raw API response to a Search Data object containing the API response and SEO score.
	 *
	 * @param ApiDataRow[] $results The raw results.
	 *
	 * @return Data_Container The parsed data.
	 */
	public function parse( array $results ): Data_Container {
		$search_data_container = new Data_Container();
		foreach ( $results as $ranking ) {
			$search_data_container->add_data( new Search_Data( $ranking->clicks, $ranking->ctr, $ranking->impressions, $ranking->position, $ranking->keys[0] ) );
		}

		return $search_data_container;
	}
}

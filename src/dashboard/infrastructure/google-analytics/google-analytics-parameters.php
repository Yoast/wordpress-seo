<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Google_Analytics;

use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Parameters;

/**
 * Domain object to add search console specific data to the parameters.
 */
class Google_Analytics_Parameters extends Parameters {

	/**
	 * The search dimension_filters to query.
	 *
	 * @var string[] $dimension_filters
	 */
	private $dimension_filters;
	/**
	 * The search metrics to query.
	 *
	 * @var string[] $metrics
	 */
	private $metrics;

	/**
	 * The constructor.
	 *
	 * @param string[] $dimension_filters The search dimensionFilters to query.
	 * @param string[] $metrics The search metrics to query.
	 */
	public function __construct( array $dimension_filters,array $metrics ) {
		$this->dimension_filters = $dimension_filters;
		$this->metrics = $metrics;
	}

	/**
	 * Getter for the dimension_filters.
	 *
	 * @return string[]
	 */
	public function get_dimension_filters(): array {
		return $this->dimension_filters;
	}

	/**
	 * Getter for the metrics parameters.
	 *
	 * @return string[]
	 */
	public function get_metrics(): array {
		return $this->metrics;
	}
}

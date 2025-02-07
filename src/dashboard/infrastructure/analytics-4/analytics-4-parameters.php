<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4;

use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Parameters;

/**
 * Domain object to add Analytics 4 specific data to the parameters.
 */
class Analytics_4_Parameters extends Parameters {

	/**
	 * The compare start date.
	 *
	 * @var string $compare_start_date
	 */
	private $compare_start_date = null;

	/**
	 * The compare end date.
	 *
	 * @var string $compare_end_date
	 */
	private $compare_end_date = null;

	/**
	 * The dimensions to query.
	 *
	 * @var array<array<string>> $dimensions
	 */
	private $dimensions = null;

	/**
	 * The dimensions filters.
	 *
	 * @var array<string, array<string>> $dimension_filters
	 */
	private $dimension_filters = null;

	/**
	 * The metrics.
	 *
	 * @var array<array<string>> $metrics
	 */
	private $metrics = null;

	/**
	 * The order by.
	 *
	 * @var array<array<array<string<string>>> $order_by
	 */
	private $order_by = null;

	/**
	 * Sets the dimensions.
	 *
	 * @param array<array<string>> $dimensions The dimensions.
	 *
	 * @return void
	 */
	public function set_dimensions( array $dimensions ): void {
		foreach ( $dimensions as $dimension ) {
			$this->dimensions[] = [ 'name' => $dimension ];
		}
	}

	/**
	 * Getter for the dimensions.
	 *
	 * @return array<array<string>>
	 */
	public function get_dimensions(): ?array {
		return $this->dimensions;
	}

	/**
	 * Getter for the compare start date.
	 *
	 * @return string
	 */
	public function get_compare_start_date(): ?string {
		return $this->compare_start_date;
	}

	/**
	 * Getter for the compare end date.
	 * The date format should be Y-M-D.
	 *
	 * @return string
	 */
	public function get_compare_end_date(): ?string {
		return $this->compare_end_date;
	}

	/**
	 * The compare start date setter.
	 *
	 * @param string $compare_start_date The compare start date.
	 *
	 * @return void
	 */
	public function set_compare_start_date( string $compare_start_date ): void {
		$this->compare_start_date = $compare_start_date;
	}

	/**
	 * The compare end date setter.
	 *
	 * @param string $compare_end_date The compare end date.
	 *
	 * @return void
	 */
	public function set_compare_end_date( string $compare_end_date ): void {
		$this->compare_end_date = $compare_end_date;
	}

	/**
	 * Sets the dimension filters.
	 *
	 * @param array<string, array<string>> $dimension_filters The dimension filters.
	 *
	 * @return void
	 */
	public function set_dimension_filters( array $dimension_filters ): void {
		$this->dimension_filters = $dimension_filters;
	}

	/**
	 * Getter for the dimension filters.
	 *
	 * @return array<string, array<string>>
	 */
	public function get_dimension_filters(): ?array {
		return $this->dimension_filters;
	}

	/**
	 * Sets the metrics.
	 *
	 * @param array<array<string>> $dimension_filters The metrics.
	 *
	 * @return void
	 */
	public function set_metrics( array $metrics ): void {
		foreach ( $metrics as $metric ) {
			$this->metrics[] = [ 'name' => $metric ];
		}
	}

	/**
	 * Getter for the metrics.
	 *
	 * @return array<array<string>>
	 */
	public function get_metrics(): ?array {
		return $this->metrics;
	}

	/**
	 * Sets the order by.
	 *
	 * @param array<array<array<string<string>>> $order_by The order by.
	 *
	 * @return void
	 */
	public function set_order_by( array $order_by ): void {
		$this->order_by = $order_by;
	}

	/**
	 * Getter for the order by.
	 *
	 * @return array<array<array<string<string>>>
	 */
	public function get_order_by(): ?array {
		return $this->order_by;
	}
}

<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Domain\Search_Rankings;

/**
 * Object representation of the request parameters.
 */
class Request_Parameters {

	/**
	 * The start date.
	 *
	 * @var string $start_date
	 */
	private $start_date;

	/**
	 * The end date.
	 *
	 * @var string $end_date
	 */
	private $end_date;

	/**
	 * The search dimensions to query.
	 *
	 * @var string[] $dimensions
	 */
	private $dimensions;

	/**
	 * The amount of results.
	 *
	 * @var int $limit
	 */
	private $limit;

	/**
	 * The constructor.
	 *
	 * @param string[] $dimensions The search dimensions to query.
	 */
	public function __construct( array $dimensions ) {
		$this->dimensions = $dimensions;
	}

	/**
	 * Getter for the start date.
	 *
	 * @return string
	 */
	public function get_start_date(): string {
		return $this->start_date;
	}

	/**
	 * Getter for the end date.
	 * The date format should be Y-M-D.
	 *
	 * @return string
	 */
	public function get_end_date(): string {
		return $this->end_date;
	}

	/**
	 * Getter for the dimensions.
	 *
	 * @return string[]
	 */
	public function get_dimensions(): array {
		return $this->dimensions;
	}

	/**
	 * Getter for the result limit.
	 *
	 * @return int
	 */
	public function get_limit(): int {
		return $this->limit;
	}

	/**
	 * The start date setter.
	 *
	 * @param string $start_date The start date.
	 *
	 * @return void
	 */
	public function set_start_date( string $start_date ): void {
		$this->start_date = $start_date;
	}

	/**
	 * The end date setter.
	 *
	 * @param string $end_date The end date.
	 *
	 * @return void
	 */
	public function set_end_date( string $end_date ): void {
		$this->end_date = $end_date;
	}

	/**
	 * The result limit.
	 *
	 * @param int $limit The result limit.
	 * @return void
	 */
	public function set_limit( int $limit ): void {
		$this->limit = $limit;
	}
}

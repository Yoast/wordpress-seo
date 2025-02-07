<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Domain\Traffic;

use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Interface;

/**
 * Domain object that represents a single Daily Traffic record.
 */
class Daily_Traffic_Data implements Data_Interface {

	/**
	 * The day of the traffic data.
	 *
	 * @var string $day
	 */
	private $day;

	/**
	 * The traffic data of the day.
	 *
	 * @var Traffic_Data $traffic_data
	 */
	private $traffic_data;

	/**
	 * The constructor.
	 *
	 * @param string $day The day of the traffic data.
	 */
	public function __construct( string $day, Traffic_Data $traffic_data ) {
		$this->day          = $day;
		$this->traffic_data = $traffic_data;
	}

	/**
	 * The array representation of this domain object.
	 *
	 * @return array<string|float|int|string[]>
	 */
	public function to_array(): array {
		$result        = [];
		$result['day'] = $this->day;


		return array_merge( $result, $this->traffic_data->to_array() );
	}
}

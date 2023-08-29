<?php

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\Values\Time_Interval;
/**
 * The Sales Helper.
 */
class Sales_Helper {

	/**
	 * The list of sales.
	 *
	 * @var array
	 */
	private $sales_list;

	/**
	 * Class constructor.
	 *
	 * @param array $sales_list The list of sales.
	 */
	public function __construct( array $sales_list = [] ) {
		$this->sales_list = $sales_list;
	}

	/**
	 * Whether the sale is effective.
	 *
	 * @param string $sale_name The name of the sale.
	 *
	 * @return bool Whether the sale is effective.
	 */
	public function is( string $sale_name ) {
		$time = \time();
		return $this->sales_list[ $sale_name ]->contains( $time );
	}

	/**
	 * Add a sale to the list.
	 *
	 * @param string        $sale_name The name of the sale.
	 * @param Time_Interval $time_interval The time interval of the sale.
	 *
	 * @return void
	 */
	public function add_sale( string $sale_name, Time_Interval $time_interval ) {
		$this->sales_list[ $sale_name ] = $time_interval;
	}

	/**
	 * Get the list of sales.
	 *
	 * @return array The list of sales.
	 */
	public function get_sales_list() {
		return $this->sales_list;
	}
}

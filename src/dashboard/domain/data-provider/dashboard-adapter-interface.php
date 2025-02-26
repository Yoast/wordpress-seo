<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Domain\Data_Provider;

/**
 * Interface describing the way an adapter gets data from data sources.
 */
interface Dashboard_Adapter_Interface {

	/**
	 * Method to get dashboard data from a data source.
	 *
	 * @param Parameters $parameters The parameter to get the dashboard data for.
	 *
	 * @return Data_Container
	 */
	public function get_data( Parameters $parameters ): Data_Container;

	/**
	 * Method to get comparison dashboard data from a data source.
	 *
	 * @param Parameters $parameters The parameter to get the dashboard data for.
	 *
	 * @return Data_Container
	 */
	public function get_comparison_data( Parameters $parameters ): Data_Container;
}

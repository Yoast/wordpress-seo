<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Analytics_4;

use Yoast\WP\SEO\Dashboard\Domain\Analytics_4\Failed_Request_Exception;
use Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Analytics_4_Parameters;

/**
 * Test class for the get_comparison_data() method when there's no permissions.
 *
 * @group analytics_4_adapter
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::build_parameters
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Analytics_4\Site_Kit_Analytics_4_Adapter::get_comparison_data
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Analytics_4_Adapter_Get_Comparison_Data_Failed_Request_Test extends Abstract_Analytics_4_Adapter_Test {

	/**
	 * Tests get_comparison_data() for unauthenticated requests.
	 *
	 * @return void
	 */
	public function test_get_comparison_data_no_permissions() {
		$request_parameters = new Analytics_4_Parameters();

		$request_parameters->set_start_date( '01-03-2025' );
		$request_parameters->set_end_date( '12-03-2025' );
		$request_parameters->set_compare_start_date( '01-02-2025' );
		$request_parameters->set_compare_end_date( '28-02-2025' );
		$request_parameters->set_metrics( [ 'sessions' ] );
		$request_parameters->set_dimension_filters( [ 'sessionDefaultChannelGrouping' => [ 'Organic Search' ] ] );

		$expected_message = 'The Analytics 4 request failed: Site Kit can’t access the relevant data from Analytics because you haven’t granted all permissions requested during setup.';

		$this->expectException( Failed_Request_Exception::class );
		$this->expectExceptionMessage( $expected_message );

		$this->instance->get_comparison_data( $request_parameters );
	}
}

<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Search_Console;

use Mockery;
use WP_REST_Response;
use Yoast\WP\SEO\Dashboard\Domain\Search_Console\Unexpected_Response_Exception;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Search_Console_Parameters;

/**
 * Test class for the get_data method when response is not an array of ApiDataRow objects.
 *
 * @group search_console_adapter
 *
 * @requires PHP >= 7.4
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter::build_parameters
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter::get_data
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter::parse_response
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Search_Console_Adapter_Get_Data_Unexpected_Response_Test extends Abstract_Search_Console_Adapter_Test {

	/**
	 * Tests get_data() for unexpected response for not being an array of ApiDataRow objects.
	 *
	 * @return void
	 */
	public function test_validate_response_unexpected_response_not_apidatarows() {

		$request_parameters = new Search_Console_Parameters();
		$request_parameters->set_start_date( '31-05-1988' );
		$request_parameters->set_end_date( '06-03-2025' );
		$request_parameters->set_dimensions( [ 'query' ] );

		$expected_message = 'The response from Google Site Kit did not have an expected format.';

		$api_response_mock = Mockery::mock( WP_REST_Response::class );
		$api_response_mock->expects( 'get_data' )->once()->andReturn( [ 'string and not an ApiDataRow' ] );
		$api_response_mock->expects( 'is_error' )->once()->andReturnFalse();

		$expected_parameters = [
			'startDate'  => '31-05-1988',
			'endDate'    => '06-03-2025',
			'dimensions' => [ 'query' ],
		];
		$this->search_console_api_call_mock->expects( 'do_request' )
			->with( $expected_parameters )
			->andReturn( $api_response_mock );

		$this->expectException( Unexpected_Response_Exception::class );
		$this->expectExceptionMessage( $expected_message );

		$this->instance->get_data( $request_parameters );
	}
}

<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Search_Console;

use Mockery;
use Yoast\WP\SEO\Dashboard\Domain\Search_Console\Unexpected_Response_Exception;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Search_Console_Parameters;

/**
 * Test class for the get_comparison_data method when response is not an array of ApiDataRow objects.
 *
 * @group search_console_adapter
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter::build_parameters
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter::get_comparison_data
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter::parse_comparison_response
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Search_Console_Adapter_Get_Comparison_Data_Unexpected_Response_Test extends Abstract_Search_Console_Adapter_Test {

	/**
	 * Tests get_comparison_data() for unexpected response for not being an array of ApiDataRow objects.
	 *
	 * @return void
	 */
	public function test_validate_response_unexpected_response_not_apidatarows() {
		self::$search_console_module = Mockery::mock( Search_Console_Module_Mock::class );
		$this->instance->set_search_console_module( self::$search_console_module );

		$request_parameters = new Search_Console_Parameters();
		$request_parameters->set_start_date( '01-03-2025' );
		$request_parameters->set_end_date( '12-03-2025' );
		$request_parameters->set_compare_start_date( '01-02-2025' );
		$request_parameters->set_dimensions( [ 'date' ] );

		$expected_message = 'The response from Google Site Kit did not have an expected format.';

		self::$search_console_module->expects( 'get_data' )
			->once()
			->andReturn( [ 'string and not an ApiDataRow' ] );

		$this->expectException( Unexpected_Response_Exception::class );
		$this->expectExceptionMessage( $expected_message );

		$this->instance->get_comparison_data( $request_parameters );
	}
}

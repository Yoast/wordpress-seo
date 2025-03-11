<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Search_Console;

use Brain\Monkey;
use Yoast\WP\SEO\Dashboard\Domain\Search_Console\Failed_Request_Exception;
use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Search_Console_Parameters;

/**
 * Test class for the permission_manage_options method.
 *
 * @group search_console_adapter
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter::get_data
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Search_Console_Adapter_Get_Data_Test extends Abstract_Search_Console_Adapter_Test {

	/**
	 * Tests get_data().
	 *
	 * @return void
	 */
	public function test_get_data() {
		$request_parameters = new Search_Console_Parameters();

		$request_parameters->set_start_date( '31-05-1988' );
		$request_parameters->set_end_date( '06-03-2025' );
		$request_parameters->set_dimensions( [ 'query' ] );

		$expected_message = 'The Search Console request failed: Site Kit can’t access the relevant data from Search Console because you haven’t granted all permissions requested during setup.';

		$this->expectException( Failed_Request_Exception::class );
		$this->expectExceptionMessage( $expected_message );

		$this->instance->get_data( $request_parameters );
	}
}

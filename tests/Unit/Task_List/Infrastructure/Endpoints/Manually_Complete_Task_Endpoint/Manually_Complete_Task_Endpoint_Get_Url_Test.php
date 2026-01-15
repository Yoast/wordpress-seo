<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure\Endpoints\Manually_Complete_Task_Endpoint;

use Brain\Monkey;
use Yoast\WP\SEO\Task_List\User_Interface\Tasks\Manually_Complete_Task_Route;

/**
 * Test class for get_url.
 *
 * @group Manually_Complete_Task_Endpoint
 *
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Endpoints\Manually_Complete_Task_Endpoint::get_url
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Manually_Complete_Task_Endpoint_Get_Url_Test extends Abstract_Manually_Complete_Task_Endpoint_Test {

	/**
	 * Tests the get_url method.
	 *
	 * @return void
	 */
	public function test_get_url() {
		$expected_url = 'https://example.com/wp-json/' . Manually_Complete_Task_Route::ROUTE_NAMESPACE . Manually_Complete_Task_Route::ROUTE_NAME;

		Monkey\Functions\expect( 'rest_url' )
			->once()
			->with( Manually_Complete_Task_Route::ROUTE_NAMESPACE . Manually_Complete_Task_Route::ROUTE_NAME )
			->andReturn( $expected_url );

		$result = $this->instance->get_url();

		$this->assertSame( $expected_url, $result );
	}
}

<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Configuration;

use Mockery;
use Yoast\WP\SEO\Task_List\Domain\Endpoint\Endpoint_List;

/**
 * Test class for getting configuration.
 *
 * @group Task_List_Configuration
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Configuration\Task_List_Configuration::get_configuration
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Task_List_Configuration_Get_Configuration_Test extends Abstract_Task_List_Configuration_Test {

	/**
	 * Tests getting the configuration.
	 *
	 * @return void
	 */
	public function test_get_configuration() {
		$endpoint_list = Mockery::mock( Endpoint_List::class );
		$endpoint_list->expects( 'to_array' )
			->once()
			->andReturn( [ 'endpoint1', 'endpoint2' ] );

		$this->options_helper->expects( 'get' )
			->once()
			->with( 'enable_task_list', true )
			->andReturn( true );

		$this->endpoints_repository->expects( 'get_all_endpoints' )
			->once()
			->andReturn( $endpoint_list );

		$expected = [
			'enabled'   => true,
			'endpoints' => [ 'endpoint1', 'endpoint2' ],
		];

		$result = $this->instance->get_configuration();

		$this->assertSame( $expected, $result );
	}
}

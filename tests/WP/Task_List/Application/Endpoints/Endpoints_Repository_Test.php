<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Task_List\Application\Endpoints;

use Yoast\WP\SEO\Task_List\Application\Endpoints\Endpoints_Repository;
use Yoast\WP\SEO\Task_List\Domain\Endpoint\Endpoint_Interface;
use Yoast\WP\SEO\Task_List\Infrastructure\Endpoints\Complete_Task_Endpoint;
use Yoast\WP\SEO\Task_List\Infrastructure\Endpoints\Get_Tasks_Endpoint;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Test class for the Endpoints Repository.
 *
 * @group Endpoints_Repository
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Endpoints\Endpoints_Repository::__construct
 * @covers Yoast\WP\SEO\Task_List\Application\Endpoints\Endpoints_Repository::get_all_endpoints
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Endpoints\Complete_Task_Endpoint::get_name
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Endpoints\Complete_Task_Endpoint::get_namespace
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Endpoints\Complete_Task_Endpoint::get_route
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Endpoints\Complete_Task_Endpoint::get_url
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Endpoints\Get_Tasks_Endpoint::get_name
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Endpoints\Get_Tasks_Endpoint::get_namespace
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Endpoints\Get_Tasks_Endpoint::get_route
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Endpoints\Get_Tasks_Endpoint::get_url
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Endpoints_Repository_Test extends TestCase {

	/**
	 * Tests if endpoints make it into the endpoint list with the needed data.
	 *
	 * @dataProvider data_get_all_endpoints
	 *
	 * @param Endpoint_Interface[] $endpoints     List of possible endpoints.
	 * @param array<string>        $expected_list Expected endpoint list.
	 *
	 * @return void
	 */
	public function test_get_all_endpoints( array $endpoints, array $expected_list ) {
		$instance = new Endpoints_Repository( ...$endpoints );

		$this->assertEquals( $expected_list, $instance->get_all_endpoints()->to_array() );
	}

	/**
	 * Data provider for test_get_all_endpoints.
	 *
	 * @return array<string, array<string, Endpoint_Interface[]|array<string, string>>>
	 */
	public static function data_get_all_endpoints() {
		$complete_task_endpoint = new Complete_Task_Endpoint();
		$get_tasks_endpoint     = new Get_Tasks_Endpoint();

		return [
			'All endpoints' => [
				'endpoints'     => [ $complete_task_endpoint, $get_tasks_endpoint ],
				'expected_list' => [
					'completeTask' => 'http://example.org/index.php?rest_route=/yoast/v1/complete_task',
					'getTasks'     => 'http://example.org/index.php?rest_route=/yoast/v1/get_tasks',
				],
			],
			'Complete task endpoint only' => [
				'endpoints'     => [ $complete_task_endpoint ],
				'expected_list' => [
					'completeTask' => 'http://example.org/index.php?rest_route=/yoast/v1/complete_task',
				],
			],
			'Get tasks endpoint only' => [
				'endpoints'     => [ $get_tasks_endpoint ],
				'expected_list' => [
					'getTasks' => 'http://example.org/index.php?rest_route=/yoast/v1/get_tasks',
				],
			],
			'No endpoints' => [
				'endpoints'     => [],
				'expected_list' => [],
			],
		];
	}
}

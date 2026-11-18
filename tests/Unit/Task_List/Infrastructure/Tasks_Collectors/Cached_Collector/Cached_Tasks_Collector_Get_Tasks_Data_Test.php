<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure\Tasks_Collectors\Cached_Collector;

use Brain\Monkey\Functions;
use WPSEO_Utils;
use Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Tasks_Collector;

/**
 * Test class for get_tasks_data.
 *
 * @group Cached_Tasks_Collector
 *
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Cached_Tasks_Collector::get_tasks_data
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Cached_Tasks_Collector_Get_Tasks_Data_Test extends Abstract_Cached_Tasks_Collector_Test {

	/**
	 * Tests get_tasks_data when cache exists.
	 *
	 * @dataProvider data_get_tasks_data_cached
	 *
	 * @param string                                    $cached_json    The cached JSON string.
	 * @param array<string, array<string, string|bool>> $expected_tasks The expected decoded tasks array.
	 *
	 * @return void
	 */
	public function test_get_tasks_data_cached( $cached_json, $expected_tasks ) {
		Functions\expect( 'get_transient' )
			->once()
			->with( 'wpseo_task_list_tasks' )
			->andReturn( $cached_json );

		$this->tasks_collector->expects( 'get_tasks_data' )->never();

		Functions\expect( 'set_transient' )->never();

		$result = $this->instance->get_tasks_data();

		$this->assertSame( $expected_tasks, $result );
	}

	/**
	 * Tests get_tasks_data when cache does not exist.
	 *
	 * @dataProvider data_get_tasks_data_uncached
	 *
	 * @param array<string, array<string, string|bool>> $tasks_data     The tasks data from collector.
	 * @param array<string, array<string, string|bool>> $expected_tasks The expected tasks array.
	 *
	 * @return void
	 */
	public function test_get_tasks_data_uncached( $tasks_data, $expected_tasks ) {
		Functions\expect( 'get_transient' )
			->once()
			->with( 'wpseo_task_list_tasks' )
			->andReturn( false );

		$this->tasks_collector->expects( 'get_tasks_data' )
			->once()
			->andReturn( $tasks_data );

		Functions\expect( 'set_transient' )
			->once()
			->with( 'wpseo_task_list_tasks', WPSEO_Utils::format_json_encode( $tasks_data ), \MINUTE_IN_SECONDS );

		$result = $this->instance->get_tasks_data();

		$this->assertSame( $expected_tasks, $result );
	}

	/**
	 * Tests get_tasks_data when cache is empty but valid.
	 *
	 * @return void
	 */
	public function test_get_tasks_data_empty_cache() {
		Functions\expect( 'get_transient' )
			->once()
			->with( 'wpseo_task_list_tasks' )
			->andReturn( '[]' );

		$this->tasks_collector->expects( 'get_tasks_data' )->never();

		Functions\expect( 'set_transient' )->never();

		$result = $this->instance->get_tasks_data();

		$this->assertSame( [], $result );
	}

	/**
	 * Data provider for test_get_tasks_data_cached.
	 *
	 * @return array<string, array<string, string|array>>
	 */
	public static function data_get_tasks_data_cached() {
		return [
			'Single task cached' => [
				'cached_json'    => '{"complete-ftc":{"id":"complete-ftc","title":"Complete First Time Configuration","is_complete":false,"priority":"high","duration":15}}',
				'expected_tasks' => [
					'complete-ftc' => [
						'id'          => 'complete-ftc',
						'title'       => 'Complete First Time Configuration',
						'is_complete' => false,
						'priority'    => 'high',
						'duration'    => 15,
					],
				],
			],
			'Multiple tasks cached' => [
				'cached_json'    => '{"complete-ftc":{"id":"complete-ftc","title":"Complete FTC","is_complete":true,"priority":"high","duration":15},"create-content":{"id":"create-content","title":"Create New Content","is_complete":false,"priority":"medium","duration":30}}',
				'expected_tasks' => [
					'complete-ftc' => [
						'id'          => 'complete-ftc',
						'title'       => 'Complete FTC',
						'is_complete' => true,
						'priority'    => 'high',
						'duration'    => 15,
					],
					'create-content' => [
						'id'          => 'create-content',
						'title'       => 'Create New Content',
						'is_complete' => false,
						'priority'    => 'medium',
						'duration'    => 30,
					],
				],
			],
		];
	}

	/**
	 * Data provider for test_get_tasks_data_uncached.
	 *
	 * @return array<string, array<string, string|array>>
	 */
	public static function data_get_tasks_data_uncached() {
		$single_task_data = [
			'complete-ftc' => [
				'id'          => 'complete-ftc',
				'title'       => 'Complete First Time Configuration',
				'is_complete' => false,
				'priority'    => 'high',
				'duration'    => 15,
			],
		];

		$multiple_tasks_data = [
			'complete-ftc' => [
				'id'          => 'complete-ftc',
				'title'       => 'Complete FTC',
				'is_complete' => true,
				'priority'    => 'high',
				'duration'    => 15,
			],
			'create-content' => [
				'id'          => 'create-content',
				'title'       => 'Create New Content',
				'is_complete' => false,
				'priority'    => 'medium',
				'duration'    => 30,
			],
		];

		return [
			'Single task uncached' => [
				'tasks_data'          => $single_task_data,
				'expected_tasks'      => $single_task_data,
			],
			'Multiple tasks uncached' => [
				'tasks_data'          => $multiple_tasks_data,
				'expected_tasks'      => $multiple_tasks_data,
			],
			'Empty tasks uncached' => [
				'tasks_data'          => [],
				'expected_tasks'      => [],
			],
		];
	}
}

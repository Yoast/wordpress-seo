<?php

namespace Yoast\WP\SEO\Tests\Unit\Introductions\Application;

use Brain\Monkey;
use Yoast\WP\SEO\Introductions\Application\Introductions_Collector;
use Yoast\WP\SEO\Tests\Unit\Doubles\Introductions\Introduction_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the introductions collector.
 *
 * @group introductions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Introductions\Application\Introductions_Collector
 */
class Introductions_Collector_Test extends TestCase {

	/**
	 * Tests the constructor and filter.
	 *
	 * @covers ::__construct
	 * @covers ::add_introductions
	 * @covers ::get_for
	 * @covers ::get_metadata
	 * @covers ::is_seen
	 *
	 * @dataProvider collector_get_data
	 *
	 * @param array $initial_introductions       The introductions via dependency injection.
	 * @param array $filtered_introductions      The introductions after the filter.
	 * @param mixed $user_introductions_metadata The WP response to the requesting of the user introductions metadata.
	 * @param array $expected_result             The array with the applicable introduction data.
	 *
	 * @return void
	 */
	public function test_collector_get_for(
		$initial_introductions,
		$filtered_introductions,
		$user_introductions_metadata,
		$expected_result
	) {
		Monkey\Filters\expectApplied( 'wpseo_introductions' )
			->once()
			->with( $initial_introductions )
			->andReturn( $filtered_introductions );
		Monkey\Functions\expect( 'get_user_meta' )
			->once()
			->with( 1, '_yoast_wpseo_introductions', true )
			->andReturn( $user_introductions_metadata );

		$sut = new Introductions_Collector( ...$initial_introductions );
		$this->assertEquals( $expected_result, $sut->get_for( 1 ) );
	}

	/**
	 * Data provider for the `test_collector_get()` test.
	 *
	 * @return array
	 */
	public function collector_get_data() {
		$introductions = [
			'test1' => new Introduction_Mock( 'test1', 1, true ),
			'test2' => new Introduction_Mock( 'test2', 2, true ),
			'test3' => new Introduction_Mock( 'test3', 3, false ),
		];

		return [
			'no introductions'                                  => [
				'initial_introductions'       => [],
				'filtered_introductions'      => [],
				'user_introductions_metadata' => [],
				'expected_result'             => [],
			],
			'has one initial introduction'                      => [
				'initial_introductions'       => [
					$introductions['test1'],
				],
				'filtered_introductions'      => [
					$introductions['test1'],
				],
				'user_introductions_metadata' => [],
				'expected_result'             => [
					[
						'id'       => 'test1',
						'priority' => 1,
					],
				],
			],
			'can add an introduction via the filter'            => [
				'initial_introductions'       => [
					$introductions['test1'],
				],
				'filtered_introductions'      => [
					$introductions['test1'],
					$introductions['test2'],
				],
				'user_introductions_metadata' => [],
				'expected_result'             => [
					[
						'id'       => 'test1',
						'priority' => 1,
					],
					[
						'id'       => 'test2',
						'priority' => 2,
					],
				],
			],
			'can replace an initial introduction in the filter' => [
				'initial_introductions'       => [
					$introductions['test1'],
				],
				'filtered_introductions'      => [
					$introductions['test2'],
				],
				'user_introductions_metadata' => [],
				'expected_result'             => [
					[
						'id'       => 'test2',
						'priority' => 2,
					],
				],
			],
			'can remove an initial introduction in the filter'  => [
				'initial_introductions'       => [
					$introductions['test1'],
					$introductions['test2'],
				],
				'filtered_introductions'      => [
					$introductions['test2'],
				],
				'user_introductions_metadata' => [],
				'expected_result'             => [
					[
						'id'       => 'test2',
						'priority' => 2,
					],
				],
			],
			'ignores introductions that should not show'        => [
				'initial_introductions'       => [
					$introductions['test1'],
					$introductions['test3'],
				],
				'filtered_introductions'      => [
					$introductions['test1'],
					$introductions['test3'],
				],
				'user_introductions_metadata' => [],
				'expected_result'             => [
					[
						'id'       => 'test1',
						'priority' => 1,
					],
				],
			],
			'ignores introductions that are already seen'       => [
				'initial_introductions'       => [
					$introductions['test1'],
					$introductions['test2'],
					$introductions['test3'],
				],
				'filtered_introductions'      => [
					$introductions['test1'],
					$introductions['test2'],
					$introductions['test3'],
				],
				'user_introductions_metadata' => [
					'test1' => true,
				],
				'expected_result'             => [
					[
						'id'       => 'test2',
						'priority' => 2,
					],
				],
			],
			'can handle metadata failure'                       => [
				'initial_introductions'       => [
					$introductions['test1'],
					$introductions['test2'],
					$introductions['test3'],
				],
				'filtered_introductions'      => [
					$introductions['test1'],
					$introductions['test2'],
					$introductions['test3'],
				],
				'user_introductions_metadata' => false,
				'expected_result'             => [
					[
						'id'       => 'test1',
						'priority' => 1,
					],
					[
						'id'       => 'test2',
						'priority' => 2,
					],
				],
			],
			'ignores unknown filter input'                      => [
				'initial_introductions'       => [
					$introductions['test1'],
					$introductions['test2'],
					$introductions['test3'],
				],
				'filtered_introductions'      => [
					$introductions['test1'],
					'bar',
					1,
					true,
					(object) [ 'foo' ],
				],
				'user_introductions_metadata' => [],
				'expected_result'             => [
					[
						'id'       => 'test1',
						'priority' => 1,
					],
				],
			],
		];
	}
}

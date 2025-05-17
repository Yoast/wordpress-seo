<?php

namespace Yoast\WP\SEO\Tests\Unit\Analytics\Application;

use Brain\Monkey;
use Yoast\WP\SEO\Analytics\Application\Missing_Indexables_Collector;
use Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Indexing\Abstract_Indexing_Action_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Missing_Indexables_Collector_Test.
 *
 * @group analytics
 *
 * @coversDefaultClass \Yoast\WP\SEO\Analytics\Application\Missing_Indexables_Collector
 */
final class Missing_Indexables_Collector_Test extends TestCase {

	/**
	 * Tests the constructor and filter.
	 *
	 * @covers ::__construct
	 * @covers ::add_additional_indexing_actions
	 *
	 * @dataProvider collector_get_data
	 *
	 * @param array                           $additional_indexation_actions All the indexations actions that are added via the filter.
	 * @param Abstract_Indexing_Action_Double $initial_indexation_actions    The initial indexation actions available in free.
	 * @param array                           $expected_result               The expected result.
	 *
	 * @return void
	 */
	public function test_collector_get( $additional_indexation_actions, $initial_indexation_actions, $expected_result ) {
		Monkey\Functions\expect( 'apply_filters' )->once()->andReturn( $additional_indexation_actions );

		$sut = new Missing_Indexables_Collector( $initial_indexation_actions );
		$this->assertEquals(
			$expected_result,
			$sut->get()
		);
	}

	/**
	 * Data provider for the `test_collector_get()` test.
	 *
	 * @return array
	 */
	public static function collector_get_data() {
		$indexation_action = new Abstract_Indexing_Action_Double();

		return [
			[
				[ $indexation_action, $indexation_action ],
				$indexation_action,
				[
					'missing_indexables' => [
						[
							'indexable_type' => Abstract_Indexing_Action_Double::class,
							'count'          => 15,
						],
						[
							'indexable_type' => Abstract_Indexing_Action_Double::class,
							'count'          => 15,
						],
					],
				],
			],
			[

				[ $indexation_action, 'somerandomobject' ],
				$indexation_action,
				[
					'missing_indexables' => [
						[
							'indexable_type' => Abstract_Indexing_Action_Double::class,
							'count'          => 15,
						],
					],
				],

			],
			[

				null,
				$indexation_action,
				[ 'missing_indexables' => [] ],

			],
		];
	}
}

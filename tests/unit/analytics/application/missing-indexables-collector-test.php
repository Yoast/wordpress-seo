<?php

namespace Yoast\WP\SEO\Tests\Unit\Analytics\Application;

use Brain\Monkey;
use Yoast\WP\SEO\Analytics\Application\Missing_Indexables_Collector;
use Yoast\WP\SEO\Tests\Unit\Doubles\Actions\indexing\Abstract_Indexing_Action_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Missing_Indexables_Collector_Test.
 *
 * @group  analytics
 *
 * @coversDefaultClass \Yoast\WP\SEO\Analytics\Application\Missing_Indexables_Collector
 */
class Missing_Indexables_Collector_Test extends TestCase {

	/**
	 * Tests the constructor and filter.
	 *
	 * @covers ::__construct
	 * @covers ::add_additional_indexing_actions
	 * @return void
	 */
	public function test__contruct_with_added_action() {
		$indexation_action = new Abstract_Indexing_Action_Double();
		Monkey\Functions\expect( 'apply_filters' )->once()->andReturn( [ $indexation_action, $indexation_action ] );

		$sut = new Missing_Indexables_Collector( $indexation_action );
		$this->assertEquals(
			[
				[
					'indexable_type' => 'Yoast\WP\SEO\Tests\Unit\Doubles\Actions\indexing\Abstract_Indexing_Action_Double',
					'count'          => 15,
				],
				[
					'indexable_type' => 'Yoast\WP\SEO\Tests\Unit\Doubles\Actions\indexing\Abstract_Indexing_Action_Double',
					'count'          => 15,
				],
			],
			$sut->get()
		);
	}

	/**
	 * Tests the constructor and filter.
	 *
	 * @covers ::__construct
	 * @covers ::add_additional_indexing_actions
	 * @return void
	 */
	public function test__contruct_without_added_action() {
		$indexation_action = new Abstract_Indexing_Action_Double();
		Monkey\Functions\expect( 'apply_filters' )->once()->andReturn( [ $indexation_action, [ 'somerandomobject' ] ] );

		$sut = new Missing_Indexables_Collector( $indexation_action );
		$this->assertEquals(
			[
				[
					'indexable_type' => 'Yoast\WP\SEO\Tests\Unit\Doubles\Actions\indexing\Abstract_Indexing_Action_Double',
					'count'          => 15,
				],
			],
			$sut->get()
		);
	}

	/**
	 * Tests the get function
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_with_data() {
		$indexation_action = new Abstract_Indexing_Action_Double();
		$sut               = new Missing_Indexables_Collector( $indexation_action );
		$this->assertEquals(
			[
				[
					'indexable_type' => 'Yoast\WP\SEO\Tests\Unit\Doubles\Actions\indexing\Abstract_Indexing_Action_Double',
					'count'          => 15,
				],
			],
			$sut->get()
		);
	}

	/**
	 * Tests the get function
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_with_no_data() {
		$sut = new Missing_Indexables_Collector();
		$this->assertEquals(
			[],
			$sut->get()
		);
	}
}

<?php

namespace Yoast\WP\SEO\Analytics\Framework;

use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Tests\Unit\Doubles\Actions\indexing\Abstract_Indexing_Action_Double;

/**
 * Class Missing_Indexables_Collector_Test.
 *
 * @group  analytics
 *
 * @coversDefaultClass Missing_Indexables_Collector
 * @covers Missing_Indexables_Collector_Test
 */
class Missing_Indexables_Collector_Test extends TestCase {

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
					'indexable_type' => 'wpseo_unindexed_double',
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

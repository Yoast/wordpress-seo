<?php

namespace Yoast\WP\SEO\Tests\Unit\Analytics\Domain;

use Yoast\WP\SEO\Analytics\Domain\Missing_Indexable_Count;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Missing_Indexable_Count_Test.
 *
 * @group analytics
 *
 * @coversDefaultClass \Yoast\WP\SEO\Analytics\Domain\Missing_Indexable_Count
 */
final class Missing_Indexable_Count_Test extends TestCase {

	/**
	 * The sut.
	 *
	 * @var Missing_Indexable_Count
	 */
	private $sut;

	/**
	 * The setup methods.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();

		$this->sut = new Missing_Indexable_Count( 'indexable_type', 0 );
	}

	/**
	 * Tests the to_array functionality.
	 *
	 * @covers ::to_array
	 * @return void
	 */
	public function test_missing_indexable_count_to_array(): void {
		$this->assertEquals(
			[
				'indexable_type' => 'indexable_type',
				'count'          => 0,
			],
			$this->sut->to_array()
		);
	}

	/**
	 * Tests the get_indexable_type functionality.
	 *
	 * @covers ::get_indexable_type
	 * @return void
	 */
	public function test_missing_indexable_count_get_indexable_type(): void {
		$this->assertSame( 'indexable_type', $this->sut->get_indexable_type() );
	}

	/**
	 * Tests the get_count functionality.
	 *
	 * @covers ::get_count
	 * @return void
	 */
	public function test_missing_indexable_count_get_count(): void {
		$this->assertSame( 0, $this->sut->get_count() );
	}
}

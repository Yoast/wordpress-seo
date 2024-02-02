<?php

namespace Yoast\WP\SEO\Tests\Unit\Analytics\Domain;

use Yoast\WP\SEO\Analytics\Domain\To_Be_Cleaned_Indexable_Count;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class To_Be_Cleaned_Indexable_Count_Test.
 *
 * @group analytics
 *
 * @coversDefaultClass \Yoast\WP\SEO\Analytics\Domain\To_Be_Cleaned_Indexable_Count
 */
final class To_Be_Cleaned_Indexable_Count_Test extends TestCase {

	/**
	 * The sut.
	 *
	 * @var To_Be_Cleaned_Indexable_Count
	 */
	private $sut;

	/**
	 * The setup methods.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();

		$this->sut = new To_Be_Cleaned_Indexable_Count( 'cleanup_name', 0 );
	}

	/**
	 * Tests the to_array functionality.
	 *
	 * @covers ::to_array
	 * @return void
	 */
	public function test_to_be_cleaned_count_to_array(): void {
		$this->assertEquals(
			[
				'count'        => 0,
				'cleanup_name' => 'cleanup_name',
			],
			$this->sut->to_array()
		);
	}

	/**
	 * Tests the get_cleanup_name functionality.
	 *
	 * @covers ::get_cleanup_name
	 * @return void
	 */
	public function test_to_be_cleaned_indexable_name(): void {
		$this->assertEquals( 'cleanup_name', $this->sut->get_cleanup_name() );
	}

	/**
	 * Tests the get_count functionality.
	 *
	 * @covers ::get_count
	 * @return void
	 */
	public function test_to_be_cleaned_count_get_count(): void {
		$this->assertEquals( 0, $this->sut->get_count() );
	}
}

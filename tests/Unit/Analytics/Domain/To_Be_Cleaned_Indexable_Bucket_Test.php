<?php

namespace Yoast\WP\SEO\Tests\Unit\Analytics\Domain;

use Yoast\WP\SEO\Analytics\Domain\To_Be_Cleaned_Indexable_Bucket;
use Yoast\WP\SEO\Analytics\Domain\To_Be_Cleaned_Indexable_Count;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class To_Be_Cleaned_Indexable_Bucket_Test.
 *
 * @group analytics
 *
 * @coversDefaultClass \Yoast\WP\SEO\Analytics\Domain\To_Be_Cleaned_Indexable_Bucket
 */
final class To_Be_Cleaned_Indexable_Bucket_Test extends TestCase {

	/**
	 * The sut.
	 *
	 * @var To_Be_Cleaned_Indexable_Bucket
	 */
	private $sut;

	/**
	 * The setup method.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();

		$this->sut = new To_Be_Cleaned_Indexable_Bucket();
	}

	/**
	 * Tests functionality of the domain object.
	 *
	 * @covers ::add_to_be_cleaned_indexable_count
	 * @covers ::to_array
	 *
	 * @return void
	 */
	public function test_missing_indexable_bucket(): void {
		$count = new To_Be_Cleaned_Indexable_Count( 'cleanup_name', 0 );

		$this->sut->add_to_be_cleaned_indexable_count( $count );

		$this->assertEquals(
			[
				0 => [
					'count'        => 0,
					'cleanup_name' => 'cleanup_name',
				],
			],
			$this->sut->to_array()
		);
	}
}

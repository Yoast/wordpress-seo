<?php

namespace Yoast\WP\SEO\Tests\Unit\Analytics\Domain;

use Yoast\WP\SEO\Analytics\Domain\Missing_Indexable_Bucket;
use Yoast\WP\SEO\Analytics\Domain\Missing_Indexable_Count;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Missing_Indexable_Bucket_Test.
 *
 * @group analytics
 *
 * @coversDefaultClass \Yoast\WP\SEO\Analytics\Domain\Missing_Indexable_Bucket
 */
final class Missing_Indexable_Bucket_Test extends TestCase {

	/**
	 * The sut.
	 *
	 * @var Missing_Indexable_Bucket
	 */
	private $sut;

	/**
	 * The setup method.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();

		$this->sut = new Missing_Indexable_Bucket();
	}

	/**
	 * Tests functionality of the domain object.
	 *
	 * @covers ::add_missing_indexable_count
	 * @covers ::to_array
	 *
	 * @return void
	 */
	public function test_missing_indexable_bucket(): void {
		$count = new Missing_Indexable_Count( 'indexable_type', 0 );

		$this->sut->add_missing_indexable_count( $count );

		$this->assertEquals(
			[
				0 => [
					'indexable_type' => 'indexable_type',
					'count'          => 0,
				],
			],
			$this->sut->to_array()
		);
	}
}

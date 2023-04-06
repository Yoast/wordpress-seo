<?php

namespace Yoast\WP\SEO\Analytics\Domain;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Missing_Indexable_Bucket_Test.
 *
 * @group  analytics
 *
 * @coversDefaultClass \Yoast\WP\SEO\Analytics\Domain\Missing_Indexable_Bucket
 * @covers \Yoast\WP\SEO\Analytics\Domain\Missing_Indexable_Bucket
 */
class Missing_Indexable_Bucket_Test extends TestCase {

	/**
	 * The sut.
	 *
	 * @var \Yoast\WP\SEO\Analytics\Domain\Missing_Indexable_Bucket
	 */
	private $sut;

	/**
	 * The setup method.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

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



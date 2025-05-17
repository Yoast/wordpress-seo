<?php

namespace Yoast\WP\SEO\Tests\Unit\Introductions\Domain;

use Yoast\WP\SEO\Introductions\Domain\Introduction_Item;
use Yoast\WP\SEO\Introductions\Domain\Introductions_Bucket;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the introductions bucket.
 *
 * @group introductions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Introductions\Domain\Introductions_Bucket
 */
final class Introductions_Bucket_Test extends TestCase {

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		$instance = new Introductions_Bucket();
		$this->assertEquals( [], $this->getPropertyValue( $instance, 'introductions' ) );
	}

	/**
	 * Tests adding introductions.
	 *
	 * @covers ::add_introduction
	 *
	 * @return void
	 */
	public function test_add_introduction() {
		$instance = new Introductions_Bucket();
		$item1    = new Introduction_Item( 'test1', 1 );
		$item2    = new Introduction_Item( 'test2', 2 );
		$instance->add_introduction( $item1 );
		$instance->add_introduction( $item2 );
		$this->assertEquals( [ $item1, $item2 ], $this->getPropertyValue( $instance, 'introductions' ) );
	}

	/**
	 * Tests converting items to an array.
	 *
	 * @covers ::to_array
	 *
	 * @return void
	 */
	public function test_to_array() {
		$instance = new Introductions_Bucket();
		$item1    = new Introduction_Item( 'test1', 1 );
		$item2    = new Introduction_Item( 'test2', 2 );
		$instance->add_introduction( $item1 );
		$instance->add_introduction( $item2 );
		$this->assertEquals(
			[
				[
					'id'       => 'test1',
					'priority' => 1,
				],
				[
					'id'       => 'test2',
					'priority' => 2,
				],
			],
			$instance->to_array()
		);
	}
}

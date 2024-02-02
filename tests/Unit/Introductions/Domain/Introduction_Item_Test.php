<?php

namespace Yoast\WP\SEO\Tests\Unit\Introductions\Domain;

use Yoast\WP\SEO\Introductions\Domain\Introduction_Item;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the introduction item.
 *
 * @group introductions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Introductions\Domain\Introduction_Item
 */
final class Introduction_Item_Test extends TestCase {

	/**
	 * Holds the test instance.
	 *
	 * @var Introduction_Item
	 */
	private $instance;

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();
		$this->instance = new Introduction_Item( 'test', 5 );
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertEquals( 'test', $this->getPropertyValue( $this->instance, 'id' ) );
		$this->assertEquals( 5, $this->getPropertyValue( $this->instance, 'priority' ) );
	}

	/**
	 * Tests converting to an array.
	 *
	 * @covers ::to_array
	 *
	 * @return void
	 */
	public function test_to_array() {
		$this->assertEquals(
			[
				'id'       => 'test',
				'priority' => 5,
			],
			$this->instance->to_array()
		);
	}

	/**
	 * Tests getting the ID.
	 *
	 * @covers ::get_id
	 *
	 * @return void
	 */
	public function test_get_id() {
		$this->assertEquals( 'test', $this->instance->get_id() );
	}

	/**
	 * Tests getting the priority.
	 *
	 * @covers ::get_priority
	 *
	 * @return void
	 */
	public function test_get_priority() {
		$this->assertEquals( 5, $this->instance->get_priority() );
	}
}

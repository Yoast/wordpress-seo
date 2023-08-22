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
class Introduction_Item_Test extends TestCase {

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
	 */
	public function test_construct() {
		$this->assertEquals( 'test', $this->getPropertyValue( $this->instance, 'name' ) );
		$this->assertEquals( 5, $this->getPropertyValue( $this->instance, 'priority' ) );
	}

	/**
	 * Tests converting to an array.
	 *
	 * @covers ::to_array
	 */
	public function test_to_array() {
		$this->assertEquals(
			[
				'name'     => 'test',
				'priority' => 5,
			],
			$this->instance->to_array()
		);
	}

	/**
	 * Tests getting the name.
	 *
	 * @covers ::get_name
	 */
	public function test_get_name() {
		$this->assertEquals( 'test', $this->instance->get_name() );
	}

	/**
	 * Tests getting the priority.
	 *
	 * @covers ::get_priority
	 */
	public function test_get_priority() {
		$this->assertEquals( 5, $this->instance->get_priority() );
	}
}

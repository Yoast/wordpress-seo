<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Front_End;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Robots_Helper;
use Yoast\WP\SEO\Integrations\Front_End\Indexing_Controls;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexing_Controls_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Front_End\Indexing_Controls
 *
 * @group integrations
 * @group front-end
 */
class Indexing_Controls_Test extends TestCase {

	/**
	 * Robots helper.
	 *
	 * @var Mockery\MockInterface|Robots_Helper
	 */
	private $robots;

	/**
	 * The test instance.
	 *
	 * @var Indexing_Controls|Mockery\MockInterface
	 */
	private $instance;

	/**
	 * Sets an instance for test purposes.
	 */
	protected function set_up() {
		parent::set_up();

		$this->robots   = Mockery::mock( Robots_Helper::class );
		$this->instance = Mockery::mock( Indexing_Controls::class )->makePartial()->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Front_End_Conditional::class ],
			Indexing_Controls::get_conditionals()
		);
	}

	/**
	 * Tests the situation where the request is performed by a robot.
	 *
	 * @covers ::noindex_robots
	 */
	public function test_no_index_robots() {
		Monkey\Functions\expect( 'is_robots' )
			->once()
			->andReturn( true );

		$this->instance
			->shouldReceive( 'set_robots_header' )
			->once()
			->andReturnTrue();

		$this->assertTrue( $this->instance->noindex_robots() );
	}

	/**
	 * Tests the situation where the request isn't performed by a robot.
	 *
	 * @covers ::noindex_robots
	 */
	public function test_no_index_and_is_no_robots() {
		Monkey\Functions\expect( 'is_robots' )->once()->andReturn( false );

		$this->instance->shouldNotReceive( 'set_robots_header' );

		$this->assertFalse( $this->instance->noindex_robots() );
	}

	/**
	 * Tests if the link is converted to a no-follow one.
	 *
	 * @covers ::nofollow_link
	 */
	public function test_nofollow_link() {
		$this->assertEquals(
			'<a rel="nofollow" href="#">A link</a>',
			$this->instance->nofollow_link( '<a href="#">A link</a>' )
		);
	}
}

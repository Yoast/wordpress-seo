<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Mockery;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Product_Helper_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Product_Helper
 *
 * @group helpers
 */
class Product_Helper_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Mockery\Mock|Product_Helper
	 */
	private $instance;

	/**
	 * Prepares the test.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = Mockery::mock( Product_Helper::class )
			->makePartial()
			->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Retrieves the name when premium is 'active'.
	 *
	 * @covers ::get_name
	 */
	public function test_get_name_premium() {
		$this->instance
			->expects( 'is_premium' )
			->once()
			->andReturnTrue();

		$this->assertEquals( 'Yoast SEO Premium plugin', $this->instance->get_name() );
	}

	/**
	 * Retrieves the name when premium is not 'active'.
	 *
	 * @covers ::get_name
	 */
	public function test_get_name_not_premium() {
		$this->instance
			->expects( 'is_premium' )
			->once()
			->andReturnFalse();

		$this->assertEquals( 'Yoast SEO plugin', $this->instance->get_name() );
	}
}

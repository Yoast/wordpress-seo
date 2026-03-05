<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Mockery;
use Yoast\WP\SEO\Conditionals\WordPress_Version_Conditional;
use Yoast\WP\SEO\Helpers\Wordpress_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the WordPress_Version_Conditional class.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\WordPress_Version_Conditional
 */
final class WordPress_Version_Conditional_Test extends TestCase {

	/**
	 * The WordPress helper mock.
	 *
	 * @var Mockery\MockInterface|Wordpress_Helper
	 */
	private $wordpress_helper;

	/**
	 * The instance under test.
	 *
	 * @var WordPress_Version_Conditional
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->wordpress_helper = Mockery::mock( Wordpress_Helper::class );
		$this->instance         = new WordPress_Version_Conditional( $this->wordpress_helper );
	}

	/**
	 * Tests that is_met returns true for WordPress 6.9.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met_returns_true_for_6_9() {
		$this->wordpress_helper
			->expects( 'get_wordpress_version' )
			->once()
			->andReturn( '6.9' );

		$this->assertTrue( $this->instance->is_met() );
	}

	/**
	 * Tests that is_met returns true for WordPress versions above 6.9.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met_returns_true_for_above_6_9() {
		$this->wordpress_helper
			->expects( 'get_wordpress_version' )
			->once()
			->andReturn( '7.0' );

		$this->assertTrue( $this->instance->is_met() );
	}

	/**
	 * Tests that is_met returns false for WordPress versions below 6.9.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met_returns_false_for_below_6_9() {
		$this->wordpress_helper
			->expects( 'get_wordpress_version' )
			->once()
			->andReturn( '6.8.1' );

		$this->assertFalse( $this->instance->is_met() );
	}
}

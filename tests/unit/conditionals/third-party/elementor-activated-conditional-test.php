<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals\Third_Party;

use Yoast\WP\SEO\Tests\Unit\TestCase;

use Brain\Monkey;
use Mockery;

use Yoast\WP\SEO\Conditionals\Third_Party\Elementor_Activated_Conditional;


/**
 * Class Elementor_Activated_Conditional_Test.
 *
 * @group conditionals/third-party
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Third_Party\Elementor_Activated_Conditional
 */
class Elementor_Activated_Conditional_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Elementor_Activated_Conditional
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Elementor_Activated_Conditional();
	}

	/**
	 * Tests that the condition is met when the Elementor plugin is active.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met() {
		Monkey\Functions\expect( 'is_plugin_active' )
			->once()
			->with( 'elementor/elementor.php' )
			->andReturn( true );

		self::assertTrue( $this->instance->is_met() );
	}

	/**
	 * Tests that the condition is not met when the Elementor plugin is not active.
	 *
	 * @covers ::is_met
	 */
	public function test_is_not_met() {
		Monkey\Functions\expect( 'is_plugin_active' )
			->once()
			->with( 'elementor/elementor.php' )
			->andReturn( false );

		self::assertFalse( $this->instance->is_met() );
	}
}

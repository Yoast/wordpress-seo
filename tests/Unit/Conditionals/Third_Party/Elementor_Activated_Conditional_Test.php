<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals\Third_Party;

use Yoast\WP\SEO\Conditionals\Third_Party\Elementor_Activated_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Elementor_Activated_Conditional_Test.
 *
 * @group conditionals
 * @group third-party
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Third_Party\Elementor_Activated_Conditional
 */
final class Elementor_Activated_Conditional_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Elementor_Activated_Conditional
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Elementor_Activated_Conditional();
	}

	/**
	 * Tests that the condition is not met when the Elementor plugin is not active.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_not_met() {
		self::assertFalse( $this->instance->is_met() );
	}

	/**
	 * Tests that the condition is met when the Elementor plugin is active.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met() {
		if ( ! \defined( 'ELEMENTOR__FILE__' ) ) {
			// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound -- Third party constant used in a test.
			\define( 'ELEMENTOR__FILE__', '/path/to/elementor/plugin_file.php' );
		}

		self::assertTrue( $this->instance->is_met() );
	}
}

<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Brain\Monkey;

use Yoast\WP\SEO\Conditionals\Third_Party\WPSEOML_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * WPSEOML_Conditional test.
 *
 * @group conditionals.
 *
 * @coversDefaultClass Yoast\WP\SEO\Conditionals\Third_Party\WPSEOML_Conditional
 */
class WPSEOML_Conditional_Test extends TestCase {

	/**
	 * The schema blocks feature flag conditional.
	 *
	 * @var WPSEOML_Conditional
	 */
	private $instance;

	/**
	 * Does the setup for testing.
	 */
	public function setUp() {
		parent::setUp();
		$this->instance = new WPSEOML_Conditional();
	}

	/**
	 * Tests whether the conditional is not met when the WPSEOML_VERSION constant is not defined.
	 *
	 * @covers ::is_met
	 */
	public function test_is_not_met() {
		Monkey\Functions\expect( 'is_plugin_active' )
			->with( 'wp-seo-multilingual/plugin.php' )
			->andReturn( false );

		self::assertFalse( $this->instance->is_met() );
	}

	/**
	 * Tests whether the conditional is met when the WPSEOML_VERSION constant is not defined.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met() {
		Monkey\Functions\expect( 'is_plugin_active' )
			->with( 'wp-seo-multilingual/plugin.php' )
			->andReturn( true );

		self::assertTrue( $this->instance->is_met() );
	}
}

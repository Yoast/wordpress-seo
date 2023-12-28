<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Third_Party\WPML_WPSEO_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * WPML_WPSEO_Conditional test.
 *
 * @group conditionals
 *
 * @coversDefaultClass Yoast\WP\SEO\Conditionals\Third_Party\WPML_WPSEO_Conditional
 */
final class WPML_WPSEO_Conditional_Test extends TestCase {

	/**
	 * The schema blocks feature flag conditional.
	 *
	 * @var WPML_WPSEO_Conditional
	 */
	protected $instance;

	/**
	 * Does the setup for testing.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();
		$this->instance = new WPML_WPSEO_Conditional();
	}

	/**
	 * Tests whether the conditional is not met when the plugin is inactive.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_not_met() {
		Monkey\Functions\expect( 'is_plugin_active' )
			->with( 'wp-seo-multilingual/plugin.php' )
			->andReturn( false );

		self::assertFalse( $this->instance->is_met() );
	}

	/**
	 * Tests whether the conditional is met when the plugin is active.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met() {
		Monkey\Functions\expect( 'is_plugin_active' )
			->with( 'wp-seo-multilingual/plugin.php' )
			->andReturn( true );

		self::assertTrue( $this->instance->is_met() );
	}
}

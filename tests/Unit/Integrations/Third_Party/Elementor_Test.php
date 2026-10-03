<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Third_Party;

use ReflectionClass;
use Yoast\WP\SEO\Integrations\Third_Party\Elementor;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Elementor_Test.
 *
 * @group integrations
 * @group third-party
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\Elementor
 */
final class Elementor_Test extends TestCase {

	/**
	 * Tests that the V4 atomic gate short-circuits to false when Elementor is not loaded, rather
	 * than throwing — the defensive guard that keeps the V4 bundle from being enqueued on sites
	 * without Elementor.
	 *
	 * @covers ::is_elementor_v4_atomic_active
	 *
	 * @return void
	 */
	public function test_v4_atomic_inactive_when_elementor_is_not_loaded() {
		// Elementor is not loaded in the unit-test environment, so the gate must short-circuit.
		self::assertFalse( \class_exists( '\Elementor\Plugin' ) );

		$reflection = new ReflectionClass( Elementor::class );
		$instance   = $reflection->newInstanceWithoutConstructor();
		$method     = $reflection->getMethod( 'is_elementor_v4_atomic_active' );
		$method->setAccessible( true );

		self::assertFalse( $method->invoke( $instance ) );
	}
}

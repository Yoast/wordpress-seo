<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Integrations;

use Generator;

/**
 * Test class for the is_ga_connected method.
 *
 * @group site-kit
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::is_ga_connected
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Is_Site_Kit_Ga_Connected_Test extends Abstract_Site_Kit_Test {

	/**
	 * Tests if Site kit consent is granted.
	 *
	 * @dataProvider generate_site_kit_ga_connected_provider
	 *
	 * @param bool $expected The expected value.
	 *
	 * @return void
	 */
	public function test_is_site_kit_ga_connected( bool $expected ) {
		$this->site_kit_is_connected_call->expects( 'is_ga_connected' )->once()->andReturn( $expected );

		$this->assertSame( $expected, $this->instance->is_ga_connected() );
	}

	/**
	 * Provides data testing if the Site Kit GA plugin is enabled.
	 *
	 * @return Generator Test data to use.
	 */
	public static function generate_site_kit_ga_connected_provider() {
		yield 'Ga connected' => [
			'expected' => true,
		];

		yield 'Ga not connected' => [
			'expected' => false,
		];
	}
}

<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Integrations;

use Generator;

/**
 * Test class for the is_enabled method.
 *
 * @group site-kit
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::is_enabled
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Is_Site_Kit_Enabled_Test extends Abstract_Site_Kit_Test {

	/**
	 * Tests if Site kit consent is granted.
	 *
	 * @dataProvider generate_site_kit_enabled_provider
	 *
	 * @param bool $site_kit_enabled Whether Site Kit is enabled.
	 * @param bool $expected         The expected value.
	 *
	 * @return void
	 */
	public function test_is_site_kit_enabled( bool $site_kit_enabled, bool $expected ) {
		$this->site_kit_conditional->expects( 'is_met' )->andReturn( $site_kit_enabled );

		$this->assertSame( $expected, $this->instance->is_enabled() );
	}

	/**
	 * Provides data testing if the Site Kit plugin is enabled.
	 *
	 * @return Generator Test data to use.
	 */
	public static function generate_site_kit_enabled_provider() {
		yield 'Site Kit enabled' => [
			'site_kit_enabled' => true,
			'expected'         => true,
		];

		yield 'Site Kit disabled' => [
			'site_kit_enabled' => false,
			'expected'         => false,
		];
	}
}

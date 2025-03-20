<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Integrations;

use Brain\Monkey\Functions;
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
	 * @param string $file_name The filename to test against.
	 * @param bool   $expected  The expected value.
	 *
	 * @return void
	 */
	public function test_is_site_kit_enabled( string $file_name, bool $expected ) {
		Functions\expect( 'is_plugin_active' )
			->with( $file_name )
			->andReturn( $expected );

		$this->assertSame( $expected, $this->instance->is_enabled() );
	}

	/**
	 * Provides data testing if the Site Kit plugin is enabled.
	 *
	 * @return Generator Test data to use.
	 */
	public static function generate_site_kit_enabled_provider() {
		yield 'Know Site Kit file given' => [
			'file_name' => 'google-site-kit/google-site-kit.php',
			'expected'  => true,
		];

		yield 'Unknown Site Kit file given' => [
			'file_name' => 'google-site-kit/kit.php',
			'expected'  => false,
		];
	}
}

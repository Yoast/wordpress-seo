<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Integrations;

use Brain\Monkey\Functions;
use Generator;

/**
 * Test class for the is_onboarded method.
 *
 * @group  Site_Kit
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit::is_onboarded
 *
 * @phpcs  :disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Is_Site_Kit_On_Boarded_Test extends Abstract_Site_Kit_Test {

	/**
	 * Tests if Site kit consent is granted.
	 *
	 * @dataProvider generate_site_kit_onboarded_provider
	 *
	 * @param bool       $is_site_kit_installed If the site kit plugin is installed.
	 * @param int | bool $is_setup_completed    The value that is returned from the option.
	 * @param bool       $is_consent_granted    If consent is granted to our integration.
	 * @param bool       $expected              The expected value.
	 *
	 * @return void
	 */
	public function test_is_site_kit_onboarded(
		bool $is_site_kit_installed,
		$is_setup_completed,
		bool $is_consent_granted,
		bool $expected
	) {
		Functions\expect( 'class_exists' )
			->andReturn( $is_site_kit_installed );

		if ( $is_site_kit_installed ) {
			Functions\expect( 'get_option' )
				->with( 'googlesitekit_has_connected_admins', false )
				->andReturn( $is_setup_completed );

			if ( $is_setup_completed === '1' ) {
				$this->site_kit_consent_repository->expects( 'is_consent_granted' )->once()->andReturn( $is_consent_granted );
			}
		}
		$this->assertSame( $expected, $this->instance->is_onboarded() );
	}

	/**
	 * Provides data testing if the Site Kit is fully configured.
	 *
	 * @return Generator Test data to use.
	 */
	public static function generate_site_kit_onboarded_provider() {
		yield 'Everything setup' => [
			'is_site_kit_installed' => true,
			'is_setup_completed'    => '1',
			'is_consent_granted'    => true,
			'expected'              => true,
		];
		yield 'Not installed' => [
			'is_site_kit_installed' => false,
			'is_setup_completed'    => '0',
			'is_consent_granted'    => true,
			'expected'              => false,
		];
		yield 'No consent given' => [
			'is_site_kit_installed' => true,
			'is_setup_completed'    => '0',
			'is_consent_granted'    => false,
			'expected'              => false,
		];
		yield 'Not installed and no consent given' => [
			'is_site_kit_installed' => false,
			'is_setup_completed'    => '0',
			'is_consent_granted'    => false,
			'expected'              => false,
		];
		yield 'Fresh install' => [
			'is_site_kit_installed' => false,
			'is_setup_completed'    => null,
			'is_consent_granted'    => false,
			'expected'              => false,
		];
		yield 'Site kit setup completed with unexpected value' => [
			'is_site_kit_installed' => true,
			'is_setup_completed'    => true,
			'is_consent_granted'    => true,
			'expected'              => false,
		];
	}
}

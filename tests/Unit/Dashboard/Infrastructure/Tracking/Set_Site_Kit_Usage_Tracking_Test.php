<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Tracking;

/**
 * Test class for the set_site_kit_usage_tracking method.
 *
 * @group Site_Kit_Usage_Tracking_Repository
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Tracking\Site_Kit_Usage_Tracking_Repository::set_site_kit_usage_tracking
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Set_Site_Kit_Usage_Tracking_Test extends Abstract_Site_Kit_Usage_Tracking_Repository_Test {

	/**
	 * Tests if the Site Kit configuration dismissal status can be set.
	 *
	 * @dataProvider set_site_kit_usage_tracking_provider
	 *
	 * @param string $element_name  The name of the option to set.
	 * @param string $element_value The value of the option to set.
	 *
	 * @return void
	 */
	public function test_set_site_kit_usage_tracking( string $element_name, string $element_value ): void {
		$usage_tracking = [
			'setup_widget_loaded'     => '',
			'first_interaction_stage' => '',
			'last_interaction_stage'  => '',
			'setup_widget_dismissed'  => '',
		];
		$this->options_helper->shouldReceive( 'get' )
			->with( 'site_kit_usage_tracking', [] )
			->andReturn( $usage_tracking );

		$usage_tracking[ $element_name ] = $element_value;

		$this->options_helper->shouldReceive( 'set' )
			->with( 'site_kit_usage_tracking', $usage_tracking )
			->andReturn( true );

		$this->assertTrue( $this->instance->set_site_kit_usage_tracking( $element_name, $element_value ) );
	}

	/**
	 * Data provider for the test_set_site_kit_usage_tracking method.
	 *
	 * @return array<array<string>> The data to test.
	 */
	public static function set_site_kit_usage_tracking_provider(): array {
		return [
			[
				'element_name'  => 'setup_widget_loaded',
				'element_value' => 'yes',
			],
			[
				'element_name'  => 'first_interaction_stage',
				'element_value' => 'SET UP',
			],
			[
				'element_name'  => 'last_interaction_stage',
				'element_value' => 'CONNECT',
			],
			[
				'element_name'  => 'setup_widget_dismissed',
				'element_value' => 'permanently',
			],
		];
	}
}

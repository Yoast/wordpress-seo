<?php

namespace Yoast\WP\SEO\Tests\WP\Integrations;

use Yoast\WP\SEO\Tests\WP\Doubles\Integrations\Settings_Integration_Double;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration Test Class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Settings_Integration
 */
final class Settings_Integration_Test extends TestCase {

	/**
	 * Tests that the settings page never receives the timestamps it must not send back.
	 *
	 * @covers ::get_settings
	 *
	 * @return void
	 */
	public function test_get_settings_excludes_timestamps() {
		$instance = new Settings_Integration_Double();

		$settings = $instance->get_settings( $instance->get_default_setting_values() );

		$this->assertArrayHasKey( 'enable_schema_aggregation_endpoint', $settings['wpseo'] );
		$this->assertArrayNotHasKey( 'schema_aggregation_endpoint_enabled_on', $settings['wpseo'] );
		$this->assertArrayNotHasKey( 'ai_free_sparks_started_on', $settings['wpseo'] );
	}
}

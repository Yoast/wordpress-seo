<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Mockery;
use WPSEO_Addon_Manager;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration;
use Yoast\WP\SEO\Config\Migration_Status;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Admin\HelpScout_Beacon;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class HelpScout_Beacon_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\HelpScout_Beacon
 */
final class HelpScout_Beacon_Test extends TestCase {

	/**
	 * Tests that the bulk editor is one of the pages the support beacon is shown on.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_beacon_is_enabled_on_the_bulk_editor_page() {
		$options       = Mockery::mock( Options_Helper::class );
		$asset_manager = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$migration     = Mockery::mock( Migration_Status::class );
		$addon_manager = Mockery::mock( WPSEO_Addon_Manager::class );

		$options->allows( 'get' )->with( 'tracking' )->andReturn( true );
		$addon_manager->allows( 'has_active_addons' )->andReturn( false );

		$instance = new HelpScout_Beacon( $options, $asset_manager, $migration, $addon_manager );

		$this->assertArrayHasKey( Bulk_Editor_Integration::PAGE, $this->getPropertyValue( $instance, 'pages_ids' ) );
	}
}

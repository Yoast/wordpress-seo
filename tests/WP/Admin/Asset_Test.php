<?php

namespace Yoast\WP\SEO\Tests\WP\Admin;

use InvalidArgumentException;
use WPSEO_Admin_Asset;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Unit Test Class.
 */
final class Asset_Test extends TestCase {

	/**
	 * Tests the constructor when no name and src are passed.
	 *
	 * @covers WPSEO_Admin_Asset::__construct
	 *
	 * @return void
	 */
	public function test_constructor_missing_name() {
		$this->expectException( InvalidArgumentException::class );

		new WPSEO_Admin_Asset( [] );
	}

	/**
	 * Tests the constructor when no src is passed.
	 *
	 * @covers WPSEO_Admin_Asset::__construct
	 *
	 * @return void
	 */
	public function test_constructor_missing_src() {
		$this->expectException( InvalidArgumentException::class );

		$asset_args = [
			'name' => 'name',
		];
		new WPSEO_Admin_Asset( $asset_args );
	}

	/**
	 * Test default values.
	 *
	 * @covers WPSEO_Admin_Asset::get_name
	 * @covers WPSEO_Admin_Asset::get_src
	 * @covers WPSEO_Admin_Asset::get_deps
	 * @covers WPSEO_Admin_Asset::get_version
	 * @covers WPSEO_Admin_Asset::get_media
	 * @covers WPSEO_Admin_Asset::is_in_footer
	 * @covers WPSEO_Admin_Asset::has_rtl
	 *
	 * @return void
	 */
	public function test_constructor_default_values() {
		$asset_args = [
			'name' => 'name',
			'src'  => 'src',
		];
		$asset      = new WPSEO_Admin_Asset( $asset_args );

		$this->assertEquals( 'name', $asset->get_name() );
		$this->assertEquals( 'src', $asset->get_src() );
		$this->assertEquals( [], $asset->get_deps() );
		$this->assertEquals( '', $asset->get_version() );
		$this->assertEquals( 'all', $asset->get_media() );
		$this->assertEquals( true, $asset->is_in_footer() );
		$this->assertEquals( true, $asset->has_rtl() );
	}

	/**
	 * Test getters.
	 *
	 * @covers WPSEO_Admin_Asset::get_deps
	 * @covers WPSEO_Admin_Asset::get_version
	 * @covers WPSEO_Admin_Asset::get_media
	 * @covers WPSEO_Admin_Asset::is_in_footer
	 * @covers WPSEO_Admin_Asset::get_suffix
	 * @covers WPSEO_Admin_Asset::has_rtl
	 *
	 * @return void
	 */
	public function test_getters() {
		$asset_args = [
			'name'      => 'name',
			'src'       => 'src',
			'deps'      => [ 'deps' ],
			'version'   => 'version',
			'media'     => 'screen',
			'in_footer' => false,
			'suffix'    => '.suffix',
			'rtl'       => false,
		];
		$asset      = new WPSEO_Admin_Asset( $asset_args );

		$this->assertEquals( [ 'deps' ], $asset->get_deps() );
		$this->assertEquals( 'version', $asset->get_version() );
		$this->assertEquals( 'screen', $asset->get_media() );
		$this->assertEquals( false, $asset->is_in_footer() );
		$this->assertEquals( '.suffix', $asset->get_suffix() );
		$this->assertEquals( false, $asset->has_rtl() );
	}
}

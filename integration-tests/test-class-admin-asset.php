<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 */
class WPSEO_Admin_Asset_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests the constructor when no name and src are passed.
	 *
	 * @covers WPSEO_Admin_Asset::__construct
	 *
	 * @expectedException InvalidArgumentException
	 */
	public function test_constructor_missing_name() {
		new WPSEO_Admin_Asset( [] );
	}

	/**
	 * Tests the constructor when no src is passed.
	 *
	 * @covers WPSEO_Admin_Asset::__construct
	 *
	 * @expectedException InvalidArgumentException
	 */
	public function test_constructor_missing_src() {
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
	 * @covers WPSEO_Admin_Asset::get_suffix
	 * @covers WPSEO_Admin_Asset::has_rtl
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
		$this->assertEquals( WPSEO_VERSION, $asset->get_version() );
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

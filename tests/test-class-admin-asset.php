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
	 * @expectedException InvalidArgumentException
	 */
	public function test_constructor_missing_name() {
		new WPSEO_Admin_Asset( array() );
	}

	/**
	 * @expectedException InvalidArgumentException
	 */
	public function test_constructor_missing_src() {
		new WPSEO_Admin_Asset( array(
			'name' => 'name',
		) );
	}

	/**
	 * Test default values.
	 */
	public function test_constructor_default_values() {
		$asset = new WPSEO_Admin_Asset( array(
			'name' => 'name',
			'src'  => 'src',
		) );

		$this->assertEquals( 'name', $asset->get_name() );
		$this->assertEquals( 'src', $asset->get_src() );
		$this->assertEquals( array(), $asset->get_deps() );
		$this->assertEquals( WPSEO_VERSION, $asset->get_version() );
		$this->assertEquals( 'all', $asset->get_media() );
		$this->assertEquals( true, $asset->is_in_footer() );
		$this->assertEquals( WPSEO_CSSJS_SUFFIX, $asset->get_suffix() );
		$this->assertEquals( true, $asset->has_rtl() );
	}

	/**
	 * Test getters.
	 */
	public function test_getters() {
		$asset = new WPSEO_Admin_Asset( array(
			'name'      => 'name',
			'src'       => 'src',
			'deps'      => array( 'deps' ),
			'version'   => 'version',
			'media'     => 'screen',
			'in_footer' => false,
			'suffix'    => '.suffix',
			'rtl'       => false,
		) );

		$this->assertEquals( array( 'deps' ), $asset->get_deps() );
		$this->assertEquals( 'version', $asset->get_version() );
		$this->assertEquals( 'screen', $asset->get_media() );
		$this->assertEquals( false, $asset->is_in_footer() );
		$this->assertEquals( '.suffix', $asset->get_suffix() );
		$this->assertEquals( false, $asset->has_rtl() );
	}

	/**
	 * The get_url method is deprecated so make sure it is. It should relay to the default location.
	 *
	 * @expectedDeprecated WPSEO_Admin_Asset::get_url
	 */
	public function test_deprecated_get_url() {
		$asset = new WPSEO_Admin_Asset( array(
			'name' => 'name',
			'src'  => 'src',
		) );

		$default_location = new WPSEO_Admin_Asset_SEO_Location( WPSEO_FILE );

		$this->expectDeprecated();
		$this->assertEquals( $default_location->get_url( $asset, WPSEO_Admin_Asset::TYPE_JS ), $asset->get_url( WPSEO_Admin_Asset::TYPE_JS, WPSEO_FILE ) );
		$this->assertEquals( $default_location->get_url( $asset, WPSEO_Admin_Asset::TYPE_CSS ), $asset->get_url( WPSEO_Admin_Asset::TYPE_CSS, WPSEO_FILE ) );
		$this->assertEquals( '', $asset->get_url( '', WPSEO_FILE ) );
	}
}

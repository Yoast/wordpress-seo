<?php

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
	}

	public function test_getters() {
		$asset = new WPSEO_Admin_Asset( array(
			'name'      => 'name',
			'src'       => 'src',
			'deps'      => array( 'deps' ),
			'version'   => 'version',
			'media'     => 'screen',
			'in_footer' => false,
			'suffix'    => '.suffix',
		) );

		$this->assertEquals( array( 'deps' ), $asset->get_deps() );
		$this->assertEquals( 'version', $asset->get_version() );
		$this->assertEquals( 'screen', $asset->get_media() );
		$this->assertEquals( false, $asset->is_in_footer() );
		$this->assertEquals( '.suffix', $asset->get_suffix() );

		$this->assertEquals( home_url() . '/wp-content/plugins/wordpress-seo/js/dist/src.suffix.js', $asset->get_url( WPSEO_Admin_Asset::TYPE_JS, WPSEO_FILE ) );
		$this->assertEquals( home_url() . '/wp-content/plugins/wordpress-seo/css/src.suffix.css', $asset->get_url( WPSEO_Admin_Asset::TYPE_CSS, WPSEO_FILE ) );
		$this->assertEquals( '', $asset->get_url( '', WPSEO_FILE ) );

	}
}

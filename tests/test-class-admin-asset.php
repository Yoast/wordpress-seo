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
	}

	public function test_getters() {
		$asset = new WPSEO_Admin_Asset( array(
			'name'      => 'name',
			'src'       => 'src',
			'deps'      => array( 'deps' ),
			'version'   => 'version',
			'media'     => 'screen',
			'in_footer' => false,
		) );

		$this->assertEquals( array( 'deps' ), $asset->get_deps() );
		$this->assertEquals( 'version', $asset->get_version() );
		$this->assertEquals( 'screen', $asset->get_media() );
		$this->assertEquals( false, $asset->is_in_footer() );
	}
}

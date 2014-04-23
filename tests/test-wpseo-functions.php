<?php

class WPSEO_Functions_Test extends WPSEO_UnitTestCase {

	/**
	* Provision some options
	*/
	public function setUp() {
		parent::setUp();
	}

	public function test_wpseo_add_capabilities() {
		// TODO
	}

	public function test_wpseo_remove_capabilities() {
		// TODO
	}

	public function test_wpseo_replace_vars() {
		// TODO
	}

	public function test_wpseo_get_terms() {
		// TODO
	}

	public function test_wpseo_strip_shortcodes() {
		// TODO
	}

	public function test_wpseo_wpml_config() {
		// TODO
	}

	/**
	* @covers wpseo_is_apache()
	*/
	public function test_wpseo_is_apache() {
		$_SERVER['SERVER_SOFTWARE'] = 'Apache/2.2.22';
		$this->assertTrue( wpseo_is_apache() );

		$_SERVER['SERVER_SOFTWARE'] = 'nginx/1.5.11';
		$this->assertFalse( wpseo_is_apache() );
	}

	/**
	* @covers test_wpseo_is_nginx()
	*/
	public function test_wpseo_is_nginx() {
		$_SERVER['SERVER_SOFTWARE'] = 'nginx/1.5.11';
		$this->assertTrue( wpseo_is_nginx() );

		$_SERVER['SERVER_SOFTWARE'] = 'Apache/2.2.22';
		$this->assertFalse( wpseo_is_nginx() );
	}

}
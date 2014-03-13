<?php

class WPSEO_Functions_Test extends WPSEO_UnitTestCase {

	/**
	* Provision some options
	*/
	public function setUp() {
		parent::setUp();

		$options = array(
			'enablexmlsitemap' => false
		);

		update_option( 'wpseo_xml', $options );
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

	/*
	* dummy test to prevent warning
	*/
	public function test_true_is_true() {
		$this->assertTrue( true );
	}

}
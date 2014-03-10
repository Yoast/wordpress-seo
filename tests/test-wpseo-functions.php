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

	/*
	* dummy test to prevent warning
	*/
	public function test_true_is_true() {
		$this->assertTrue( true );
	}

}
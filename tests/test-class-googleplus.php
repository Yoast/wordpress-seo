<?php

class WPSEO_GooglePlus_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Twitter
	 */
	private $class_instance;

	/**
	 * Provision tests
	 */
	public function setUp() {
		parent::setUp();

		$this->class_instance = new WPSEO_GooglePlus();
	}

	/**
	 * Clean-up
	 */
	public function tearDown() {
		parent::tearDown();
	}

	/**
	 * Placeholder test to prevent PHPUnit from throwing errors
	 */
	public function test_class_is_tested() {
		$this->assertTrue( true );
	}

}
<?php

class WPSEO_OpenGraph_Test extends WPSEO_UnitTestCase {

	/**
	* @var WPSEO_OpenGraph
	*/ 
	private $class_instance;

	/**
	* Provision tests
	*/
	public function setUp() {
		parent::setUp();

		$this->class_instance = new WPSEO_OpenGraph();
	}

	/**
	* Test if options were properly fetched upon class instantiation.
	*/
	public function test_options_not_empty() {
		$this->assertNotEmpty( $this->class_instance->options );
	}

	

	/**
	* Placeholder tests to prevent notices
	*/
	public function test_class_is_tested() {
		$this->assertTrue( true );
	}

	

}
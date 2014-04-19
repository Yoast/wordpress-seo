<?php

class Sitemap_Walker_Test extends WPSEO_UnitTestCase {

	/**
	 * @var Sitemap_Walker
	 */
	private $class_instance;

	public function setUp() {
		parent::setUp();

		$this->class_instance = new Sitemap_Walker;
	}

	/**
	* Placeholder test to prevent PHPUnit throwing warnings.
	*/
	public function test_class_is_tested() {
		$this->assertTrue( true );
	}

}
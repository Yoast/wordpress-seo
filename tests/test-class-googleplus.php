<?php

class WPSEO_GooglePlus_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_GooglePlus
	 */
	private static $class_instance;

	public static function setUpBeforeClass() {
		self::$class_instance = new WPSEO_GooglePlus;
	}

	/**
	 * Placeholder test to prevent PHPUnit from throwing errors
	 */
	public function test_class_is_tested() {
		$this->assertTrue( true );
	}

}
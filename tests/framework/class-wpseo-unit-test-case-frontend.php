<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Framework
 */

/**
 * Helper class to provide needed shared code to implementations.
 */
abstract class WPSEO_UnitTestCase_Frontend extends WPSEO_UnitTestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Frontend_Double
	 */
	protected static $class_instance;

	/**
	 * Sets up the class instance to be a more usable double of the Frontend class.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		self::$class_instance = WPSEO_Frontend_Double::get_instance();
	}
}

<?php
/**
 * @package WPSEO\Tests\Framework
 */

/**
 * Helper class to provide needed shared code to implementations.
 */
class WPSEO_UnitTestCase_Frontend extends WPSEO_UnitTestCase {
	/** @var WPSEO_Frontend_Double */
	protected static $class_instance;

	/**
	 * Sets up the class instance to be a more usable double of the Frontend class.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		require_once WPSEO_TESTS_PATH . 'doubles/frontend-double.php';

		self::$class_instance = WPSEO_Frontend_Double::get_instance();
	}
}

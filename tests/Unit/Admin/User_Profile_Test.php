<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin;

use WPSEO_Admin_User_Profile;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit test class
 *
 * @group MyYoast
 *
 * @coversDefaultClass WPSEO_Admin_User_Profile
 */
final class User_Profile_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var WPSEO_Admin_User_Profile
	 */
	private $instance;

	/**
	 * Set up.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new WPSEO_Admin_User_Profile();
	}
}

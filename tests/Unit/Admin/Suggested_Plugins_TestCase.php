<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin;

use Mockery;
use WPSEO_Plugin_Availability;
use WPSEO_Suggested_Plugins;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Notification_Center;

/**
 * Suggested_Plugins_TestCase class for all Suggested_Plugins tests.
 */
abstract class Suggested_Plugins_TestCase extends TestCase {

	/**
	 * Represents the instance we are testing.
	 *
	 * @var WPSEO_Suggested_Plugins
	 */
	protected $instance;

	/**
	 * Holds the availability checker.
	 *
	 * @var Mockery\MockInterface|WPSEO_Plugin_Availability
	 */
	protected $availability_checker;

	/**
	 * Holds the notification center.
	 *
	 * @var Mockery\MockInterface|Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->availability_checker = Mockery::mock( WPSEO_Plugin_Availability::class );
		$this->notification_center  = Mockery::mock( Yoast_Notification_Center::class );
		$this->instance             = new WPSEO_Suggested_Plugins( $this->availability_checker, $this->notification_center );
	}
}

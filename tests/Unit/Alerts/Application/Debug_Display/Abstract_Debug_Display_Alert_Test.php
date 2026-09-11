<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\Application\Debug_Display;

use Mockery;
use Yoast\WP\SEO\Alerts\Application\Debug_Display\Debug_Display_Alert;
use Yoast\WP\SEO\Helpers\Environment_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Notification_Center;

/**
 * Base class for the debug display alert application tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Debug_Display_Alert_Test extends TestCase {

	/**
	 * The notifications center.
	 *
	 * @var Mockery\MockInterface|Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * The environment helper.
	 *
	 * @var Mockery\MockInterface|Environment_Helper
	 */
	protected $environment_helper;

	/**
	 * Holds the instance.
	 *
	 * @var Debug_Display_Alert
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();
		$this->stubEscapeFunctions();

		$this->notification_center = Mockery::mock( Yoast_Notification_Center::class );
		$this->environment_helper  = Mockery::mock( Environment_Helper::class );

		$this->instance = new Debug_Display_Alert(
			$this->notification_center,
			$this->environment_helper,
		);
	}
}

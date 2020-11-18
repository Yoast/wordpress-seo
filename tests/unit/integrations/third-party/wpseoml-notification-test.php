<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Third_Party;

use Yoast\WP\SEO\Tests\Unit\TestCase;

use Brain\Monkey;
use Mockery;

use Yoast\WP\SEO\Integrations\Third_Party\WPSEOML_Notification;

use Yoast_Notification_Center;
use Yoast\WP\SEO\Conditionals\Third_Party\WPSEOML_Conditional;

/**
 * WPSEOML_Notification test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\WPSEOML_Notification
 */
class WPSEOML_Notification_Test extends TestCase {

	/**
	 * Yoast_Notification_Center mock.
	 *
	 * @var Mockery\MockInterface|Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * WPSEOML_Conditional mock.
	 *
	 * @var Mockery\MockInterface|WPSEOML_Conditional
	 */
	protected $wpseoml_conditional;

	/**
	 * Instance under test.
	 *
	 * @var WPSEOML_Notification
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function setUp() {
		parent::setUp();
		$this->notification_center = Mockery::mock( Yoast_Notification_Center::class );
		$this->wpseoml_conditional = Mockery::mock( WPSEOML_Conditional::class );
		$this->instance            = new WPSEOML_Notification(
			$this->notification_center,
			$this->wpseoml_conditional
		);
	}
}

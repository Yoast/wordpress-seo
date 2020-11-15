<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Indexing;

use Mockery;
use Yoast\WP\SEO\Actions\Indexing\Indexing_Prepare_Action;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Notification_Center;

/**
 * Class Indexing_Prepare_Action.
 *
 * @group actions
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexing\Indexing_Prepare_Action
 */
class Indexing_Prepare_Action_Test extends TestCase {

	/**
	 * The mocked indexing helper.
	 *
	 * @var Mockery\MockInterface|Indexing_Helper
	 */
	protected $indexing;

	/**
	 * The notification center.
	 *
	 * @var Mockery\MockInterface|Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * Instance under test.
	 *
	 * @var Indexing_Prepare_Action
	 */
	protected $instance;

	/**
	 * Set up the tests.
	 */
	protected function set_up() {
		parent::set_up();
		$this->indexing            = Mockery::mock( Indexing_Helper::class );
		$this->notification_center = Mockery::mock( Yoast_Notification_Center::class );

		$this->instance = new Indexing_Prepare_Action(
			$this->indexing,
			$this->notification_center
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertAttributeEquals( $this->indexing, 'indexing_helper', $this->instance );
		$this->assertAttributeEquals( $this->notification_center, 'notification_center', $this->instance );
	}

	/**
	 * Tests the prepare method.
	 *
	 * @covers ::prepare
	 */
	public function test_prepare() {
		$this->indexing
			->expects( 'start' )
			->once()
			->withNoArgs();

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->with( Indexing_Notification_Integration::NOTIFICATION_ID );

		$this->instance->prepare();
	}
}

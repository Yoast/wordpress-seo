<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Indexing;

use Mockery;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Prepare_Indexation_Action;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Notification_Center;

/**
 * Class Indexable_Prepare_Indexation_Action_Test.
 *
 * @group actions
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexing\Indexable_Prepare_Indexation_Action
 */
class Indexable_Prepare_Indexation_Action_Test extends TestCase {

	/**
	 * The mocked date helper.
	 *
	 * @var Mockery\MockInterface|Date_Helper
	 */
	private $date;

	/**
	 * The mocked indexing helper.
	 *
	 * @var Mockery\MockInterface|Indexing_Helper
	 */
	private $indexing;

	/**
	 * The notification center.
	 *
	 * @var Mockery\MockInterface|Yoast_Notification_Center
	 */
	private $notification_center;

	/**
	 * Instance under test.
	 *
	 * @var Indexable_Prepare_Indexation_Action
	 */
	private $instance;

	/**
	 * Set up the tests.
	 */
	public function setUp() {
		parent::setUp();
		$this->date                = Mockery::mock( Date_Helper::class );
		$this->indexing            = Mockery::mock( Indexing_Helper::class );
		$this->notification_center = Mockery::mock( Yoast_Notification_Center::class );

		$this->instance = new Indexable_Prepare_Indexation_Action(
			$this->date,
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
		$this->assertAttributeEquals( $this->date, 'date_helper', $this->instance );
		$this->assertAttributeEquals( $this->indexing, 'indexing_helper', $this->instance );
	}

	/**
	 * Tests the prepare method.
	 *
	 * @covers ::prepare
	 */
	public function test_prepare() {
		$mocked_time = 1593426177;

		$this->date->expects( 'current_time' )
			->once()
			->andReturn( $mocked_time );

		$this->indexing->expects( 'set_first_time' )
			->with( false );

		$this->indexing->expects( 'set_started' )
			->with( $mocked_time );

		$this->notification_center->expects( 'remove_notification_by_id' )
			->with( Indexing_Notification_Integration::NOTIFICATION_ID );

		$this->instance->prepare();
	}
}

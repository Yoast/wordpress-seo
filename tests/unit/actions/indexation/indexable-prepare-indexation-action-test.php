<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Indexation;

use Mockery;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Prepare_Indexation_Action;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Notification_Center;

/**
 * Class Indexable_Prepare_Indexation_Action_Test
 *
 * @group actions
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexation\Indexable_Prepare_Indexation_Action
 */
class Indexable_Prepare_Indexation_Action_Test extends TestCase {

	/**
	 * The mocked date helper.
	 *
	 * @var Mockery\MockInterface|Date_Helper
	 */
	private $date;

	/**
	 * The mocked options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

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
		$this->options             = Mockery::mock( Options_Helper::class );
		$this->date                = Mockery::mock( Date_Helper::class );
		$this->notification_center = Mockery::mock( Yoast_Notification_Center::class );

		$this->instance = new Indexable_Prepare_Indexation_Action(
			$this->options,
			$this->date,
			$this->notification_center
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertAttributeEquals( $this->options, 'options', $this->instance );
		$this->assertAttributeEquals( $this->date, 'date', $this->instance );
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

		$this->options->expects( 'set' )
			->with( 'indexing_first_time', false );

		$this->options->expects( 'set' )
			->with( 'indexation_started', $mocked_time );

		$this->notification_center->expects( 'remove_notification_by_id' )
			->with( Indexing_Notification_Integration::NOTIFICATION_ID );

		$this->instance->prepare();
	}
}

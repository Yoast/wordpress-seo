<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Mockery;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Notification_Center;

/**
 * Class Indexing_Helper_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Indexing_Helper
 * @covers \Yoast\WP\SEO\Helpers\Indexing_Helper
 *
 * @group helpers
 * @group indexing
 */
class Indexing_Helper_Test extends TestCase {

	/**
	 * Represents the class to test.
	 *
	 * @var Indexing_Helper
	 */
	protected $instance;

	/**
	 * Represents the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Represents the date helper.
	 *
	 * @var Mockery\MockInterface|Date_Helper
	 */
	protected $date_helper;

	/**
	 * The notification center.
	 *
	 * @var Mockery\MockInterface|Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function setUp() {
		parent::setUp();

		$this->options_helper      = Mockery::mock( Options_Helper::class );
		$this->date_helper         = Mockery::mock( Date_Helper::class );
		$this->notification_center = Mockery::mock( Yoast_Notification_Center::class );
		$this->instance            = new Indexing_Helper(
			$this->options_helper,
			$this->date_helper,
			$this->notification_center
		);
	}

	/**
	 * Tests if the class attributes are set properly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertAttributeInstanceOf( Options_Helper::class, 'options_helper', $this->instance );
		$this->assertAttributeInstanceOf( Date_Helper::class, 'date_helper', $this->instance );
	}

	/**
	 * Tests start.
	 *
	 * @covers ::start
	 * @covers ::set_first_time
	 * @covers ::set_started
	 */
	public function test_start() {
		$this->options_helper
			->expects( 'set' )
			->once()
			->with( 'indexing_first_time', false );

		$start_time = 160934509;

		$this->date_helper
			->expects( 'current_time' )
			->once()
			->withNoArgs()
			->andReturn( $start_time );

		$this->options_helper
			->expects( 'set' )
			->once()
			->with( 'indexation_started', $start_time );

		$this->instance->start();
	}

	/**
	 * Tests finish.
	 *
	 * @covers ::finish
	 * @covers ::set_started
	 * @covers ::set_reason
	 */
	public function test_finish() {
		$this->options_helper
			->expects( 'set' )
			->once()
			->with( 'indexation_started', null );

		$this->options_helper
			->expects( 'set' )
			->once()
			->with( 'indexing_reason', '' );

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->once()
			->with( Indexing_Notification_Integration::NOTIFICATION_ID );

		$this->instance->finish();
	}

	/**
	 * Tests setting the indexing reason.
	 *
	 * @covers ::set_reason
	 */
	public function test_set_reason() {
		$reason = 'permalinks_changed';

		$this->options_helper
			->expects( 'set' )
			->once()
			->with( 'indexing_reason', $reason );

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->once()
			->with( Indexing_Notification_Integration::NOTIFICATION_ID );

		$this->instance->set_reason( $reason );
	}

	/**
	 * Tests getting the indexing reason.
	 *
	 * @covers ::has_reason
	 */
	public function test_has_reason() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'indexing_reason', '' );

		$this->assertFalse( $this->instance->has_reason() );
	}

	/**
	 * Tests getting the indexing reason.
	 *
	 * @covers ::has_reason
	 */
	public function test_get_reason() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'indexing_reason', '' )
			->andReturn( 'first-install' );

		$this->assertSame( 'first-install', $this->instance->get_reason() );
	}

	/**
	 * Tests getting the indexing start time.
	 *
	 * @covers ::get_started
	 */
	public function test_get_started() {
		$start_time = 160934509;
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'indexation_started' )
			->andReturn( $start_time );

		$this->assertSame( $start_time, $this->instance->get_started() );
	}

	/**
	 * Tests getting whether a site still has to be indexed for the first time.
	 *
	 * @covers ::is_initial_indexing
	 */
	public function test_is_initial_indexing() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'indexing_first_time', true )
			->andReturnTrue();

		$this->assertTrue( $this->instance->is_initial_indexing() );
	}
}

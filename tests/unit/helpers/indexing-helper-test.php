<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Indexing\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Indexing_Complete_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Post_Link_Indexing_Action;
use Yoast\WP\SEO\Actions\Indexing\Term_Link_Indexing_Action;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;
use Yoast_Notification_Center;

/**
 * Class Indexing_Helper_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Indexing_Helper
 * @covers \Yoast\WP\SEO\Helpers\Indexing_Helper
 *
 * @group  helpers
 * @group  indexing
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
	 * The indexable builder version mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Builder_Versions
	 */
	protected $indexable_builder_versions;

	/**
	 * The post indexable indexation action.
	 *
	 * @var Mockery\MockInterface|Indexable_Post_Indexation_Action
	 */
	protected $post_indexation;

	/**
	 * The term indexable indexation action.
	 *
	 * @var Mockery\MockInterface|Indexable_Term_Indexation_Action
	 */
	protected $term_indexation;

	/**
	 * The post type archive indexable indexation action.
	 *
	 * @var Mockery\MockInterface|Indexable_Post_Type_Archive_Indexation_Action
	 */
	protected $post_type_archive_indexation;

	/**
	 * The general indexable indexation action.
	 *
	 * @var Mockery\MockInterface|Indexable_General_Indexation_Action
	 */
	protected $general_indexation;

	/**
	 * The post link indexing action.
	 *
	 * @var Mockery\MockInterface|Indexable_Indexing_Complete_Action
	 */
	protected $post_link_indexing_action;

	/**
	 * The term link indexing action.
	 *
	 * @var Mockery\MockInterface|Term_Link_Indexing_Action
	 */
	protected $term_link_indexing_action;

	/**
	 * Sets up the class under test and mock objects.
	 */
	protected function set_up() {
		parent::set_up();

		$this->options_helper             = Mockery::mock( Options_Helper::class );
		$this->date_helper                = Mockery::mock( Date_Helper::class );
		$this->notification_center        = Mockery::mock( Yoast_Notification_Center::class );
		$this->indexable_builder_versions = Mockery::mock( Indexable_Builder_Versions::class );
		$this->instance                   = new Indexing_Helper(
			$this->options_helper,
			$this->date_helper,
			$this->notification_center,
			$this->indexable_builder_versions
		);

		$this->post_indexation              = Mockery::mock( Indexable_Post_Indexation_Action::class );
		$this->term_indexation              = Mockery::mock( Indexable_Term_Indexation_Action::class );
		$this->post_type_archive_indexation = Mockery::mock( Indexable_Post_Type_Archive_Indexation_Action::class );
		$this->general_indexation           = Mockery::mock( Indexable_General_Indexation_Action::class );
		$this->post_link_indexing_action    = Mockery::mock( Post_Link_Indexing_Action::class );
		$this->term_link_indexing_action    = Mockery::mock( Term_Link_Indexing_Action::class );
		$this->instance->set_indexing_actions(
			$this->post_indexation,
			$this->term_indexation,
			$this->post_type_archive_indexation,
			$this->general_indexation,
			$this->post_link_indexing_action,
			$this->term_link_indexing_action
		);
	}

	/**
	 * Tests if the class attributes are set properly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
		$this->assertInstanceOf(
			Date_Helper::class,
			$this->getPropertyValue( $this->instance, 'date_helper' )
		);
	}

	/**
	 * Sets the setting of the indexing actions.
	 *
	 * @covers ::set_indexing_actions
	 */
	public function test_set_indexing_actions() {
		static::assertInstanceOf(
			Indexable_Post_Indexation_Action::class,
			$this->getPropertyValue( $this->instance, 'indexing_actions' )[0]
		);
		static::assertInstanceOf(
			Indexable_Term_Indexation_Action::class,
			$this->getPropertyValue( $this->instance, 'indexing_actions' )[1]
		);
		static::assertInstanceOf(
			Indexable_Post_Type_Archive_Indexation_Action::class,
			$this->getPropertyValue( $this->instance, 'indexing_actions' )[2]
		);
		static::assertInstanceOf(
			Indexable_General_Indexation_Action::class,
			$this->getPropertyValue( $this->instance, 'indexing_actions' )[3]
		);
		static::assertInstanceOf(
			Post_Link_Indexing_Action::class,
			$this->getPropertyValue( $this->instance, 'indexing_actions' )[4]
		);
		static::assertInstanceOf(
			Term_Link_Indexing_Action::class,
			$this->getPropertyValue( $this->instance, 'indexing_actions' )[5]
		);
	}

	/**
	 * Tests prepare.
	 *
	 * @covers ::prepare
	 * @covers ::set_first_time
	 * @covers ::set_started
	 */
	public function test_prepare() {
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
			->with( 'indexing_started', $start_time );

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->once()
			->with( 'wpseo-reindex' );

		$this->instance->prepare();
	}

	/**
	 * Tests complete.
	 *
	 * @covers ::complete
	 * @covers ::set_started
	 * @covers ::set_reason
	 */
	public function test_complete() {
		$this->options_helper
			->expects( 'set' )
			->once()
			->with( 'indexing_started', null );

		$this->options_helper
			->expects( 'set' )
			->once()
			->with( 'indexing_reason', '' );

		$this->notification_center
			->expects( 'remove_notification_by_id' )
			->once()
			->with( Indexing_Notification_Integration::NOTIFICATION_ID );

		$this->instance->complete();
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
			->with( 'indexing_started' )
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

	/**
	 * Tests the retrieval of the unindexed count.
	 *
	 * @covers ::get_unindexed_count
	 */
	public function test_get_unindexed_count() {
		$this->post_indexation
			->expects( 'get_total_unindexed' )
			->once()
			->andReturn( 0 );

		$this->term_indexation
			->expects( 'get_total_unindexed' )
			->once()
			->andReturn( 0 );

		$this->general_indexation
			->expects( 'get_total_unindexed' )
			->once()
			->andReturn( 0 );

		$this->post_type_archive_indexation
			->expects( 'get_total_unindexed' )
			->once()
			->andReturn( 0 );

		$this->post_link_indexing_action
			->expects( 'get_total_unindexed' )
			->once()
			->andReturn( 0 );

		$this->term_link_indexing_action
			->expects( 'get_total_unindexed' )
			->once()
			->andReturn( 0 );

		static::assertEquals( 0, $this->instance->get_unindexed_count() );
	}

	/**
	 * Tests the retrieval of the filtered unindexed count.
	 *
	 * @covers ::get_filtered_unindexed_count
	 * @covers ::get_limited_unindexed_count
	 */
	public function test_get_filtered_unindexed_count() {
		$this->post_indexation
			->expects( 'get_total_unindexed' )
			->once()
			->andReturn( 0 );

		$this->term_indexation
			->expects( 'get_total_unindexed' )
			->once()
			->andReturn( 0 );

		$this->general_indexation
			->expects( 'get_total_unindexed' )
			->once()
			->andReturn( 0 );

		$this->post_type_archive_indexation
			->expects( 'get_total_unindexed' )
			->once()
			->andReturn( 0 );

		$this->post_link_indexing_action
			->expects( 'get_total_unindexed' )
			->once()
			->andReturn( 0 );

		$this->term_link_indexing_action
			->expects( 'get_total_unindexed' )
			->once()
			->andReturn( 0 );

		Monkey\Filters\expectApplied( 'wpseo_indexing_get_unindexed_count' )
			->andReturn( 20 );

		static::assertEquals( 20, $this->instance->get_filtered_unindexed_count() );
	}

	/**
	 * Tests the retrieval of the filtered unindexed count with a limit.
	 *
	 * @covers ::get_limited_filtered_unindexed_count
	 * @covers ::get_limited_unindexed_count
	 */
	public function test_get__limitedfiltered_unindexed_count() {
		$limit = 25;

		$this->post_indexation
			->expects( 'get_limited_unindexed_count' )
			->with( $limit + 1 )
			->once()
			->andReturn( 10 );

		$this->term_indexation
			->expects( 'get_limited_unindexed_count' )
			->with( $limit - 10 + 1 )
			->once()
			->andReturn( 10 );

		$this->post_type_archive_indexation
			->expects( 'get_limited_unindexed_count' )
			->with( $limit - 20 + 1 )
			->once()
			->andReturn( 10 );

		static::assertEquals( 30, $this->instance->get_limited_filtered_unindexed_count( 25 ) );
	}
}

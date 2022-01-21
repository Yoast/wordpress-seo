<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Indexing\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Indexing_Complete_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Post_Link_Indexing_Action;
use Yoast\WP\SEO\Actions\Indexing\Term_Link_Indexing_Action;
use Yoast\WP\SEO\Conditionals\Get_Request_Conditional;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Admin_And_Dashboard_Conditional;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Integrations\Admin\Background_Indexing_Integration;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Tool_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Background_Indexing_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Background_Indexing_Integration
 *
 * @group integrations
 * @group indexing
 */
class Background_Indexing_Integration_Test extends TestCase {

	/**
	 * The indexation integration under test.
	 *
	 * @var Indexing_Tool_Integration
	 */
	protected $instance;

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
	 * The complete indexation action.
	 *
	 * @var Mockery\MockInterface|Indexable_Indexing_Complete_Action
	 */
	protected $complete_indexation_action;

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
	 * Represents the indexing helper.
	 *
	 * @var Mockery\MockInterface|Indexing_Helper
	 */
	protected $indexing_helper;

	/**
	 * Sets up the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->post_indexation              = Mockery::mock( Indexable_Post_Indexation_Action::class );
		$this->term_indexation              = Mockery::mock( Indexable_Term_Indexation_Action::class );
		$this->post_type_archive_indexation = Mockery::mock( Indexable_Post_Type_Archive_Indexation_Action::class );
		$this->general_indexation           = Mockery::mock( Indexable_General_Indexation_Action::class );
		$this->complete_indexation_action   = Mockery::mock( Indexable_Indexing_Complete_Action::class );
		$this->post_link_indexing_action    = Mockery::mock( Post_Link_Indexing_Action::class );
		$this->term_link_indexing_action    = Mockery::mock( Term_Link_Indexing_Action::class );
		$this->indexing_helper              = Mockery::mock( Indexing_Helper::class );

		$this->instance = new Background_Indexing_Integration(
			$this->post_indexation,
			$this->term_indexation,
			$this->post_type_archive_indexation,
			$this->general_indexation,
			$this->complete_indexation_action,
			$this->post_link_indexing_action,
			$this->term_link_indexing_action,
			$this->indexing_helper
		);
	}

	/**
	 * Tests the get_conditionals method.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		static::assertEquals(
			[
				Yoast_Admin_And_Dashboard_Conditional::class,
				Migrations_Conditional::class,
				Get_Request_Conditional::class,
			],
			Background_Indexing_Integration::get_conditionals()
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		static::assertInstanceOf(
			Indexable_Post_Indexation_Action::class,
			$this->getPropertyValue( $this->instance, 'post_indexation' )
		);
		static::assertInstanceOf(
			Indexable_Term_Indexation_Action::class,
			$this->getPropertyValue( $this->instance, 'term_indexation' )
		);
		static::assertInstanceOf(
			Indexable_Post_Type_Archive_Indexation_Action::class,
			$this->getPropertyValue( $this->instance, 'post_type_archive_indexation' )
		);
		static::assertInstanceOf(
			Indexable_General_Indexation_Action::class,
			$this->getPropertyValue( $this->instance, 'general_indexation' )
		);
		static::assertInstanceOf(
			Indexable_Indexing_Complete_Action::class,
			$this->getPropertyValue( $this->instance, 'complete_indexation_action' )
		);
		static::assertInstanceOf(
			Indexing_Helper::class,
			$this->getPropertyValue( $this->instance, 'indexing_helper' )
		);
	}

	/**
	 * Tests the register hooks method.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		Monkey\Actions\expectAdded( 'admin_init' );

		$this->instance->register_hooks();
	}

	/**
	 * Tests the enqueue_scripts method.
	 *
	 * @covers ::register_shutdown_indexing
	 * @covers ::get_shutdown_limit
	 */
	public function test_register_shutdown_indexing() {
		$this->indexing_helper
			->expects( 'get_limited_filtered_unindexed_count' )
			->once()
			->andReturn( 10 );

		Monkey\Functions\expect( 'register_shutdown_function' )->with( [ $this->instance, 'index' ] );

		Monkey\Filters\expectApplied( 'wpseo_shutdown_indexation_limit' )
			->andReturn( 25 );

		$this->instance->register_shutdown_indexing();
	}

	/**
	 * Tests the shutdown indexing method.
	 *
	 * @covers ::index
	 */
	public function test_index() {
		$this->term_indexation
			->expects( 'index' )
			->once();

		$this->post_indexation
			->expects( 'index' )
			->once();

		$this->general_indexation
			->expects( 'index' )
			->once();

		$this->post_type_archive_indexation
			->expects( 'index' )
			->once();

		$this->post_link_indexing_action
			->expects( 'index' )
			->once();

		$this->term_link_indexing_action
			->expects( 'index' )
			->once();

		$this->complete_indexation_action
			->expects( 'complete' )
			->once();

		$this->instance->index();
	}

	/**
	 * Sets the expectations for the shutdown indexation.
	 */
	public function shutdown_indexation_expectations() {
		$this->post_indexation->expects( 'index' )->once();
		$this->term_indexation->expects( 'index' )->once();
		$this->general_indexation->expects( 'index' )->once();
		$this->post_type_archive_indexation->expects( 'index' )->once();
		$this->complete_indexation_action->expects( 'complete' )->once();
		$this->post_link_indexing_action->expects( 'index' )->once();
		$this->term_link_indexing_action->expects( 'index' )->once();
	}
}

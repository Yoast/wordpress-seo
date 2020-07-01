<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Commands
 */

namespace Yoast\WP\SEO\Tests\Commands;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Complete_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Commands\Index_Command;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Index_Command_Test.
 *
 * @group commands
 *
 * @coversDefaultClass \Yoast\WP\SEO\Commands\Index_Command
 * @covers ::<!public>
 */
class Index_Command_Test extends TestCase {

	/**
	 * The post indexation action.
	 *
	 * @var Indexable_Post_Indexation_Action
	 */
	private $post_indexation_action;

	/**
	 * The term indexation action.
	 *
	 * @var Indexable_Term_Indexation_Action
	 */
	private $term_indexation_action;

	/**
	 * The post type archive indexation action.
	 *
	 * @var Indexable_Post_Type_Archive_Indexation_Action
	 */
	private $post_type_archive_indexation_action;

	/**
	 * The general indexation action.
	 *
	 * @var Indexable_General_Indexation_Action
	 */
	private $general_indexation_action;

	/**
	 * The complete indexation action.
	 *
	 * @var Indexable_Complete_Indexation_Action
	 */
	private $complete_indexation_action;

	/**
	 * The instance
	 *
	 * @var Index_Command
	 */
	private $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		$this->post_indexation_action              = Mockery::mock( Indexable_Post_Indexation_Action::class );
		$this->term_indexation_action              = Mockery::mock( Indexable_Term_Indexation_Action::class );
		$this->post_type_archive_indexation_action = Mockery::mock( Indexable_Post_Type_Archive_Indexation_Action::class );
		$this->general_indexation_action           = Mockery::mock( Indexable_General_Indexation_Action::class );
		$this->complete_indexation_action          = Mockery::mock( Indexable_Complete_Indexation_Action::class );

		$this->instance = new Index_Command(
			$this->post_indexation_action,
			$this->term_indexation_action,
			$this->post_type_archive_indexation_action,
			$this->general_indexation_action,
			$this->complete_indexation_action
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertAttributeInstanceOf( Indexable_Post_Indexation_Action::class, 'post_indexation_action', $this->instance );
		$this->assertAttributeInstanceOf( Indexable_Term_Indexation_Action::class, 'term_indexation_action', $this->instance );
		$this->assertAttributeInstanceOf( Indexable_Post_Type_Archive_Indexation_Action::class, 'post_type_archive_indexation_action', $this->instance );
		$this->assertAttributeInstanceOf( Indexable_General_Indexation_Action::class, 'general_indexation_action', $this->instance );
	}

	/**
	 * Tests the execute function.
	 *
	 * @covers ::index
	 * @covers ::run_indexation_action
	 */
	public function test_execute() {
		$indexation_actions = [
			$this->post_indexation_action,
			$this->term_indexation_action,
			$this->post_type_archive_indexation_action,
			$this->general_indexation_action,
		];

		foreach ( $indexation_actions as $indexation_action ) {
			$indexation_action->expects( 'get_total_unindexed' )->once()->andReturn( 30 );
			$indexation_action->expects( 'get_limit' )->once()->andReturn( 25 );
			$indexation_action->expects( 'index' )
				->times( 2 )
				->andReturn( \array_fill( 0, 25, true ), \array_fill( 0, 5, true ) );
		}

		$this->complete_indexation_action->expects( 'complete' )->once();

		$progress_bar_mock = Mockery::mock( 'cli\progress\Bar' );
		Monkey\Functions\expect( '\WP_CLI\Utils\make_progress_bar' )
			->times( 4 )
			->with( Mockery::type( 'string' ), 30 )
			->andReturn( $progress_bar_mock );
		$progress_bar_mock->expects( 'tick' )->times( 4 )->with( 25 );
		$progress_bar_mock->expects( 'tick' )->times( 4 )->with( 5 );
		$progress_bar_mock->expects( 'finish' )->times( 4 );

		$this->instance->index();
	}

	/**
	 * Tests the execute function.
	 *
	 * @covers ::index
	 * @covers ::run_indexation_action
	 * @covers ::clear
	 */
	public function test_execute_with_reindexing() {
		$indexation_actions = [
			$this->post_indexation_action,
			$this->term_indexation_action,
			$this->post_type_archive_indexation_action,
			$this->general_indexation_action,
		];

		foreach ( $indexation_actions as $indexation_action ) {
			$indexation_action->expects( 'get_total_unindexed' )->once()->andReturn( 30 );
			$indexation_action->expects( 'get_limit' )->once()->andReturn( 25 );
			$indexation_action->expects( 'index' )
				->times( 2 )
				->andReturn( \array_fill( 0, 25, true ), \array_fill( 0, 5, true ) );
		}

		$this->complete_indexation_action->expects( 'complete' )->once();

		$progress_bar_mock = Mockery::mock( 'cli\progress\Bar' );
		Monkey\Functions\expect( '\WP_CLI\Utils\make_progress_bar' )
			->times( 4 )
			->with( Mockery::type( 'string' ), 30 )
			->andReturn( $progress_bar_mock );
		$progress_bar_mock->expects( 'tick' )->times( 4 )->with( 25 );
		$progress_bar_mock->expects( 'tick' )->times( 4 )->with( 5 );
		$progress_bar_mock->expects( 'finish' )->times( 4 );

		$cli = Mockery::mock( 'overload:WP_CLI' );
		$cli
			->expects( 'confirm' )
			->with( 'This will clear all previously indexed objects. Are you certain you wish to proceed?' );

		$wpdb            = Mockery::mock();
		$wpdb->prefix    = 'wp_';
		$GLOBALS['wpdb'] = $wpdb;

		$wpdb
			->expects( 'query' )
			->once()
			->with( 'TRUNCATE TABLE wp_yoast_indexable' );

		$wpdb
			->expects( 'prepare' )
			->once()
			->with( 'TRUNCATE TABLE %1$s', 'wp_yoast_indexable' )
			->andReturn( 'TRUNCATE TABLE wp_yoast_indexable' );

		$wpdb
			->expects( 'query' )
			->once()
			->with( 'TRUNCATE TABLE wp_yoast_indexable_hierarchy' );


		$wpdb
			->expects( 'prepare' )
			->once()
			->with( 'TRUNCATE TABLE %1$s', 'wp_yoast_indexable_hierarchy' )
			->andReturn( 'TRUNCATE TABLE wp_yoast_indexable_hierarchy' );

		$this->instance->index( null, [ 'reindex' => true ] );
	}

	/**
	 * Tests the execute function on multisite.
	 *
	 * @covers ::index
	 * @covers ::run_indexation_action
	 */
	public function test_execute_multisite() {
		Monkey\Functions\expect( 'get_sites' )
			->once()
			->with(
				[
					'fields'   => 'ids',
					'spam'     => 0,
					'deleted'  => 0,
					'archived' => 0,
				]
			)
			->andReturn( [ 1, 2 ] );

		Monkey\Functions\expect( 'switch_to_blog' )->once()->with( 1 );
		Monkey\Functions\expect( 'switch_to_blog' )->once()->with( 2 );
		Monkey\Functions\expect( 'restore_current_blog' )->times( 2 );
		Monkey\Actions\expectDone( '_yoast_run_migrations' );

		$indexation_actions = [
			$this->post_indexation_action,
			$this->term_indexation_action,
			$this->post_type_archive_indexation_action,
			$this->general_indexation_action,
		];

		foreach ( $indexation_actions as $indexation_action ) {
			$indexation_action->expects( 'get_total_unindexed' )->times( 2 )->andReturn( 30 );
			$indexation_action->expects( 'get_limit' )->times( 2 )->andReturn( 25 );
			$indexation_action->expects( 'index' )
				->times( 4 )
				->andReturn(
					\array_fill( 0, 25, true ),
					\array_fill( 0, 5, true ),
					\array_fill( 0, 25, true ),
					\array_fill( 0, 5, true )
				);
		}

		// Expect the complete action twice: once for each site in the multisite.
		$this->complete_indexation_action->expects( 'complete' )->twice();

		$progress_bar_mock = Mockery::mock( 'cli\progress\Bar' );
		Monkey\Functions\expect( '\WP_CLI\Utils\make_progress_bar' )
			->times( 8 )
			->with( Mockery::type( 'string' ), 30 )
			->andReturn( $progress_bar_mock );
		$progress_bar_mock->expects( 'tick' )->times( 8 )->with( 25 );
		$progress_bar_mock->expects( 'tick' )->times( 8 )->with( 5 );
		$progress_bar_mock->expects( 'finish' )->times( 8 );

		$this->instance->index( null, [ 'network' => true ] );
	}

	/**
	 * Tests the get_namespace function.
	 *
	 * @covers ::get_namespace
	 */
	public function test_get_namespace() {
		$this->assertEquals( Main::WP_CLI_NAMESPACE, Index_Command::get_namespace() );
	}
}

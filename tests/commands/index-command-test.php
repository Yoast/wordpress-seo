<?php

namespace Yoast\WP\SEO\Tests\Commands;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Indexation\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Commands\Index_Command;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Index_Command_Test.
 *
 * @group indexables
 * @group builders
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

		$this->instance = new Index_Command(
			$this->post_indexation_action,
			$this->term_indexation_action,
			$this->post_type_archive_indexation_action,
			$this->general_indexation_action
		);
	}

	/**
	 * Tests the execute function.
	 *
	 * @covers ::execute
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
			$indexation_action->expects( 'index' )->times( 2 )->andReturn( \array_fill( 0, 25, true ), \array_fill( 0, 5, true ) );
		}

		$progress_bar_mock = Mockery::mock( 'cli\progress\Bar' );
		Monkey\Functions\expect( '\WP_CLI\Utils\make_progress_bar' )->times( 4 )->with( Mockery::type( 'string' ), 30 )->andReturn( $progress_bar_mock );
		$progress_bar_mock->expects( 'tick' )->times( 4 )->with( 25 );
		$progress_bar_mock->expects( 'tick' )->times( 4 )->with( 5 );
		$progress_bar_mock->expects( 'finish' )->times( 4 );

		$this->instance->execute();
	}

	/**
	 * Tests the get_name function.
	 *
	 * @covers ::get_name
	 */
	public function test_get_name() {
		$this->assertEquals( 'yoast index', $this->instance->get_name() );
	}

    /**
	 * Tests the get_config function.
	 *
	 * @covers ::get_config
	 */
	public function test_get_config() {
		Monkey\Functions\expect( '__' )->once()->with( 'Indexes all your content to ensure the best performance.', 'wordpress-seo' )->andReturn( 'string' );

		$this->assertEquals( [ 'shortdesc' => 'string' ], $this->instance->get_config() );
	}
}

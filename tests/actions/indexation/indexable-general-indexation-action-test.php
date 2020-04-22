<?php

namespace Yoast\WP\SEO\Tests\Actions\Indexation;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Indexation\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Indexable_Post_Indexation_Action_Test class
 *
 * @group actions
 * @group indexation
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexation\Indexable_General_Indexation_Action
 */
class Indexable_General_Indexation_Action_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexable_General_Indexation_Action
	 */
	protected $instance;

	/**
	 * Represents the indexable repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Represents the indexable builder.
	 *
	 * @var Mockery\MockInterface|Indexable_Builder
	 */
	protected $indexable_builder;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );
		$this->indexable_builder    = Mockery::mock( Indexable_Builder::class );
		$this->instance             = new Indexable_General_Indexation_Action( $this->indexable_repository, $this->indexable_builder );
	}

	/**
	 * Tests the calculation of the unindexed general pages.
	 *
	 * @covers ::__construct
	 * @covers ::get_total_unindexed
	 * @covers ::query
	 */
	public function test_get_total_unindexed() {
		$this->set_query();

		$this->assertEquals( 4, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests the indexing of the general indexables.
	 *
	 * @covers ::__construct
	 * @covers ::index
	 * @covers ::query
	 */
	public function test_index() {
		$this->set_query();

		$this->indexable_builder
			->expects( 'build_for_system_page' )
			->with( '404' )
			->andReturn( '404' );

		$this->indexable_builder
			->expects( 'build_for_system_page' )
			->with( 'search' )
			->andReturn( 'search' );

		$this->indexable_builder
			->expects( 'build_for_date_archive' )
			->andReturn( 'date archive' );

		$this->indexable_builder
			->expects( 'build_for_home_page' )
			->andReturn( 'home page' );

		$this->assertEquals( [ '404', 'search', 'date archive', 'home page' ], $this->instance->index() );
	}

	/**
	 * Sets the expectations for the query method.
	 */
	private function set_query() {
		$this->indexable_repository
			->expects( 'find_for_system_page' )
			->once()
			->with( '404', false )
			->andReturnFalse();

		$this->indexable_repository
			->expects( 'find_for_system_page' )
			->once()
			->with( 'search', false )
			->andReturnFalse();

		$this->indexable_repository
			->expects( 'find_for_date_archive' )
			->once()
			->with( false )
			->andReturnFalse();

		$this->indexable_repository
			->expects( 'find_for_home_page' )
			->once()
			->with( false )
			->andReturnFalse();

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'page_on_front' )
			->andReturn( 0 );

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'show_on_front' )
			->andReturn( 'posts' );
	}

}

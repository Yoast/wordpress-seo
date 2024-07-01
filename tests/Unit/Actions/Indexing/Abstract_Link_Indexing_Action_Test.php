<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Indexing;

use Brain\Monkey;
use Mockery;
use wpdb;
use Yoast\WP\SEO\Actions\Indexing\Abstract_Link_Indexing_Action;
use Yoast\WP\SEO\Builders\Indexable_Link_Builder;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract_Link_Indexing_Action_Test class
 *
 * @group actions
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexing\Abstract_Link_Indexing_Action
 */
final class Abstract_Link_Indexing_Action_Test extends TestCase {

	/**
	 * Represents the link builder.
	 *
	 * @var Mockery\MockInterface|Indexable_Link_Builder
	 */
	protected $link_builder;

	/**
	 * Represents the taxonomy helper.
	 *
	 * @var Mockery\MockInterface|Taxonomy_Helper
	 */
	protected $taxonomy_helper;

	/**
	 * Represents the indexable helper.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * Represents the indexable repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $repository;

	/**
	 * The WordPress database instance.
	 *
	 * @var wpdb
	 */
	private $wpdb;

	/**
	 * The instance.
	 *
	 * @var Abstract_Link_Indexing_Action
	 */
	protected $instance;

	/**
	 * Does the setup.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		global $wpdb;
		// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- Intended, to be able to test the Abstract_Link_Indexing_Action.
		$wpdb = (object) [ 'prefix' => 'wp_' ];

		$this->link_builder        = Mockery::mock( Indexable_Link_Builder::class );
		$this->indexable_helper    = Mockery::mock( Indexable_Helper::class );
		$this->repository          = Mockery::mock( Indexable_Repository::class );
		$this->wpdb                = Mockery::mock( wpdb::class );
		$this->wpdb->term_taxonomy = 'wp_term_taxonomy';

		$this->instance = Mockery::mock(
			Abstract_Link_Indexing_Action::class,
			[
				$this->link_builder,
				$this->indexable_helper,
				$this->repository,
				$this->wpdb,
			]
		)->makePartial();
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Indexable_Link_Builder::class,
			$this->getPropertyValue( $this->instance, 'link_builder' )
		);
		$this->assertInstanceOf(
			Indexable_Helper::class,
			$this->getPropertyValue( $this->instance, 'indexable_helper' )
		);
		$this->assertInstanceOf(
			Indexable_Repository::class,
			$this->getPropertyValue( $this->instance, 'repository' )
		);
		$this->assertInstanceOf(
			'wpdb',
			$this->getPropertyValue( $this->instance, 'wpdb' )
		);
	}

	/**
	 * Tests the retrieval of the indexing limit.
	 *
	 * @covers ::get_limit
	 *
	 * @return void
	 */
	public function test_get_limit() {
		Monkey\Filters\expectApplied( 'wpseo_link_indexing_limit' )
			->with( 5 )
			->andReturn( 25 );

		$this->assertEquals( 25, $this->instance->get_limit() );
	}
}

<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Indexing;

use Brain\Monkey;
use Mockery;
use wpdb;
use Yoast\WP\SEO\Actions\Indexing\Abstract_Link_Indexing_Action;
use Yoast\WP\SEO\Builders\Indexable_Link_Builder;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract_Link_Indexing_Action_Test class
 *
 * @group actions
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexation\Abstract_Link_Indexing_Action
 */
class Abstract_Link_Indexing_Action_Test extends TestCase {

	/**
	 * The link builder.
	 *
	 * @var Indexable_Link_Builder
	 */
	protected $link_builder;

	/**
	 * The post type helper.
	 *
	 * @var Taxonomy_Helper
	 */
	protected $taxonomy_helper;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
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
	 */
	protected function set_up() {
		parent::set_up();

		global $wpdb;
		// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- Intended, to be able to test the Abstract_Link_Indexing_Action.
		$wpdb = (object) [ 'prefix' => 'wp_' ];

		$this->link_builder        = Mockery::mock( Indexable_Link_Builder::class );
		$this->repository          = Mockery::mock( Indexable_Repository::class );
		$this->wpdb                = Mockery::mock( 'wpdb' );
		$this->wpdb->term_taxonomy = 'wp_term_taxonomy';

		$this->instance = Mockery::mock(
			Abstract_Link_Indexing_Action::class,
			[
				$this->link_builder,
				$this->repository,
				$this->wpdb,
			]
		)->makePartial();
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		static::assertAttributeInstanceOf( Indexable_Link_Builder::class, 'link_builder', $this->instance );
		static::assertAttributeInstanceOf( Indexable_Repository::class, 'repository', $this->instance );
		static::assertAttributeInstanceOf( 'wpdb', 'wpdb', $this->instance );
	}

	/**
	 * Tests the retrieval of the indexing limit.
	 *
	 * @covers ::get_limit
	 */
	public function test_get_limit() {
		Monkey\Filters\expectApplied( 'wpseo_link_indexing_limit' )
			->with( 5 )
			->andReturn( 25 );

		static::assertEquals( 25, $this->instance->get_limit() );
	}
}

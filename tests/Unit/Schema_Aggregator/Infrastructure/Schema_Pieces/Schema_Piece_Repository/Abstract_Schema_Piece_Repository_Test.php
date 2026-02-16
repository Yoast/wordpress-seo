<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Schema_Pieces\Schema_Piece_Repository;

use Mockery;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Schema_Enhancement_Factory;
use Yoast\WP\SEO\Schema_Aggregator\Domain\External_Schema_Piece_Repository_Interface;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Aggregator_Config;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository\Indexable_Repository_Factory;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Meta_Tags_Context_Memoizer_Adapter;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\Schema_Piece_Repository;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\WordPress_Global_State_Adapter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Schema_Piece_Repository tests.
 *
 * @group schema-aggregator
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Schema_Piece_Repository_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Schema_Piece_Repository
	 */
	protected $instance;

	/**
	 * Holds the Meta_Tags_Context_Memoizer mock.
	 *
	 * @var Mockery\MockInterface|Meta_Tags_Context_Memoizer
	 */
	protected $memoizer;

	/**
	 * Holds the Indexable_Helper mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * Holds the Meta_Tags_Context_Memoizer_Adapter mock.
	 *
	 * @var Mockery\MockInterface|Meta_Tags_Context_Memoizer_Adapter
	 */
	protected $adapter;

	/**
	 * Holds the Aggregator_Config mock.
	 *
	 * @var Mockery\MockInterface|Aggregator_Config
	 */
	protected $config;

	/**
	 * Holds the Schema_Enhancement_Factory mock.
	 *
	 * @var Mockery\MockInterface|Schema_Enhancement_Factory
	 */
	protected $enhancement_factory;

	/**
	 * Holds the Indexable_Repository_Factory mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository_Factory
	 */
	protected $indexable_repository_factory;

	/**
	 * Holds the WordPress_Global_State_Adapter mock.
	 *
	 * @var Mockery\MockInterface|WordPress_Global_State_Adapter
	 */
	protected $global_state_adapter;

	/**
	 * Holds the external repository mock.
	 *
	 * @var Mockery\MockInterface|External_Schema_Piece_Repository_Interface
	 */
	protected $external_repository;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->memoizer                     = Mockery::mock( Meta_Tags_Context_Memoizer::class );
		$this->indexable_helper             = Mockery::mock( Indexable_Helper::class );
		$this->adapter                      = Mockery::mock( Meta_Tags_Context_Memoizer_Adapter::class );
		$this->config                       = Mockery::mock( Aggregator_Config::class );
		$this->enhancement_factory          = Mockery::mock( Schema_Enhancement_Factory::class );
		$this->indexable_repository_factory = Mockery::mock( Indexable_Repository_Factory::class );
		$this->global_state_adapter         = Mockery::mock( WordPress_Global_State_Adapter::class );
		$this->external_repository          = Mockery::mock( External_Schema_Piece_Repository_Interface::class );

		$this->instance = new Schema_Piece_Repository(
			$this->memoizer,
			$this->indexable_helper,
			$this->adapter,
			$this->config,
			$this->enhancement_factory,
			$this->indexable_repository_factory,
			$this->global_state_adapter,
			$this->external_repository,
		);
	}
}

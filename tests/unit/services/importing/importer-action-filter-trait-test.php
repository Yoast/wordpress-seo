<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Importing;

use Mockery;
use PHPUnit_Framework_ExpectationFailedException;
use SebastianBergmann\RecursionContext\InvalidArgumentException;
use PHPUnit\Framework\ExpectationFailedException;
use PHPUnit_Framework_Exception;
use PHPUnit\Framework\Exception;
use Yoast\WP\SEO\Actions\Importing\Aioseo_Posts_Importing_Action;
use Yoast\WP\SEO\Helpers\Meta_Helper;
use Yoast\WP\SEO\Helpers\Indexable_To_Postmeta_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Wpdb_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Services\Importing\Aioseo_Replacevar_Handler;
use Yoast\WP\SEO\Services\Importing\Aioseo_Robots_Provider_Service;
use Yoast\WP\SEO\Services\Importing\Aioseo_Robots_Transformer_Service;
use Yoast\WP\SEO\Services\Importing\Importable_Detector;
use Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Importing\Aioseo_Posts_Importing_Action_Double;
use Yoast\WP\SEO\Tests\Unit\Doubles\Services\Importing\Importable_Detector_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Importer_Action_Filter_Trait_Test.
 *
 * @group importing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Services\Importing\Importer_Action_Filter_Trait
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Importer_Action_Filter_Trait_Test extends TestCase {

	/**
	 * The mocked importing action.
	 *
	 * @var Aioseo_Posts_Importing_Action_Double
	 */
	protected $importing_action;

	/**
	 * Represents the indexable repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * The mocked WordPress database object.
	 *
	 * @var Mockery\MockInterface|\wpdb
	 */
	protected $wpdb;

	/**
	 * The mocked meta helper.
	 *
	 * @var Mockery\MockInterface|Meta_Helper
	 */
	protected $meta;

	/**
	 * The mocked indexable_to_postmeta helper.
	 *
	 * @var Mockery\MockInterface|Indexable_To_Postmeta_Helper
	 */
	protected $indexable_to_postmeta;

	/**
	 * The mocked options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options;

	/**
	 * The wpdb helper.
	 *
	 * @var Wpdb_Helper
	 */
	protected $wpdb_helper;

	/**
	 * The replacevar handler.
	 *
	 * @var Aioseo_Replacevar_Handler
	 */
	protected $replacevar_handler;

	/**
	 * The robots provider service.
	 *
	 * @var Mockery\MockInterface|Aioseo_Robots_Provider_Service
	 */
	protected $robots_provider;

	/**
	 * The robots transformer service.
	 *
	 * @var Mockery\MockInterface|Aioseo_Robots_Transformer_Service
	 */
	protected $robots_transformer;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_repository  = Mockery::mock( Indexable_Repository::class );
		$this->wpdb                  = Mockery::mock( 'wpdb' );
		$this->meta                  = Mockery::mock( Meta_Helper::class );
		$this->indexable_to_postmeta = Mockery::mock( Indexable_To_Postmeta_Helper::class, [ $this->meta ] );
		$this->options               = Mockery::mock( Options_Helper::class );
		$this->wpdb_helper           = Mockery::mock( Wpdb_Helper::class );
		$this->replacevar_handler    = new Aioseo_Replacevar_Handler();
		$this->robots_provider       = new Aioseo_Robots_Provider_Service();
		$this->robots_transformer    = new Aioseo_Robots_Transformer_Service( $this->robots_provider );

		$this->importing_action = Mockery::mock(
			Aioseo_Posts_Importing_Action_Double::class,
			[
				$this->indexable_repository,
				$this->wpdb,
				$this->indexable_to_postmeta,
				$this->options,
				$this->wpdb_helper,
				$this->replacevar_handler,
				$this->robots_provider,
				$this->robots_transformer,
			]
		)->makePartial()->shouldAllowMockingProtectedMethods();

		$this->mock_instance = Mockery::mock(
			Importable_Detector_Double::class,
			[
				$this->importing_action,
			]
		)->makePartial()->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Tests whether filter_actions returns all plugins when no plugin and type are provided.
	 *
	 * @return void
	 *
	 * @covers ::filter_actions
	 */
	public function test_filter_actions_no_filters() {
		$filtered_importers_no_filters = $this->mock_instance->filter_actions( [ $this->importing_action ] );

		$this->assertTrue( \is_array( $filtered_importers_no_filters ) );
		$this->assertTrue( \count( $filtered_importers_no_filters ) === 1 );
		$this->assertInstanceOf(
			Aioseo_Posts_Importing_Action::class,
			$filtered_importers_no_filters[0]
		);
	}

	/**
	 * Tests whether filter_actions returns the correct importers when only the plugin is provided.
	 *
	 * @return void
	 *
	 * @covers ::filter_actions
	 */
	public function test_filter_actions_plugin_filter_only() {
		$filtered_importers_plugin_filters = $this->mock_instance->filter_actions( [ $this->importing_action ], 'aioseo' );

		$this->assertTrue( \is_array( $filtered_importers_plugin_filters ) );
		$this->assertTrue( \count( $filtered_importers_plugin_filters ) === 1 );
		$this->assertInstanceOf(
			Aioseo_Posts_Importing_Action::class,
			$filtered_importers_plugin_filters[0]
		);
	}

	/**
	 * Tests whether filter_actions returns the correct importers when only the type is provided.
	 *
	 * @return void
	 *
	 * @covers ::filter_actions
	 */
	public function test_filter_actions_type_filter_only() {
		$filtered_importers_type_filters = $this->mock_instance->filter_actions( [ $this->importing_action ], false, 'posts' );

		$this->assertTrue( \is_array( $filtered_importers_type_filters ) );
		$this->assertTrue( \count( $filtered_importers_type_filters ) === 1 );
		$this->assertInstanceOf(
			Aioseo_Posts_Importing_Action::class,
			$filtered_importers_type_filters[0]
		);
	}

	/**
	 * Tests whether filter_actions returns the correct importers when both the plugin and the type are provided.
	 *
	 * @return void
	 *
	 * @covers ::filter_actions
	 */
	public function test_filter_actions_plugin_and_type_filter() {
		$filtered_importers_plugin_type_filters = $this->mock_instance->filter_actions( [ $this->importing_action ], 'aioseo', 'posts' );

		$this->assertTrue( \is_array( $filtered_importers_plugin_type_filters ) );
		$this->assertTrue( \count( $filtered_importers_plugin_type_filters ) === 1 );
		$this->assertInstanceOf(
			Aioseo_Posts_Importing_Action::class,
			$filtered_importers_plugin_type_filters[0]
		);
	}

	/**
	 * Tests whether filter_actions returns no importers when a non-existent plugin is provided.
	 *
	 * @return void
	 *
	 * @covers ::filter_actions
	 */
	public function test_filter_actions_non_existent_plugin() {
		$no_filtered_importers_plugin_filters = $this->mock_instance->filter_actions( [ $this->importing_action ], 'aioseo1' );

		$this->assertTrue( \is_array( $no_filtered_importers_plugin_filters ) );
		$this->assertTrue( \count( $no_filtered_importers_plugin_filters ) === 0 );
	}

	/**
	 * Tests whether filter_actions returns no importers when a non-existent type is provided.
	 *
	 * @return void
	 *
	 * @covers ::filter_actions
	 */
	public function test_filter_actions_non_existent_type() {
		$no_filtered_importers_type_filters = $this->mock_instance->filter_actions( [ $this->importing_action ], false, 'posts1' );

		$this->assertTrue( \is_array( $no_filtered_importers_type_filters ) );
		$this->assertTrue( \count( $no_filtered_importers_type_filters ) === 0 );
	}

	/**
	 * Tests whether filter_actions returns no importers when a non-existent type and -plugin are provided.
	 *
	 * @return void
	 *
	 * @covers ::filter_actions
	 */
	public function test_filter_actions_non_existent_type_and_plugin() {
		$no_filtered_importers_plugin_type_filters = $this->mock_instance->filter_actions( [ $this->importing_action ], 'aioseo1', 'posts1' );

		$this->assertTrue( \is_array( $no_filtered_importers_plugin_type_filters ) );
		$this->assertTrue( \count( $no_filtered_importers_plugin_type_filters ) === 0 );
	}
}

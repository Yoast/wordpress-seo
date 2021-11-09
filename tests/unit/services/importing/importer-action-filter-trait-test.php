<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Importing;

use Mockery;
use Yoast\WP\SEO\Actions\Importing\Aioseo_Posts_Importing_Action;
use Yoast\WP\SEO\Helpers\Meta_Helper;
use Yoast\WP\SEO\Helpers\Indexable_To_Postmeta_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Wpdb_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Models\Indexable;
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

		$this->importing_action = Mockery::mock(
			Aioseo_Posts_Importing_Action_Double::class,
			[
				$this->indexable_repository,
				$this->wpdb,
				$this->indexable_to_postmeta,
				$this->options,
				$this->wpdb_helper,
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
	 * Tests if the detector detects when there are no unimported data.
	 *
	 * @covers ::filter_actions
	 */
	public function test_filter_actions() {
		// Test filter_actions() with no filters.
		$filtered_importers_no_filters = $this->mock_instance->filter_actions( [ $this->importing_action ] );

		$this->assertTrue( \is_array( $filtered_importers_no_filters ) );
		$this->assertTrue( \count( $filtered_importers_no_filters ) === 1 );
		$this->assertInstanceOf(
			Aioseo_Posts_Importing_Action::class,
			$filtered_importers_no_filters[0]
		);

		// Test filter_actions() with a plugin filter.
		$filtered_importers_plugin_filters = $this->mock_instance->filter_actions( [ $this->importing_action ], 'aioseo' );

		$this->assertTrue( \is_array( $filtered_importers_plugin_filters ) );
		$this->assertTrue( \count( $filtered_importers_plugin_filters ) === 1 );
		$this->assertInstanceOf(
			Aioseo_Posts_Importing_Action::class,
			$filtered_importers_plugin_filters[0]
		);

		// Test filter_actions() with a type filter.
		$filtered_importers_type_filters = $this->mock_instance->filter_actions( [ $this->importing_action ], false, 'posts' );

		$this->assertTrue( \is_array( $filtered_importers_type_filters ) );
		$this->assertTrue( \count( $filtered_importers_type_filters ) === 1 );
		$this->assertInstanceOf(
			Aioseo_Posts_Importing_Action::class,
			$filtered_importers_type_filters[0]
		);

		// Test filter_actions() with both a plugin and a type filter.
		$filtered_importers_plugin_type_filters = $this->mock_instance->filter_actions( [ $this->importing_action ], 'aioseo', 'posts' );

		$this->assertTrue( \is_array( $filtered_importers_plugin_type_filters ) );
		$this->assertTrue( \count( $filtered_importers_plugin_type_filters ) === 1 );
		$this->assertInstanceOf(
			Aioseo_Posts_Importing_Action::class,
			$filtered_importers_plugin_type_filters[0]
		);

		// Test filter_actions() with a plugin filter that doesn't exist.
		$no_filtered_importers_plugin_filters = $this->mock_instance->filter_actions( [ $this->importing_action ], 'aioseo1' );

		$this->assertTrue( \is_array( $no_filtered_importers_plugin_filters ) );
		$this->assertTrue( \count( $no_filtered_importers_plugin_filters ) === 0 );

		// Test filter_actions() with a type filter that doesn't exist.
		$no_filtered_importers_type_filters = $this->mock_instance->filter_actions( [ $this->importing_action ], false, 'posts1' );

		$this->assertTrue( \is_array( $no_filtered_importers_type_filters ) );
		$this->assertTrue( \count( $no_filtered_importers_type_filters ) === 0 );

		// Test filter_actions() with both a plugin and a type filter that don't exist.
		$no_filtered_importers_plugin_type_filters = $this->mock_instance->filter_actions( [ $this->importing_action ], 'aioseo1', 'posts1' );

		$this->assertTrue( \is_array( $no_filtered_importers_plugin_type_filters ) );
		$this->assertTrue( \count( $no_filtered_importers_plugin_type_filters ) === 0 );
	}
}

<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\AIOSEO_V4_Importer_Conditional;
use Yoast\WP\SEO\Conditionals\Import_Tool_Selected_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Tools_Page_Conditional;
use Yoast\WP\SEO\Integrations\Admin\Import_Integration;
use Yoast\WP\SEO\Services\Importing\Importable_Detector;
use Yoast\WP\SEO\Routes\Importing_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Import_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Import_Integration
 *
 * @group integrations
 * @group indexing
 */
class Import_Integration_Test extends TestCase {

	/**
	 * The import integration under test.
	 *
	 * @var Import_Integration
	 */
	protected $instance;

	/**
	 * The admin asset manager.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * The Importable Detector service.
	 *
	 * @var Mockery\MockInterface|Importable_Detector
	 */
	protected $importable_detector;

	/**
	 * The AIOSEO_V4_Importer conditional.
	 *
	 * @var Mockery\MockInterface|AIOSEO_V4_Importer_Conditional
	 */
	protected $importer_conditional;

	/**
	 * The Importing Route class.
	 *
	 * @var Mockery\MockInterface|Importing_Route
	 */
	protected $importing_route;

	/**
	 * Sets up the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();
		$this->stubEscapeFunctions();

		$this->asset_manager        = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->importer_conditional = Mockery::mock( AIOSEO_V4_Importer_Conditional::class );
		$this->importable_detector  = Mockery::mock( Importable_Detector::class );
		$this->importing_route      = Mockery::mock( Importing_Route::class );

		$this->instance = new Import_Integration(
			$this->asset_manager,
			$this->importer_conditional,
			$this->importable_detector,
			$this->importing_route
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		static::assertInstanceOf(
			WPSEO_Admin_Asset_Manager::class,
			self::getPropertyValue( $this->instance, 'asset_manager' )
		);
		static::assertInstanceOf(
			AIOSEO_V4_Importer_Conditional::class,
			self::getPropertyValue( $this->instance, 'importer_conditional' )
		);
		static::assertInstanceOf(
			Importable_Detector::class,
			self::getPropertyValue( $this->instance, 'importable_detector' )
		);
		static::assertInstanceOf(
			Importing_Route::class,
			self::getPropertyValue( $this->instance, 'importing_route' )
		);
	}

	/**
	 * Tests the get_conditionals method.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$actual   = Import_Integration::get_conditionals();
		$expected = [
			AIOSEO_V4_Importer_Conditional::class,
			Import_Tool_Selected_Conditional::class,
			Yoast_Tools_Page_Conditional::class,
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the register hooks method.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		Monkey\Actions\expectAdded( 'admin_enqueue_scripts' );

		$this->instance->register_hooks();
	}

	/**
	 * Tests the enqueue_import_script method.
	 *
	 * @covers ::enqueue_import_script
	 * @covers ::get_importing_endpoints
	 */
	public function test_enqueue_import_script() {
		Monkey\Functions\expect( 'wp_enqueue_style' )
			->andReturn( 'dashicons' );

		$this->asset_manager
			->expects( 'enqueue_script' )
			->with( 'import' );

		Monkey\Functions\expect( 'rest_url' )
			->andReturn( 'https://example.org/wp-ajax/' );

		$expected_detections = [
			'aioseo' => [ 'posts' ],
		];

		$this->importable_detector
			->expects( 'detect' )
			->andReturn( $expected_detections );

		$this->importing_route
			->expects( 'get_endpoint' )
			->once()
			->with( 'aioseo', 'posts' )
			->andReturn( 'yoast/v1/import/aioseo/posts' );

		Monkey\Functions\expect( 'wp_create_nonce' )
			->with( 'wp_rest' )
			->andReturn( 'nonce_value' );

		Monkey\Functions\expect( 'admin_url' )
				->with( 'images/loading.gif' )
				->andReturn( 'https://example.org/wp-admin/images/loading.gif' );

		$injected_data = [
			'restApi' => [
				'root'                => 'https://example.org/wp-ajax/',
				'importing_endpoints' => [
					'aioseo' => [
						'yoast/v1/import/aioseo/posts',
					],
				],
				'nonce'               => 'nonce_value',
			],
			'assets'  => [
				'loading_msg'        => 'The import can take a long time depending on your site\'s size',
				'select_placeholder' => 'Select SEO plugin',
				'no_data_msg'        => 'No data found from other SEO plugins',
				'spinner'            => 'https://example.org/wp-admin/images/loading.gif',
			],
		];

		Monkey\Filters\expectApplied( 'wpseo_importing_data' )
			->with( $injected_data );

		$this->asset_manager
			->expects( 'localize_script' )
			->with( 'import', 'yoastImportData', $injected_data );

		$this->instance->enqueue_import_script();
	}
}

<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Import_Tool_Selected_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Tools_Page_Conditional;
use Yoast\WP\SEO\Integrations\Admin\Import_Integration;
use Yoast\WP\SEO\Routes\Importing_Route;
use Yoast\WP\SEO\Services\Importing\Importable_Detector_Service;
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
	 * @var Mockery\MockInterface|Importable_Detector_Service
	 */
	protected $importable_detector;

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

		$this->asset_manager       = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->importable_detector = Mockery::mock( Importable_Detector_Service::class );
		$this->importing_route     = Mockery::mock( Importing_Route::class );

		$this->instance = new Import_Integration(
			$this->asset_manager,
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
			Importable_Detector_Service::class,
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
	 * @covers ::get_import_failure_alert
	 */
	public function test_enqueue_import_script() {
		Monkey\Functions\expect( 'wp_enqueue_style' )
			->andReturn( 'dashicons' );

		$this->asset_manager
			->expects( 'enqueue_script' )
			->with( 'import' );

		Monkey\Functions\expect( 'rest_url' )
			->andReturn( 'https://example.org/wp-ajax/' );

		$expected_import_detections = [
			'aioseo' => [ 'posts' ],
		];

		$expected_cleanup_detections = [
			'aioseo' => [ 'cleanup' ],
		];

		$this->importable_detector
			->expects( 'detect_importers' )
			->andReturn( $expected_import_detections );

		$this->importable_detector
			->expects( 'detect_cleanups' )
			->andReturn( $expected_cleanup_detections );

		$this->importing_route
			->expects( 'get_endpoint' )
			->once()
			->with( 'aioseo', 'posts' )
			->andReturn( 'yoast/v1/import/aioseo/posts' );

		$this->importing_route
			->expects( 'get_endpoint' )
			->once()
			->with( 'aioseo', 'cleanup' )
			->andReturn( 'yoast/v1/import/aioseo/cleanup' );

		Monkey\Functions\expect( 'wp_create_nonce' )
			->with( 'wp_rest' )
			->andReturn( 'nonce_value' );

		Monkey\Functions\expect( 'plugin_dir_url' )
			->andReturn( 'https://example.org/wp-content/plugins/' );

		Monkey\Functions\expect( 'admin_url' )
				->with( 'images/loading.gif' )
				->andReturn( 'https://example.org/wp-admin/images/loading.gif' );

		$injected_data = [
			'restApi' => [
				'root'                => 'https://example.org/wp-ajax/',
				'cleanup_endpoints'   => [
					'aioseo' => [
						'yoast/v1/import/aioseo/cleanup',
					],
				],
				'importing_endpoints' => [
					'aioseo' => [
						'yoast/v1/import/aioseo/posts',
					],
				],
				'nonce'               => 'nonce_value',
			],
			'assets'  => [
				'loading_msg_import'       => 'The import can take a long time depending on your site\'s size.',
				'loading_msg_cleanup'      => 'The cleanup can take a long time depending on your site\'s size.',
				'note'                     => 'Note: ',
				'cleanup_after_import_msg' => 'After you\'ve imported data from another SEO plugin, please make sure to clean up all the original data from that plugin. (step 5)',
				'select_placeholder'       => 'Select SEO plugin',
				'no_data_msg'              => 'No data found from other SEO plugins.',
				'import_failure'           => '<div class="yoast-alert yoast-alert--error"><span><img class="yoast-alert__icon" src="https://example.org/wp-content/plugins/images/alert-error-icon.svg" alt="" /></span><span>Import failed with the following error:<br/><br/>%s</span></div>',
				'cleanup_failure'          => '<div class="yoast-alert yoast-alert--error"><span><img class="yoast-alert__icon" src="https://example.org/wp-content/plugins/images/alert-error-icon.svg" alt="" /></span><span>Cleanup failed with the following error:<br/><br/>%s</span></div>',
				'spinner'                  => 'https://example.org/wp-admin/images/loading.gif',
				'replacing_texts'          => [
					'cleanup_button'       => 'Clean up',
					'import_explanation'   => 'Please select an SEO plugin below to see what data can be imported.',
					'cleanup_explanation'  => 'Once you\'re certain that your site is working properly with the imported data from another SEO plugin, you can clean up all the original data from that plugin.',
					'select_header'        => 'The import from %s includes:',
					'plugins'              => [
						'aioseo' => [
							[
								'data_name' => 'Post metadata (SEO titles, descriptions, etc.)',
								'data_note' => 'Note: This metadata will only be imported if there is no existing Yoast SEO metadata yet.',
							],
							[
								'data_name' => 'Default settings',
								'data_note' => 'Note: These settings will overwrite the default settings of Yoast SEO.',
							],
						],
						'other' => [
							[
								'data_name' => 'Post metadata (SEO titles, descriptions, etc.)',
								'data_note' => 'Note: This metadata will only be imported if there is no existing Yoast SEO metadata yet.',
							],
						],
					],
				],
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

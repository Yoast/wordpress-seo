<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Archive_And_Special_Page_SEO_Data_Collector;
use Yoast\WP\SEO\Abilities\Application\Archive_And_Special_Page_SEO_Data_Updater;
use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Template_Target_Exception;
use Yoast\WP\SEO\Abilities\Domain\Template_Field_Interface;
use Yoast\WP\SEO\Abilities\Domain\Template_Target_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Template_Fields\Template_Field_Repository;
use Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Template_Target_Repository;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Archive_And_Special_Page_SEO_Data_Updater class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Application\Archive_And_Special_Page_SEO_Data_Updater
 */
final class Archive_And_Special_Page_SEO_Data_Updater_Test extends TestCase {

	/**
	 * The template field repository mock.
	 *
	 * @var Mockery\MockInterface|Template_Field_Repository
	 */
	private $field_repository;

	/**
	 * The template target repository mock.
	 *
	 * @var Mockery\MockInterface|Template_Target_Repository
	 */
	private $target_repository;

	/**
	 * The archive and special page SEO data collector mock.
	 *
	 * @var Mockery\MockInterface|Archive_And_Special_Page_SEO_Data_Collector
	 */
	private $collector;

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * All field mocks, keyed by name.
	 *
	 * @var array<string, Mockery\MockInterface|Template_Field_Interface>
	 */
	private $fields;

	/**
	 * The instance under test.
	 *
	 * @var Archive_And_Special_Page_SEO_Data_Updater
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->field_repository  = Mockery::mock( Template_Field_Repository::class );
		$this->target_repository = Mockery::mock( Template_Target_Repository::class );
		$this->collector         = Mockery::mock( Archive_And_Special_Page_SEO_Data_Collector::class );
		$this->options_helper    = Mockery::mock( Options_Helper::class );

		$this->fields = [
			'seo_title'        => $this->mock_field( 'string' ),
			'meta_description' => $this->mock_field( 'string' ),
			'noindex'          => $this->mock_field( 'boolean' ),
		];

		$this->field_repository->allows( 'get_all' )->andReturn( $this->fields );
		$this->field_repository->allows( 'get_schemas' )->andReturnUsing(
			static function ( $fields ) {
				return \array_map(
					static function ( $field ) {
						return $field->get_schema();
					},
					$fields,
				);
			},
		);

		$this->instance = new Archive_And_Special_Page_SEO_Data_Updater(
			$this->field_repository,
			$this->target_repository,
			$this->collector,
			$this->options_helper,
		);
	}

	/**
	 * Creates a field mock that is stored in an option named after the target.
	 *
	 * @param string $type The schema type of the field.
	 *
	 * @return Mockery\MockInterface|Template_Field_Interface The field mock.
	 */
	private function mock_field( string $type ) {
		$field = Mockery::mock( Template_Field_Interface::class );
		$field->allows( 'get_schema' )->andReturn( [ 'type' => $type ] );
		$field->allows( 'get_option_name' )->andReturnUsing(
			static function ( $target ) use ( $type ) {
				return $type . '-option-' . $target->get_name();
			},
		);

		return $field;
	}

	/**
	 * Creates a target mock that is available.
	 *
	 * @param array<string, string> $identifiers The identifiers of the target.
	 * @param bool                  $enabled     Whether the target is enabled.
	 *
	 * @return Mockery\MockInterface|Template_Target_Interface The target mock.
	 */
	private function mock_target( array $identifiers, bool $enabled ) {
		$target = Mockery::mock( Template_Target_Interface::class );
		$target->allows( 'ensure_available' );
		$target->allows( 'get_name' )->andReturn( $identifiers['target'] );
		$target->allows( 'get_identifiers' )->andReturn( $identifiers );
		$target->allows( 'is_enabled' )->andReturn( $enabled );

		return $target;
	}

	/**
	 * Tests that update saves the provided fields in their option for the target and returns its new state.
	 *
	 * @covers ::__construct
	 * @covers ::update
	 * @covers ::save_field
	 * @covers ::get_input_warnings
	 *
	 * @return void
	 */
	public function test_update() {
		$target = $this->mock_target(
			[
				'target'    => 'post_type_archive',
				'post_type' => 'portfolio',
			],
			true,
		);

		$this->target_repository->expects( 'get' )->once()->with( 'post_type_archive', 'portfolio' )->andReturn( $target );
		$this->field_repository->expects( 'get_for_target' )->once()->with( $target )->andReturn( $this->fields );
		$this->options_helper->expects( 'set' )->once()->with( 'string-option-post_type_archive', '%%pt_plural%% Archive' )->andReturnTrue();
		$this->options_helper->expects( 'set' )->once()->with( 'boolean-option-post_type_archive', true )->andReturnTrue();
		$this->collector->expects( 'get_target' )->once()->with( $target )->andReturn( [ 'seo_title' => '%%pt_plural%% Archive' ] );

		$this->assertSame(
			[ 'seo_title' => '%%pt_plural%% Archive' ],
			$this->instance->update(
				[
					'target'    => 'post_type_archive',
					'post_type' => 'portfolio',
					'seo_title' => '%%pt_plural%% Archive',
					'noindex'   => true,
				],
			),
		);
	}

	/**
	 * Tests that update turns an unavailable target into an error, without saving anything.
	 *
	 * @covers ::update
	 *
	 * @return void
	 */
	public function test_update_unavailable_target() {
		$target = Mockery::mock( Template_Target_Interface::class );
		$target->expects( 'ensure_available' )->once()->andThrow( new Unavailable_Template_Target_Exception( 'yoast_seo_static_homepage', 'Static homepage.' ) );

		$this->target_repository->expects( 'get' )->once()->with( 'homepage', '' )->andReturn( $target );
		$this->options_helper->expects( 'set' )->never();

		$result = $this->instance->update(
			[
				'target'    => 'homepage',
				'seo_title' => 'Home',
			],
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'yoast_seo_static_homepage', $result->get_error_code() );
		$this->assertSame( 'Static homepage.', $result->get_error_message() );
		$this->assertSame( [ 'status' => 400 ], $result->get_error_data() );
	}

	/**
	 * Tests that update turns an unknown target into an error.
	 *
	 * @covers ::update
	 *
	 * @return void
	 */
	public function test_update_unknown_target() {
		$this->target_repository->expects( 'get' )->once()->andThrow( new Unavailable_Template_Target_Exception( 'yoast_seo_invalid_target', 'Unknown.' ) );

		$result = $this->instance->update( [ 'target' => 'unknown' ] );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'yoast_seo_invalid_target', $result->get_error_code() );
	}

	/**
	 * Tests that update skips the fields the target does not have, ignores a post type the target does not use,
	 * still saves the other fields, and warns about all of it.
	 *
	 * @covers ::update
	 * @covers ::get_input_warnings
	 *
	 * @return void
	 */
	public function test_update_with_ignored_input() {
		$target = $this->mock_target( [ 'target' => 'search_page' ], true );

		$this->target_repository->expects( 'get' )->once()->with( 'search_page', 'page' )->andReturn( $target );
		$this->field_repository->expects( 'get_for_target' )->once()->with( $target )->andReturn( [ 'seo_title' => $this->fields['seo_title'] ] );
		$this->options_helper->expects( 'set' )->once()->with( 'string-option-search_page', 'Search' )->andReturnTrue();
		$this->collector->expects( 'get_target' )->once()->with( $target )->andReturn( [ 'seo_title' => 'Search' ] );

		$this->assertSame(
			[
				'seo_title' => 'Search',
				'warning'   => 'The post_type is only used for the post_type_archive target, so it was ignored. These settings are not available for search_page, so they were not saved: meta_description, noindex.',
			],
			$this->instance->update(
				[
					'target'           => 'search_page',
					'post_type'        => 'page',
					'seo_title'        => 'Search',
					'meta_description' => 'Results',
					'noindex'          => false,
				],
			),
		);
	}

	/**
	 * Tests that update warns when a field could not be saved as provided, and when the saved fields have no effect
	 * because the target is disabled.
	 *
	 * @covers ::update
	 * @covers ::save_field
	 *
	 * @return void
	 */
	public function test_update_disabled_target_with_failed_save() {
		$target = $this->mock_target( [ 'target' => 'author_archives' ], false );

		$this->target_repository->expects( 'get' )->once()->with( 'author_archives', '' )->andReturn( $target );
		$this->field_repository->expects( 'get_for_target' )->once()->with( $target )->andReturn(
			[
				'seo_title'        => $this->fields['seo_title'],
				'meta_description' => $this->fields['meta_description'],
			],
		);
		$this->options_helper->expects( 'set' )->once()->with( 'string-option-author_archives', '%%name%%' )->andReturnTrue();
		$this->options_helper->expects( 'set' )->once()->with( 'string-option-author_archives', '<b>Bold</b>' )->andReturnFalse();
		$this->collector->expects( 'get_target' )->once()->with( $target )->andReturn( [ 'seo_title' => '%%name%%' ] );

		$this->assertSame(
			[
				'seo_title' => '%%name%%',
				'warning'   => 'The meta_description setting could not be saved as provided, so its current value is returned. The other settings were saved. The settings were saved, but these pages are disabled on this site, so the settings have no effect until the pages are enabled in the Yoast SEO settings.',
			],
			$this->instance->update(
				[
					'target'           => 'author_archives',
					'seo_title'        => '%%name%%',
					'meta_description' => '<b>Bold</b>',
				],
			),
		);
	}

	/**
	 * Tests that save_field does not save a field the target does not have.
	 *
	 * @covers ::save_field
	 *
	 * @return void
	 */
	public function test_save_field_without_field() {
		$this->options_helper->expects( 'set' )->never();

		$instance = new class( $this->field_repository, $this->target_repository, $this->collector, $this->options_helper ) extends Archive_And_Special_Page_SEO_Data_Updater {

			/**
			 * Exposes save_field.
			 *
			 * @param string               $field_name The name of the field.
			 * @param mixed                $value      The value to save.
			 * @param array<string, mixed> $context    The target in 'target', and the fields it has in 'fields'.
			 *
			 * @return bool Whether the field was saved.
			 */
			public function save( string $field_name, $value, array $context ): bool {
				return $this->save_field( $field_name, $value, $context );
			}
		};

		$this->assertFalse(
			$instance->save(
				'noindex',
				true,
				[
					'target' => Mockery::mock( Template_Target_Interface::class ),
					'fields' => [],
				],
			),
		);
	}
}

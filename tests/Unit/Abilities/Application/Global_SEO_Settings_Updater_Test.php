<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Global_SEO_Settings_Collector;
use Yoast\WP\SEO\Abilities\Application\Global_SEO_Settings_Updater;
use Yoast\WP\SEO\Abilities\Domain\Global_Setting_Target_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Field_Map;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Global_SEO_Settings_Updater class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Application\Global_SEO_Settings_Updater
 */
final class Global_SEO_Settings_Updater_Test extends TestCase {

	/**
	 * The global setting field map mock.
	 *
	 * @var Mockery\MockInterface|Global_Setting_Field_Map
	 */
	private $field_map;

	/**
	 * The global SEO settings collector mock.
	 *
	 * @var Mockery\MockInterface|Global_SEO_Settings_Collector
	 */
	private $collector;

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The instance under test.
	 *
	 * @var Global_SEO_Settings_Updater
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

		$this->field_map      = Mockery::mock( Global_Setting_Field_Map::class );
		$this->collector      = Mockery::mock( Global_SEO_Settings_Collector::class );
		$this->options_helper = Mockery::mock( Options_Helper::class );

		$this->field_map->allows( 'get_fields' )->andReturn(
			[
				'seo_title'        => [ 'type' => 'string' ],
				'meta_description' => [ 'type' => 'string' ],
				'noindex'          => [ 'type' => 'boolean' ],
				'schema_page_type' => [ 'type' => 'string' ],
			],
		);
		$this->field_map->allows( 'get_option_name' )->andReturnUsing(
			static function ( $field_name, $target ) {
				return $field_name . '-' . $target->get_name();
			},
		);

		$this->instance = new Global_SEO_Settings_Updater( $this->field_map, $this->collector, $this->options_helper );
	}

	/**
	 * Creates a target mock.
	 *
	 * @param string                  $name           The name of the target.
	 * @param bool                    $enabled        Whether the target is enabled.
	 * @param array<string, callable> $validators     The validators the field map returns.
	 * @param array<string>           $missing_fields The fields the target does not have.
	 *
	 * @return Mockery\MockInterface|Global_Setting_Target_Interface The target mock.
	 */
	private function mock_target( string $name, bool $enabled, array $validators = [], array $missing_fields = [] ) {
		$target = Mockery::mock( Global_Setting_Target_Interface::class );
		$target->allows( 'get_name' )->andReturn( $name );
		$target->allows( 'is_enabled' )->andReturn( $enabled );

		$this->field_map->allows( 'get_validators' )->andReturn( $validators );
		$this->field_map->allows( 'target_has_field' )->andReturnUsing(
			static function ( $field_name ) use ( $missing_fields ) {
				return ! \in_array( $field_name, $missing_fields, true );
			},
		);

		return $target;
	}

	/**
	 * Tests that update saves the provided fields in their option for the target, ignores what identifies the target,
	 * and returns its new state.
	 *
	 * @covers ::__construct
	 * @covers ::update
	 * @covers ::update_field
	 * @covers ::save_field
	 * @covers ::get_field_value
	 *
	 * @return void
	 */
	public function test_update() {
		$target = $this->mock_target( 'content_type', true );

		$this->options_helper->expects( 'get' )->once()->with( 'seo_title-content_type' )->andReturn( '' );
		$this->options_helper->expects( 'get' )->once()->with( 'noindex-content_type' )->andReturnFalse();
		$this->options_helper->expects( 'set' )->once()->with( 'seo_title-content_type', '%%title%%' )->andReturnTrue();
		$this->options_helper->expects( 'set' )->once()->with( 'noindex-content_type', true )->andReturnTrue();
		$this->collector->expects( 'get_target_settings' )->once()->with( $target )->andReturn( [ 'seo_title' => '%%title%%' ] );

		$this->assertSame(
			[ 'seo_title' => '%%title%%' ],
			$this->instance->update(
				$target,
				[
					'post_type' => 'portfolio',
					'seo_title' => '%%title%%',
					'noindex'   => true,
				],
			),
		);
	}

	/**
	 * Tests that update returns an error when the input has no field to change, without saving anything.
	 *
	 * @covers ::update
	 *
	 * @return void
	 */
	public function test_update_without_fields() {
		$target = $this->mock_target( 'taxonomy_archive', true );

		$this->options_helper->expects( 'set' )->never();
		$this->collector->expects( 'get_target_settings' )->never();

		$result = $this->instance->update(
			$target,
			[
				'target'   => 'taxonomy_archive',
				'taxonomy' => 'category',
			],
		);

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'yoast_seo_no_settings', $result->get_error_code() );
		$this->assertSame( 'Provide at least one setting to change.', $result->get_error_message() );
		$this->assertSame( [ 'status' => 400 ], $result->get_error_data() );
	}

	/**
	 * Tests that update skips the fields the target does not have, whatever their validator, and the fields their
	 * validator warns about, and still saves the other fields.
	 *
	 * @covers ::update
	 * @covers ::update_field
	 *
	 * @return void
	 */
	public function test_update_with_invalid_fields() {
		$warn = static function ( $value, $field_name ) {
			return 'The ' . $field_name . ' setting is invalid.';
		};

		$target = $this->mock_target(
			'content_type',
			true,
			[
				'meta_description' => $warn,
				'noindex'          => $warn,
			],
			[ 'noindex' ],
		);

		$this->options_helper->expects( 'get' )->once()->with( 'seo_title-content_type' )->andReturn( '' );
		$this->options_helper->expects( 'set' )->once()->with( 'seo_title-content_type', '%%title%%' )->andReturnTrue();
		$this->collector->expects( 'get_target_settings' )->once()->with( $target )->andReturn( [ 'seo_title' => '%%title%%' ] );

		$this->assertSame(
			[
				'seo_title' => '%%title%%',
				'warning'   => 'The meta_description setting is invalid. The noindex setting is not available for content_type, so it was not saved. The other settings were saved.',
			],
			$this->instance->update(
				$target,
				[
					'seo_title'        => '%%title%%',
					'meta_description' => 'Products',
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
	 * @covers ::get_field_value
	 *
	 * @return void
	 */
	public function test_update_disabled_target_with_failed_save() {
		$target = $this->mock_target( 'author_archives', false );

		$this->options_helper->expects( 'get' )->once()->with( 'seo_title-author_archives' )->andReturn( '' );
		$this->options_helper->expects( 'get' )->twice()->with( 'meta_description-author_archives' )->andReturn( 'Authors' );
		$this->options_helper->expects( 'set' )->once()->with( 'seo_title-author_archives', '%%name%%' )->andReturnTrue();
		$this->options_helper->expects( 'set' )->once()->with( 'meta_description-author_archives', '<b>Bold</b>' )->andReturnFalse();
		$this->collector->expects( 'get_target_settings' )->once()->with( $target )->andReturn( [ 'seo_title' => '%%name%%' ] );

		$this->assertSame(
			[
				'seo_title' => '%%name%%',
				'warning'   => 'The meta_description setting could not be saved as provided, so its current value is returned. The other settings were saved. The settings were saved, but these pages are disabled on this site, so the settings have no effect until the pages are enabled in the Yoast SEO settings.',
			],
			$this->instance->update(
				$target,
				[
					'seo_title'        => '%%name%%',
					'meta_description' => '<b>Bold</b>',
				],
			),
		);
	}

	/**
	 * Tests that update reports a field that got sanitized into something else as saved, with a warning about it.
	 *
	 * @covers ::update
	 * @covers ::save_field
	 * @covers ::get_field_value
	 *
	 * @return void
	 */
	public function test_update_with_sanitized_save() {
		$target = $this->mock_target( 'search_page', true );

		$this->options_helper->expects( 'get' )->twice()->with( 'seo_title-search_page' )->andReturn( 'Search', 'Bold' );
		$this->options_helper->expects( 'set' )->once()->with( 'seo_title-search_page', '<b>Bold</b>' )->andReturnFalse();
		$this->collector->expects( 'get_target_settings' )->once()->with( $target )->andReturn( [ 'seo_title' => 'Bold' ] );

		$this->assertSame(
			[
				'seo_title' => 'Bold',
				'warning'   => 'The seo_title setting was saved after being cleaned up, so its saved value differs from the one provided.',
			],
			$this->instance->update(
				$target,
				[
					'seo_title' => '<b>Bold</b>',
				],
			),
		);
	}

	/**
	 * Tests that save_field does not save, and get_field_value does not read, a field the target does not have.
	 *
	 * @covers ::save_field
	 * @covers ::get_field_value
	 *
	 * @return void
	 */
	public function test_save_field_without_option() {
		$target = Mockery::mock( Global_Setting_Target_Interface::class );

		$field_map = Mockery::mock( Global_Setting_Field_Map::class );
		$field_map->expects( 'get_option_name' )->twice()->with( 'noindex', $target )->andReturnNull();

		$this->options_helper->expects( 'set' )->never();
		$this->options_helper->expects( 'get' )->never();

		$instance = new class( $field_map, $this->collector, $this->options_helper ) extends Global_SEO_Settings_Updater {

			/**
			 * Exposes save_field.
			 *
			 * @param string               $field_name The name of the field.
			 * @param mixed                $value      The value to save.
			 * @param array<string, mixed> $context    The target, under 'target'.
			 *
			 * @return bool Whether the field was saved.
			 */
			public function save( string $field_name, $value, array $context ): bool {
				return $this->save_field( $field_name, $value, $context );
			}

			/**
			 * Exposes get_field_value.
			 *
			 * @param string               $field_name The name of the field.
			 * @param array<string, mixed> $context    The target, under 'target'.
			 *
			 * @return mixed The stored value.
			 */
			public function get( string $field_name, array $context ) {
				return $this->get_field_value( $field_name, $context );
			}
		};

		$this->assertFalse( $instance->save( 'noindex', true, [ 'target' => $target ] ) );
		$this->assertNull( $instance->get( 'noindex', [ 'target' => $target ] ) );
	}
}

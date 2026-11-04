<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Global_SEO_Settings_Updater;
use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Global_Setting_Target_Exception;
use Yoast\WP\SEO\Abilities\Domain\Global_Setting_Target_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Global_Setting_Target_Repository;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Update_Archive_And_Special_Page_SEO_Settings_Ability;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Update_Archive_And_Special_Page_SEO_Settings_Ability class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Update_Archive_And_Special_Page_SEO_Settings_Ability
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Update_Archive_And_Special_Page_SEO_Settings_Ability_Test extends TestCase {

	/**
	 * The names of the targets.
	 *
	 * @var array<string>
	 */
	private const TARGET_NAMES = [ 'homepage', 'post_type_archive', 'taxonomy_archive', 'author_archives', 'date_archives', 'search_page', 'not_found_page' ];

	/**
	 * The capability helper mock.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The global setting field map mock.
	 *
	 * @var Mockery\MockInterface|Global_Setting_Field_Map
	 */
	private $field_map;

	/**
	 * The global setting target repository mock.
	 *
	 * @var Mockery\MockInterface|Global_Setting_Target_Repository
	 */
	private $target_repository;

	/**
	 * The global SEO settings updater mock.
	 *
	 * @var Mockery\MockInterface|Global_SEO_Settings_Updater
	 */
	private $updater;

	/**
	 * The instance under test.
	 *
	 * @var Update_Archive_And_Special_Page_SEO_Settings_Ability
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

		$this->capability_helper = Mockery::mock( Capability_Helper::class );
		$this->field_map         = Mockery::mock( Global_Setting_Field_Map::class );
		$this->target_repository = Mockery::mock( Global_Setting_Target_Repository::class );
		$this->updater           = Mockery::mock( Global_SEO_Settings_Updater::class );

		$this->target_repository->allows( 'get_names' )->andReturn( self::TARGET_NAMES );

		$this->instance = new Update_Archive_And_Special_Page_SEO_Settings_Ability( $this->capability_helper, $this->field_map, $this->target_repository, $this->updater );
	}

	/**
	 * Tests that get_name returns the prefixed ability name.
	 *
	 * @covers ::get_name
	 *
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'yoast-seo/update-archive-and-special-page-seo-settings', $this->instance->get_name() );
	}

	/**
	 * Tests that execute resolves the available target the input identifies and passes it to the updater along with
	 * the input.
	 *
	 * @covers ::__construct
	 * @covers ::execute
	 * @covers ::resolve_target
	 *
	 * @return void
	 */
	public function test_execute() {
		$input  = [
			'target'    => 'taxonomy_archive',
			'taxonomy'  => 'category',
			'seo_title' => '%%term_title%%',
		];
		$result = [ 'seo_title' => '%%term_title%%' ];

		$target = Mockery::mock( Global_Setting_Target_Interface::class );
		$target->expects( 'ensure_available' )->once();

		$this->target_repository->expects( 'get' )->once()->with( 'taxonomy_archive', '', 'category' )->andReturn( $target );
		$this->updater->expects( 'update' )->once()->with( $target, $input )->andReturn( $result );

		$this->assertSame( $result, $this->instance->execute( $input ) );
	}

	/**
	 * Tests that execute turns a target that is not available into an error, without updating anything.
	 *
	 * @covers ::execute
	 * @covers ::resolve_target
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Global_SEO_Settings_Ability::to_wp_error
	 *
	 * @return void
	 */
	public function test_execute_unavailable_target() {
		$target = Mockery::mock( Global_Setting_Target_Interface::class );
		$target->expects( 'ensure_available' )->once()->andThrow( new Unavailable_Global_Setting_Target_Exception( 'yoast_seo_static_homepage', 'Static homepage.' ) );

		$this->target_repository->expects( 'get' )->once()->with( 'homepage', '', '' )->andReturn( $target );
		$this->updater->expects( 'update' )->never();

		$result = $this->instance->execute(
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
	 * Tests that execute turns an unknown target into an error.
	 *
	 * @covers ::execute
	 *
	 * @return void
	 */
	public function test_execute_unknown_target() {
		$this->target_repository->expects( 'get' )->once()->andThrow( new Unavailable_Global_Setting_Target_Exception( 'yoast_seo_invalid_target', 'Unknown.' ) );
		$this->updater->expects( 'update' )->never();

		$result = $this->instance->execute( [ 'target' => 'unknown' ] );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'yoast_seo_invalid_target', $result->get_error_code() );
	}

	/**
	 * Tests that get_args builds the input schema from the targets and the fields they have, adds the warning to the
	 * output schema and does not claim the ability is non-destructive.
	 *
	 * @covers ::get_args
	 * @covers ::get_identifier_input_schema
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Archive_And_Special_Page_SEO_Settings_Ability::get_targets_description
	 *
	 * @return void
	 */
	public function test_get_args() {
		$seo_title = [
			'type'        => 'string',
			'description' => 'The SEO title.',
		];

		$this->field_map->allows( 'get_fields_for_targets' )->with( self::TARGET_NAMES )->andReturn( [ 'seo_title' => $seo_title ] );

		$args = $this->instance->get_args();

		$this->assertSame( 'Update SEO Settings for Archives and Special Pages', $args['label'] );
		$this->assertStringContainsString( 'yoast-seo/update-content-type-seo-settings', $args['description'] );
		$this->assertSame( [ 'target' ], $args['input_schema']['required'] );
		$this->assertSame( 2, $args['input_schema']['minProperties'] );
		$this->assertFalse( $args['input_schema']['additionalProperties'] );
		$this->assertSame( self::TARGET_NAMES, $args['input_schema']['properties']['target']['enum'] );
		$this->assertSame( [ 'target', 'post_type', 'taxonomy', 'seo_title' ], \array_keys( $args['input_schema']['properties'] ) );
		$this->assertStringContainsString( 'required for the taxonomy_archive target', $args['input_schema']['properties']['taxonomy']['description'] );
		$this->assertStringContainsString( 'Under "Categories & tags": taxonomy_archive holds the default settings', $args['input_schema']['properties']['target']['description'] );
		$this->assertSame( $seo_title, $args['input_schema']['properties']['seo_title'] );
		$this->assertArrayHasKey( 'warning', $args['output_schema']['properties'] );
		$this->assertArrayHasKey( 'enabled', $args['output_schema']['properties'] );
		$this->assertSame( [ $this->instance, 'can_manage_seo' ], $args['permission_callback'] );
		$this->assertSame( [ $this->instance, 'execute' ], $args['execute_callback'] );
		$this->assertSame(
			[
				'readonly'    => false,
				'destructive' => null,
				'idempotent'  => true,
			],
			$args['meta']['annotations'],
		);
	}
}

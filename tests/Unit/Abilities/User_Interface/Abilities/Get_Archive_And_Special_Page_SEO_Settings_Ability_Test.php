<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Mockery;
use stdClass;
use Yoast\WP\SEO\Abilities\Application\Global_SEO_Settings_Collector;
use Yoast\WP\SEO\Abilities\Domain\Global_Setting_Target_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Global_Setting_Target_Repository;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Get_Archive_And_Special_Page_SEO_Settings_Ability;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Get_Archive_And_Special_Page_SEO_Settings_Ability class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Get_Archive_And_Special_Page_SEO_Settings_Ability
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Get_Archive_And_Special_Page_SEO_Settings_Ability_Test extends TestCase {

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
	 * The global SEO settings collector mock.
	 *
	 * @var Mockery\MockInterface|Global_SEO_Settings_Collector
	 */
	private $collector;

	/**
	 * The instance under test.
	 *
	 * @var Get_Archive_And_Special_Page_SEO_Settings_Ability
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
		$this->collector         = Mockery::mock( Global_SEO_Settings_Collector::class );

		$this->target_repository->allows( 'get_names' )->andReturn( self::TARGET_NAMES );

		$this->instance = new Get_Archive_And_Special_Page_SEO_Settings_Ability( $this->capability_helper, $this->field_map, $this->target_repository, $this->collector );
	}

	/**
	 * Tests that get_name returns the prefixed ability name.
	 *
	 * @covers ::get_name
	 *
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'yoast-seo/get-archive-and-special-page-seo-settings', $this->instance->get_name() );
	}

	/**
	 * Tests that the ability is always available.
	 *
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Global_SEO_Settings_Ability::is_available
	 *
	 * @return void
	 */
	public function test_is_available() {
		$this->assertTrue( $this->instance->is_available() );
	}

	/**
	 * Tests that can_manage_seo checks the management capability and returns its result.
	 *
	 * @covers ::__construct
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Archive_And_Special_Page_SEO_Settings_Ability::__construct
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Global_SEO_Settings_Ability::__construct
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Global_SEO_Settings_Ability::can_manage_seo
	 *
	 * @return void
	 */
	public function test_can_manage_seo() {
		$this->capability_helper->expects( 'current_user_can' )->once()->with( 'wpseo_manage_options' )->andReturnFalse();

		$this->assertFalse( $this->instance->can_manage_seo() );
	}

	/**
	 * Tests that execute returns the global settings of all targets.
	 *
	 * @covers ::execute
	 *
	 * @return void
	 */
	public function test_execute() {
		$first  = Mockery::mock( Global_Setting_Target_Interface::class );
		$second = Mockery::mock( Global_Setting_Target_Interface::class );

		$this->target_repository->expects( 'get_all' )->once()->andReturn( [ $first, $second ] );
		$this->collector->expects( 'get_target_settings' )->once()->with( $first )->andReturn( [ 'target' => 'homepage' ] );
		$this->collector->expects( 'get_target_settings' )->once()->with( $second )->andReturn( [ 'target' => 'taxonomy_archive' ] );

		$this->assertSame(
			[
				[ 'target' => 'homepage' ],
				[ 'target' => 'taxonomy_archive' ],
			],
			$this->instance->execute(),
		);
	}

	/**
	 * Tests that get_args describes a list of targets with only the fields of the archive and special page targets,
	 * reduced to their output schema, and registers the ability as read-only with an empty, optional input.
	 *
	 * @covers ::get_args
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Archive_And_Special_Page_SEO_Settings_Ability::get_target_output_schema
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Global_SEO_Settings_Ability::build_target_output_schema
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Global_SEO_Settings_Ability::to_output_schema
	 *
	 * @return void
	 */
	public function test_get_args() {
		$this->field_map->expects( 'get_fields_for_targets' )->once()->with( self::TARGET_NAMES )->andReturn(
			[
				'seo_title' => [
					'type'        => 'string',
					'description' => 'The SEO title.',
					'maxLength'   => 100,
				],
			],
		);

		$args = $this->instance->get_args();

		$this->assertEquals(
			[
				'type'                 => 'object',
				'additionalProperties' => false,
				'default'              => new stdClass(),
			],
			$args['input_schema'],
		);
		$this->assertStringContainsString( 'yoast-seo/get-term-seo-data', $args['description'] );

		$this->assertSame( 'array', $args['output_schema']['type'] );

		$properties = $args['output_schema']['items']['properties'];

		$this->assertSame(
			[ 'target', 'post_type', 'taxonomy', 'label', 'seo_title', 'enabled', 'shared' ],
			\array_keys( $properties ),
		);
		$this->assertSame( self::TARGET_NAMES, $properties['target']['enum'] );
		$this->assertSame(
			[
				'type'        => 'string',
				'description' => 'The SEO title.',
			],
			$properties['seo_title'],
		);
		$this->assertSame( [ $this->instance, 'can_manage_seo' ], $args['permission_callback'] );
		$this->assertSame( [ $this->instance, 'execute' ], $args['execute_callback'] );
		$this->assertSame(
			[
				'show_in_rest' => true,
				'annotations'  => [
					'readonly'    => true,
					'destructive' => false,
					'idempotent'  => true,
				],
				'mcp'          => [
					'public' => true,
				],
			],
			$args['meta'],
		);
	}
}

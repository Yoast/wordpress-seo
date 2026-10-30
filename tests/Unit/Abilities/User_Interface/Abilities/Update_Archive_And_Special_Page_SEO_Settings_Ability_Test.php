<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Mockery;
use Yoast\WP\SEO\Abilities\Application\Archive_And_Special_Page_SEO_Settings_Updater;
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
	 * The archive and special page SEO settings updater mock.
	 *
	 * @var Mockery\MockInterface|Archive_And_Special_Page_SEO_Settings_Updater
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
		$this->updater           = Mockery::mock( Archive_And_Special_Page_SEO_Settings_Updater::class );

		$this->target_repository->allows( 'get_names' )->andReturn( [ 'homepage', 'author_archives', 'date_archives', 'search_page', 'not_found_page', 'post_type_archive' ] );

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
	 * Tests that execute delegates to the updater and returns its result.
	 *
	 * @covers ::__construct
	 * @covers ::execute
	 *
	 * @return void
	 */
	public function test_execute() {
		$input  = [
			'target'    => 'homepage',
			'seo_title' => 'Home',
		];
		$result = [ 'seo_title' => 'Home' ];

		$this->updater->expects( 'update' )->once()->with( $input )->andReturn( $result );

		$this->assertSame( $result, $this->instance->execute( $input ) );
	}

	/**
	 * Tests that get_args builds the input schema from the targets and the field map, adds the warning to the
	 * output schema and does not claim the ability is non-destructive.
	 *
	 * @covers ::get_args
	 *
	 * @return void
	 */
	public function test_get_args() {
		$seo_title = [
			'type'        => 'string',
			'description' => 'The SEO title.',
		];

		$this->field_map->allows( 'get_fields' )->andReturn( [ 'seo_title' => $seo_title ] );

		$args = $this->instance->get_args();

		$this->assertSame( 'Update SEO Settings for Archives and Special Pages', $args['label'] );
		$this->assertSame( [ 'target' ], $args['input_schema']['required'] );
		$this->assertSame( 2, $args['input_schema']['minProperties'] );
		$this->assertFalse( $args['input_schema']['additionalProperties'] );
		$this->assertSame(
			[ 'homepage', 'author_archives', 'date_archives', 'search_page', 'not_found_page', 'post_type_archive' ],
			$args['input_schema']['properties']['target']['enum'],
		);
		$this->assertSame( [ 'target', 'post_type', 'seo_title' ], \array_keys( $args['input_schema']['properties'] ) );
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

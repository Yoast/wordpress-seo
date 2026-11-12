<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Global_SEO_Settings_Updater;
use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Global_Setting_Target_Exception;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Content_Type_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Content_Type_Target_Factory;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Update_Content_Type_SEO_Settings_Ability;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Update_Content_Type_SEO_Settings_Ability class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Update_Content_Type_SEO_Settings_Ability
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Update_Content_Type_SEO_Settings_Ability_Test extends TestCase {

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
	 * The factory of the content type targets mock.
	 *
	 * @var Mockery\MockInterface|Content_Type_Target_Factory
	 */
	private $target_factory;

	/**
	 * The global SEO settings updater mock.
	 *
	 * @var Mockery\MockInterface|Global_SEO_Settings_Updater
	 */
	private $updater;

	/**
	 * The instance under test.
	 *
	 * @var Update_Content_Type_SEO_Settings_Ability
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
		$this->target_factory    = Mockery::mock( Content_Type_Target_Factory::class );
		$this->updater           = Mockery::mock( Global_SEO_Settings_Updater::class );

		$this->instance = new Update_Content_Type_SEO_Settings_Ability( $this->capability_helper, $this->field_map, $this->target_factory, $this->updater );
	}

	/**
	 * Tests that get_name returns the prefixed ability name.
	 *
	 * @covers ::get_name
	 *
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'yoast-seo/update-content-type-seo-settings', $this->instance->get_name() );
	}

	/**
	 * Tests that execute resolves the available content type and passes it to the updater along with the input.
	 *
	 * @covers ::__construct
	 * @covers ::execute
	 * @covers ::resolve_target
	 *
	 * @return void
	 */
	public function test_execute() {
		$input  = [
			'post_type' => 'product',
			'noindex'   => true,
		];
		$result = [ 'noindex' => true ];

		$target = Mockery::mock( Content_Type_Target::class );
		$target->expects( 'ensure_available' )->once();

		$this->target_factory->expects( 'create' )->once()->with( 'product' )->andReturn( $target );
		$this->updater->expects( 'update' )->once()->with( $target, $input )->andReturn( $result );

		$this->assertSame( $result, $this->instance->execute( $input ) );
	}

	/**
	 * Tests that execute turns a content type without default SEO settings into an error, without updating anything.
	 *
	 * @covers ::execute
	 *
	 * @return void
	 */
	public function test_execute_unavailable_content_type() {
		$target = Mockery::mock( Content_Type_Target::class );
		$target->expects( 'ensure_available' )->once()->andThrow( new Unavailable_Global_Setting_Target_Exception( 'yoast_seo_missing_post_type', 'Missing.' ) );

		$this->target_factory->expects( 'create' )->once()->with( '' )->andReturn( $target );
		$this->updater->expects( 'update' )->never();

		$result = $this->instance->execute( [ 'noindex' => true ] );

		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertSame( 'yoast_seo_missing_post_type', $result->get_error_code() );
	}

	/**
	 * Tests that get_args requires the post type next to at least one field of the content type target, adds the
	 * warning to the output schema and does not claim the ability is non-destructive.
	 *
	 * @covers ::get_args
	 *
	 * @return void
	 */
	public function test_get_args() {
		$noindex = [
			'type'        => 'boolean',
			'description' => 'Whether to hide.',
		];

		$this->field_map->allows( 'get_fields_for_targets' )->with( [ 'content_type' ] )->andReturn( [ 'noindex' => $noindex ] );

		$args = $this->instance->get_args();

		$this->assertSame( 'Update SEO Settings for Content Types', $args['label'] );
		$this->assertStringContainsString( 'yoast-seo/update-archive-and-special-page-seo-settings', $args['description'] );
		$this->assertSame( [ 'post_type' ], $args['input_schema']['required'] );
		$this->assertSame( 2, $args['input_schema']['minProperties'] );
		$this->assertFalse( $args['input_schema']['additionalProperties'] );
		$this->assertSame( [ 'post_type', 'noindex' ], \array_keys( $args['input_schema']['properties'] ) );
		$this->assertSame( $noindex, $args['input_schema']['properties']['noindex'] );
		$this->assertArrayHasKey( 'warning', $args['output_schema']['properties'] );
		$this->assertArrayNotHasKey( 'target', $args['output_schema']['properties'] );
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

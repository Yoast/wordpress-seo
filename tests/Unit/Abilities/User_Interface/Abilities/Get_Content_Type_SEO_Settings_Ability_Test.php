<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Mockery;
use stdClass;
use Yoast\WP\SEO\Abilities\Application\Global_SEO_Settings_Collector;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Content_Type_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Content_Type_Target_Factory;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Get_Content_Type_SEO_Settings_Ability;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Get_Content_Type_SEO_Settings_Ability class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Get_Content_Type_SEO_Settings_Ability
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Get_Content_Type_SEO_Settings_Ability_Test extends TestCase {

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
	 * The global SEO settings collector mock.
	 *
	 * @var Mockery\MockInterface|Global_SEO_Settings_Collector
	 */
	private $collector;

	/**
	 * The instance under test.
	 *
	 * @var Get_Content_Type_SEO_Settings_Ability
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
		$this->collector         = Mockery::mock( Global_SEO_Settings_Collector::class );

		$this->instance = new Get_Content_Type_SEO_Settings_Ability( $this->capability_helper, $this->field_map, $this->target_factory, $this->collector );
	}

	/**
	 * Tests that get_name returns the prefixed ability name.
	 *
	 * @covers ::get_name
	 *
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'yoast-seo/get-content-type-seo-settings', $this->instance->get_name() );
	}

	/**
	 * Tests that can_manage_seo checks the management capability and returns its result.
	 *
	 * @covers ::__construct
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Content_Type_SEO_Settings_Ability::__construct
	 *
	 * @return void
	 */
	public function test_can_manage_seo() {
		$this->capability_helper->expects( 'current_user_can' )->once()->with( 'wpseo_manage_options' )->andReturnTrue();

		$this->assertTrue( $this->instance->can_manage_seo() );
	}

	/**
	 * Tests that execute returns the default SEO settings of all content types.
	 *
	 * @covers ::execute
	 *
	 * @return void
	 */
	public function test_execute() {
		$post = Mockery::mock( Content_Type_Target::class );
		$page = Mockery::mock( Content_Type_Target::class );

		$this->target_factory->expects( 'create_all' )->once()->andReturn( [ $post, $page ] );
		$this->collector->expects( 'get_target_settings' )->once()->with( $post )->andReturn( [ 'post_type' => 'post' ] );
		$this->collector->expects( 'get_target_settings' )->once()->with( $page )->andReturn( [ 'post_type' => 'page' ] );

		$this->assertSame(
			[
				[ 'post_type' => 'post' ],
				[ 'post_type' => 'page' ],
			],
			$this->instance->execute(),
		);
	}

	/**
	 * Tests that get_args describes a list of content types with only the fields of the content type target, and
	 * registers the ability as read-only with an empty, optional input.
	 *
	 * @covers ::get_args
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Content_Type_SEO_Settings_Ability::get_target_output_schema
	 *
	 * @return void
	 */
	public function test_get_args() {
		$this->field_map->expects( 'get_fields_for_targets' )->once()->with( [ 'content_type' ] )->andReturn(
			[
				'schema_page_type' => [
					'type'        => 'string',
					'description' => 'The page type.',
					'enum'        => [ 'WebPage' ],
				],
			],
		);

		$args = $this->instance->get_args();

		$this->assertSame( 'Get SEO Settings for Content Types', $args['label'] );
		$this->assertStringContainsString( 'yoast-seo/get-archive-and-special-page-seo-settings', $args['description'] );
		$this->assertEquals(
			[
				'type'                 => 'object',
				'additionalProperties' => false,
				'default'              => new stdClass(),
			],
			$args['input_schema'],
		);
		$this->assertSame( 'array', $args['output_schema']['type'] );
		$this->assertSame(
			[ 'post_type', 'label', 'schema_page_type', 'enabled', 'shared' ],
			\array_keys( $args['output_schema']['items']['properties'] ),
		);
		$this->assertSame(
			[
				'type'        => 'string',
				'description' => 'The page type.',
			],
			$args['output_schema']['items']['properties']['schema_page_type'],
		);
		$this->assertSame( [ $this->instance, 'can_manage_seo' ], $args['permission_callback'] );
		$this->assertSame( [ $this->instance, 'execute' ], $args['execute_callback'] );
		$this->assertSame(
			[
				'readonly'    => true,
				'destructive' => false,
				'idempotent'  => true,
			],
			$args['meta']['annotations'],
		);
	}
}

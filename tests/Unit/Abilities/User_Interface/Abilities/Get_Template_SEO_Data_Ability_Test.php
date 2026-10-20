<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Mockery;
use Yoast\WP\SEO\Abilities\Application\Template_SEO_Data_Collector;
use Yoast\WP\SEO\Abilities\Infrastructure\Template_Fields\Template_Field_Repository;
use Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Template_Target_Repository;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Get_Template_SEO_Data_Ability;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Get_Template_SEO_Data_Ability class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Get_Template_SEO_Data_Ability
 */
final class Get_Template_SEO_Data_Ability_Test extends TestCase {

	/**
	 * The capability helper mock.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	private $capability_helper;

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
	 * The template SEO data collector mock.
	 *
	 * @var Mockery\MockInterface|Template_SEO_Data_Collector
	 */
	private $collector;

	/**
	 * The instance under test.
	 *
	 * @var Get_Template_SEO_Data_Ability
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
		$this->field_repository  = Mockery::mock( Template_Field_Repository::class );
		$this->target_repository = Mockery::mock( Template_Target_Repository::class );
		$this->collector         = Mockery::mock( Template_SEO_Data_Collector::class );

		$this->target_repository->allows( 'get_names' )->andReturn( [ 'homepage', 'author_archives', 'date_archives', 'search_page', 'not_found_page', 'post_type_archive' ] );

		$this->instance = new Get_Template_SEO_Data_Ability( $this->capability_helper, $this->field_repository, $this->target_repository, $this->collector );
	}

	/**
	 * Tests that get_name returns the prefixed ability name.
	 *
	 * @covers ::get_name
	 *
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'yoast-seo/get-template-seo-data', $this->instance->get_name() );
	}

	/**
	 * Tests that the ability is always available.
	 *
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Template_SEO_Data_Ability::is_available
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
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Template_SEO_Data_Ability::__construct
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Template_SEO_Data_Ability::can_manage_seo
	 *
	 * @return void
	 */
	public function test_can_manage_seo() {
		$this->capability_helper->expects( 'current_user_can' )->once()->with( 'wpseo_manage_options' )->andReturnFalse();

		$this->assertFalse( $this->instance->can_manage_seo() );
	}

	/**
	 * Tests that execute returns the template SEO data of all targets.
	 *
	 * @covers ::execute
	 *
	 * @return void
	 */
	public function test_execute() {
		$data = [ 'homepage' => [ 'seo_title' => 'Home' ] ];

		$this->collector->expects( 'get_all' )->once()->andReturn( $data );

		$this->assertSame( $data, $this->instance->execute() );
	}

	/**
	 * Tests that get_args describes a list of targets with a single item schema, with the fields reduced to their
	 * output schema, and registers the ability as read-only without an input.
	 *
	 * @covers ::get_args
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Template_SEO_Data_Ability::get_target_output_schema
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Template_SEO_Data_Ability::to_output_schema
	 *
	 * @return void
	 */
	public function test_get_args() {
		$this->field_repository->expects( 'get_all' )->once()->andReturn( [] );
		$this->field_repository->expects( 'get_schemas' )->once()->andReturn(
			[
				'seo_title' => [
					'type'        => 'string',
					'description' => 'The SEO title.',
					'maxLength'   => 100,
				],
			],
		);

		$args = $this->instance->get_args();

		$this->assertArrayNotHasKey( 'input_schema', $args );
		$this->assertSame( 'array', $args['output_schema']['type'] );

		$properties = $args['output_schema']['items']['properties'];

		$this->assertSame(
			[ 'target', 'post_type', 'label', 'seo_title', 'enabled', 'shared', 'url' ],
			\array_keys( $properties ),
		);
		$this->assertSame(
			[ 'homepage', 'author_archives', 'date_archives', 'search_page', 'not_found_page', 'post_type_archive' ],
			$properties['target']['enum'],
		);
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

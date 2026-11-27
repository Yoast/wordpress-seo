<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Abilities\Application\Author_SEO_Data_Collector;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Get_Author_SEO_Data_Ability;
use Yoast\WP\SEO\Abilities\User_Interface\SEO_Data_Output_Schema;
use Yoast\WP\SEO\Conditionals\Should_Index_Indexables_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Get_Author_SEO_Data_Ability class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Get_Author_SEO_Data_Ability
 */
final class Get_Author_SEO_Data_Ability_Test extends TestCase {

	use Author_SEO_Data_Schema_Trait;

	/**
	 * The capability helper mock.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The should index indexables conditional mock.
	 *
	 * @var Mockery\MockInterface|Should_Index_Indexables_Conditional
	 */
	private $should_index_indexables_conditional;

	/**
	 * The author SEO data collector mock.
	 *
	 * @var Mockery\MockInterface|Author_SEO_Data_Collector
	 */
	private $author_seo_data_collector;

	/**
	 * The SEO data output schema mock.
	 *
	 * @var Mockery\MockInterface|SEO_Data_Output_Schema
	 */
	private $output_schema;

	/**
	 * The instance under test.
	 *
	 * @var Get_Author_SEO_Data_Ability
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

		$this->capability_helper                   = Mockery::mock( Capability_Helper::class );
		$this->should_index_indexables_conditional = Mockery::mock( Should_Index_Indexables_Conditional::class );
		$this->author_seo_data_collector           = Mockery::mock( Author_SEO_Data_Collector::class );
		$this->output_schema                       = Mockery::mock( SEO_Data_Output_Schema::class );

		$this->instance = new Get_Author_SEO_Data_Ability(
			$this->capability_helper,
			$this->should_index_indexables_conditional,
			$this->output_schema,
			$this->author_seo_data_collector,
		);
	}

	/**
	 * Tests that get_name returns the prefixed ability name.
	 *
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Author_SEO_Data_Ability::get_name
	 * @covers ::get_slug
	 *
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'yoast-seo/get-author-seo-data', $this->instance->get_name() );
	}

	/**
	 * Tests that is_available follows whether the indexables are being built.
	 *
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_SEO_Data_Ability::is_available
	 *
	 * @dataProvider provide_boolean_outcomes
	 *
	 * @param bool $is_met Whether the indexables are being built.
	 *
	 * @return void
	 */
	public function test_is_available( bool $is_met ) {
		$this->should_index_indexables_conditional->expects( 'is_met' )->once()->andReturn( $is_met );

		$this->assertSame( $is_met, $this->instance->is_available() );
	}

	/**
	 * Tests that can_edit_advanced_metadata checks the advanced metadata capability and returns its result.
	 *
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_SEO_Data_Ability::__construct
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_SEO_Data_Ability::can_edit_advanced_metadata
	 *
	 * @dataProvider provide_boolean_outcomes
	 *
	 * @param bool $allowed Whether the capability is granted.
	 *
	 * @return void
	 */
	public function test_can_edit_advanced_metadata( bool $allowed ) {
		$this->capability_helper
			->expects( 'current_user_can' )
			->once()
			->with( 'wpseo_edit_advanced_metadata' )
			->andReturn( $allowed );

		$this->assertSame( $allowed, $this->instance->can_edit_advanced_metadata() );
	}

	/**
	 * Tests that can_edit_users_advanced_metadata requires both the advanced metadata and the edit users capability.
	 *
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Author_SEO_Data_Ability::can_edit_users_advanced_metadata
	 *
	 * @dataProvider provide_edit_users_advanced_metadata_capabilities
	 *
	 * @param bool $can_edit_advanced_metadata Whether the advanced metadata capability is granted.
	 * @param bool $can_edit_users             Whether the edit users capability is granted.
	 * @param bool $expected                   The expected result.
	 *
	 * @return void
	 */
	public function test_can_edit_users_advanced_metadata( bool $can_edit_advanced_metadata, bool $can_edit_users, bool $expected ) {
		$this->capability_helper
			->expects( 'current_user_can' )
			->once()
			->with( 'wpseo_edit_advanced_metadata' )
			->andReturn( $can_edit_advanced_metadata );

		Monkey\Functions\expect( 'current_user_can' )
			->times( ( $can_edit_advanced_metadata ) ? 1 : 0 )
			->with( 'edit_users' )
			->andReturn( $can_edit_users );

		$this->assertSame( $expected, $this->instance->can_edit_users_advanced_metadata() );
	}

	/**
	 * Provides the capability combinations for the permission callback.
	 *
	 * @return array<string, array<bool>> The capability combinations and the expected result.
	 */
	public static function provide_edit_users_advanced_metadata_capabilities(): array {
		return [
			'both capabilities'               => [ true, true, true ],
			'no edit users capability'        => [ true, false, false ],
			'no advanced metadata capability' => [ false, true, false ],
			'no capabilities'                 => [ false, false, false ],
		];
	}

	/**
	 * Tests that get_args returns the expected registration arguments.
	 *
	 * @covers ::__construct
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Author_SEO_Data_Ability::__construct
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Author_SEO_Data_Ability::get_args
	 * @covers ::get_label
	 * @covers ::get_description
	 * @covers ::get_input_properties
	 * @covers ::get_execute_callback
	 * @covers ::get_annotations
	 *
	 * @return void
	 */
	public function test_get_args() {
		$output_schema = [ 'type' => 'object' ];

		$this->output_schema->expects( 'get_author_output_schema' )->once()->andReturn( $output_schema );

		$this->assertSame(
			[
				'label'               => 'Get Author SEO Data',
				'description'         => 'Get the SEO data for the author archive of a single user. Identify the user by user_id or by the permalink (URL) of their author archive. Only users who can edit other users can use this, and only on users they are allowed to edit.',
				'category'            => 'yoast-seo',
				'input_schema'        => [
					'type'                 => 'object',
					'additionalProperties' => false,
					'properties'           => [
						'user_id'   => [
							'type'        => 'integer',
							'description' => 'The ID of the user whose author archive to retrieve.',
							'minimum'     => 1,
						],
						'permalink' => [
							'type'        => 'string',
							'description' => 'The permalink (URL) of the author archive to retrieve.',
						],
					],
				],
				'output_schema'       => $output_schema,
				'permission_callback' => [ $this->instance, 'can_edit_users_advanced_metadata' ],
				'execute_callback'    => [ $this->author_seo_data_collector, 'get_author_seo_data' ],
				'meta'                => [
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
			],
			$this->instance->get_args(),
		);
	}
}

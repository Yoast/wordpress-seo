<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Mockery;
use Yoast\WP\SEO\Abilities\Application\Term_SEO_Data_Collector;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Get_Term_SEO_Data_Ability;
use Yoast\WP\SEO\Abilities\User_Interface\SEO_Data_Output_Schema;
use Yoast\WP\SEO\Conditionals\Should_Index_Indexables_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Get_Term_SEO_Data_Ability class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Get_Term_SEO_Data_Ability
 */
final class Get_Term_SEO_Data_Ability_Test extends TestCase {

	use Term_SEO_Data_Schema_Trait;

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
	 * The term SEO data collector mock.
	 *
	 * @var Mockery\MockInterface|Term_SEO_Data_Collector
	 */
	private $term_seo_data_collector;

	/**
	 * The SEO data output schema mock.
	 *
	 * @var Mockery\MockInterface|SEO_Data_Output_Schema
	 */
	private $output_schema;

	/**
	 * The instance under test.
	 *
	 * @var Get_Term_SEO_Data_Ability
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
		$this->term_seo_data_collector             = Mockery::mock( Term_SEO_Data_Collector::class );
		$this->output_schema                       = Mockery::mock( SEO_Data_Output_Schema::class );

		$this->instance = new Get_Term_SEO_Data_Ability(
			$this->capability_helper,
			$this->should_index_indexables_conditional,
			$this->term_seo_data_collector,
			$this->output_schema,
		);
	}

	/**
	 * Tests that get_name returns the prefixed ability name.
	 *
	 * @covers ::get_name
	 *
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'yoast-seo/get-term-seo-data', $this->instance->get_name() );
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
	 * Tests that get_args returns the expected registration arguments.
	 *
	 * @covers ::__construct
	 * @covers ::get_args
	 * @covers ::get_term_identifier_input_schema
	 *
	 * @return void
	 */
	public function test_get_args() {
		$output_schema = [ 'type' => 'object' ];

		$this->output_schema->expects( 'get_term_output_schema' )->once()->andReturn( $output_schema );

		$this->assertSame(
			[
				'label'               => 'Get Term SEO Data',
				'description'         => 'Get the SEO data for a single taxonomy term, such as a category or a tag. Identify the term by term_id or by permalink (URL). Only terms the current user is allowed to edit are returned.',
				'category'            => 'yoast-seo',
				'input_schema'        => [
					'type'                 => 'object',
					'additionalProperties' => false,
					'properties'           => [
						'term_id'   => [
							'type'        => 'integer',
							'description' => 'The ID of the term to retrieve.',
							'minimum'     => 1,
						],
						'permalink' => [
							'type'        => 'string',
							'description' => 'The permalink (URL) of the term archive to retrieve.',
						],
					],
				],
				'output_schema'       => $output_schema,
				'permission_callback' => [ $this->instance, 'can_edit_advanced_metadata' ],
				'execute_callback'    => [ $this->term_seo_data_collector, 'get_term_seo_data' ],
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

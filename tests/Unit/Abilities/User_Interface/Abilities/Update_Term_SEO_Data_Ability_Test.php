<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Term_SEO_Data_Updater;
use Yoast\WP\SEO\Abilities\Infrastructure\Term_SEO_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Term_SEO_Meta_Writer;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Update_Term_SEO_Data_Ability;
use Yoast\WP\SEO\Conditionals\Should_Index_Indexables_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Update_Term_SEO_Data_Ability class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Update_Term_SEO_Data_Ability
 */
final class Update_Term_SEO_Data_Ability_Test extends TestCase {

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
	 * The term SEO data updater mock.
	 *
	 * @var Mockery\MockInterface|Term_SEO_Data_Updater
	 */
	private $term_seo_data_updater;

	/**
	 * The product helper mock.
	 *
	 * @var Mockery\MockInterface|Product_Helper
	 */
	private $product_helper;

	/**
	 * The instance under test.
	 *
	 * @var Update_Term_SEO_Data_Ability
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
		$this->term_seo_data_updater               = Mockery::mock( Term_SEO_Data_Updater::class );
		$this->product_helper                      = Mockery::mock( Product_Helper::class );

		$this->instance = new Update_Term_SEO_Data_Ability(
			$this->capability_helper,
			$this->should_index_indexables_conditional,
			$this->term_seo_data_updater,
			$this->product_helper,
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
		$this->assertSame( 'yoast-seo/update-term-seo-data', $this->instance->get_name() );
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
	 * Tests that get_args returns the expected registration arguments, with the AI Generate
	 * hint in the output schema on the free plugin only.
	 *
	 * @covers ::__construct
	 * @covers ::get_args
	 * @covers ::get_update_term_seo_data_input_schema
	 * @covers ::ai_generate_field_schema
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\AI_Generate_Upsell_Trait::add_ai_generate_hint_to_output_schema
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Term_SEO_Data_Ability::get_term_seo_data_output_schema
	 *
	 * @dataProvider provide_boolean_outcomes
	 *
	 * @param bool $is_premium Whether Premium is active.
	 *
	 * @return void
	 */
	public function test_get_args( bool $is_premium ) {
		$this->product_helper->expects( 'is_premium' )->once()->andReturn( $is_premium );

		$this->assertSame(
			[
				'label'               => 'Update Term SEO Data',
				'description'         => 'Update the SEO data for a single taxonomy term, such as a category or a tag. Identify the term by term_id or by permalink (URL). Only the fields you provide are changed; a provided empty value clears that field. Only terms the current user is allowed to edit can be updated.',
				'category'            => 'yoast-seo',
				'input_schema'        => $this->get_expected_update_input_schema(),
				'output_schema'       => $this->get_expected_update_output_schema( $is_premium ),
				'permission_callback' => [ $this->instance, 'can_edit_advanced_metadata' ],
				'execute_callback'    => [ $this->instance, 'execute' ],
				'meta'                => [
					'show_in_rest' => true,
					'annotations'  => [
						'readonly'    => false,
						'destructive' => null,
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

	/**
	 * Tests that execute adds the AI Generate hint to the response only on the free plugin
	 * and only when a field AI Generate can write was set.
	 *
	 * @covers ::execute
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\AI_Generate_Upsell_Trait::add_ai_generate_hint
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\AI_Generate_Upsell_Trait::should_upsell_ai_generate
	 *
	 * @dataProvider provide_execute_cases
	 *
	 * @param bool                 $is_premium  Whether Premium is active.
	 * @param array<string, mixed> $input       The ability input.
	 * @param bool                 $expect_hint Whether the hint is expected in the response.
	 *
	 * @return void
	 */
	public function test_execute( bool $is_premium, array $input, bool $expect_hint ) {
		$updated = [
			'term_id'   => 7,
			'seo_title' => 'A title',
		];

		$this->term_seo_data_updater
			->expects( 'update_term_seo_data' )
			->once()
			->with( $input )
			->andReturn( $updated );
		$this->product_helper->expects( 'is_premium' )->once()->andReturn( $is_premium );

		if ( $expect_hint ) {
			$updated['ai_generate_hint'] = 'Yoast AI Generate can write SEO-optimised titles and descriptions, more details here: https://yoa.st/ai-generate-ability-response';
		}

		$this->assertSame( $updated, $this->instance->execute( $input ) );
	}

	/**
	 * Data provider for test_execute.
	 *
	 * @return array<string, array<string, mixed>> The cases.
	 */
	public static function provide_execute_cases(): array {
		return [
			'free, AI Generate field set'     => [
				'is_premium'  => false,
				'input'       => [
					'term_id'   => 7,
					'seo_title' => 'A title',
				],
				'expect_hint' => true,
			],
			'free, AI Generate field cleared' => [
				'is_premium'  => false,
				'input'       => [
					'term_id'          => 7,
					'open_graph_title' => null,
				],
				'expect_hint' => true,
			],
			'free, only other fields set'     => [
				'is_premium'  => false,
				'input'       => [
					'term_id'        => 7,
					'is_cornerstone' => true,
					'noindex'        => false,
				],
				'expect_hint' => false,
			],
			'premium, AI Generate field set'  => [
				'is_premium'  => true,
				'input'       => [
					'term_id'          => 7,
					'meta_description' => 'A description',
				],
				'expect_hint' => false,
			],
		];
	}

	/**
	 * Tests that execute passes an error from the updater through untouched.
	 *
	 * @covers ::execute
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\AI_Generate_Upsell_Trait::add_ai_generate_hint
	 *
	 * @return void
	 */
	public function test_execute_passes_errors_through() {
		$input = [
			'term_id'   => 7,
			'seo_title' => 'A title',
		];
		$error = Mockery::mock( WP_Error::class );

		$this->term_seo_data_updater
			->expects( 'update_term_seo_data' )
			->once()
			->with( $input )
			->andReturn( $error );
		$this->product_helper->expects( 'is_premium' )->never();

		$this->assertSame( $error, $this->instance->execute( $input ) );
	}

	/**
	 * Tests that every writable field in the update input schema is applied by the
	 * field map and cascades to a term meta key.
	 *
	 * The field contract is spread over hand-maintained structures (the input schema,
	 * Term_SEO_Field_Map, Term_SEO_Meta_Writer) which fail silently when they drift: a
	 * schema field missing from the field map is accepted but never applied, and an
	 * indexable column missing from the writer is skipped and then reverted by the
	 * indexable rebuild. This test turns both drift paths into a failure.
	 *
	 * @covers ::get_args
	 * @covers ::get_update_term_seo_data_input_schema
	 *
	 * @return void
	 */
	public function test_every_writable_input_field_cascades_to_term_meta() {
		// Premium or free makes no difference to the input schema.
		$this->product_helper->expects( 'is_premium' )->once()->andReturnTrue();

		$input_schema = $this->instance->get_args()['input_schema'];

		$writable_fields = \array_diff_key(
			$input_schema['properties'],
			[
				'term_id'   => true,
				'permalink' => true,
			],
		);

		$field_map                  = new Term_SEO_Field_Map( Mockery::mock( Meta_Surface::class ) );
		$indexable                  = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id       = 7;
		$indexable->object_sub_type = 'category';

		$written = [];
		$writer  = Mockery::mock( Term_SEO_Meta_Writer::class )
			->makePartial()
			->shouldAllowMockingProtectedMethods();
		$writer->shouldReceive( 'get_stored_meta' )->andReturn( [] );
		$writer->shouldReceive( 'save_meta' )->andReturnUsing(
			static function ( $term_id, $taxonomy, $meta ) use ( &$written ) {
				$written = $meta;
			},
		);

		foreach ( $writable_fields as $field => $field_schema ) {
			$value   = ( \in_array( 'boolean', (array) $field_schema['type'], true ) ) ? true : 'a value';
			$changed = $field_map->apply_to_indexable( [ $field => $value ], $indexable );

			$this->assertNotEmpty(
				$changed,
				"Input field `{$field}` is accepted by the update input schema but not applied by Term_SEO_Field_Map, so writes to it are silently dropped.",
			);

			foreach ( $changed as $column ) {
				$written = [];
				$writer->write_columns( $indexable, [ $column ] );

				$this->assertNotEmpty(
					$written,
					"Indexable column `{$column}` has no Term_SEO_Meta_Writer mapping, so writes to it are silently discarded and reverted by the indexable rebuild.",
				);
			}
		}
	}

	/**
	 * Returns the expected update input schema.
	 *
	 * @return array<string, mixed> The schema.
	 */
	private function get_expected_update_input_schema(): array {
		$templated = static function ( $field ) {
			return [
				'type'        => [ 'string', 'null' ],
				'description' => "The {$field} for the term.",
			];
		};

		return [
			'type'                 => 'object',
			'additionalProperties' => false,
			'properties'           => [
				'term_id'                => [
					'type'        => 'integer',
					'description' => 'The ID of the term to update.',
					'minimum'     => 1,
				],
				'permalink'              => [
					'type'        => 'string',
					'description' => 'The permalink (URL) of the term archive to update.',
				],
				'seo_title'              => $templated( 'SEO title' ),
				'meta_description'       => $templated( 'meta description' ),
				'canonical'              => [
					'type'        => [ 'string', 'null' ],
					'description' => 'The custom canonical URL for the term archive. Use null or an empty string to remove it and fall back to the default canonical.',
				],
				'is_cornerstone'         => [
					'type'        => 'boolean',
					'description' => 'Whether the term is marked as cornerstone content.',
				],
				'noindex'                => [
					'type'        => [ 'boolean', 'null' ],
					'description' => 'Whether search engines should be told not to index this term archive. true sets noindex (the archive is excluded from search results); false forces the archive to be indexed; null clears the setting and falls back to the taxonomy default.',
				],
				'open_graph_title'       => $templated( 'Open Graph title' ),
				'open_graph_description' => $templated( 'Open Graph description' ),
				'twitter_title'          => $templated( 'X title' ),
				'twitter_description'    => $templated( 'X description' ),
			],
		];
	}

	/**
	 * Returns the expected update output schema: the shared term SEO data schema plus, on
	 * the free plugin, the optional AI Generate hint.
	 *
	 * @param bool $is_premium Whether Premium is active, which drops the AI Generate hint from the schema.
	 *
	 * @return array<string, mixed> The schema.
	 */
	private function get_expected_update_output_schema( bool $is_premium ): array {
		$schema = $this->get_expected_output_schema();

		if ( $is_premium ) {
			return $schema;
		}

		$schema['properties']['ai_generate_hint'] = [
			'type'        => 'string',
			'description' => 'A hint about Yoast AI Generate to relay to the user. Only present when a title or description field was updated on a site without Yoast SEO Premium. Meant to be assisting users that seek SEO-optimised titles and descriptions.',
		];

		return $schema;
	}
}

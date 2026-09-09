<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Abilities\Application\Post_SEO_Data_Updater;
use Yoast\WP\SEO\Abilities\Infrastructure\Post_SEO_Field_Map;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Update_Post_SEO_Data_Ability;
use Yoast\WP\SEO\Conditionals\Should_Index_Indexables_Conditional;
use Yoast\WP\SEO\Config\Schema_Types;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Indexable_To_Postmeta_Helper;
use Yoast\WP\SEO\Helpers\Meta_Helper;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Update_Post_SEO_Data_Ability class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Update_Post_SEO_Data_Ability
 */
final class Update_Post_SEO_Data_Ability_Test extends TestCase {

	use Post_SEO_Data_Schema_Trait;

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
	 * The post SEO data updater mock.
	 *
	 * @var Mockery\MockInterface|Post_SEO_Data_Updater
	 */
	private $post_seo_data_updater;

	/**
	 * The instance under test.
	 *
	 * @var Update_Post_SEO_Data_Ability
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

		// The article-type enum is built from the documented filter; return the default unfiltered.
		Monkey\Functions\when( 'apply_filters' )->returnArg( 2 );

		$this->capability_helper                   = Mockery::mock( Capability_Helper::class );
		$this->should_index_indexables_conditional = Mockery::mock( Should_Index_Indexables_Conditional::class );
		$this->post_seo_data_updater               = Mockery::mock( Post_SEO_Data_Updater::class );

		$this->instance = new Update_Post_SEO_Data_Ability(
			$this->capability_helper,
			$this->should_index_indexables_conditional,
			$this->post_seo_data_updater,
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
		$this->assertSame( 'yoast-seo/update-post-seo-data', $this->instance->get_name() );
	}

	/**
	 * Tests that is_available follows whether the indexables are being built.
	 *
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Post_SEO_Data_Ability::is_available
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
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Post_SEO_Data_Ability::__construct
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Post_SEO_Data_Ability::can_edit_advanced_metadata
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
	 * @covers ::get_update_post_seo_data_input_schema
	 * @covers ::get_schema_article_types
	 * @covers ::nullable_enum_schema
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Post_SEO_Data_Ability::get_post_seo_data_output_schema
	 *
	 * @return void
	 */
	public function test_get_args() {
		$this->assertSame(
			[
				'label'               => 'Update Post SEO Data',
				'description'         => 'Update the SEO data for a single post. Identify the post by post_id or by permalink (URL). Only the fields you provide are changed; a provided empty value clears that field. Only posts the current user is allowed to edit can be updated.',
				'category'            => 'yoast-seo',
				'input_schema'        => $this->get_expected_update_input_schema(),
				'output_schema'       => $this->get_expected_output_schema(),
				'permission_callback' => [ $this->instance, 'can_edit_advanced_metadata' ],
				'execute_callback'    => [ $this->post_seo_data_updater, 'update_post_seo_data' ],
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
	 * Tests that every writable field in the update input schema is applied by the
	 * field map and cascades to a post meta write.
	 *
	 * The field contract is spread over hand-maintained structures (the input schema,
	 * Post_SEO_Field_Map, Indexable_To_Postmeta_Helper) which fail silently when they
	 * drift: a schema field missing from the field map is validated and accepted but
	 * never applied, and an indexable column missing from the postmeta map is skipped
	 * by the cascade and then reverted by the indexable rebuild. This test turns both
	 * drift paths into a failure.
	 *
	 * @covers ::get_args
	 * @covers ::get_update_post_seo_data_input_schema
	 *
	 * @return void
	 */
	public function test_every_writable_input_field_cascades_to_post_meta() {
		$input_schema = $this->instance->get_args()['input_schema'];

		$writable_fields = \array_diff_key(
			$input_schema['properties'],
			[
				'post_id'   => true,
				'permalink' => true,
			],
		);

		$field_map            = new Post_SEO_Field_Map( Mockery::mock( Meta_Surface::class ) );
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 42;

		$changed_columns = [];
		foreach ( $writable_fields as $field => $field_schema ) {
			// A truthy value for every type, so each mapped column performs a meta write below.
			$value   = ( \in_array( 'boolean', (array) $field_schema['type'], true ) ) ? true : 'a value';
			$changed = $field_map->apply_to_indexable( [ $field => $value ], $indexable );

			$this->assertNotEmpty(
				$changed,
				"Input field `{$field}` is accepted by the update input schema but not applied by Post_SEO_Field_Map, so writes to it are silently dropped.",
			);

			$changed_columns[] = $changed;
		}

		$meta_writes = 0;
		$meta_helper = Mockery::mock( Meta_Helper::class );
		$meta_helper->shouldReceive( 'set_value', 'delete' )->andReturnUsing(
			static function () use ( &$meta_writes ) {
				++$meta_writes;

				return true;
			},
		);
		$postmeta_helper = new Indexable_To_Postmeta_Helper( $meta_helper );

		foreach ( \array_unique( \array_merge( ...$changed_columns ) ) as $column ) {
			$writes_before = $meta_writes;
			$postmeta_helper->map_column_to_postmeta( $indexable, $column, true );

			$this->assertGreaterThan(
				$writes_before,
				$meta_writes,
				"Indexable column `{$column}` has no Indexable_To_Postmeta_Helper mapping, so writes to it are silently discarded and reverted by the indexable rebuild.",
			);
		}
	}

	/**
	 * Returns the expected update input schema.
	 *
	 * @return array<string, mixed> The schema.
	 */
	private function get_expected_update_input_schema(): array {
		return [
			'type'                 => 'object',
			'additionalProperties' => false,
			'properties'           => [
				'post_id'             => [
					'type'        => 'integer',
					'description' => 'The ID of the post to update.',
					'minimum'     => 1,
				],
				'permalink'           => [
					'type'        => 'string',
					'description' => 'The permalink (URL) of the post to update.',
				],
				'canonical'           => [
					'type'        => [ 'string', 'null' ],
					'description' => 'The custom canonical URL for the post. Use null or an empty string to remove it and fall back to the default canonical.',
				],
				'is_cornerstone'      => [
					'type'        => 'boolean',
					'description' => 'Whether the post is marked as cornerstone content.',
				],
				'noindex'             => [
					'type'        => [ 'boolean', 'null' ],
					'description' => 'Whether search engines should be told not to index this post. true sets noindex (the post is excluded from search results); false forces the post to be indexed; null clears the setting and falls back to the post-type default.',
				],
				'nofollow'            => [
					'type'        => 'boolean',
					'description' => 'Whether search engines should be told not to follow the links on this post.',
				],
				'noimageindex'        => [
					'type'        => 'boolean',
					'description' => 'Whether search engines should be told not to index the images on this post.',
				],
				'noarchive'           => [
					'type'        => 'boolean',
					'description' => 'Whether search engines should be told not to show a cached copy of this post.',
				],
				'nosnippet'           => [
					'type'        => 'boolean',
					'description' => 'Whether search engines should be told not to show a snippet of this post in the search results.',
				],
				'schema_page_type'    => [
					'type'        => [ 'string', 'null' ],
					'description' => 'The Schema.org page type for the post. Must be one of the supported page types. Use null to clear it and fall back to the default.',
					'enum'        => \array_merge( \array_keys( Schema_Types::PAGE_TYPES ), [ '', null ] ),
				],
				'schema_article_type' => [
					'type'        => [ 'string', 'null' ],
					'description' => 'The Schema.org article type for the post. Must be one of the supported article types. Use null to clear it and fall back to the default.',
					'enum'        => \array_merge( \array_keys( Schema_Types::ARTICLE_TYPES ), [ '', null ] ),
				],
			],
		];
	}
}

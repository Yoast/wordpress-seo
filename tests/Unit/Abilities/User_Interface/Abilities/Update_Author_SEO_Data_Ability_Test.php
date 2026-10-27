<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Abilities\Application\Author_SEO_Data_Updater;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_SEO_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_SEO_Meta_Writer;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Update_Author_SEO_Data_Ability;
use Yoast\WP\SEO\Abilities\User_Interface\SEO_Data_Output_Schema;
use Yoast\WP\SEO\Conditionals\Should_Index_Indexables_Conditional;
use Yoast\WP\SEO\Helpers\Author_Archive_Helper;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Sanitization_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Update_Author_SEO_Data_Ability class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Update_Author_SEO_Data_Ability
 */
final class Update_Author_SEO_Data_Ability_Test extends TestCase {

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
	 * The author SEO data updater mock.
	 *
	 * @var Mockery\MockInterface|Author_SEO_Data_Updater
	 */
	private $author_seo_data_updater;

	/**
	 * The SEO data output schema mock.
	 *
	 * @var Mockery\MockInterface|SEO_Data_Output_Schema
	 */
	private $output_schema;

	/**
	 * The instance under test.
	 *
	 * @var Update_Author_SEO_Data_Ability
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		// The inputs are real booleans, which WordPress returns as is.
		Monkey\Functions\when( 'rest_sanitize_boolean' )->alias( 'boolval' );

		$this->stubTranslationFunctions();

		$this->capability_helper                   = Mockery::mock( Capability_Helper::class );
		$this->should_index_indexables_conditional = Mockery::mock( Should_Index_Indexables_Conditional::class );
		$this->author_seo_data_updater             = Mockery::mock( Author_SEO_Data_Updater::class );
		$this->output_schema                       = Mockery::mock( SEO_Data_Output_Schema::class );

		$this->instance = new Update_Author_SEO_Data_Ability(
			$this->capability_helper,
			$this->should_index_indexables_conditional,
			$this->author_seo_data_updater,
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
		$this->assertSame( 'yoast-seo/update-author-seo-data', $this->instance->get_name() );
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
	 * @covers ::get_update_author_seo_data_input_schema
	 *
	 * @return void
	 */
	public function test_get_args() {
		$output_schema = [ 'type' => 'object' ];

		$this->output_schema->expects( 'get_author_output_schema' )->once()->andReturn( $output_schema );

		$this->assertSame(
			[
				'label'               => 'Update Author SEO Data',
				'description'         => 'Update the SEO data for the author archive of a single user: its SEO title, meta description and whether search engines are told not to index it. Identify the user by user_id or by the permalink (URL) of their author archive. Only the fields you provide are changed; a provided empty value clears that field. Provide only the user ID or permalink to read the current values without changing anything. Only users who can edit other users can use this, and only on users they are allowed to edit.',
				'category'            => 'yoast-seo',
				'input_schema'        => $this->get_expected_update_input_schema(),
				'output_schema'       => $output_schema,
				'permission_callback' => [ $this->instance, 'can_edit_advanced_metadata' ],
				'execute_callback'    => [ $this->author_seo_data_updater, 'update_author_seo_data' ],
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
	 * field map and cascades to a user meta key.
	 *
	 * The field contract is spread over hand-maintained structures (the input schema,
	 * Author_SEO_Field_Map, Author_SEO_Meta_Writer) which fail silently when they drift: a
	 * schema field missing from the field map is accepted but never applied, and an
	 * indexable column missing from the writer is skipped and then reverted by the
	 * indexable rebuild. This test turns both drift paths into a failure.
	 *
	 * @covers ::get_args
	 * @covers ::get_update_author_seo_data_input_schema
	 *
	 * @return void
	 */
	public function test_every_writable_input_field_cascades_to_user_meta() {
		$this->output_schema->expects( 'get_author_output_schema' )->once()->andReturn( [] );

		$input_schema = $this->instance->get_args()['input_schema'];

		$writable_fields = \array_diff_key(
			$input_schema['properties'],
			[
				'user_id'   => true,
				'permalink' => true,
			],
		);

		$field_map = new Author_SEO_Field_Map(
			Mockery::mock( Meta_Surface::class ),
			Mockery::mock( User_Helper::class ),
			Mockery::mock( Author_Archive_Helper::class ),
		);

		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 7;

		Monkey\Functions\when( 'get_userdata' )->justReturn( Mockery::mock( 'WP_User' ) );

		$written     = [];
		$user_helper = Mockery::mock( User_Helper::class );
		$user_helper->allows( 'update_meta' )->andReturnUsing(
			static function ( $user_id, $meta_key ) use ( &$written ) {
				$written[] = $meta_key;
			},
		);
		$user_helper->allows( 'delete_meta' )->andReturnUsing(
			static function ( $user_id, $meta_key ) use ( &$written ) {
				$written[] = $meta_key;
			},
		);
		$sanitization_helper = Mockery::mock( Sanitization_Helper::class );
		$sanitization_helper->allows( 'sanitize_text_field' )->andReturnArg( 0 );
		$writer = new Author_SEO_Meta_Writer( $user_helper, $sanitization_helper );

		foreach ( $writable_fields as $field => $field_schema ) {
			$value   = ( \in_array( 'boolean', (array) $field_schema['type'], true ) ) ? true : 'a value';
			$changed = $field_map->apply_to_indexable( [ $field => $value ], $indexable );

			$this->assertNotEmpty(
				$changed,
				"Input field `{$field}` is accepted by the update input schema but not applied by Author_SEO_Field_Map, so writes to it are silently dropped.",
			);

			foreach ( $changed as $column ) {
				$written = [];
				$writer->write_columns( $indexable, [ $column ] );

				$this->assertNotSame(
					[],
					\array_diff( $written, [ '_yoast_wpseo_profile_updated' ] ),
					"Indexable column `{$column}` has no Author_SEO_Meta_Writer mapping, so writes to it are silently discarded and reverted by the indexable rebuild.",
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
		return [
			'type'                 => 'object',
			'additionalProperties' => false,
			'properties'           => [
				'user_id'          => [
					'type'        => 'integer',
					'description' => 'The ID of the user whose author archive to update.',
					'minimum'     => 1,
				],
				'permalink'        => [
					'type'        => 'string',
					'description' => 'The permalink (URL) of the author archive to update.',
				],
				'seo_title'        => [
					'type'        => [ 'string', 'null' ],
					'description' => 'The SEO title for the author archive.',
				],
				'meta_description' => [
					'type'        => [ 'string', 'null' ],
					'description' => 'The meta description for the author archive.',
				],
				'noindex'          => [
					'type'        => 'boolean',
					'description' => 'Whether search engines should be told not to index this author archive. true sets noindex (the archive is excluded from search results); false removes it. When the site settings set all author archives to noindex, that setting applies regardless of this one.',
				],
			],
		];
	}
}

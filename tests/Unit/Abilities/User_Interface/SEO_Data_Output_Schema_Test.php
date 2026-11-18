<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface;

use Mockery;
use Yoast\WP\SEO\Abilities\Infrastructure\Term_SEO_Field_Map;
use Yoast\WP\SEO\Abilities\User_Interface\SEO_Data_Output_Schema;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities\Term_SEO_Data_Schema_Trait;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the SEO_Data_Output_Schema class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\SEO_Data_Output_Schema
 */
final class SEO_Data_Output_Schema_Test extends TestCase {

	use Term_SEO_Data_Schema_Trait;

	/**
	 * The instance under test.
	 *
	 * @var SEO_Data_Output_Schema
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

		$this->instance = new SEO_Data_Output_Schema();
	}

	/**
	 * Tests that get_term_output_schema returns the term identity fields, the shared SEO fields and the term-specific fields.
	 *
	 * @covers ::get_term_output_schema
	 * @covers ::get_shared_properties
	 * @covers ::raw
	 * @covers ::rendered
	 * @covers ::score
	 *
	 * @return void
	 */
	public function test_get_term_output_schema() {
		$this->assertSame( $this->get_expected_output_schema(), $this->instance->get_term_output_schema() );
	}

	/**
	 * Tests that the SEO data array built by the term field map exposes exactly the
	 * properties documented in the term output schema.
	 *
	 * The field contract is spread over hand-maintained structures (the output schema
	 * and Term_SEO_Field_Map) which fail silently when they drift: a field missing from
	 * either side is simply never surfaced to the ability's consumers. This test turns
	 * that drift into a failure.
	 *
	 * @covers ::get_term_output_schema
	 * @covers ::get_shared_properties
	 * @covers ::raw
	 * @covers ::rendered
	 * @covers ::score
	 *
	 * @return void
	 */
	public function test_term_output_schema_matches_field_map_output() {
		$meta_surface = Mockery::mock( Meta_Surface::class );
		$meta_surface->expects( 'for_indexable' )->andReturnFalse();
		$field_map = new Term_SEO_Field_Map( $meta_surface );

		$schema_properties = \array_keys( $this->instance->get_term_output_schema()['properties'] );
		$output_fields     = \array_keys( $field_map->to_seo_array( Mockery::mock( Indexable_Mock::class ) ) );
		\sort( $schema_properties );
		\sort( $output_fields );

		$this->assertSame(
			$schema_properties,
			$output_fields,
			'The output schema and Term_SEO_Field_Map::to_seo_array() must describe the same set of fields.',
		);
	}
}

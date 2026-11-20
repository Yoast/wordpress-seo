<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Yoast\WP\SEO\Abilities\Application\Schema_Type_Cast_Trait;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Schema_Type_Cast_Trait trait.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Application\Schema_Type_Cast_Trait
 */
final class Schema_Type_Cast_Trait_Test extends TestCase {

	/**
	 * The instance under test, which uses the trait.
	 *
	 * @var object
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new class() {

			use Schema_Type_Cast_Trait;

			/**
			 * Exposes cast_to_schema_type.
			 *
			 * @param mixed                $value  The stored value.
			 * @param array<string, mixed> $schema The JSON schema of the field.
			 *
			 * @return mixed The cast value.
			 */
			public function cast( $value, array $schema ) {
				return $this->cast_to_schema_type( $value, $schema );
			}
		};
	}

	/**
	 * Data provider for test_cast_to_schema_type.
	 *
	 * @return array<string, array<string, mixed>>
	 */
	public static function data_cast_to_schema_type() {
		return [
			'Unset integer' => [
				'value'    => false,
				'schema'   => [ 'type' => 'integer' ],
				'expected' => 0,
			],
			'Numeric string' => [
				'value'    => '5',
				'schema'   => [ 'type' => 'integer' ],
				'expected' => 5,
			],
			'Unset string' => [
				'value'    => false,
				'schema'   => [ 'type' => 'string' ],
				'expected' => '',
			],
			'Unset array' => [
				'value'    => '',
				'schema'   => [ 'type' => 'array' ],
				'expected' => [],
			],
			'Array' => [
				'value'    => [ 'https://example.com' ],
				'schema'   => [ 'type' => 'array' ],
				'expected' => [ 'https://example.com' ],
			],
			'Unset boolean' => [
				'value'    => '',
				'schema'   => [ 'type' => 'boolean' ],
				'expected' => false,
			],
			'Boolean' => [
				'value'    => true,
				'schema'   => [ 'type' => 'boolean' ],
				'expected' => true,
			],
			'Other type' => [
				'value'    => 1.5,
				'schema'   => [ 'type' => 'number' ],
				'expected' => 1.5,
			],
			'No type' => [
				'value'    => false,
				'schema'   => [],
				'expected' => false,
			],
		];
	}

	/**
	 * Tests that cast_to_schema_type casts the value to the type its schema declares, and leaves other types as
	 * they are.
	 *
	 * @covers ::cast_to_schema_type
	 *
	 * @dataProvider data_cast_to_schema_type
	 *
	 * @param mixed                $value    The stored value.
	 * @param array<string, mixed> $schema   The JSON schema of the field.
	 * @param mixed                $expected The expected value.
	 *
	 * @return void
	 */
	public function test_cast_to_schema_type( $value, $schema, $expected ) {
		$this->assertSame( $expected, $this->instance->cast( $value, $schema ) );
	}
}

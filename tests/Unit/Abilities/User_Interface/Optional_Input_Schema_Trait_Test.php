<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface;

use stdClass;
use Yoast\WP\SEO\Abilities\User_Interface\Optional_Input_Schema_Trait;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Optional_Input_Schema_Trait trait.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Optional_Input_Schema_Trait
 */
final class Optional_Input_Schema_Trait_Test extends TestCase {

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

			use Optional_Input_Schema_Trait;

			/**
			 * Exposes get_optional_input_schema.
			 *
			 * @param array<string, array<string, mixed>> $properties The input properties, keyed by name.
			 *
			 * @return array<string, mixed> The input schema.
			 */
			public function get( array $properties = [] ): array {
				return $this->get_optional_input_schema( $properties );
			}
		};
	}

	/**
	 * Tests that an ability without input properties gets an object schema with an object default.
	 *
	 * @covers ::get_optional_input_schema
	 *
	 * @return void
	 */
	public function test_get_optional_input_schema_without_properties() {
		// The default input is a new object, so it can only be compared by value.
		$this->assertEquals(
			[
				'type'                 => 'object',
				'additionalProperties' => false,
				'default'              => new stdClass(),
			],
			$this->instance->get(),
		);
	}

	/**
	 * Tests that the given properties are added to the schema.
	 *
	 * @covers ::get_optional_input_schema
	 *
	 * @return void
	 */
	public function test_get_optional_input_schema_with_properties() {
		$properties = [
			'term_id' => [
				'type'    => 'integer',
				'minimum' => 1,
			],
		];

		$schema = $this->instance->get( $properties );

		$this->assertSame( $properties, $schema['properties'] );
		$this->assertInstanceOf( stdClass::class, $schema['default'] );
		$this->assertSame( [], (array) $schema['default'] );
	}
}

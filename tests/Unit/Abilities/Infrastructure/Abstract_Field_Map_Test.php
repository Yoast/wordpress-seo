<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure;

use Yoast\WP\SEO\Abilities\Infrastructure\Abstract_Field_Map;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Abstract_Field_Map class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Abstract_Field_Map
 */
final class Abstract_Field_Map_Test extends TestCase {

	/**
	 * The default fields of the instance under test.
	 *
	 * @var array<string, array<string, string>>
	 */
	public const DEFAULT_FIELDS = [
		'first' => [ 'type' => 'string' ],
	];

	/**
	 * Returns an instance whose filter returns the given fields, and which drops the given fields when resolving
	 * their extra keys.
	 *
	 * @param mixed         $filtered_fields What the filter returns.
	 * @param array<string> $dropped_fields  The fields to drop when resolving their extra keys.
	 *
	 * @return Abstract_Field_Map The instance under test.
	 */
	private function get_instance( $filtered_fields, array $dropped_fields = [] ): Abstract_Field_Map {
		return new class( $filtered_fields, $dropped_fields ) extends Abstract_Field_Map {

			/**
			 * The number of times the filter was applied.
			 *
			 * @var int
			 */
			public $filter_calls = 0;

			/**
			 * The fields the filter received.
			 *
			 * @var array<string, array<string, mixed>>|null
			 */
			public $filter_input;

			/**
			 * What the filter returns.
			 *
			 * @var mixed
			 */
			private $filtered_fields;

			/**
			 * The fields to drop when resolving their extra keys.
			 *
			 * @var array<string>
			 */
			private $dropped_fields;

			/**
			 * Constructor.
			 *
			 * @param mixed         $filtered_fields What the filter returns.
			 * @param array<string> $dropped_fields  The fields to drop when resolving their extra keys.
			 */
			public function __construct( $filtered_fields, array $dropped_fields ) {
				$this->filtered_fields = $filtered_fields;
				$this->dropped_fields  = $dropped_fields;
			}

			/**
			 * Returns the default fields.
			 *
			 * @return array<string, array<string, mixed>> The default fields.
			 */
			protected function get_default_fields(): array {
				return Abstract_Field_Map_Test::DEFAULT_FIELDS;
			}

			/**
			 * Records the call and returns the configured fields.
			 *
			 * @param array<string, array<string, mixed>> $default_fields The default fields.
			 *
			 * @return mixed The configured fields.
			 */
			protected function get_filtered_fields( array $default_fields ) {
				++$this->filter_calls;
				$this->filter_input = $default_fields;

				return $this->filtered_fields;
			}

			/**
			 * Drops the configured fields.
			 *
			 * @param string               $field_name The name of the field.
			 * @param array<string, mixed> $schema     The JSON schema of the field.
			 *
			 * @return array<string, mixed>|null The schema, or null for the configured fields.
			 */
			protected function resolve_extra_keys( string $field_name, array $schema ): ?array {
				return ( \in_array( $field_name, $this->dropped_fields, true ) ) ? null : $schema;
			}
		};
	}

	/**
	 * Tests that get_fields passes the default fields through the filter, returns the result and resolves the
	 * fields only once.
	 *
	 * @covers ::get_fields
	 * @covers ::get_validators
	 * @covers ::resolve_fields
	 *
	 * @return void
	 */
	public function test_get_fields() {
		$fields   = [
			'first'  => [ 'type' => 'string' ],
			'second' => [ 'type' => 'integer' ],
		];
		$instance = $this->get_instance( $fields );

		$this->assertSame( $fields, $instance->get_fields() );
		$this->assertSame( [], $instance->get_validators() );
		$this->assertSame( $fields, $instance->get_fields() );
		$this->assertSame( 1, $instance->filter_calls );
		$this->assertSame( self::DEFAULT_FIELDS, $instance->filter_input );
	}

	/**
	 * Tests that get_fields falls back to the default fields when the filter does not return an array.
	 *
	 * @covers ::get_fields
	 * @covers ::resolve_fields
	 *
	 * @return void
	 */
	public function test_get_fields_filter_not_array() {
		$this->assertSame( self::DEFAULT_FIELDS, $this->get_instance( 'not an array' )->get_fields() );
	}

	/**
	 * Tests that the validators are extracted from the schemas, and that fields without a schema or with a
	 * validator that is not callable are dropped.
	 *
	 * @covers ::get_fields
	 * @covers ::get_validators
	 * @covers ::resolve_fields
	 *
	 * @return void
	 */
	public function test_get_validators() {
		$validator = static function () {
			return null;
		};
		$instance  = $this->get_instance(
			[
				'first'        => [
					'type'              => 'string',
					'validate_callback' => $validator,
				],
				'no_schema'    => 'string',
				'not_callable' => [
					'type'              => 'string',
					'validate_callback' => 'not_a_function',
				],
			],
		);

		$this->assertSame( [ 'first' => [ 'type' => 'string' ] ], $instance->get_fields() );
		$this->assertSame( [ 'first' => $validator ], $instance->get_validators() );
	}

	/**
	 * Tests that a field dropped while resolving its extra keys is dropped along with its validator.
	 *
	 * @covers ::get_fields
	 * @covers ::get_validators
	 * @covers ::resolve_fields
	 * @covers ::resolve_extra_keys
	 *
	 * @return void
	 */
	public function test_get_fields_dropped_by_extra_keys() {
		$instance = $this->get_instance(
			[
				'first'   => [ 'type' => 'string' ],
				'dropped' => [
					'type'              => 'string',
					'validate_callback' => 'is_string',
				],
			],
			[ 'dropped' ],
		);

		$this->assertSame( [ 'first' => [ 'type' => 'string' ] ], $instance->get_fields() );
		$this->assertSame( [], $instance->get_validators() );
	}
}

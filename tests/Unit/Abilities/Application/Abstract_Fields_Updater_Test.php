<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Yoast\WP\SEO\Abilities\Application\Abstract_Fields_Updater;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Abstract_Fields_Updater class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Application\Abstract_Fields_Updater
 */
final class Abstract_Fields_Updater_Test extends TestCase {

	/**
	 * The fields the updater receives.
	 *
	 * @var array<string, array<string, string>>
	 */
	private const FIELDS = [
		'first'  => [ 'type' => 'string' ],
		'second' => [ 'type' => 'string' ],
	];

	/**
	 * The instance under test, which records the fields it saves.
	 *
	 * @var Abstract_Fields_Updater
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

		$this->instance = new class() extends Abstract_Fields_Updater {

			/**
			 * Whether the fields are saved as provided.
			 *
			 * @var bool
			 */
			public $save_result = true;

			/**
			 * The fields that were saved, with their value and context.
			 *
			 * @var array<string, array<int, mixed>>
			 */
			public $saved = [];

			/**
			 * Records the field and returns the configured result.
			 *
			 * @param string               $field_name The name of the field.
			 * @param mixed                $value      The value to save.
			 * @param array<string, mixed> $context    The context.
			 *
			 * @return bool Whether the field was saved as provided.
			 */
			protected function save_field( string $field_name, $value, array $context ): bool {
				$this->saved[ $field_name ] = [ $value, $context ];

				return $this->save_result;
			}

			/**
			 * Exposes update_fields.
			 *
			 * @param array<string, array<string, mixed>> $fields     The fields.
			 * @param array<string, callable>             $validators The validators.
			 * @param array<string, mixed>                $input      The input.
			 * @param array<string, mixed>                $context    The context.
			 *
			 * @return string|null The warning.
			 */
			public function update( array $fields, array $validators, array $input, array $context = [] ): ?string {
				return $this->update_fields( $fields, $validators, $input, $context );
			}
		};
	}

	/**
	 * Tests that update saves only the known fields present in the input and returns no warning.
	 *
	 * @covers ::update_fields
	 * @covers ::update_field
	 * @covers ::validate_field
	 *
	 * @return void
	 */
	public function test_update() {
		$warning = $this->instance->update(
			self::FIELDS,
			[],
			[
				'first'   => 'one',
				'unknown' => 'ignored',
			],
		);

		$this->assertNull( $warning );
		$this->assertSame( [ 'first' => [ 'one', [] ] ], $this->instance->saved );
	}

	/**
	 * Tests that update saves nothing when the input has no fields to change.
	 *
	 * @covers ::update_fields
	 *
	 * @return void
	 */
	public function test_update_no_fields() {
		$this->assertNull( $this->instance->update( self::FIELDS, [], [ 'user_id' => 7 ] ) );
		$this->assertSame( [], $this->instance->saved );
	}

	/**
	 * Tests that update skips a field whose validator returns a warning, saves the other fields and returns
	 * that warning.
	 *
	 * @covers ::update_fields
	 * @covers ::update_field
	 * @covers ::validate_field
	 *
	 * @return void
	 */
	public function test_update_validator_warning() {
		$received   = [];
		$validators = [
			'first' => static function ( $value, $field_name ) use ( &$received ) {
				$received = [ $value, $field_name ];

				return 'The first setting was not changed.';
			},
		];

		$warning = $this->instance->update(
			self::FIELDS,
			$validators,
			[
				'first'  => 'one',
				'second' => 'two',
			],
		);

		$this->assertSame( [ 'one', 'first' ], $received );
		$this->assertSame( [ 'second' => [ 'two', [] ] ], $this->instance->saved );
		$this->assertSame( 'The first setting was not changed. The other settings were saved.', $warning );
	}

	/**
	 * Data provider for test_update_validator_no_warning.
	 *
	 * @return array<string, array<string, mixed>>
	 */
	public static function data_update_validator_no_warning() {
		return [
			'Null'         => [ 'validator_result' => null ],
			'Empty string' => [ 'validator_result' => '' ],
			'False'        => [ 'validator_result' => false ],
			'Array'        => [ 'validator_result' => [ 'A warning' ] ],
		];
	}

	/**
	 * Tests that update saves a field whose validator returns anything but a non-empty string.
	 *
	 * @covers ::update_fields
	 * @covers ::update_field
	 * @covers ::validate_field
	 *
	 * @dataProvider data_update_validator_no_warning
	 *
	 * @param mixed $validator_result What the validator returns.
	 *
	 * @return void
	 */
	public function test_update_validator_no_warning( $validator_result ) {
		$validators = [
			'first' => static function () use ( $validator_result ) {
				return $validator_result;
			},
		];

		$this->assertNull( $this->instance->update( self::FIELDS, $validators, [ 'first' => 'one' ] ) );
		$this->assertSame( [ 'first' => [ 'one', [] ] ], $this->instance->saved );
	}

	/**
	 * Tests that update reports every field that could not be saved in one warning, in the order of the fields.
	 *
	 * @covers ::update_fields
	 * @covers ::update_field
	 *
	 * @return void
	 */
	public function test_update_not_saved() {
		$this->instance->save_result = false;

		$warning = $this->instance->update(
			self::FIELDS,
			[],
			[
				'second' => 'two',
				'first'  => 'one',
			],
		);

		$this->assertSame(
			'The first setting could not be saved as provided, so its current value is returned. The second setting could not be saved as provided, so its current value is returned. No other settings were saved.',
			$warning,
		);
	}

	/**
	 * Tests that update passes the context to save_field.
	 *
	 * @covers ::update_fields
	 * @covers ::update_field
	 *
	 * @return void
	 */
	public function test_update_context() {
		$this->instance->update( self::FIELDS, [], [ 'first' => 'one' ], [ 'user_id' => 7 ] );

		$this->assertSame( [ 'first' => [ 'one', [ 'user_id' => 7 ] ] ], $this->instance->saved );
	}
}

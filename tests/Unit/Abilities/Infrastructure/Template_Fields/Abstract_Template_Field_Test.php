<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Template_Fields;

use Mockery;
use Yoast\WP\SEO\Abilities\Domain\Template_Target_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Template_Fields\Abstract_Template_Field;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Abstract_Template_Field class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Template_Fields\Abstract_Template_Field
 */
final class Abstract_Template_Field_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Abstract_Template_Field
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new class() extends Abstract_Template_Field {

			/**
			 * Returns the name of the field.
			 *
			 * @return string The name.
			 */
			public function get_name(): string {
				return 'test_field';
			}

			/**
			 * Returns the JSON schema of the field.
			 *
			 * @return array<string, string> The JSON schema.
			 */
			public function get_schema(): array {
				return [ 'type' => 'string' ];
			}

			/**
			 * Returns the option pattern of each target that has the field.
			 *
			 * @return array<string, string> The option pattern of each target, keyed by target name.
			 */
			protected function get_option_patterns(): array {
				return [ 'post_type_archive' => 'test-ptarchive-%s' ];
			}
		};
	}

	/**
	 * Tests that get_option_name lets the target turn the option pattern into the option name.
	 *
	 * @covers ::get_option_name
	 *
	 * @return void
	 */
	public function test_get_option_name() {
		$target = Mockery::mock( Template_Target_Interface::class );
		$target->expects( 'get_name' )->once()->andReturn( 'post_type_archive' );
		$target->expects( 'format_option_name' )->once()->with( 'test-ptarchive-%s' )->andReturn( 'test-ptarchive-portfolio' );

		$this->assertSame( 'test-ptarchive-portfolio', $this->instance->get_option_name( $target ) );
	}

	/**
	 * Tests that get_option_name returns null for a target that does not have the field.
	 *
	 * @covers ::get_option_name
	 *
	 * @return void
	 */
	public function test_get_option_name_unsupported_target() {
		$target = Mockery::mock( Template_Target_Interface::class );
		$target->expects( 'get_name' )->once()->andReturn( 'homepage' );
		$target->expects( 'format_option_name' )->never();

		$this->assertNull( $this->instance->get_option_name( $target ) );
	}
}

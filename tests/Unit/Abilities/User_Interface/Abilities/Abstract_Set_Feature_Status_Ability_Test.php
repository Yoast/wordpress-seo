<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Mockery;
use Yoast\WP\SEO\Abilities\Application\Feature_Status_Updater;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the defaults of the Abstract_Set_Feature_Status_Ability class, through a feature whose
 * output is just its status.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability
 */
final class Abstract_Set_Feature_Status_Ability_Test extends TestCase {

	/**
	 * The feature status updater mock.
	 *
	 * @var Mockery\MockInterface|Feature_Status_Updater
	 */
	private $feature_status_updater;

	/**
	 * The instance under test.
	 *
	 * @var Abstract_Set_Feature_Status_Ability
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

		$this->feature_status_updater = Mockery::mock( Feature_Status_Updater::class );

		$this->instance = new class( Mockery::mock( Capability_Helper::class ), $this->feature_status_updater ) extends Abstract_Set_Feature_Status_Ability {

			/**
			 * Returns the ability slug.
			 *
			 * @return string The ability slug.
			 */
			protected function get_slug(): string {
				return 'set-plain-status';
			}

			/**
			 * Returns the option name.
			 *
			 * @return string The option name.
			 */
			protected function get_option_name(): string {
				return 'enable_plain';
			}

			/**
			 * Returns the feature name.
			 *
			 * @return string The feature name.
			 */
			protected function get_feature_name(): string {
				return 'plain';
			}

			/**
			 * Returns the label.
			 *
			 * @return string The label.
			 */
			protected function get_label(): string {
				return 'Set Plain Status';
			}

			/**
			 * Returns the description.
			 *
			 * @return string The description.
			 */
			protected function get_description(): string {
				return 'Enable or disable the plain feature.';
			}
		};
	}

	/**
	 * Tests that execute delegates to the updater and returns the status.
	 *
	 * @covers ::execute
	 *
	 * @return void
	 */
	public function test_execute() {
		$this->feature_status_updater
			->expects( 'set_status' )
			->once()
			->with( 'enable_plain', [ 'enabled' => true ] )
			->andReturn( [ 'enabled' => true ] );

		$this->assertSame( [ 'enabled' => true ], $this->instance->execute( [ 'enabled' => true ] ) );
	}

	/**
	 * Tests that the output schema describes only the status when the feature adds no output of its own.
	 *
	 * @covers ::get_args
	 * @covers ::get_additional_output_properties
	 *
	 * @return void
	 */
	public function test_get_args_without_additional_output_properties() {
		$this->assertSame(
			[
				'type'       => 'object',
				'properties' => [
					'enabled' => [
						'type'        => 'boolean',
						'description' => 'Whether Yoast SEO\'s plain feature is enabled.',
					],
				],
			],
			$this->instance->get_args()['output_schema'],
		);
	}
}

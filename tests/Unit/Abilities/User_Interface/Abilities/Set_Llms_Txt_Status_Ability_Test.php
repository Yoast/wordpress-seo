<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Feature_Status_Updater;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Set_Llms_Txt_Status_Ability;
use Yoast\WP\SEO\Conditionals\Non_Multisite_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Populate_File_Command_Handler;
use Yoast\WP\SEO\Llms_Txt\Application\Health_Check\File_Runner;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Set_Llms_Txt_Status_Ability class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Set_Llms_Txt_Status_Ability
 */
final class Set_Llms_Txt_Status_Ability_Test extends TestCase {

	/**
	 * The capability helper mock.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The feature status updater mock.
	 *
	 * @var Mockery\MockInterface|Feature_Status_Updater
	 */
	private $feature_status_updater;

	/**
	 * The non-multisite conditional mock.
	 *
	 * @var Mockery\MockInterface|Non_Multisite_Conditional
	 */
	private $non_multisite_conditional;

	/**
	 * The llms.txt file generation health check runner mock.
	 *
	 * @var Mockery\MockInterface|File_Runner
	 */
	private $file_runner;

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The llms.txt population command handler mock.
	 *
	 * @var Mockery\MockInterface|Populate_File_Command_Handler
	 */
	private $populate_file_command_handler;

	/**
	 * The instance under test.
	 *
	 * @var Set_Llms_Txt_Status_Ability
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

		$this->capability_helper             = Mockery::mock( Capability_Helper::class );
		$this->feature_status_updater        = Mockery::mock( Feature_Status_Updater::class );
		$this->non_multisite_conditional     = Mockery::mock( Non_Multisite_Conditional::class );
		$this->file_runner                   = Mockery::mock( File_Runner::class );
		$this->options_helper                = Mockery::mock( Options_Helper::class );
		$this->populate_file_command_handler = Mockery::mock( Populate_File_Command_Handler::class );

		$this->instance = new Set_Llms_Txt_Status_Ability(
			$this->capability_helper,
			$this->feature_status_updater,
			$this->non_multisite_conditional,
			$this->file_runner,
			$this->options_helper,
			$this->populate_file_command_handler,
		);
	}

	/**
	 * Expects the current llms.txt status to be read once.
	 *
	 * @param bool $enabled The current status.
	 *
	 * @return void
	 */
	private function expect_current_status( bool $enabled ): void {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'enable_llms_txt', false )
			->andReturn( $enabled );
	}

	/**
	 * Data provider for the boolean outcome tests.
	 *
	 * @return array<string, array<bool>> The outcomes.
	 */
	public static function provide_boolean_outcomes(): array {
		return [
			'true'  => [ true ],
			'false' => [ false ],
		];
	}

	/**
	 * Tests that get_name returns the prefixed ability name.
	 *
	 * @covers ::get_slug
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability::get_name
	 *
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'yoast-seo/set-llms-txt-status', $this->instance->get_name() );
	}

	/**
	 * Tests that is_available follows the non-multisite conditional.
	 *
	 * @covers ::__construct
	 * @covers ::is_available
	 *
	 * @dataProvider provide_boolean_outcomes
	 *
	 * @param bool $is_met Whether the site is not a multisite.
	 *
	 * @return void
	 */
	public function test_is_available( bool $is_met ) {
		$this->non_multisite_conditional->expects( 'is_met' )->once()->andReturn( $is_met );

		$this->assertSame( $is_met, $this->instance->is_available() );
	}

	/**
	 * Tests that can_manage_seo checks the management capability and returns its result.
	 *
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability::__construct
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability::can_manage_seo
	 *
	 * @dataProvider provide_boolean_outcomes
	 *
	 * @param bool $allowed Whether the capability is granted.
	 *
	 * @return void
	 */
	public function test_can_manage_seo( bool $allowed ) {
		$this->capability_helper
			->expects( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( $allowed );

		$this->assertSame( $allowed, $this->instance->can_manage_seo() );
	}

	/**
	 * Tests that execute returns the disabled status without generating or consulting the file
	 * health check, since a recorded generation failure is only reported while the feature is enabled.
	 *
	 * @covers ::get_option_name
	 * @covers ::execute
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability::execute
	 *
	 * @dataProvider provide_boolean_outcomes
	 *
	 * @param bool $was_enabled Whether the feature was enabled before the call.
	 *
	 * @return void
	 */
	public function test_execute_disable( bool $was_enabled ) {
		$this->expect_current_status( $was_enabled );
		$this->feature_status_updater
			->expects( 'set_status' )
			->once()
			->with( 'enable_llms_txt', [ 'enabled' => false ] )
			->andReturn( [ 'enabled' => false ] );
		$this->populate_file_command_handler->expects( 'handle' )->never();
		$this->file_runner->expects( 'run' )->never();

		$this->assertSame( [ 'enabled' => false ], $this->instance->execute( [ 'enabled' => false ] ) );
	}

	/**
	 * Tests that execute passes an error from the updater through without generating or consulting the file health check.
	 *
	 * @covers ::execute
	 *
	 * @return void
	 */
	public function test_execute_passes_errors_through() {
		$error = Mockery::mock( WP_Error::class );

		$this->expect_current_status( true );
		$this->feature_status_updater
			->expects( 'set_status' )
			->once()
			->with( 'enable_llms_txt', [ 'enabled' => true ] )
			->andReturn( $error );
		$this->populate_file_command_handler->expects( 'handle' )->never();
		$this->file_runner->expects( 'run' )->never();

		$this->assertSame( $error, $this->instance->execute( [ 'enabled' => true ] ) );
	}

	/**
	 * Tests that execute returns the enabled status without a warning when no generation failure is
	 * recorded, and generates the file again only when the feature was already enabled, since the
	 * option watcher does not do so without an option change.
	 *
	 * @covers ::execute
	 * @covers ::get_generation_failure_warning
	 *
	 * @dataProvider provide_boolean_outcomes
	 *
	 * @param bool $was_enabled Whether the feature was enabled before the call.
	 *
	 * @return void
	 */
	public function test_execute_enable_generated( bool $was_enabled ) {
		$this->expect_current_status( $was_enabled );
		$this->feature_status_updater
			->expects( 'set_status' )
			->once()
			->with( 'enable_llms_txt', [ 'enabled' => true ] )
			->andReturn( [ 'enabled' => true ] );
		$this->populate_file_command_handler->expects( 'handle' )->times( ( $was_enabled ) ? 1 : 0 );
		$this->file_runner->expects( 'run' )->once();
		$this->file_runner->expects( 'is_successful' )->once()->andReturnTrue();
		$this->file_runner->expects( 'get_generation_failure_reason' )->never();

		$this->assertSame( [ 'enabled' => true ], $this->instance->execute( [ 'enabled' => true ] ) );
	}

	/**
	 * Data provider for the generation failure reasons.
	 *
	 * @return array<string, array<string>> The reasons and the warnings they map to.
	 */
	public static function provide_generation_failure_reasons(): array {
		return [
			'not managed by Yoast SEO' => [
				'not_managed_by_yoast_seo',
				'The llms.txt feature is enabled, but the file could not be generated or updated: an llms.txt file already exists that was not created by Yoast SEO or has been edited manually, and it will not be overwritten. Delete it manually to let Yoast SEO generate the file, or disable the Yoast SEO feature.',
			],
			'filesystem permissions'   => [
				'filesystem_permissions',
				'The llms.txt feature is enabled, but the file could not be generated or updated: the web server\'s filesystem permissions do not allow writing it.',
			],
			'unknown'                  => [
				'something_else',
				'The llms.txt feature is enabled, but the file could not be generated or updated, for unknown reasons.',
			],
		];
	}

	/**
	 * Tests that execute adds a warning explaining the failure when the feature was enabled but the file was not generated.
	 *
	 * @covers ::execute
	 * @covers ::get_generation_failure_warning
	 *
	 * @dataProvider provide_generation_failure_reasons
	 *
	 * @param string $reason  The generation failure reason.
	 * @param string $warning The expected warning.
	 *
	 * @return void
	 */
	public function test_execute_enable_not_generated( string $reason, string $warning ) {
		$this->expect_current_status( true );
		$this->feature_status_updater
			->expects( 'set_status' )
			->once()
			->with( 'enable_llms_txt', [ 'enabled' => true ] )
			->andReturn( [ 'enabled' => true ] );
		$this->populate_file_command_handler->expects( 'handle' )->once();
		$this->file_runner->expects( 'run' )->once();
		$this->file_runner->expects( 'is_successful' )->once()->andReturnFalse();
		$this->file_runner->expects( 'get_generation_failure_reason' )->once()->andReturn( $reason );

		$this->assertSame(
			[
				'enabled' => true,
				'warning' => $warning,
			],
			$this->instance->execute( [ 'enabled' => true ] ),
		);
	}

	/**
	 * Tests that get_args returns the expected registration arguments.
	 *
	 * @covers ::get_feature_name
	 * @covers ::get_label
	 * @covers ::get_description
	 * @covers ::get_additional_output_properties
	 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Set_Feature_Status_Ability::get_args
	 *
	 * @return void
	 */
	public function test_get_args() {
		$this->assertSame(
			[
				'label'               => 'Set llms.txt Status',
				'description'         => 'Enable or disable Yoast SEO\'s llms.txt feature. Enabling it generates an llms.txt file for the site and keeps it up to date; disabling it removes the file.',
				'category'            => 'yoast-seo',
				'input_schema'        => [
					'type'                 => 'object',
					'additionalProperties' => false,
					'required'             => [ 'enabled' ],
					'properties'           => [
						'enabled' => [
							'type'        => 'boolean',
							'description' => 'Whether Yoast SEO\'s llms.txt feature should be enabled. true enables it; false disables it.',
						],
					],
				],
				'output_schema'       => [
					'type'       => 'object',
					'properties' => [
						'enabled' => [
							'type'        => 'boolean',
							'description' => 'Whether Yoast SEO\'s llms.txt feature is enabled.',
						],
						'warning' => [
							'type'        => 'string',
							'description' => 'Only present when the feature is enabled but the llms.txt file could not be generated. Meant to be relayed to the user.',
						],
					],
				],
				'permission_callback' => [ $this->instance, 'can_manage_seo' ],
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
}

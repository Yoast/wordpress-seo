<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Application;

use Mockery;
use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Feature_Status_Updater;
use Yoast\WP\SEO\Abilities\Application\Llms_Txt_Status_Updater;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Populate_File_Command_Handler;
use Yoast\WP\SEO\Llms_Txt\Application\Health_Check\File_Runner;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Llms_Txt_Status_Updater class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Application\Llms_Txt_Status_Updater
 */
final class Llms_Txt_Status_Updater_Test extends TestCase {

	/**
	 * The feature status updater mock.
	 *
	 * @var Mockery\MockInterface|Feature_Status_Updater
	 */
	private $feature_status_updater;

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
	 * The llms.txt file generation health check runner mock.
	 *
	 * @var Mockery\MockInterface|File_Runner
	 */
	private $file_runner;

	/**
	 * The instance under test.
	 *
	 * @var Llms_Txt_Status_Updater
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

		$this->feature_status_updater        = Mockery::mock( Feature_Status_Updater::class );
		$this->options_helper                = Mockery::mock( Options_Helper::class );
		$this->populate_file_command_handler = Mockery::mock( Populate_File_Command_Handler::class );
		$this->file_runner                   = Mockery::mock( File_Runner::class );

		$this->instance = new Llms_Txt_Status_Updater(
			$this->feature_status_updater,
			$this->options_helper,
			$this->populate_file_command_handler,
			$this->file_runner,
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
	 * Expects the feature status to be written once with the given input.
	 *
	 * @param bool                         $enabled The requested status.
	 * @param array<string, bool>|WP_Error $result  What the feature status updater returns.
	 *
	 * @return void
	 */
	private function expect_status_write( bool $enabled, $result ): void {
		$this->feature_status_updater
			->expects( 'set_status' )
			->once()
			->with( 'enable_llms_txt', [ 'enabled' => $enabled ] )
			->andReturn( $result );
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
	 * Tests that set_status returns the disabled status without generating or consulting the file
	 * health check, since a recorded generation failure is only reported while the feature is enabled.
	 *
	 * @covers ::__construct
	 * @covers ::set_status
	 *
	 * @dataProvider provide_boolean_outcomes
	 *
	 * @param bool $was_enabled Whether the feature was enabled before the call.
	 *
	 * @return void
	 */
	public function test_set_status_disable( bool $was_enabled ) {
		$this->expect_current_status( $was_enabled );
		$this->expect_status_write( false, [ 'enabled' => false ] );
		$this->populate_file_command_handler->expects( 'handle' )->never();
		$this->file_runner->expects( 'run' )->never();

		$this->assertSame( [ 'enabled' => false ], $this->instance->set_status( [ 'enabled' => false ] ) );
	}

	/**
	 * Tests that set_status passes an error from the feature status updater through without
	 * generating or consulting the file health check.
	 *
	 * @covers ::set_status
	 *
	 * @return void
	 */
	public function test_set_status_passes_errors_through() {
		$error = Mockery::mock( WP_Error::class );

		$this->expect_current_status( true );
		$this->expect_status_write( true, $error );
		$this->populate_file_command_handler->expects( 'handle' )->never();
		$this->file_runner->expects( 'run' )->never();

		$this->assertSame( $error, $this->instance->set_status( [ 'enabled' => true ] ) );
	}

	/**
	 * Tests that set_status returns the enabled status without a warning when no generation failure
	 * is recorded, and generates the file again only when the feature was already enabled, since
	 * the option watcher does not do so without an option change.
	 *
	 * @covers ::set_status
	 * @covers ::get_generation_failure_warning
	 *
	 * @dataProvider provide_boolean_outcomes
	 *
	 * @param bool $was_enabled Whether the feature was enabled before the call.
	 *
	 * @return void
	 */
	public function test_set_status_enable_generated( bool $was_enabled ) {
		$this->expect_current_status( $was_enabled );
		$this->expect_status_write( true, [ 'enabled' => true ] );
		$this->populate_file_command_handler->expects( 'handle' )->times( ( $was_enabled ) ? 1 : 0 );
		$this->file_runner->expects( 'run' )->once();
		$this->file_runner->expects( 'is_successful' )->once()->andReturnTrue();
		$this->file_runner->expects( 'get_generation_failure_reason' )->never();

		$this->assertSame( [ 'enabled' => true ], $this->instance->set_status( [ 'enabled' => true ] ) );
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
	 * Tests that set_status adds a warning explaining the failure when the feature was enabled but the file was not generated.
	 *
	 * @covers ::set_status
	 * @covers ::get_generation_failure_warning
	 *
	 * @dataProvider provide_generation_failure_reasons
	 *
	 * @param string $reason  The generation failure reason.
	 * @param string $warning The expected warning.
	 *
	 * @return void
	 */
	public function test_set_status_enable_not_generated( string $reason, string $warning ) {
		$this->expect_current_status( true );
		$this->expect_status_write( true, [ 'enabled' => true ] );
		$this->populate_file_command_handler->expects( 'handle' )->once();
		$this->file_runner->expects( 'run' )->once();
		$this->file_runner->expects( 'is_successful' )->once()->andReturnFalse();
		$this->file_runner->expects( 'get_generation_failure_reason' )->once()->andReturn( $reason );

		$this->assertSame(
			[
				'enabled' => true,
				'warning' => $warning,
			],
			$this->instance->set_status( [ 'enabled' => true ] ),
		);
	}
}

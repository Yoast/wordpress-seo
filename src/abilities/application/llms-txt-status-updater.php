<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use WP_Error;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Populate_File_Command_Handler;
use Yoast\WP\SEO\Llms_Txt\Application\Health_Check\File_Runner;

/**
 * Application service that enables or disables the llms.txt feature and reports whether the file could be generated.
 */
class Llms_Txt_Status_Updater {

	/**
	 * The name of the option that enables the llms.txt feature.
	 */
	public const OPTION_NAME = 'enable_llms_txt';

	/**
	 * The feature status updater.
	 *
	 * @var Feature_Status_Updater
	 */
	private $feature_status_updater;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The llms.txt population command handler.
	 *
	 * @var Populate_File_Command_Handler
	 */
	private $populate_file_command_handler;

	/**
	 * The llms.txt file generation health check runner.
	 *
	 * @var File_Runner
	 */
	private $file_runner;

	/**
	 * Constructor.
	 *
	 * @param Feature_Status_Updater        $feature_status_updater        The feature status updater.
	 * @param Options_Helper                $options_helper                The options helper.
	 * @param Populate_File_Command_Handler $populate_file_command_handler The llms.txt population command handler.
	 * @param File_Runner                   $file_runner                   The llms.txt file generation health check runner.
	 */
	public function __construct(
		Feature_Status_Updater $feature_status_updater,
		Options_Helper $options_helper,
		Populate_File_Command_Handler $populate_file_command_handler,
		File_Runner $file_runner
	) {
		$this->feature_status_updater        = $feature_status_updater;
		$this->options_helper                = $options_helper;
		$this->populate_file_command_handler = $populate_file_command_handler;
		$this->file_runner                   = $file_runner;
	}

	/**
	 * Enables or disables the llms.txt feature and returns its new status.
	 *
	 * Enabling generates the file synchronously through the option watcher, which can fail
	 * without the option write failing. Like the admin notification, a recorded failure is
	 * only reported while the feature is enabled, as a warning rather than an error.
	 *
	 * @param array<string, bool> $input The input holding the desired `enabled` status.
	 *
	 * @return array<string, bool|string>|WP_Error The new status, or an error when the input is invalid or the status could not be saved.
	 */
	public function set_status( array $input ) {
		$was_enabled = ( $this->options_helper->get( self::OPTION_NAME, false ) === true );

		$result = $this->feature_status_updater->set_status( self::OPTION_NAME, $input );

		if ( ! \is_array( $result ) || $result['enabled'] !== true ) {
			return $result;
		}

		// The option watcher only generates the file when the option actually changes. Enabling an
		// already enabled feature is how an agent retries after fixing the cause of an earlier
		// failure, so generate again to report a fresh outcome instead of the stored one.
		if ( $was_enabled ) {
			$this->populate_file_command_handler->handle();
		}

		$warning = $this->get_generation_failure_warning();

		if ( $warning !== null ) {
			$result['warning'] = $warning;
		}

		return $result;
	}

	/**
	 * Returns the warning for a failed llms.txt generation, or null when the file was generated.
	 *
	 * The reasons mirror the ones the file health check and the admin notification report.
	 *
	 * @return string|null The warning.
	 */
	private function get_generation_failure_warning(): ?string {
		$this->file_runner->run();

		if ( $this->file_runner->is_successful() ) {
			return null;
		}

		switch ( $this->file_runner->get_generation_failure_reason() ) {
			case 'not_managed_by_yoast_seo':
				return \sprintf(
					/* translators: %1$s expands to Yoast SEO */
					\__( 'The llms.txt feature is enabled, but the file could not be generated or updated: an llms.txt file already exists that was not created by %1$s or has been edited manually, and it will not be overwritten. Delete it manually to let %1$s generate the file, or disable the %1$s feature.', 'wordpress-seo' ),
					'Yoast SEO',
				);
			case 'filesystem_permissions':
				return \__( 'The llms.txt feature is enabled, but the file could not be generated or updated: the web server\'s filesystem permissions do not allow writing it.', 'wordpress-seo' );
			default:
				return \__( 'The llms.txt feature is enabled, but the file could not be generated or updated, for unknown reasons.', 'wordpress-seo' );
		}
	}
}

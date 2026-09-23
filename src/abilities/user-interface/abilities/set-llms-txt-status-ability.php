<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use WP_Error;
use Yoast\WP\SEO\Abilities\Application\Feature_Status_Updater;
use Yoast\WP\SEO\Conditionals\Non_Multisite_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Populate_File_Command_Handler;
use Yoast\WP\SEO\Llms_Txt\Application\Health_Check\File_Runner;

/**
 * The ability that enables or disables the llms.txt feature.
 *
 * Disabling removes the generated file and re-enabling regenerates it. The destructive
 * annotation is left unknown so that clients decide how to confirm the toggle.
 */
class Set_Llms_Txt_Status_Ability extends Abstract_Set_Feature_Status_Ability {

	/**
	 * The non-multisite conditional.
	 *
	 * @var Non_Multisite_Conditional
	 */
	private $non_multisite_conditional;

	/**
	 * The llms.txt file generation health check runner.
	 *
	 * @var File_Runner
	 */
	private $file_runner;

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
	 * Constructor.
	 *
	 * @param Capability_Helper             $capability_helper             The capability helper.
	 * @param Feature_Status_Updater        $feature_status_updater        The feature status updater.
	 * @param Non_Multisite_Conditional     $non_multisite_conditional     The non-multisite conditional.
	 * @param File_Runner                   $file_runner                   The llms.txt file generation health check runner.
	 * @param Options_Helper                $options_helper                The options helper.
	 * @param Populate_File_Command_Handler $populate_file_command_handler The llms.txt population command handler.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Feature_Status_Updater $feature_status_updater,
		Non_Multisite_Conditional $non_multisite_conditional,
		File_Runner $file_runner,
		Options_Helper $options_helper,
		Populate_File_Command_Handler $populate_file_command_handler
	) {
		parent::__construct( $capability_helper, $feature_status_updater );

		$this->non_multisite_conditional     = $non_multisite_conditional;
		$this->file_runner                   = $file_runner;
		$this->options_helper                = $options_helper;
		$this->populate_file_command_handler = $populate_file_command_handler;
	}

	/**
	 * Returns whether the ability is available: the llms.txt feature cannot be enabled on
	 * multisite installations, so the ability is only offered outside of them.
	 *
	 * @return bool Whether the ability is available.
	 */
	public function is_available(): bool {
		return $this->non_multisite_conditional->is_met();
	}

	/**
	 * Enables or disables the feature and returns its new status.
	 *
	 * Enabling generates the file synchronously through the option watcher, which can fail
	 * without the option write failing. Like the admin notification, a recorded failure is
	 * only reported while the feature is enabled, as a warning rather than an error.
	 *
	 * @param array<string, bool> $input The input holding the desired `enabled` status.
	 *
	 * @return array<string, bool|string>|WP_Error The new status, or an error when it could not be saved.
	 */
	public function execute( array $input ) {
		$was_enabled = ( $this->options_helper->get( $this->get_option_name(), false ) === true );

		$result = parent::execute( $input );

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

	/**
	 * Returns the part of the ability name that follows the category slug.
	 *
	 * @return string The ability slug.
	 */
	protected function get_slug(): string {
		return 'set-llms-txt-status';
	}

	/**
	 * Returns the name of the boolean option that enables the feature.
	 *
	 * @return string The option name.
	 */
	protected function get_option_name(): string {
		return 'enable_llms_txt';
	}

	/**
	 * Returns the human-readable name of the feature.
	 *
	 * @return string The feature name.
	 */
	protected function get_feature_name(): string {
		return 'llms.txt';
	}

	/**
	 * Returns the label of the ability.
	 *
	 * @return string The label.
	 */
	protected function get_label(): string {
		return \__( 'Set llms.txt Status', 'wordpress-seo' );
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the warning property that reports a failed file generation.
	 *
	 * @return array<string, array<string, mixed>> The additional output schema properties.
	 */
	protected function get_additional_output_properties(): array {
		return [
			'warning' => [
				'type'        => 'string',
				'description' => \__( 'Only present when the feature is enabled but the llms.txt file could not be generated. Meant to be relayed to the user.', 'wordpress-seo' ),
			],
		];
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint

	/**
	 * Returns the description of the ability.
	 *
	 * @return string The description.
	 */
	protected function get_description(): string {
		return \sprintf(
			/* translators: %s expands to Yoast SEO */
			\__( 'Enable or disable %s\'s llms.txt feature. Enabling it generates an llms.txt file for the site and keeps it up to date; disabling it removes the file.', 'wordpress-seo' ),
			'Yoast SEO',
		);
	}
}

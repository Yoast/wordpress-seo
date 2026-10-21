<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use WP_Error;
use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Global_Setting_Target_Exception;
use Yoast\WP\SEO\Abilities\Domain\Global_Setting_Field_Interface;
use Yoast\WP\SEO\Abilities\Domain\Global_Setting_Target_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Fields\Global_Setting_Field_Repository;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Global_Setting_Target_Repository;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Application service that updates the global settings of one target.
 *
 * The values are saved through the options helper, so they are sanitized and validated exactly like they are when
 * saved from the settings page.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Archive_And_Special_Page_SEO_Settings_Updater extends Abstract_Fields_Updater {

	/**
	 * The global setting field repository.
	 *
	 * @var Global_Setting_Field_Repository
	 */
	private $field_repository;

	/**
	 * The global setting target repository.
	 *
	 * @var Global_Setting_Target_Repository
	 */
	private $target_repository;

	/**
	 * The archive and special page SEO settings collector.
	 *
	 * @var Archive_And_Special_Page_SEO_Settings_Collector
	 */
	private $collector;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructor.
	 *
	 * @param Global_Setting_Field_Repository                 $field_repository  The global setting field repository.
	 * @param Global_Setting_Target_Repository                $target_repository The global setting target repository.
	 * @param Archive_And_Special_Page_SEO_Settings_Collector $collector         The archive and special page SEO settings collector.
	 * @param Options_Helper                                  $options_helper    The options helper.
	 */
	public function __construct(
		Global_Setting_Field_Repository $field_repository,
		Global_Setting_Target_Repository $target_repository,
		Archive_And_Special_Page_SEO_Settings_Collector $collector,
		Options_Helper $options_helper
	) {
		$this->field_repository  = $field_repository;
		$this->target_repository = $target_repository;
		$this->collector         = $collector;
		$this->options_helper    = $options_helper;
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The fields added through the filter can hold any option value.

	/**
	 * Updates the global settings of a target and returns its new state.
	 *
	 * Only fields present in the input are changed (patch semantics). Fields the target does not have, or that
	 * cannot be saved, are reported in a warning, while the other fields are still saved.
	 *
	 * @param array<string, mixed> $input The target, the post type for the archive of a content type, and the fields
	 *                                    to change.
	 *
	 * @return array<string, mixed>|WP_Error The new global settings of the target, plus a warning when some fields
	 *                                       could not be changed, or an error when the target cannot be changed.
	 */
	public function update( array $input ) {
		try {
			$target = $this->target_repository->get( (string) ( $input['target'] ?? '' ), (string) ( $input['post_type'] ?? '' ) );
			$target->ensure_available();
		} catch ( Unavailable_Global_Setting_Target_Exception $exception ) {
			return new WP_Error( $exception->get_error_code(), $exception->getMessage(), [ 'status' => $exception->getCode() ] );
		}

		$target_fields = $this->field_repository->get_for_target( $target );
		$warnings      = $this->get_input_warnings( $input, $target, $target_fields );

		$result = $this->update_fields(
			$this->field_repository->get_schemas( $target_fields ),
			[],
			$input,
			[
				'target' => $target,
				'fields' => $target_fields,
			],
		);

		if ( $result['warning'] !== null ) {
			$warnings[] = $result['warning'];
		}

		if ( $result['saved_any'] && ! $target->is_enabled() ) {
			$warnings[] = \__( 'The settings were saved, but these pages are disabled on this site, so the settings have no effect until the pages are enabled in the Yoast SEO settings.', 'wordpress-seo' );
		}

		$data = $this->collector->get_target( $target );

		if ( $warnings !== [] ) {
			$data['warning'] = \implode( ' ', $warnings );
		}

		return $data;
	}

	/**
	 * Saves a single field in the option it is stored in for the target.
	 *
	 * @param string               $field_name The name of the field.
	 * @param mixed                $value      The value to save.
	 * @param array<string, mixed> $context    The target in 'target', and the fields it has in 'fields'.
	 *
	 * @return bool Whether the field was saved.
	 */
	protected function save_field( string $field_name, $value, array $context ): bool {
		$field = ( $context['fields'][ $field_name ] ?? null );
		if ( ! $field instanceof Global_Setting_Field_Interface ) {
			return false;
		}

		$option_name = $field->get_option_name( $context['target'] );
		if ( $option_name === null ) {
			return false;
		}

		return $this->options_helper->set( $option_name, $value ) === true;
	}

	/**
	 * Returns the warnings about the input that is ignored for the target.
	 *
	 * @param array<string, mixed>                          $input         The ability input.
	 * @param Global_Setting_Target_Interface               $target        The target.
	 * @param array<string, Global_Setting_Field_Interface> $target_fields The fields the target has, keyed by name.
	 *
	 * @return array<string> The warnings.
	 */
	private function get_input_warnings( array $input, Global_Setting_Target_Interface $target, array $target_fields ): array {
		$warnings = [];

		if ( isset( $input['post_type'] ) && ! \array_key_exists( 'post_type', $target->get_identifiers() ) ) {
			$warnings[] = \sprintf(
				/* translators: 1: the name of a parameter, 2: the name of a target. */
				\__( 'The %1$s is only used for the %2$s target, so it was ignored.', 'wordpress-seo' ),
				'post_type',
				'post_type_archive',
			);
		}

		$unsupported = \array_keys( \array_diff_key( \array_intersect_key( $this->field_repository->get_all(), $input ), $target_fields ) );
		if ( $unsupported !== [] ) {
			$warnings[] = \sprintf(
				/* translators: 1: a list of setting names, 2: the name of a target. */
				\__( 'These settings are not available for %2$s, so they were not saved: %1$s.', 'wordpress-seo' ),
				\implode( ', ', $unsupported ),
				$target->get_name(),
			);
		}

		return $warnings;
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}

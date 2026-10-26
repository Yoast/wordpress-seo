<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use WP_Error;
use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Global_Setting_Target_Exception;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Field_Map;
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
	 * The global setting field map.
	 *
	 * @var Global_Setting_Field_Map
	 */
	private $field_map;

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
	 * @param Global_Setting_Field_Map                        $field_map         The global setting field map.
	 * @param Global_Setting_Target_Repository                $target_repository The global setting target repository.
	 * @param Archive_And_Special_Page_SEO_Settings_Collector $collector         The archive and special page SEO settings collector.
	 * @param Options_Helper                                  $options_helper    The options helper.
	 */
	public function __construct(
		Global_Setting_Field_Map $field_map,
		Global_Setting_Target_Repository $target_repository,
		Archive_And_Special_Page_SEO_Settings_Collector $collector,
		Options_Helper $options_helper
	) {
		$this->field_map         = $field_map;
		$this->target_repository = $target_repository;
		$this->collector         = $collector;
		$this->options_helper    = $options_helper;
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The fields added through the filter can hold any option value.

	/**
	 * Updates the global settings of a target and returns its new state.
	 *
	 * Only fields present in the input are changed (patch semantics). Fields the target does not have, or that
	 * cannot be saved, are reported in a warning, while the other fields are still saved. A post type is only used
	 * for the archive of a content type, and ignored for the other targets.
	 *
	 * @param array<string, mixed> $input The target, the post type for the archive of a content type, and the fields
	 *                                    to change.
	 *
	 * @return array<string, mixed>|WP_Error The new global settings of the target, plus a warning when some fields
	 *                                       could not be changed, or an error when the target cannot be changed or
	 *                                       no field is provided.
	 */
	public function update( array $input ) {
		try {
			$target = $this->target_repository->get( (string) ( $input['target'] ?? '' ), (string) ( $input['post_type'] ?? '' ) );
			$target->ensure_available();
		} catch ( Unavailable_Global_Setting_Target_Exception $exception ) {
			return new WP_Error( $exception->get_error_code(), $exception->getMessage(), [ 'status' => $exception->getCode() ] );
		}

		$fields = $this->field_map->get_fields();

		// The post type identifies the target rather than being a setting, so the input schema cannot catch this.
		if ( \array_intersect_key( $fields, $input ) === [] ) {
			return new WP_Error(
				'yoast_seo_no_settings',
				\__( 'Provide at least one setting to change.', 'wordpress-seo' ),
				[ 'status' => 400 ],
			);
		}

		$warnings = [];
		$result   = $this->update_fields( $fields, $this->field_map->get_validators(), $input, [ 'target' => $target ] );

		if ( $result['warning'] !== null ) {
			$warnings[] = $result['warning'];
		}

		if ( $result['saved_any'] && ! $target->is_enabled() ) {
			$warnings[] = \__( 'The settings were saved, but these pages are disabled on this site, so the settings have no effect until the pages are enabled in the Yoast SEO settings.', 'wordpress-seo' );
		}

		$data = $this->collector->get_target_settings( $target );

		if ( $warnings !== [] ) {
			$data['warning'] = \implode( ' ', $warnings );
		}

		return $data;
	}

	/**
	 * Validates and saves a single field, unless the target does not have it, which is never saved, whatever its
	 * own validator would say.
	 *
	 * @param array<string, callable> $validators The validator of each field that has one, keyed by field name.
	 * @param string                  $field_name The name of the field.
	 * @param mixed                   $value      The value to save.
	 * @param array<string, mixed>    $context    The target, under 'target'.
	 *
	 * @return string|null A warning when the field could not be saved, null otherwise.
	 */
	protected function update_field( array $validators, string $field_name, $value, array $context ): ?string {
		if ( ! $this->field_map->target_has_field( $field_name, $context['target'] ) ) {
			return \sprintf(
				/* translators: 1: the name of a setting, 2: the name of a target. */
				\__( 'The %1$s setting is not available for %2$s, so it was not saved.', 'wordpress-seo' ),
				$field_name,
				$context['target']->get_name(),
			);
		}

		return parent::update_field( $validators, $field_name, $value, $context );
	}

	/**
	 * Saves a single field in the option it is stored in for the target.
	 *
	 * @param string               $field_name The name of the field.
	 * @param mixed                $value      The value to save.
	 * @param array<string, mixed> $context    The target, under 'target'.
	 *
	 * @return bool Whether the field was saved.
	 */
	protected function save_field( string $field_name, $value, array $context ): bool {
		$option_name = $this->field_map->get_option_name( $field_name, $context['target'] );
		if ( $option_name === null ) {
			return false;
		}

		return $this->options_helper->set( $option_name, $value ) === true;
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}

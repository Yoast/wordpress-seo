<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Application;

use Yoast\WP\SEO\Abilities\Domain\Template_Target_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Template_Fields\Template_Field_Repository;
use Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Template_Target_Repository;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Application service that collects the SEO data of the homepage, the archives and the special pages.
 */
class Archive_And_Special_Page_SEO_Data_Collector {

	use Schema_Type_Cast_Trait;

	/**
	 * The template field repository.
	 *
	 * @var Template_Field_Repository
	 */
	private $field_repository;

	/**
	 * The template target repository.
	 *
	 * @var Template_Target_Repository
	 */
	private $target_repository;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructor.
	 *
	 * @param Template_Field_Repository  $field_repository  The template field repository.
	 * @param Template_Target_Repository $target_repository The template target repository.
	 * @param Options_Helper             $options_helper    The options helper.
	 */
	public function __construct(
		Template_Field_Repository $field_repository,
		Template_Target_Repository $target_repository,
		Options_Helper $options_helper
	) {
		$this->field_repository  = $field_repository;
		$this->target_repository = $target_repository;
		$this->options_helper    = $options_helper;
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The fields added through the filter can hold any option value.

	/**
	 * Returns the template SEO data of all targets whose template SEO data exists on the site.
	 *
	 * @return array<array<string, mixed>> The template SEO data of each target.
	 */
	public function get_all(): array {
		return \array_map( [ $this, 'get_target' ], $this->target_repository->get_all() );
	}

	/**
	 * Returns the template SEO data of a target: what identifies it like the update ability expects it, the
	 * current value of each field it has, and what agents need to know to change them.
	 *
	 * @param Template_Target_Interface $target The target.
	 *
	 * @return array<string, mixed> The template SEO data of the target.
	 */
	public function get_target( Template_Target_Interface $target ): array {
		$data = $target->get_identifiers();

		foreach ( $this->field_repository->get_for_target( $target ) as $field_name => $field ) {
			$data[ $field_name ] = $this->cast_to_schema_type( $this->options_helper->get( $field->get_option_name( $target ) ), $field->get_schema() );
		}

		$data['enabled'] = $target->is_enabled();
		$data['shared']  = $target->is_shared();

		return $data;
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}

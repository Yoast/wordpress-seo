<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Author_Archives_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Date_Archives_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Global_Setting_Target_Repository;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Homepage_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Not_Found_Page_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Post_Type_Archive_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Search_Page_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Taxonomy_Archive_Target;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * Shared base for the abilities that read and update the SEO data of the homepage, the archives and the special
 * pages.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Archive_And_Special_Page_SEO_Settings_Ability extends Abstract_Global_SEO_Settings_Ability {

	/**
	 * The global setting target repository.
	 *
	 * @var Global_Setting_Target_Repository
	 */
	protected $target_repository;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper                $capability_helper The capability helper.
	 * @param Global_Setting_Field_Map         $field_map         The global setting field map.
	 * @param Global_Setting_Target_Repository $target_repository The global setting target repository.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Global_Setting_Field_Map $field_map,
		Global_Setting_Target_Repository $target_repository
	) {
		parent::__construct( $capability_helper, $field_map );

		$this->target_repository = $target_repository;
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the output schema of the global settings of a single target.
	 *
	 * @return array<string, mixed> The output schema.
	 */
	protected function get_target_output_schema(): array {
		return $this->build_target_output_schema(
			$this->target_repository->get_names(),
			[
				'target'    => [
					'type'        => 'string',
					'enum'        => $this->target_repository->get_names(),
					'description' => \__( 'The pages these settings belong to.', 'wordpress-seo' ) . ' ' . $this->get_targets_description(),
				],
				'post_type' => [
					'type'        => 'string',
					'description' => \sprintf(
						/* translators: %s expands to the name of a target. */
						\__( 'Only present for the %s target: the post type of the content type.', 'wordpress-seo' ),
						Post_Type_Archive_Target::NAME,
					),
				],
				'taxonomy'  => [
					'type'        => 'string',
					'description' => \sprintf(
						/* translators: %s expands to the name of a target. */
						\__( 'Only present for the %s target: the taxonomy.', 'wordpress-seo' ),
						Taxonomy_Archive_Target::NAME,
					),
				],
				'label'     => [
					'type'        => 'string',
					'description' => \sprintf(
						/* translators: 1: the name of a target, 2: the name of a target. */
						\__( 'Only present for the %1$s and %2$s targets: the name of the content type or the taxonomy, as shown in the Yoast SEO settings.', 'wordpress-seo' ),
						Post_Type_Archive_Target::NAME,
						Taxonomy_Archive_Target::NAME,
					),
				],
			],
		);
	}

	/**
	 * Returns what each target is, and where it is found in the Yoast SEO settings, so agents can relate the targets
	 * to what users see.
	 *
	 * @return string The description of the targets.
	 */
	protected function get_targets_description(): string {
		return \sprintf(
			/* translators: 1-7: the name of a target. */
			\__( 'Under "Content types" in the Yoast SEO settings: %1$s is the homepage when it shows the latest posts, and %2$s the archive of a content type. Under "Categories & tags": %3$s holds the default settings of the term archives of a taxonomy; the format archives are listed under "Advanced" instead. Under "Advanced": %4$s holds the settings of the author archives, %5$s of the date archives, %6$s of the search results pages and %7$s of the 404 pages.', 'wordpress-seo' ),
			Homepage_Target::NAME,
			Post_Type_Archive_Target::NAME,
			Taxonomy_Archive_Target::NAME,
			Author_Archives_Target::NAME,
			Date_Archives_Target::NAME,
			Search_Page_Target::NAME,
			Not_Found_Page_Target::NAME,
		);
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}

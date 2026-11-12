<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Field_Map;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Content_Type_Target;
use Yoast\WP\SEO\Abilities\Infrastructure\Global_Setting_Targets\Content_Type_Target_Factory;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * Shared base for the abilities that read and update the default SEO settings of the content types.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Content_Type_SEO_Settings_Ability extends Abstract_Global_SEO_Settings_Ability {

	/**
	 * The factory of the content type targets.
	 *
	 * @var Content_Type_Target_Factory
	 */
	protected $target_factory;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper           $capability_helper The capability helper.
	 * @param Global_Setting_Field_Map    $field_map         The global setting field map.
	 * @param Content_Type_Target_Factory $target_factory    The factory of the content type targets.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Global_Setting_Field_Map $field_map,
		Content_Type_Target_Factory $target_factory
	) {
		parent::__construct( $capability_helper, $field_map );

		$this->target_factory = $target_factory;
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the output schema of the default SEO settings of a single content type.
	 *
	 * @return array<string, mixed> The output schema.
	 */
	protected function get_target_output_schema(): array {
		return $this->build_target_output_schema(
			[ Content_Type_Target::NAME ],
			[
				'post_type' => [
					'type'        => 'string',
					'description' => \__( 'The post type of the content type.', 'wordpress-seo' ),
				],
				'label'     => [
					'type'        => 'string',
					'description' => \__( 'The display name of the content type.', 'wordpress-seo' ),
				],
			],
		);
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}

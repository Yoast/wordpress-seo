<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

/**
 * The ability that enables or disables the Schema Framework feature.
 *
 * Only the option is written: when the feature is disabled, the schema disabled conditional
 * stops the JSON-LD output on the front end.
 */
class Set_Schema_Framework_Status_Ability extends Abstract_Set_Option_Status_Ability {

	/**
	 * Returns the part of the ability name that follows the category slug.
	 *
	 * @return string The ability slug.
	 */
	protected function get_slug(): string {
		return 'set-schema-framework-status';
	}

	/**
	 * Returns the name of the option that enables the Schema Framework feature.
	 *
	 * @return string The option name.
	 */
	protected function get_option_name(): string {
		return 'enable_schema';
	}

	/**
	 * Returns the human-readable name of the feature.
	 *
	 * @return string The feature name.
	 */
	protected function get_feature_name(): string {
		return 'Schema Framework';
	}

	/**
	 * Returns the label of the ability.
	 *
	 * @return string The label.
	 */
	protected function get_label(): string {
		return \__( 'Set Schema Framework Status', 'wordpress-seo' );
	}

	/**
	 * Returns the description of the ability.
	 *
	 * @return string The description.
	 */
	protected function get_description(): string {
		return \sprintf(
			/* translators: %s expands to Yoast SEO */
			\__( 'Enable or disable %s\'s Schema Framework feature. Enabling it outputs a single structured data graph (JSON-LD) on the site\'s pages, so search engines and language models can consistently read every person, product, organization, and piece of content; disabling it stops outputting the graph.', 'wordpress-seo' ),
			'Yoast SEO',
		);
	}
}

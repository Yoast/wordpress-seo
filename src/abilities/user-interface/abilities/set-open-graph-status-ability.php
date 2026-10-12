<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

/**
 * The ability that enables or disables the Open Graph data feature.
 *
 * Only the option is written: when the feature is disabled, the front-end integration
 * stops outputting the Open Graph meta tags.
 */
class Set_Open_Graph_Status_Ability extends Abstract_Set_Option_Status_Ability {

	/**
	 * Returns the part of the ability name that follows the category slug.
	 *
	 * @return string The ability slug.
	 */
	protected function get_slug(): string {
		return 'set-open-graph-status';
	}

	/**
	 * Returns the name of the option that enables the Open Graph data feature.
	 *
	 * @return string The option name.
	 */
	protected function get_option_name(): string {
		return 'opengraph';
	}

	/**
	 * Returns the human-readable name of the feature.
	 *
	 * @return string The feature name.
	 */
	protected function get_feature_name(): string {
		return 'Open Graph data';
	}

	/**
	 * Returns the label of the ability.
	 *
	 * @return string The label.
	 */
	protected function get_label(): string {
		return \__( 'Set Open Graph Data Status', 'wordpress-seo' );
	}

	/**
	 * Returns the description of the ability.
	 *
	 * @return string The description.
	 */
	protected function get_description(): string {
		return \sprintf(
			/* translators: %s expands to Yoast SEO */
			\__( 'Enable or disable %s\'s Open Graph data feature. Enabling it outputs Open Graph meta tags on the site\'s pages, so Facebook and other social media can display a preview with an image and a text excerpt when a link to the site is shared; disabling it stops outputting the tags.', 'wordpress-seo' ),
			'Yoast SEO',
		);
	}
}

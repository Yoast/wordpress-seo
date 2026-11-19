<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\Infrastructure\Features\Open_Graph_Feature;

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
	 * Returns the key of the feature in the feature repository.
	 *
	 * @return string The feature key.
	 */
	protected function get_feature_key(): string {
		return Open_Graph_Feature::KEY;
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

<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\Infrastructure\Features\Xml_Sitemap_Feature;

/**
 * The ability that enables or disables the XML sitemap feature.
 */
class Set_Xml_Sitemap_Status_Ability extends Abstract_Set_Option_Status_Ability {

	/**
	 * Returns the part of the ability name that follows the category slug.
	 *
	 * @return string The ability slug.
	 */
	protected function get_slug(): string {
		return 'set-xml-sitemap-status';
	}

	/**
	 * Returns the key of the feature in the feature repository.
	 *
	 * @return string The feature key.
	 */
	protected function get_feature_key(): string {
		return Xml_Sitemap_Feature::KEY;
	}

	/**
	 * Returns the label of the ability.
	 *
	 * @return string The label.
	 */
	protected function get_label(): string {
		return \__( 'Set XML Sitemap Status', 'wordpress-seo' );
	}

	/**
	 * Returns the description of the ability.
	 *
	 * @return string The description.
	 */
	protected function get_description(): string {
		return \sprintf(
			/* translators: %s expands to Yoast SEO */
			\__( 'Enable or disable %s\'s XML sitemap feature. Enabling it serves the sitemap index at /sitemap_index.xml and its sub-sitemaps, and replaces the WordPress core sitemaps; disabling it stops serving them.', 'wordpress-seo' ),
			'Yoast SEO',
		);
	}
}

<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\Application\Feature_Status_Updater;
use Yoast\WP\SEO\Abilities\Infrastructure\Features\Xml_Sitemap_Feature;
use Yoast\WP\SEO\Helpers\Capability_Helper;

/**
 * The ability that enables or disables the XML sitemap feature.
 */
class Set_Xml_Sitemap_Status_Ability extends Abstract_Set_Option_Status_Ability {

	/**
	 * The XML sitemap feature.
	 *
	 * @var Xml_Sitemap_Feature
	 */
	private $xml_sitemap_feature;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper      $capability_helper      The capability helper.
	 * @param Feature_Status_Updater $feature_status_updater The feature status updater.
	 * @param Xml_Sitemap_Feature    $xml_sitemap_feature    The XML sitemap feature.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Feature_Status_Updater $feature_status_updater,
		Xml_Sitemap_Feature $xml_sitemap_feature
	) {
		parent::__construct( $capability_helper, $feature_status_updater );

		$this->xml_sitemap_feature = $xml_sitemap_feature;
	}

	/**
	 * Returns whether the ability is available.
	 *
	 * When a network admin forbids the XML sitemap, the option validation silently forces the feature back off on save,
	 * so the ability is not offered instead of failing on every call.
	 *
	 * @return bool Whether the ability is available.
	 */
	public function is_available(): bool {
		return $this->xml_sitemap_feature->is_available();
	}

	/**
	 * Returns the part of the ability name that follows the category slug.
	 *
	 * @return string The ability slug.
	 */
	protected function get_slug(): string {
		return 'set-xml-sitemap-status';
	}

	/**
	 * Returns the name of the option that enables the XML sitemap feature.
	 *
	 * @return string The option name.
	 */
	protected function get_option_name(): string {
		return Xml_Sitemap_Feature::OPTION_NAME;
	}

	/**
	 * Returns the human-readable name of the feature.
	 *
	 * @return string The feature name.
	 */
	protected function get_feature_name(): string {
		return Xml_Sitemap_Feature::NAME;
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

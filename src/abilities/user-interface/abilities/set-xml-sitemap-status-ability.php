<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\Application\Feature_Status_Updater;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * The ability that enables or disables the XML sitemap feature.
 */
class Set_Xml_Sitemap_Status_Ability extends Abstract_Set_Feature_Status_Ability {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructor.
	 *
	 * @param Capability_Helper      $capability_helper      The capability helper.
	 * @param Feature_Status_Updater $feature_status_updater The feature status updater.
	 * @param Options_Helper         $options_helper         The options helper.
	 */
	public function __construct(
		Capability_Helper $capability_helper,
		Feature_Status_Updater $feature_status_updater,
		Options_Helper $options_helper
	) {
		parent::__construct( $capability_helper, $feature_status_updater );

		$this->options_helper = $options_helper;
	}

	/**
	 * Returns whether the ability is available.
	 *
	 * A network admin can forbid the XML sitemap for the sites of a multisite network. When
	 * that is the case, the option validation silently forces the feature back off on save,
	 * so the ability is not offered instead of failing on every call. Outside of a multisite
	 * the network option does not exist and the feature is always allowed.
	 *
	 * @return bool Whether the ability is available.
	 */
	public function is_available(): bool {
		return (bool) $this->options_helper->get( 'allow_enable_xml_sitemap', true );
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
	 * Returns the name of the boolean option that enables the feature.
	 *
	 * @return string The option name.
	 */
	protected function get_option_name(): string {
		return 'enable_xml_sitemap';
	}

	/**
	 * Returns the human-readable name of the feature.
	 *
	 * @return string The feature name.
	 */
	protected function get_feature_name(): string {
		return 'XML sitemap';
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
		return \__( 'Enable or disable the XML sitemap feature. Enabling it serves the sitemap index at /sitemap_index.xml and its sub-sitemaps, and replaces the WordPress core sitemaps; disabling it stops serving them.', 'wordpress-seo' );
	}
}

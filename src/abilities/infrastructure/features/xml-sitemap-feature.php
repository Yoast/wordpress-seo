<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Features;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * The XML sitemap feature.
 */
class Xml_Sitemap_Feature extends Abstract_Feature {

	/**
	 * The key of the feature.
	 *
	 * @var string
	 */
	public const KEY = 'xml_sitemap';

	/**
	 * The name of the boolean option that enables the feature.
	 *
	 * @var string
	 */
	public const OPTION_NAME = 'enable_xml_sitemap';

	/**
	 * The human-readable name of the feature.
	 *
	 * @var string
	 */
	public const NAME = 'XML sitemap';

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Returns the key of the feature.
	 *
	 * @return string The key.
	 */
	public function get_key(): string {
		return self::KEY;
	}

	/**
	 * Returns the name of the boolean option that enables the feature.
	 *
	 * @return string The option name.
	 */
	public function get_option_name(): string {
		return self::OPTION_NAME;
	}

	/**
	 * Returns the human-readable name of the feature.
	 *
	 * @return string The name.
	 */
	public function get_name(): string {
		return self::NAME;
	}

	/**
	 * Returns whether the feature can be changed on the site.
	 *
	 * A network admin can forbid the XML sitemap for the sites of a multisite network. When that is the case, the
	 * option validation silently forces the feature back off on save. Outside of a multisite the network option
	 * does not exist and the feature is always allowed.
	 *
	 * @return bool Whether the feature can be changed.
	 */
	public function is_available(): bool {
		return (bool) $this->options_helper->get( 'allow_enable_xml_sitemap', true );
	}
}

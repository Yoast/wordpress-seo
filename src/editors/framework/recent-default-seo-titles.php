<?php

namespace Yoast\WP\SEO\Editors\Framework;

use Yoast\WP\SEO\Alerts\Infrastructure\Default_SEO_Data\Default_SEO_Data_Collector;
use Yoast\WP\SEO\Editors\Domain\Analysis_Features\Analysis_Feature_Interface;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Describes if the Recent Default SEO Titles feature is enabled.
 */
class Recent_Default_SEO_Titles implements Analysis_Feature_Interface {

	public const NAME = 'recentDefaultSeoTitles';

	/**
	 * The default SEO data collector.
	 *
	 * @var Default_SEO_Data_Collector
	 */
	private $default_seo_data_collector;

	/**
	 * The constructor.
	 *
	 * @param Default_SEO_Data_Collector $default_seo_data_collector The default SEO data collector.
	 */
	public function __construct( Default_SEO_Data_Collector $default_seo_data_collector ) {
		$this->default_seo_data_collector = $default_seo_data_collector;
	}

	/**
	 * If recent default SEO titles is enabled.
	 *
	 * @return bool If recent default SEO titles is enabled.
	 */
	public function is_enabled(): bool {
		return \count( $this->default_seo_data_collector->get_posts_with_default_seo_title() ) > 4;
	}

	/**
	 * Gets the name.
	 *
	 * @return string The name.
	 */
	public function get_name(): string {
		return self::NAME;
	}

	/**
	 * Gets the legacy key.
	 *
	 * @return string The legacy key.
	 */
	public function get_legacy_key(): string {
		return 'recentDefaultSeoTitles';
	}
}

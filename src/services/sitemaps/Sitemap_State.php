<?php

namespace Yoast\WP\SEO\Services\Sitemaps;

use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;

class Sitemap_State {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * The indexing helper.
	 *
	 * @var Indexing_Helper
	 */
	protected $indexing_helper;

	/**
	 * @param Options_Helper  $options         The options helper.
	 * @param Indexing_Helper $indexing_helper The indexing helper.
	 */
	public function __construct(
		Options_Helper $options,
		Indexing_Helper $indexing_helper
	) {
		$this->indexing_helper = $indexing_helper;
		$this->options_helper  = $options;
	}

	/**
	 * Checks if the sitemaps are enabled.
	 *
	 * @return bool Whether the sitemaps are enabled.
	 */
	public function is_enabled() {
		return (bool) $this->options_helper->get( 'enable_xml_sitemap' );
	}

	/**
	 * Checks if the sitemaps are complete and are presentable.
	 *
	 * @return bool Whether the sitemaps are complete and presentable.
	 */
	public function is_presentable() {
		return $this->is_enabled() && $this->indexing_helper->is_index_up_to_date( '2-2-3-3-3-3-3-2' );
	}
}

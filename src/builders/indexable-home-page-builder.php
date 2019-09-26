<?php
/**
 * Homepage Builder for the indexables.
 *
 * @package Yoast\YoastSEO\Builders
 */

namespace Yoast\WP\Free\Builders;

use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Helpers\Url_Helper;

/**
 * Formats the homepage meta to indexable format.
 */
class Indexable_Home_Page_Builder {

	/**
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * @var Url_Helper
	 */
	private $url_helper;

	/**
	 * Indexable_Home_Page_Builder constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 * @param Url_Helper     $url_helper     The url helper.
	 */
	public function __construct(
		Options_Helper $options_helper,
		Url_Helper $url_helper
	) {
		$this->options_helper = $options_helper;
		$this->url_helper     = $url_helper;
	}

	/**
	 * Formats the data.
	 *
	 * @param \Yoast\WP\Free\Models\Indexable $indexable The indexable to format.
	 *
	 * @return \Yoast\WP\Free\Models\Indexable The extended indexable.
	 */
	public function build( $indexable ) {
		$indexable->object_type      = 'home-page';
		$indexable->title            = $this->options_helper->get( 'title-home-wpseo' );
		$indexable->breadcrumb_title = $this->options_helper->get( 'breadcrumbs-home' );
		$indexable->permalink        = $this->url_helper->home();
		$indexable->canonical        = $indexable->permalink;
		$indexable->description      = $this->options_helper->get( 'metadesc-home-wpseo' );
		if ( empty( $indexable->description ) ) {
			$indexable->description = \get_bloginfo( 'description' );
		}

		$indexable->is_robots_noindex = \get_option( 'blog_public' ) === '0';

		$indexable->og_title       = $this->options_helper->get( 'og_frontpage_title' );
		$indexable->og_image       = $this->options_helper->get( 'og_frontpage_image' );
		$indexable->og_description = $this->options_helper->get( 'og_frontpage_desc' );

		return $indexable;
	}
}

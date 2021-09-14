<?php

namespace Yoast\WP\SEO\Builders;

use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Homepage Builder for the indexables.
 *
 * Formats the homepage meta to indexable format.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Indexable_Home_Page_Builder {

	use Indexable_Social_Image_Trait;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options;

	/**
	 * The URL helper.
	 *
	 * @var Url_Helper
	 */
	protected $url_helper;

	/**
	 * The latest version of the Indexable-Home-Page-Builder.
	 *
	 * @var int
	 */
	protected $version;

	/**
	 * Indexable_Home_Page_Builder constructor.
	 *
	 * @param Options_Helper             $options    The options helper.
	 * @param Url_Helper                 $url_helper The url helper.
	 * @param Indexable_Builder_Versions $versions   Knows the latest version of each Indexable type.
	 */
	public function __construct(
		Options_Helper $options,
		Url_Helper $url_helper,
		Indexable_Builder_Versions $versions
	) {
		$this->options    = $options;
		$this->url_helper = $url_helper;
		$this->version    = $versions->get_latest_version_for_type( 'home-page' );
	}

	/**
	 * Formats the data.
	 *
	 * @param Indexable $indexable The indexable to format.
	 *
	 * @return Indexable The extended indexable.
	 */
	public function build( $indexable ) {
		$indexable->object_type      = 'home-page';
		$indexable->title            = $this->options->get( 'title-home-wpseo' );
		$indexable->breadcrumb_title = $this->options->get( 'breadcrumbs-home' );
		$indexable->permalink        = $this->url_helper->get_url_path( $this->url_helper->home() );
		$indexable->blog_id          = \get_current_blog_id();
		$indexable->description      = $this->options->get( 'metadesc-home-wpseo' );
		if ( empty( $indexable->description ) ) {
			$indexable->description = \get_bloginfo( 'description' );
		}

		$indexable->is_robots_noindex = \get_option( 'blog_public' ) === '0';

		$indexable->open_graph_title       = $this->options->get( 'open_graph_frontpage_title' );
		$indexable->open_graph_image       = $this->options->get( 'open_graph_frontpage_image' );
		$indexable->open_graph_image_id    = $this->options->get( 'open_graph_frontpage_image_id' );
		$indexable->open_graph_description = $this->options->get( 'open_graph_frontpage_desc' );

		// Reset the OG image source & meta.
		$indexable->open_graph_image_source = null;
		$indexable->open_graph_image_meta   = null;

		// When the image or image id is set.
		if ( $indexable->open_graph_image || $indexable->open_graph_image_id ) {
			$indexable->open_graph_image_source = 'set-by-user';

			$this->set_open_graph_image_meta_data( $indexable );
		}

		$indexable->version = $this->version;

		return $indexable;
	}
}

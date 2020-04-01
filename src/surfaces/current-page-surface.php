<?php
/**
 * Surface for the indexables.
 *
 * @package Yoast\YoastSEO\Surfaces
 */

namespace Yoast\WP\SEO\Surfaces;

use Yoast\WP\SEO\Memoizer\Meta_Tags_Context_Memoizer;

/**
 * Class Current_Page_Surface
 *
 * @property string      $canonical
 * @property string      $description
 * @property string      $title
 * @property string      $id
 * @property string      $site_name
 * @property string      $wordpress_site_name
 * @property string      $site_url
 * @property string      $company_name
 * @property int         $company_logo_id
 * @property int         $site_user_id
 * @property string      $site_represents
 * @property array|false $site_represents_reference
 * @property bool        $breadcrumbs_enabled
 * @property string      $schema_page_type
 * @property string      $main_schema_id
 * @property string      $page_type
 * @property string      $meta_description
 * @property array       $robots
 * @property array       $googlebot
 * @property string      $rel_next
 * @property string      $rel_prev
 * @property bool        $open_graph_enabled
 * @property string      $open_graph_publisher
 * @property string      $open_graph_type
 * @property string      $open_graph_title
 * @property string      $open_graph_description
 * @property array       $open_graph_images
 * @property string      $open_graph_url
 * @property string      $open_graph_site_name
 * @property string      $open_graph_article_publisher
 * @property string      $open_graph_article_author
 * @property string      $open_graph_article_published_time
 * @property string      $open_graph_article_modified_time
 * @property string      $open_graph_locale
 * @property string      $open_graph_fb_app_id
 * @property array       $schema
 * @property string      $twitter_card
 * @property string      $twitter_title
 * @property string      $twitter_description
 * @property string      $twitter_image
 * @property string      $twitter_creator
 * @property string      $twitter_site
 * @property array       $source
 * @property array       $breadcrumbs
 */
class Current_Page_Surface {

	/**
	 * The memoizer for the meta tags context.
	 *
	 * @var Meta_Tags_Context_Memoizer;
	 */
	private $meta_tags_context_memoizer;

	/**
	 * Current_Page_Surface constructor.
	 *
	 * @param Meta_Tags_Context_Memoizer $meta_tags_context_memoizer The meta tags context memoizer.
	 */
	public function __construct( Meta_Tags_Context_Memoizer $meta_tags_context_memoizer ) {
		$this->meta_tags_context_memoizer = $meta_tags_context_memoizer;
	}

	/**
	 * Magic getter to retrieve variables from either meta tags context or presentation.
	 *
	 * @param string $key The variable to retrieve.
	 *
	 * @return mixed|null
	 */
	public function __get( $key ) {
		$meta_tags_context = $this->meta_tags_context_memoizer->for_current_page();

		if ( isset( $meta_tags_context->$key ) ) {
			return $meta_tags_context->$key;
		}

		if ( isset( $meta_tags_context->presentation->$key ) ) {
			return $meta_tags_context->presentation->$key;
		}

		return null;
	}

	/**
	 * Returns the presentation of the current page.
	 *
	 * @return \Yoast\WP\SEO\Presentations\Indexable_Presentation The presentation.
	 */
	public function get_presentation() {
		$meta_tags_context = $this->meta_tags_context_memoizer->for_current_page();

		return $meta_tags_context->presentation;
	}
}

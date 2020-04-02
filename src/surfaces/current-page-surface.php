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
 * @property array       $breadcrumbs                       The breadcrumbs array for the current page.
 * @property bool        $breadcrumbs_enabled               Whether breadcrumbs are enabled or not.
 * @property string      $canonical                         The canonical URL for the current page.
 * @property string      $company_name                      The company name from the Knowledge graph settings.
 * @property int         $company_logo_id                   The attachment ID for the company logo.
 * @property string      $description                       The meta description for the current page, if set.
 * @property array       $googlebot                         The meta robots values we specifically output for Googlebot on this page.
 * @property string      $main_schema_id                    Schema ID that points to the main Schema thing on the page, usually the webpage or article Schema piece.
 * @property string      $meta_description                  The meta description for the current page, if set.
 * @property string      $open_graph_article_author         The article:author value.
 * @property string      $open_graph_article_modified_time  The article:modified_time value.
 * @property string      $open_graph_article_published_time The article:published_time value.
 * @property string      $open_graph_article_publisher      The article:publisher value.
 * @property string      $open_graph_description            The og:description.
 * @property bool        $open_graph_enabled                Whether OpenGraph is enabled on this site.
 * @property string      $open_graph_fb_app_id              The Facebook App ID.
 * @property array       $open_graph_images                 The array of images we have for this page.
 * @property string      $open_graph_locale                 The og:locale for the current page.
 * @property string      $open_graph_publisher              The OpenGraph publisher reference.
 * @property string      $open_graph_site_name              The og:site_name.
 * @property string      $open_graph_title                  The og:title.
 * @property string      $open_graph_type                   The og:type.
 * @property string      $open_graph_url                    The og:url.
 * @property string      $page_type                         The Schema page type.
 * @property array       $robots                            An array of the robots values set for the current page.
 * @property string      $rel_next                          The next page in the series, if any.
 * @property string      $rel_prev                          The previous page in the series, if any.
 * @property array       $schema                            The entire Schema array for the current page.
 * @property string      $schema_page_type                  The Schema page type.
 * @property string      $site_name                         The site name from the Yoast SEO settings.
 * @property string      $site_represents                   Whether the site represents a 'person' or a 'company'.
 * @property array|false $site_represents_reference         The schema reference ID for what this site represents.
 * @property string      $site_url                          The site's main URL.
 * @property int         $site_user_id                      If the site represents a 'person', this is the ID of the accompanying user profile.
 * @property string      $title                             The SEO title for the current page.
 * @property string      $twitter_card                      The Twitter card type for the current page.
 * @property string      $twitter_creator                   The Twitter card author for the current page.
 * @property string      $twitter_description               The Twitter card description for the current page.
 * @property string      $twitter_image                     The Twitter card image for the current page.
 * @property string      $twitter_site                      The Twitter card site reference for the current page.
 * @property string      $twitter_title                     The Twitter card title for the current page.
 * @property string      $wordpress_site_name               The site name from the WordPress settings.
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

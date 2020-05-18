<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * This code adds the OpenGraph output.
 *
 * @deprecated 14.0
 */
class WPSEO_OpenGraph {

	/* ********************* DEPRECATED METHODS ********************* */

	/**
	 * Class constructor.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );
	}

	/**
	 * Main OpenGraph output.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 */
	public function opengraph() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );
	}

	/**
	 * Internal function to output FB tags. This also adds an output filter to each bit of output based on the property.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @param string $property Property attribute value.
	 * @param string $content  Content attribute value.
	 *
	 * @return boolean
	 */
	public function og_tag( $property, $content ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		/**
		 * Filter: 'wpseo_og_' . $og_property - Allow developers to change the content of specific OG meta tags.
		 *
		 * @deprecated 14.0
		 *
		 * @api string $content The content of the property.
		 */
		$content = apply_filters_deprecated( 'wpseo_og_' . $og_property, $content, 'WPSEO 14.0' );

		return true;
	}

	/**
	 * Outputs the site owner.
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @return void
	 *
	 * @deprecated 7.1
	 * @codeCoverageIgnore
	 */
	public function site_owner() {
		// As this is a frontend method, we want to make sure it is not displayed for non-logged in users.
		if ( function_exists( 'wp_get_current_user' ) && current_user_can( 'manage_options' ) ) {
			_deprecated_function( __METHOD__, '7.1', null );
		}
	}

	/**
	 * Fallback method for plugins using image_output.
	 *
	 * @param string|bool $image Image URL.
	 *
	 * @deprecated 7.4
	 * @codeCoverageIgnore
	 */
	public function image_output( $image = false ) {
		_deprecated_function( __METHOD__, '7.4', 'WPSEO_OpenGraph::image' );
	}

	/**
	 * Outputs the canonical URL as OpenGraph URL, which consolidates likes and shares.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @return boolean
	 */
	public function url() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return false;
	}

	/**
	 * Outputs the SEO title as OpenGraph title.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @param bool $echo Whether or not to echo the output.
	 *
	 * @return string|boolean
	 */
	public function og_title( $echo = true ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return false;
	}

	/**
	 * Outputs the OpenGraph description, specific OG description first, if not, grabs the meta description.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @param bool $echo Whether to echo or return the description.
	 *
	 * @return string $ogdesc
	 */
	public function description( $echo = true ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return '';
	}

	/**
	 * Outputs the author's FB page.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @link https://developers.facebook.com/blog/post/2013/06/19/platform-updates--new-open-graph-tags-for-media-publishers-and-more/
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @return boolean
	 */
	public function article_author_facebook() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return false;
	}

	/**
	 * Outputs the website's FB page.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @link https://developers.facebook.com/blog/post/2013/06/19/platform-updates--new-open-graph-tags-for-media-publishers-and-more/
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @return boolean
	 */
	public function website_facebook() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return false;
	}

	/**
	 * Outputs the OpenGraph type.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @param boolean $echo Whether to echo or return the type.
	 *
	 * @return string $type
	 */
	public function type( $echo = true ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return '';
	}

	/**
	 * Outputs the locale, doing some conversions to make sure the proper Facebook locale is output.
	 *
	 * Last update/compare with FB list done on 2015-03-16 by Rarst.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @link http://www.facebook.com/translations/FacebookLocales.xml for the list of supported locales.
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @param bool $echo Whether to echo or return the locale.
	 *
	 * @return string $locale
	 */
	public function locale( $echo = true ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return '';
	}

	/**
	 * Filters the Facebook plugins metadata.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @param array $meta_tags The array to fix.
	 *
	 * @return array $meta_tags
	 */
	public function facebook_filter( $meta_tags ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return [];
	}

	/**
	 * Outputs the site name straight from the blog info.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function site_name() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );
	}

	/**
	 * Outputs the article publish and last modification date.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @return boolean;
	 */
	public function publish_date() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return true;
	}

	/**
	 * Creates new WPSEO_OpenGraph_Image class and get the images to set the og:image.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @param string|bool $image Optional. Image URL.
	 *
	 * @return void
	 */
	public function image( $image = false ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );
	}

	/**
	 * Outputs the Facebook app_id.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function app_id() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );
	}

	/**
	 * Outputs the article tags as article:tag tags.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @return boolean
	 */
	public function tags() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return false;
	}

	/**
	 * Outputs the article category as an article:section tag.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @return boolean;
	 */
	public function category() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return false;
	}
}

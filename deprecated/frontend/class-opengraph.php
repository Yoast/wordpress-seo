<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * This code adds the OpenGraph output.
 *
 * @deprecated xx.x
 */
class WPSEO_OpenGraph {

	/* ********************* DEPRECATED METHODS ********************* */

	/**
	 * Class constructor.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}

	/**
	 * Main OpenGraph output.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 */
	public function opengraph() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		/**
		 * Action: 'wpseo_opengraph' - Hook to add all Facebook OpenGraph output to so they're close together.
		 *
		 * @deprecated xx.x
		 */
		do_action_deprecated( 'wpseo_opengraph', 'WPSEO xx.x');
	}

	/**
	 * Internal function to output FB tags. This also adds an output filter to each bit of output based on the property.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @param string $property Property attribute value.
	 * @param string $content  Content attribute value.
	 *
	 * @return boolean
	 */
	public function og_tag( $property, $content ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		/**
		 * Filter: 'wpseo_og_' . $og_property - Allow developers to change the content of specific OG meta tags.
		 *
		 * @deprecated xx.x
		 *
		 * @api string $content The content of the property.
		 */
		$content = apply_filters_deprecated( 'wpseo_og_' . $og_property, $content, 'WPSEO xx.x');

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
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @return boolean
	 */
	public function url() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return false;
	}

	/**
	 * Outputs the SEO title as OpenGraph title.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @param bool $echo Whether or not to echo the output.
	 *
	 * @return string|boolean
	 */
	public function og_title( $echo = true ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return false;
	}

	/**
	 * Outputs the OpenGraph description, specific OG description first, if not, grabs the meta description.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @param bool $echo Whether to echo or return the description.
	 *
	 * @return string $ogdesc
	 */
	public function description( $echo = true ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return '';
	}

	/**
	 * Outputs the author's FB page.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @link https://developers.facebook.com/blog/post/2013/06/19/platform-updates--new-open-graph-tags-for-media-publishers-and-more/
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @return boolean
	 */
	public function article_author_facebook() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return false;
	}

	/**
	 * Outputs the website's FB page.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @link https://developers.facebook.com/blog/post/2013/06/19/platform-updates--new-open-graph-tags-for-media-publishers-and-more/
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @return boolean
	 */
	public function website_facebook() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return false;
	}

	/**
	 * Outputs the OpenGraph type.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @param boolean $echo Whether to echo or return the type.
	 *
	 * @return string $type
	 */
	public function type( $echo = true ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return '';
	}

	/**
	 * Outputs the locale, doing some conversions to make sure the proper Facebook locale is output.
	 *
	 * Last update/compare with FB list done on 2015-03-16 by Rarst.
	 *
	 * @deprecated xx.x
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
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return '';
	}

	/**
	 * Filters the Facebook plugins metadata.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @param array $meta_tags The array to fix.
	 *
	 * @return array $meta_tags
	 */
	public function facebook_filter( $meta_tags ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return array();
	}

	/**
	 * Outputs the site name straight from the blog info.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function site_name() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}

	/**
	 * Outputs the article publish and last modification date.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @return boolean;
	 */
	public function publish_date() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return true;
	}

	/**
	 * Creates new WPSEO_OpenGraph_Image class and get the images to set the og:image.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore

	 * @param string|bool $image Optional. Image URL.
	 *
	 * @return void
	 */
	public function image( $image = false ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}

	/**
	 * Outputs the Facebook app_id.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function app_id() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}

	/**
	 * Outputs the article tags as article:tag tags.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @return boolean
	 */
	public function tags() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return false;
	}

	/**
	 * Outputs the article category as an article:section tag.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 *
	 * @link https://developers.facebook.com/docs/reference/opengraph/object-type/article/
	 *
	 * @return boolean;
	 */
	public function category() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return false;
	}
} /* End of class */

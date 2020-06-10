<?php
/**
 * A helper object for meta.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\SEO\Helpers;

use WPSEO_Meta;

/**
 * Class Meta_Helper
 */
class Meta_Helper {

	/**
	 * Get a custom post meta value.
	 *
	 * Returns the default value if the meta value has not been set.
	 *
	 * {@internal Unfortunately there isn't a filter available to hook into before returning
	 *            the results for get_post_meta(), get_post_custom() and the likes. That
	 *            would have been the preferred solution.}}
	 *
	 * @param string $key    Internal key of the value to get (without prefix).
	 * @param int    $postid Post ID of the post to get the value for.
	 *
	 * @codeCoverageIgnore We have to write test when this method contains own code.
	 *
	 * @return string All 'normal' values returned from get_post_meta() are strings.
	 *                Objects and arrays are possible, but not used by this plugin
	 *                and therefore discarted (except when the special 'serialized' field def
	 *                value is set to true - only used by add-on plugins for now).
	 *                Will return the default value if no value was found.
	 *                Will return empty string if no default was found (not one of our keys) or
	 *                if the post does not exist.
	 */
	public function get_value( $key, $postid = 0 ) {
		return WPSEO_Meta::get_value( $key, $postid );
	}
}

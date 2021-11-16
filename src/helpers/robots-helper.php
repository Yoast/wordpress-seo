<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for the robots meta tag.
 */
class Robots_Helper {

	/**
	 * A helper to get and set plugin options.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Robots_Helper constructor.
	 *
	 * @param Options_Helper $options_helper A helper to get and set plugin options.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Sets the robots index to noindex.
	 *
	 * @param array $robots The current robots value.
	 *
	 * @return array The altered robots string.
	 */
	public function set_robots_no_index( $robots ) {
		if ( ! \is_array( $robots ) ) {
			\_deprecated_argument( __METHOD__, '14.1', '$robots has to be a key-value paired array.' );
			return $robots;
		}

		$robots['index'] = 'noindex';

		return $robots;
	}

	/**
	 * Gets the site default noindex value for an object type.
	 *
	 * @param string $object_type The object type.
	 * @param string $object_sub_type The object subtype. Used for post_types.
	 *
	 * @return bool Whether the site default is set to noindex for the requested object type.
	 */
	public function get_default_noindex_for_object( $object_type, $object_sub_type = '' ) {
		switch ( $object_type ) {
			case 'post':
				return (bool) $this->options_helper->get( 'noindex-' . $object_sub_type );
			case 'user':
				return (bool) $this->options_helper->get( 'noindex-author-wpseo' );
			case 'term':
				return (bool) $this->options_helper->get( 'noindex-tax-' . $object_sub_type );
			default:
				return false;
		}
	}
}

<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for the indexable page.
 *
 * @deprecated 20.4
 * @codeCoverageIgnore
 */
class Indexables_Page_Helper {

	/**
	 * The default size of the indexable lists.
	 *
	 * @var int
	 */
	const LIST_SIZE = 5;

	/**
	 * The default size of the buffer, in terms of how many times is bigger than the list size.
	 *
	 * @var int
	 */
	const BUFFER_SIZE = 20;

	/**
	 * The default minimum threshold for the amount of posts in the site.
	 *
	 * @var int
	 */
	const POSTS_THRESHOLD = 20;

	/**
	 * The default minimum threshold for the amount of analysed posts in the site, as a fraction of the total posts.
	 *
	 * @var float
	 */
	const ANALYSED_POSTS_THRESHOLD = 0.5;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Indexables_Page_Helper constructor.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @param Options_Helper $options The options helper.
	 */
	public function __construct( Options_Helper $options ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		$this->options = $options;
	}

	/**
	 * Retrieves the size of the Indexables lists. This size is the amount of indexables that are displayed in each list.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @return int The size of the Indexables lists.
	 */
	public function get_indexables_list_size() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		/**
		 * Filter 'wpseo_indexables_list_size' - Allow filtering the size of the Indexables lists.
		 *
		 * @api int The size of the Indexables lists.
		 */
		return \apply_filters_deprecated( 'wpseo_indexables_list_size', [ self::LIST_SIZE ], 'Yoast SEO 20.4' );
	}

	/**
	 * Retrieves the size of the buffer for the Indexables lists, in terms of how many times bigger it is from the lists' size. This size is the amount of indexables that are fetched upon page load.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @return int The size of the Indexables lists.
	 */
	public function get_buffer_size() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		/**
		 * Filter 'wpseo_indexables_buffer_size' - Allow filtering the size of the buffer for the Indexables lists, in terms of how many times bigger it is from the lists' size.
		 *
		 * @api int The size of the buffer for the Indexables lists, in terms of how many times bigger it is from the lists' size.
		 */
		$times = \apply_filters_deprecated( 'wpseo_indexables_buffer_size', [ self::BUFFER_SIZE ], 'Yoast SEO 20.4' );
		if ( $times < 3 ) {
			$times = 3;
		}

		return ( $this->get_indexables_list_size() * \intval( $times ) );
	}

	/**
	 * Retrieves the minimum threshold for the amount of posts in the site, in order for lists to be relevant.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @return int The size of the Indexables lists.
	 */
	public function get_minimum_posts_threshold() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		/**
		 * Filter 'wpseo_posts_threshold' - Allow filtering the minimum threshold for the amount of posts in the site, in order for Indexable lists to be relevant.
		 *
		 * @api int The minimum threshold for the amount of posts in the site, in order for Indexable lists to be relevant.
		 */
		return \apply_filters_deprecated( 'wpseo_posts_threshold', [ self::POSTS_THRESHOLD ], 'Yoast SEO 20.4' );
	}

	/**
	 * Retrieves the minimum threshold for the amount of analyzed posts in the site, in order for lists to be relevant.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @return int The size of the Indexables lists.
	 */
	public function get_minimum_analyzed_posts_threshold() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		/**
		 * Filter 'wpseo_analyzed_posts_threshold' - Allow filtering the minimum threshold for the amount of analyzed posts in the site, in order for Indexable lists to be relevant.
		 *
		 * @api int The minimum threshold for the amount of analyzed posts in the site, in order for Indexable lists to be relevant.
		 */
		return \apply_filters_deprecated( 'wpseo_analyzed_posts_threshold', [ self::ANALYSED_POSTS_THRESHOLD ], 'Yoast SEO 20.4' );
	}

	/**
	 * Checks if link suggestions are enabled or not
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @return bool Wether enable_link_suggestions is set to true or not.
	 */
	public function get_link_suggestions_enabled() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		return $this->options->get( 'enable_link_suggestions', false ) === true;
	}

	/**
	 * Returns the list names that are valid.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @return array An array with valid list names.
	 */
	public function get_list_names() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		$valid_list_names = [
			'least_readability',
			'least_seo_score',
			'most_linked',
			'least_linked',
		];

		return $valid_list_names;
	}

	/**
	 * Returns the ignore list names that are valid.
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @return array An array with valid ignore list names.
	 */
	public function get_ignore_list_names() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		$valid_list_names        = $this->get_list_names();
		$valid_ignore_list_names = [];
		foreach ( $valid_list_names as $valid_list_name ) {
			$valid_ignore_list_names[] = $valid_list_name . '_ignore_list';
		}

		return $valid_ignore_list_names;
	}

	/**
	 * Checks if the ignore list name is a valid list name
	 *
	 * @deprecated 20.4
	 * @codeCoverageIgnore
	 *
	 * @param string $list_name The list name.
	 *
	 * @return bool Wether the list name is valid or not.
	 */
	public function is_valid_ignore_list_name( $list_name ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.4' );

		$valid_list_names = $this->get_ignore_list_names();

		return \in_array( $list_name, $valid_list_names, true );
	}
}

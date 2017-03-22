<?php
/**
 * @package WPSEO\Premium
 */

/**
 * Represents the unindexed posts.
 */
class WPSEO_Premium_Prominent_Words_Unindexed_Post_Query {

	/**
	 * Returns the total amount of posts.
	 *
	 * @param string $post_type The posttype to limit the resultset for.
	 * @param int    $limit     The offset for the query.
	 *
	 * @return int The total posts.
	 */
	public function get_query( $post_type, $limit = 10 ) {
		global $wpdb;

		// @codingStandardsIgnoreStart
		return $wpdb->get_var( "
			SELECT COUNT( ID ) 
			FROM   wp_posts 
			WHERE  ID NOT IN( 
				SELECT post_id FROM wp_postmeta WHERE meta_key = 'yst_prominent_words_version' && meta_value = '1' 
			) && post_status IN( 'future, draft, pending, private, publish' ) && post_type = '" . $post_type . "'
			LIMIT " . $limit . '
		' );
		// @codingStandardsIgnoreEnd
	}
}

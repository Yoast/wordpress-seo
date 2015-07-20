<?php
/**
 * @package WPSEO\Internals
 */

/**
 * Class that generates interesting statistics about things
 */
class WPSEO_Statistics {

	/**
	 * Returns the amount of posts that have no focus keyword
	 *
	 * @return int
	 */
	public function get_no_focus_post_count() {
		return $this->get_post_count( WPSEO_Rank::NO_FOCUS );
	}

	/**
	 * Returns the amount of posts that have a bad SEO ranking
	 *
	 * @return int
	 */
	public function get_bad_seo_post_count() {
		return $this->get_post_count( WPSEO_Rank::BAD );
	}

	/**
	 * Returns the amount of posts that have a poor SEO ranking
	 *
	 * @return int
	 */
	public function get_poor_seo_post_count() {
		return $this->get_post_count( WPSEO_Rank::POOR );
	}

	/**
	 * Returns the amount of posts that have an ok SEO ranking
	 *
	 * @return int
	 */
	public function get_ok_seo_post_count() {
		return $this->get_post_count( WPSEO_Rank::OK );
	}

	/**
	 * Returns the amount of posts that have a good SEO ranking
	 *
	 * @return int
	 */
	public function get_good_seo_post_count() {
		return $this->get_post_count( WPSEO_Rank::GOOD );
	}

	/**
	 * Returns the amount of posts that have no SEO ranking
	 *
	 * @return int
	 */
	public function get_no_index_post_count() {
		return $this->get_post_count( WPSEO_Rank::NO_INDEX );
	}

	/**
	 * Returns the post count for a certain SEO ranking
	 *
	 * @todo Merge/DRY this with the logic virtually the same in WPSEO_Metabox::column_sort_orderby()
	 *
	 * @param string $seo_ranking The SEO ranking to get the post count for.
	 *     Possible values: no_seo, bad, poor, ok, good, no_focus.
	 *
	 * @return int
	 */
	private function get_post_count( $seo_ranking ) {

		if ( WPSEO_Rank::NO_FOCUS === $seo_ranking ) {
			$posts = array(
				'meta_query' => array(
					'relation' => 'OR',
					array(
						'key'     => WPSEO_Meta::$meta_prefix . 'linkdex',
						'value'   => 'needs-a-value-anyway',
						'compare' => 'NOT EXISTS',
					)
				),
			);
		}
		elseif ( WPSEO_Rank::NO_INDEX === $seo_ranking ) {
			$posts = array(
				'meta_key'   => WPSEO_Meta::$meta_prefix . 'meta-robots-noindex',
				'meta_value' => '1',
				'compare'    => '=',
			);
		}
		else {
			$start = WPSEO_Rank::$range[ $seo_ranking ]['start'];
			$end   = WPSEO_Rank::$range[ $seo_ranking ]['end'];

			$posts = array(
				'meta_key'     => WPSEO_Meta::$meta_prefix . 'linkdex',
				'meta_value'   => array( $start, $end ),
				'meta_compare' => 'BETWEEN',
				'meta_type'    => 'NUMERIC',
			);
		}

		$posts['fields']      = 'ids';
		$posts['post_status'] = 'publish';
		$posts = new WP_Query( $posts );

		return $posts->found_posts;
	}

}

<?php
/**
 * Post Formatter for the indexables.
 *
 * @package Yoast\YoastSEO\Formatters
 */

namespace Yoast\YoastSEO\Formatters;

/**
 * Formats the term meta to indexable format.
 */
class Indexable_Term {

	/**
	 * The current term id.
	 *
	 * @var int
	 */
	protected $term_id;

	/**
	 * The taxonomy the term belongs to.
	 *
	 * @var string
	 */
	protected $taxonomy;

	/**
	 * Term constructor.
	 *
	 * @param int    $term_id  ID of the term to save data for.
	 * @param string $taxonomy The taxonomy the term belongs to.
	 */
	public function __construct( $term_id, $taxonomy ) {
		$this->term_id  = $term_id;
		$this->taxonomy = $taxonomy;
	}

	/**
	 * Formats the data.
	 *
	 * @return array The formatted data.
	 */
	public function format() {
		$term_meta = $this->get_meta_data();
		$formatted = array();

		$formatted['primary_focus_keyword_score'] = $this->get_keyword_score(
			$term_meta['wpseo_focuskw'],
			$term_meta['wpseo_linkdex']
		);

		$formatted['is_robots_noindex']  = $this->get_noindex_value( $term_meta['wpseo_noindex'] );

		foreach ( $this->get_meta_lookup() as $meta_key => $indexable_key ) {
			$formatted[ $indexable_key ] = $term_meta[ $meta_key ];
		}

		// Not implemented yet.
		$formatted['is_cornerstone']     = 0;
		$formatted['is_robots_nofollow'] = 0;

		return $formatted;
	}

	/**
	 * Converts the meta noindex value to the indexable value.
	 *
	 * @param string $meta_value Term meta to base the value on.
	 *
	 * @return bool|null
	 */
	protected function get_noindex_value( $meta_value ) {
		switch ( (string) $meta_value ) {
			case 'noindex':
				return true;
			case 'index':
				return false;
		}

		return null;
	}

	/**
	 * Determines the focus keyword score.
	 *
	 * @param string $keyword The focus keyword that is set.
	 * @param int    $score   The score saved on the meta data.
	 *
	 * @return null|int Score to use.
	 */
	protected function get_keyword_score( $keyword, $score ) {
		if ( empty( $keyword ) ) {
			return null;
		}

		return $score;
	}

	/**
	 * Retrieves the lookup table.
	 *
	 * @return array Lookup table for the meta fields.
	 */
	protected function get_meta_lookup() {
		return array(
			'wpseo_canonical'             => 'canonical',
			'wpseo_focuskw'               => 'primary_focus_keyword',
			'wpseo_title'                 => 'title',
			'wpseo_desc'                  => 'description',
			'wpseo_content_score'         => 'readability_score',
			'wpseo_bctitle'               => 'breadcrumb_title',
			'wpseo_opengraph-title'       => 'og_title',
			'wpseo_opengraph-description' => 'og_description',
			'wpseo_opengraph-image'       => 'og_image',
			'wpseo_twitter-title'         => 'twitter_title',
			'wpseo_twitter-description'   => 'twitter_description',
			'wpseo_twitter-image'         => 'twitter_image',
		);
	}

	/**
	 * Retrieves the meta data for a term.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool|array The meta data for the term.
	 */
	protected function get_meta_data() {
		return \WPSEO_Taxonomy_Meta::get_term_meta( $this->term_id, $this->taxonomy );
	}
}

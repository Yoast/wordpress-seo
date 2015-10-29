<?php
/**
 * @package WPSEO\Internals
 */

/**
 * Holder for SEO Rank information
 */
class WPSEO_Rank {

	const BAD      = 1;
	const POOR     = 2;
	const OK       = 3;
	const GOOD     = 4;
	const NO_FOCUS = 5;
	const NO_INDEX = 6;

	/**
	 * @var array All possible ranks.
	 */
	protected static $ranks = array(
		self::BAD,
		self::POOR,
		self::OK,
		self::GOOD,
		self::NO_FOCUS,
		self::NO_INDEX,
	);

	/**
	 * Holds the translation from seo score slug to actual score range
	 *
	 * @var array
	 */
	protected static $ranges = array(
		self::NO_FOCUS => array(
			'start' => 0,
			'end'   => 0,
		),
		self::BAD  => array(
			'start' => 1,
			'end'   => 34,
		),
		self::POOR => array(
			'start' => 35,
			'end'   => 54,
		),
		self::OK => array(
			'start' => 55,
			'end'   => 74,
		),
		self::GOOD => array(
			'start' => 75,
			'end' => 100,
		),
	);

	/**
	 * @var int
	 */
	protected $rank;

	/**
	 * @param int $rank The actual rank.
	 */
	public function __construct( $rank ) {
		if ( ! in_array( $rank, self::$ranks ) ) {
			$rank = self::BAD;
		}

		$this->rank = $rank;
	}

	/**
	 * Returns the saved rank for this rank.
	 *
	 * @return int
	 */
	public function get_rank() {
		return $this->rank;
	}

	/**
	 * Returns a CSS class for this rank
	 *
	 * @return string
	 */
	public function get_css_class() {
		$labels = array(
			self::NO_FOCUS => 'na',
			self::NO_INDEX => 'noindex',
			self::BAD      => 'bad',
			self::POOR     => 'poor',
			self::OK       => 'ok',
			self::GOOD     => 'good',
		);

		return $labels[ $this->rank ];
	}

	/**
	 * Returns a label for this rank
	 *
	 * @return string
	 */
	public function get_label() {
		$labels = array(
			self::NO_FOCUS => __( 'N/A', 'wordpress-seo' ),
			self::NO_INDEX => __( 'No index', 'wordpress-seo' ),
			self::BAD      => __( 'Bad', 'wordpress-seo' ),
			self::POOR     => __( 'Poor', 'wordpress-seo' ),
			self::OK       => __( 'OK', 'wordpress-seo' ),
			self::GOOD     => __( 'Good', 'wordpress-seo' ),
		);

		return $labels[ $this->rank ];
	}

	/**
	 * Returns a label for use in a drop down
	 *
	 * @return mixed
	 */
	public function get_drop_down_label() {
		$labels = array(
			self::NO_FOCUS => __( 'SEO: No Focus Keyword', 'wordpress-seo' ),
			self::BAD      => __( 'SEO: Bad', 'wordpress-seo' ),
			self::POOR     => __( 'SEO: Poor', 'wordpress-seo' ),
			self::OK       => __( 'SEO: OK', 'wordpress-seo' ),
			self::GOOD     => __( 'SEO: Good', 'wordpress-seo' ),
			self::NO_INDEX => __( 'SEO: Post Noindexed', 'wordpress-seo' ),
		);

		return $labels[ $this->rank ];
	}

	/**
	 * @return int The starting score for this rank.
	 */
	public function get_starting_score() {
		// No index does not have a starting score.
		if ( self::NO_INDEX === $this->rank ) {
			return -1;
		}

		return self::$ranges[ $this->rank ]['start'];
	}

	/**
	 * @return int The end score for this rank.
	 */
	public function get_end_score() {
		// No index does not have an end score.
		if ( self::NO_INDEX === $this->rank ) {
			return -1;
		}

		return self::$ranges[ $this->rank ]['end'];
	}

	/**
	 * Returns a rank for a specific numeric score
	 *
	 * @param int $score The score to determine a rank for.
	 *
	 * @return self
	 */
	public static function from_numeric_score( $score ) {
		// Set up the default value.
		$rank = new self( self::BAD );

		foreach ( self::$ranges as $rank_index => $range ) {
			if ( $range['start'] <= $score && $score <= $range['end'] ) {
				$rank = new self( $rank_index );
				break;
			}
		}

		return $rank;
	}

	/**
	 * Returns a list of all possible SEO Ranks
	 *
	 * @return WPSEO_Rank[]
	 */
	public static function get_all_ranks() {
		return array_map( array( 'WPSEO_Rank', 'create_rank' ), self::$ranks );
	}

	/**
	 * Converts a numeric rank into a WPSEO_Rank object, for use in functional array_* functions
	 *
	 * @param int $rank SEO Rank.
	 *
	 * @return WPSEO_Rank
	 */
	private static function create_rank( $rank ) {
		return new self( $rank );
	}
}

<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Domain\Search_Rankings;

use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Interface;

/**
 * Domain object that represents a single Search Data record.
 */
class Search_Data implements Data_Interface {

	/**
	 * The amount of clicks a `key` gets.
	 *
	 * @var int $clicks
	 */
	private $clicks;

	/**
	 * The click-through rate a `key` gets.
	 *
	 * @var float $clicks
	 */
	private $ctr;

	/**
	 * The amount of impressions a `key` gets.
	 *
	 * @var int $impressions
	 */
	private $impressions;

	/**
	 * The average position for the given `key`.
	 *
	 * @var float $position
	 */
	private $position;

	/**
	 * In the context of this domain object subject can represent a `URI` or a `search term`
	 *
	 * @var string
	 */
	private $subject;

	/**
	 * The seo score.
	 *
	 * @var int
	 */
	private $seo_score;

	/**
	 * The constructor.
	 *
	 * @param int    $clicks      The clicks.
	 * @param float  $ctr         The ctr.
	 * @param int    $impressions The impressions.
	 * @param float  $position    The position.
	 * @param string $subject     The subject of the data.
	 */
	public function __construct( int $clicks, float $ctr, int $impressions, float $position, string $subject ) {
		$this->clicks      = $clicks;
		$this->ctr         = $ctr;
		$this->impressions = $impressions;
		$this->position    = $position;
		$this->subject     = $subject;
		$this->seo_score   = 0;
	}

	/**
	 * The array representation of this domain object.
	 *
	 * @return array<string|float|int|string[]>
	 */
	public function to_array(): array {
		return [
			'clicks'      => $this->clicks,
			'ctr'         => $this->ctr,
			'impressions' => $this->impressions,
			'position'    => $this->position,
			'subject'     => $this->subject,
			'seoScore'    => $this->seo_score,
		];
	}
}

<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles;

use Yoast\WP\SEO\Conditionals\Gradual_Rollout_Conditional;

/**
 * Test double exposing the abstract Gradual_Rollout_Conditional with a configurable
 * feature flag name and rollout share.
 */
final class Gradual_Rollout_Conditional_Double extends Gradual_Rollout_Conditional {

	/**
	 * The feature flag name.
	 *
	 * @var string
	 */
	private $feature_flag;

	/**
	 * The rollout share in per-mille.
	 *
	 * @var int
	 */
	private $rollout_share;

	/**
	 * Constructor.
	 *
	 * @param string $feature_flag  The feature flag name.
	 * @param int    $rollout_share The rollout share in per-mille.
	 */
	public function __construct( string $feature_flag, int $rollout_share ) {
		$this->feature_flag  = $feature_flag;
		$this->rollout_share = $rollout_share;
	}

	/**
	 * Returns the feature flag name.
	 *
	 * @return string The feature flag name.
	 */
	protected function get_feature_flag() {
		return $this->feature_flag;
	}

	/**
	 * Returns the rollout share in per-mille.
	 *
	 * @return int The rollout share.
	 */
	protected function get_rollout_share(): int {
		return $this->rollout_share;
	}
}

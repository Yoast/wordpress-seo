<?php

namespace Yoast\WP\SEO\Conditionals;

/**
 * Feature-flag conditional whose default state is a gradual, deterministic rollout
 * across a share of sites.
 *
 * The `YOAST_SEO_<FEATURE>` constant remains an explicit override: when it is defined
 * in wp-config.php it wins outright (`true` forces the feature on, `false` forces it off),
 * exactly like a plain {@see Feature_Flag_Conditional}. This is the per-site testing lever.
 *
 * When the constant is *not* defined, the feature falls back to the gradual-rollout
 * heuristic: it is enabled for a slowly widening share of sites. A site's bucket is derived
 * from a stable hash of the feature name plus the site URL, so the same site stays in (or out
 * of) the rollout consistently across plugin releases.
 *
 * The share is expressed in per-mille (0-1000), not percent, because at the install base this
 * rides on (10M+ sites) a single percent is too coarse for the first rollout steps; per-mille
 * lets a rollout start at 0.1% (a share of 1).
 *
 * The hash input deliberately includes the feature name, so a site that buckets low for one
 * feature is not automatically early for every feature - there are no permanently "lucky" sites
 * that always receive new features first.
 *
 * This machinery is temporary by design: once a feature reaches a 100% share with no
 * regressions, the concrete conditional reverts to extending {@see Feature_Flag_Conditional}
 * directly and this class can be removed.
 */
abstract class Gradual_Rollout_Conditional extends Feature_Flag_Conditional {

	/**
	 * The number of buckets sites are distributed across.
	 *
	 * @var int
	 */
	private const BUCKET_COUNT = 1000;

	/**
	 * Returns whether the feature is enabled.
	 *
	 * The `YOAST_SEO_<FEATURE>` constant, when defined, is an explicit override and wins.
	 * Otherwise the gradual-rollout share decides.
	 *
	 * @return bool Whether the conditional is met.
	 */
	public function is_met() {
		$constant = 'YOAST_SEO_' . \strtoupper( $this->get_feature_flag() );

		// An explicit constant always wins (true forces on, false forces off).
		if ( \defined( $constant ) ) {
			return ( \constant( $constant ) === true );
		}

		return $this->is_in_rollout_cohort();
	}

	/**
	 * Returns the current rollout share in per-mille (0-1000).
	 *
	 * 0 means the feature is enabled for no sites, 1000 for all sites. The value is
	 * raised release over release as the rollout widens.
	 *
	 * @return int The rollout share in per-mille.
	 */
	abstract protected function get_rollout_share(): int;

	/**
	 * Determines whether this site falls within the current rollout share.
	 *
	 * @return bool Whether this site is in the rollout cohort.
	 */
	private function is_in_rollout_cohort(): bool {
		$share = \max( 0, \min( self::BUCKET_COUNT, $this->get_rollout_share() ) );

		if ( $share <= 0 ) {
			return false;
		}

		if ( $share >= self::BUCKET_COUNT ) {
			return true;
		}

		// Hash the feature name together with the site URL so cohorts differ per feature
		// (no permanently lucky sites). sprintf( '%u' ) reads crc32's result as unsigned,
		// which keeps the modulo correct on 32-bit platforms where crc32 can be negative.
		$bucket = ( (int) \sprintf( '%u', \crc32( $this->get_feature_name() . \site_url() ) ) % self::BUCKET_COUNT );

		return ( $bucket < $share );
	}
}

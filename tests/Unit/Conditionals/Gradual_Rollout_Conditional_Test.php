<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Yoast\WP\SEO\Tests\Unit\Doubles\Gradual_Rollout_Conditional_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Gradual_Rollout_Conditional_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Gradual_Rollout_Conditional
 *
 * @group conditionals
 */
final class Gradual_Rollout_Conditional_Test extends TestCase {

	/**
	 * The site URL stubbed by the test harness (YoastTestCase).
	 *
	 * @var string
	 */
	private const SITE_URL = 'https://www.example.org';

	/**
	 * A feature flag whose constant is never defined, so the gradual-rollout cohort decides.
	 *
	 * @var string
	 */
	private const COHORT_FLAG = 'ROLLOUT';

	/**
	 * Computes the production bucket for a feature flag name and site URL.
	 *
	 * Mirrors Gradual_Rollout_Conditional::is_in_rollout_cohort().
	 *
	 * @param string $feature_flag The feature flag name.
	 * @param string $site_url     The site URL.
	 *
	 * @return int The bucket (0-999).
	 */
	private function bucket_for( string $feature_flag, string $site_url ): int {
		return ( (int) \sprintf( '%u', \crc32( $feature_flag . $site_url ) ) % 1000 );
	}

	/**
	 * Tests that a defined constant set to true forces the feature on, regardless of share.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_defined_constant_true_forces_on() {
		if ( ! \defined( 'YOAST_SEO_OVERRIDE_ON' ) ) {
			\define( 'YOAST_SEO_OVERRIDE_ON', true );
		}

		// Share 0 would exclude every site, but the explicit constant wins.
		$instance = new Gradual_Rollout_Conditional_Double( 'OVERRIDE_ON', 0 );

		$this->assertTrue( $instance->is_met() );
	}

	/**
	 * Tests that a defined constant set to false forces the feature off, regardless of share.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_defined_constant_false_forces_off() {
		if ( ! \defined( 'YOAST_SEO_OVERRIDE_OFF' ) ) {
			\define( 'YOAST_SEO_OVERRIDE_OFF', false );
		}

		// Share 1000 would include every site, but the explicit constant wins.
		$instance = new Gradual_Rollout_Conditional_Double( 'OVERRIDE_OFF', 1000 );

		$this->assertFalse( $instance->is_met() );
	}

	/**
	 * Tests that, with no constant defined, a share of 0 excludes everyone.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_cohort_share_zero_excludes_everyone() {
		$instance = new Gradual_Rollout_Conditional_Double( self::COHORT_FLAG, 0 );

		$this->assertFalse( $instance->is_met() );
	}

	/**
	 * Tests that, with no constant defined, a share of 1000 includes everyone.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_cohort_share_full_includes_everyone() {
		$instance = new Gradual_Rollout_Conditional_Double( self::COHORT_FLAG, 1000 );

		$this->assertTrue( $instance->is_met() );
	}

	/**
	 * Tests that an out-of-range share is clamped to the full bucket count.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_share_above_range_is_clamped_to_full() {
		$instance = new Gradual_Rollout_Conditional_Double( self::COHORT_FLAG, 5000 );

		$this->assertTrue( $instance->is_met() );
	}

	/**
	 * Tests that a negative share is clamped to zero (nobody).
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_negative_share_is_clamped_to_zero() {
		$instance = new Gradual_Rollout_Conditional_Double( self::COHORT_FLAG, -10 );

		$this->assertFalse( $instance->is_met() );
	}

	/**
	 * Tests that a site whose bucket is below the share is included.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_site_inside_share_is_included() {
		// Set the share just above this site's bucket.
		$bucket   = $this->bucket_for( self::COHORT_FLAG, self::SITE_URL );
		$instance = new Gradual_Rollout_Conditional_Double( self::COHORT_FLAG, ( $bucket + 1 ) );

		$this->assertTrue( $instance->is_met() );
	}

	/**
	 * Tests that a site whose bucket equals the share is excluded (boundary is exclusive).
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_site_at_share_boundary_is_excluded() {
		$bucket = $this->bucket_for( self::COHORT_FLAG, self::SITE_URL );

		// A bucket of 0 would make the share 0, which the $share <= 0 clamp handles before the
		// boundary comparison, so the boundary case is only meaningful for a non-zero bucket.
		if ( $bucket === 0 ) {
			$this->markTestSkipped( 'Bucket for the test URL is on the clamp boundary.' );
		}

		$instance = new Gradual_Rollout_Conditional_Double( self::COHORT_FLAG, $bucket );

		$this->assertFalse( $instance->is_met() );
	}

	/**
	 * Tests that the decision is stable across repeated calls for the same site.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_decision_is_stable_for_same_site() {
		$instance = new Gradual_Rollout_Conditional_Double( self::COHORT_FLAG, 500 );

		$this->assertSame( $instance->is_met(), $instance->is_met() );
	}

	/**
	 * Tests that the feature flag name is part of the hash, so the same site can be in the
	 * cohort for one feature but not for another at the same share (no permanently "lucky"
	 * sites). Neither constant is defined, so the cohort decides for both.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_cohort_differs_per_feature_for_same_site() {
		$low_bucket  = $this->bucket_for( 'FEATURE_LOW', self::SITE_URL );
		$high_bucket = $this->bucket_for( 'FEATURE_HIGH', self::SITE_URL );

		// Confirm the fixture features bucket differently for this site; if they ever collide,
		// the test premise no longer holds and needs different feature names.
		$this->assertNotSame( $low_bucket, $high_bucket, 'Fixture features must bucket differently.' );

		// Pick a share equal to the higher bucket, so the lower-bucket feature is in and the
		// higher-bucket one is out (bucket < share).
		$share = \max( $low_bucket, $high_bucket );

		$in_feature  = ( $low_bucket < $high_bucket ) ? 'FEATURE_LOW' : 'FEATURE_HIGH';
		$out_feature = ( $low_bucket < $high_bucket ) ? 'FEATURE_HIGH' : 'FEATURE_LOW';

		$this->assertTrue( ( new Gradual_Rollout_Conditional_Double( $in_feature, $share ) )->is_met() );
		$this->assertFalse( ( new Gradual_Rollout_Conditional_Double( $out_feature, $share ) )->is_met() );
	}
}

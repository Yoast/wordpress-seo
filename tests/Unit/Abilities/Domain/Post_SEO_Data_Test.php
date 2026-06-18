<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Domain;

use Yoast\WP\SEO\Abilities\Domain\Post_SEO_Data;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Post_SEO_Data class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Domain\Post_SEO_Data
 */
final class Post_SEO_Data_Test extends TestCase {

	/**
	 * Tests that to_array returns the data as given.
	 *
	 * @covers ::__construct
	 * @covers ::to_array
	 *
	 * @return void
	 */
	public function test_to_array_returns_the_data() {
		$data = [
			'post_id'   => 42,
			'seo_title' => 'A title',
			'noindex'   => null,
		];

		$instance = new Post_SEO_Data( $data );

		$this->assertSame( $data, $instance->to_array() );
	}

	/**
	 * Tests that to_candidate_array returns only the identity fields.
	 *
	 * @covers ::to_candidate_array
	 *
	 * @return void
	 */
	public function test_to_candidate_array_returns_identity_only() {
		$instance = new Post_SEO_Data(
			[
				'post_id'          => 42,
				'post_title'       => 'A title',
				'permalink'        => 'https://example.com/a-title/',
				'post_type'        => 'post',
				'post_status'      => 'publish',
				'meta_description' => 'Should not be in the candidate.',
			],
		);

		$this->assertSame(
			[
				'post_id'     => 42,
				'post_title'  => 'A title',
				'permalink'   => 'https://example.com/a-title/',
				'post_type'   => 'post',
				'post_status' => 'publish',
			],
			$instance->to_candidate_array(),
		);
	}

	/**
	 * Tests that to_candidate_array falls back to null for missing identity fields.
	 *
	 * @covers ::to_candidate_array
	 *
	 * @return void
	 */
	public function test_to_candidate_array_with_missing_fields() {
		$instance = new Post_SEO_Data( [ 'post_id' => 42 ] );

		$this->assertSame(
			[
				'post_id'     => 42,
				'post_title'  => null,
				'permalink'   => null,
				'post_type'   => null,
				'post_status' => null,
			],
			$instance->to_candidate_array(),
		);
	}
}

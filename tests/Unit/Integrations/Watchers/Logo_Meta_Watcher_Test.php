<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Integrations\Watchers\Logo_Meta_Watcher;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Logo_Meta_Watcher_Test.
 *
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Logo_Meta_Watcher
 * @covers \Yoast\WP\SEO\Integrations\Watchers\Logo_Meta_Watcher
 */
final class Logo_Meta_Watcher_Test extends TestCase {

	/**
	 * The image helper mock.
	 *
	 * @var Mockery\MockInterface|Image_Helper
	 */
	protected $image;

	/**
	 * The instance under test.
	 *
	 * @var Logo_Meta_Watcher
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->image    = Mockery::mock( Image_Helper::class );
		$this->instance = new Logo_Meta_Watcher( $this->image );
	}

	/**
	 * Tests that no conditionals are registered.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertSame( [], Logo_Meta_Watcher::get_conditionals() );
	}

	/**
	 * Tests that the pre_update_option_wpseo_titles filter gets registered.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse(
			Monkey\Filters\has( 'pre_update_option_wpseo_titles', [ $this->instance, 'ensure_logo_meta' ] ),
		);
	}

	/**
	 * Tests that a non-array value is returned unchanged.
	 *
	 * @covers ::ensure_logo_meta
	 *
	 * @return void
	 */
	public function test_ensure_logo_meta_returns_non_array_unchanged() {
		$this->image->shouldNotReceive( 'get_best_attachment_variation' );

		$this->assertFalse( $this->instance->ensure_logo_meta( false ) );
		$this->assertSame( 'unexpected', $this->instance->ensure_logo_meta( 'unexpected' ) );
	}

	/**
	 * Tests that missing meta gets recomputed from the attachment id.
	 *
	 * @covers ::ensure_logo_meta
	 *
	 * @return void
	 */
	public function test_ensure_logo_meta_recomputes_when_meta_is_empty() {
		$computed_company = [
			'url'    => 'https://example.test/company.png',
			'width'  => 200,
			'height' => 200,
		];
		$computed_person  = [
			'url'    => 'https://example.test/person.png',
			'width'  => 100,
			'height' => 100,
		];

		$this->image
			->expects( 'get_best_attachment_variation' )
			->once()
			->with( 42 )
			->andReturn( $computed_company );

		$this->image
			->expects( 'get_best_attachment_variation' )
			->once()
			->with( 99 )
			->andReturn( $computed_person );

		$result = $this->instance->ensure_logo_meta(
			[
				'company_logo_id'   => 42,
				'company_logo_meta' => false,
				'person_logo_id'    => 99,
				'person_logo_meta'  => false,
			],
		);

		$this->assertSame( $computed_company, $result['company_logo_meta'] );
		$this->assertSame( $computed_person, $result['person_logo_meta'] );
	}

	/**
	 * Tests that meta already supplied by the caller is preserved as-is and no
	 * recomputation happens.
	 *
	 * @covers ::ensure_logo_meta
	 *
	 * @return void
	 */
	public function test_ensure_logo_meta_preserves_supplied_meta() {
		$supplied = [
			'url'    => 'https://example.test/preset.png',
			'width'  => 300,
			'height' => 300,
		];

		$this->image->shouldNotReceive( 'get_best_attachment_variation' );

		$result = $this->instance->ensure_logo_meta(
			[
				'company_logo_id'   => 42,
				'company_logo_meta' => $supplied,
				'person_logo_id'    => 0,
				'person_logo_meta'  => false,
			],
		);

		$this->assertSame( $supplied, $result['company_logo_meta'] );
	}

	/**
	 * Tests that meta is cleared to false when the id is missing or zero.
	 *
	 * @covers ::ensure_logo_meta
	 *
	 * @return void
	 */
	public function test_ensure_logo_meta_clears_when_id_is_missing() {
		$this->image->shouldNotReceive( 'get_best_attachment_variation' );

		$result = $this->instance->ensure_logo_meta(
			[
				'company_logo_id'   => 0,
				'company_logo_meta' => [ 'url' => 'https://example.test/stale.png' ],
				// person_logo_id deliberately omitted to exercise the isset branch.
				'person_logo_meta'  => [ 'url' => 'https://example.test/stale-person.png' ],
			],
		);

		$this->assertFalse( $result['company_logo_meta'] );
		$this->assertFalse( $result['person_logo_meta'] );
	}

	/**
	 * Tests that when the helper cannot derive a variation, meta is stored as
	 * false rather than an empty array or other falsy value.
	 *
	 * @covers ::ensure_logo_meta
	 *
	 * @return void
	 */
	public function test_ensure_logo_meta_stores_false_when_variation_cannot_be_derived() {
		$this->image
			->expects( 'get_best_attachment_variation' )
			->once()
			->with( 42 )
			->andReturnFalse();

		$this->image
			->expects( 'get_best_attachment_variation' )
			->once()
			->with( 99 )
			->andReturn( [] );

		$result = $this->instance->ensure_logo_meta(
			[
				'company_logo_id'   => 42,
				'company_logo_meta' => false,
				'person_logo_id'    => 99,
				'person_logo_meta'  => false,
			],
		);

		$this->assertFalse( $result['company_logo_meta'] );
		$this->assertFalse( $result['person_logo_meta'] );
	}

	/**
	 * Tests that unrelated keys in the option are passed through untouched.
	 *
	 * @covers ::ensure_logo_meta
	 *
	 * @return void
	 */
	public function test_ensure_logo_meta_preserves_unrelated_keys() {
		$this->image->shouldNotReceive( 'get_best_attachment_variation' );

		$input = [
			'breadcrumbs-prefix' => 'You are here:',
			'title-404-wpseo'    => 'Page not found',
			'company_logo_id'    => 0,
			'company_logo_meta'  => false,
			'person_logo_id'     => 0,
			'person_logo_meta'   => false,
		];

		$result = $this->instance->ensure_logo_meta( $input );

		$this->assertSame( 'You are here:', $result['breadcrumbs-prefix'] );
		$this->assertSame( 'Page not found', $result['title-404-wpseo'] );
	}
}

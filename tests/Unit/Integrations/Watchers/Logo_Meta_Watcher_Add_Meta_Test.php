<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey;

/**
 * Tests the add_logo_meta method of the Logo_Meta_Watcher.
 *
 * @group integrations
 * @group watchers
 *
 * @covers \Yoast\WP\SEO\Integrations\Watchers\Logo_Meta_Watcher::add_logo_meta
 * @covers \Yoast\WP\SEO\Integrations\Watchers\Logo_Meta_Watcher::add_id_of_logo
 * @covers \Yoast\WP\SEO\Integrations\Watchers\Logo_Meta_Watcher::add_meta_of_logo
 * @covers \Yoast\WP\SEO\Integrations\Watchers\Logo_Meta_Watcher::is_meta_of_logo
 * @covers \Yoast\WP\SEO\Integrations\Watchers\Logo_Meta_Watcher::match_scheme_of_request
 */
final class Logo_Meta_Watcher_Add_Meta_Test extends Abstract_Logo_Meta_Watcher_Test {

	/**
	 * The URL of the image with ID 505.
	 */
	private const LOGO_URL = 'http://example.org/wp-content/uploads/logo.png';

	/**
	 * The meta of the image with ID 505.
	 */
	private const LOGO_META = [
		'width'  => 512,
		'height' => 512,
		'url'    => self::LOGO_URL,
		'id'     => 505,
	];

	/**
	 * Tests that values that need no meta are returned as they are, without looking up an image.
	 *
	 * @dataProvider data_provider_untouched_values
	 *
	 * @param mixed $new_value The value that is about to be saved.
	 *
	 * @return void
	 */
	public function test_leaves_the_value_untouched( $new_value ) {
		$this->image_helper->expects( 'get_attachment_by_url' )->never();
		$this->image_helper->expects( 'get_best_attachment_variation' )->never();

		$this->assertSame( $new_value, $this->instance->add_logo_meta( $new_value ) );
	}

	/**
	 * Data provider for test_leaves_the_value_untouched.
	 *
	 * @return array<string, array<mixed>>
	 */
	public static function data_provider_untouched_values() {
		return [
			'Not an array'                    => [ false ],
			'No logo keys at all'             => [ [ 'company_name' => 'Example' ] ],
			'No logo ID and no meta'          => [
				[
					'company_logo'    => '',
					'company_logo_id' => 0,
				],
			],
			'Meta of the same logo'           => [
				[
					'company_logo_id'   => 505,
					'company_logo_meta' => self::LOGO_META,
				],
			],
			'Logo ID is a numeric string'     => [
				[
					'company_logo_id'   => '505',
					'company_logo_meta' => self::LOGO_META,
				],
			],
		];
	}

	/**
	 * Tests that the meta of a previous logo is removed when the logo ID is removed.
	 *
	 * @return void
	 */
	public function test_removes_the_meta_when_there_is_no_logo_id() {
		$this->image_helper->expects( 'get_best_attachment_variation' )->never();

		$result = $this->instance->add_logo_meta(
			[
				'company_logo_id'   => 0,
				'company_logo_meta' => self::LOGO_META,
			],
		);

		$this->assertFalse( $result['company_logo_meta'] );
		$this->assertSame( 0, $result['company_logo_id'] );
	}

	/**
	 * Tests that a logo that only has a URL gets its ID and its meta.
	 *
	 * @dataProvider data_provider_logo_with_only_a_url
	 *
	 * @param array<string, mixed>      $new_value The value that is about to be saved.
	 * @param array<string, mixed>|bool $old_value The value before the save.
	 *
	 * @return void
	 */
	public function test_adds_the_id_of_a_logo_with_only_a_url( $new_value, $old_value ) {
		Monkey\Functions\expect( 'is_ssl' )->andReturn( false );

		$this->image_helper
			->expects( 'get_attachment_by_url' )
			->once()
			->with( self::LOGO_URL, false )
			->andReturn( 505 );
		$this->image_helper
			->expects( 'get_best_attachment_variation' )
			->once()
			->with( 505 )
			->andReturn( self::LOGO_META );

		$result = $this->instance->add_logo_meta( $new_value, $old_value );

		$this->assertSame( 505, $result['company_logo_id'] );
		$this->assertSame( self::LOGO_META, $result['company_logo_meta'] );
	}

	/**
	 * Data provider for test_adds_the_id_of_a_logo_with_only_a_url.
	 *
	 * @return array<string, array<array<string, mixed>|bool>>
	 */
	public static function data_provider_logo_with_only_a_url() {
		$stale_meta       = self::LOGO_META;
		$stale_meta['id'] = 404;

		return [
			'No ID before the save'             => [
				[
					'company_logo'    => self::LOGO_URL,
					'company_logo_id' => 0,
				],
				[
					'company_logo'    => self::LOGO_URL,
					'company_logo_id' => 0,
				],
			],
			'First save of the option'          => [
				[ 'company_logo' => self::LOGO_URL ],
				false,
			],
			'Meta of another image is replaced' => [
				[
					'company_logo'      => self::LOGO_URL,
					'company_logo_id'   => 0,
					'company_logo_meta' => $stale_meta,
				],
				[ 'company_logo_id' => 0 ],
			],
		];
	}

	/**
	 * Tests that the ID stays empty and the meta of a previous logo is removed when the URL of the logo matches no image.
	 *
	 * @return void
	 */
	public function test_leaves_the_id_empty_when_the_url_matches_no_image() {
		$this->image_helper
			->expects( 'get_attachment_by_url' )
			->once()
			->with( 'https://example.com/logo.png', false )
			->andReturn( 0 );
		$this->image_helper->expects( 'get_best_attachment_variation' )->never();

		$result = $this->instance->add_logo_meta(
			[
				'company_logo'      => 'https://example.com/logo.png',
				'company_logo_id'   => 0,
				'company_logo_meta' => self::LOGO_META,
			],
			[ 'company_logo_id' => 0 ],
		);

		$this->assertSame( 0, $result['company_logo_id'] );
		$this->assertFalse( $result['company_logo_meta'] );
	}

	/**
	 * Tests that the URL is not looked up when this save is the one that removes the logo ID.
	 *
	 * @return void
	 */
	public function test_does_not_restore_an_id_that_this_save_removes() {
		$this->image_helper->expects( 'get_attachment_by_url' )->never();
		$this->image_helper->expects( 'get_best_attachment_variation' )->never();

		$result = $this->instance->add_logo_meta(
			[
				'company_logo'      => self::LOGO_URL,
				'company_logo_id'   => 0,
				'company_logo_meta' => self::LOGO_META,
			],
			[
				'company_logo'      => self::LOGO_URL,
				'company_logo_id'   => 505,
				'company_logo_meta' => self::LOGO_META,
			],
		);

		$this->assertSame( 0, $result['company_logo_id'] );
		$this->assertFalse( $result['company_logo_meta'] );
	}

	/**
	 * Tests that the meta is added when the logo has none.
	 *
	 * @dataProvider data_provider_missing_meta
	 *
	 * @param array<string, mixed> $new_value The value that is about to be saved.
	 *
	 * @return void
	 */
	public function test_adds_the_missing_meta( $new_value ) {
		Monkey\Functions\expect( 'is_ssl' )->andReturn( false );

		$this->image_helper
			->expects( 'get_best_attachment_variation' )
			->once()
			->with( 505 )
			->andReturn( self::LOGO_META );

		$result = $this->instance->add_logo_meta( $new_value );

		$this->assertSame( self::LOGO_META, $result['company_logo_meta'] );
		$this->assertSame( 505, $result['company_logo_id'] );
	}

	/**
	 * Data provider for test_adds_the_missing_meta.
	 *
	 * @return array<string, array<array<string, mixed>>>
	 */
	public static function data_provider_missing_meta() {
		return [
			'Meta key is missing' => [
				[ 'company_logo_id' => 505 ],
			],
			'Meta is false' => [
				[
					'company_logo_id'   => 505,
					'company_logo_meta' => false,
				],
			],
			'Meta is an array without an ID' => [
				[
					'company_logo_id'   => 505,
					'company_logo_meta' => [ '', '', '' ],
				],
			],
		];
	}

	/**
	 * Tests that the meta of another image is replaced.
	 *
	 * @return void
	 */
	public function test_replaces_the_meta_of_another_image() {
		Monkey\Functions\expect( 'is_ssl' )->andReturn( false );

		$other_meta       = self::LOGO_META;
		$other_meta['id'] = 404;

		$this->image_helper
			->expects( 'get_best_attachment_variation' )
			->once()
			->with( 505 )
			->andReturn( self::LOGO_META );

		$result = $this->instance->add_logo_meta(
			[
				'company_logo_id'   => 505,
				'company_logo_meta' => $other_meta,
			],
		);

		$this->assertSame( self::LOGO_META, $result['company_logo_meta'] );
	}

	/**
	 * Tests that the meta of another image is removed when the logo has no usable variation.
	 *
	 * @return void
	 */
	public function test_removes_the_meta_of_another_image_when_there_is_no_variation() {
		$other_meta       = self::LOGO_META;
		$other_meta['id'] = 404;

		$this->image_helper
			->expects( 'get_best_attachment_variation' )
			->once()
			->with( 505 )
			->andReturn( false );

		$result = $this->instance->add_logo_meta(
			[
				'company_logo_id'   => 505,
				'company_logo_meta' => $other_meta,
			],
		);

		$this->assertFalse( $result['company_logo_meta'] );
	}

	/**
	 * Tests that a value without meta stays the same when the logo has no usable variation.
	 *
	 * @return void
	 */
	public function test_leaves_the_missing_meta_missing_when_there_is_no_variation() {
		$new_value = [ 'company_logo_id' => 505 ];

		$this->image_helper
			->expects( 'get_best_attachment_variation' )
			->once()
			->with( 505 )
			->andReturn( false );

		$this->assertSame( $new_value, $this->instance->add_logo_meta( $new_value ) );
	}

	/**
	 * Tests that the image URL gets the scheme of a request that is served over HTTPS.
	 *
	 * @return void
	 */
	public function test_uses_the_scheme_of_an_https_request() {
		Monkey\Functions\expect( 'is_ssl' )->andReturn( true );
		Monkey\Functions\expect( 'set_url_scheme' )
			->once()
			->with( 'http://example.org/wp-content/uploads/logo.png' )
			->andReturn( 'https://example.org/wp-content/uploads/logo.png' );

		$this->image_helper
			->expects( 'get_best_attachment_variation' )
			->once()
			->with( 505 )
			->andReturn( self::LOGO_META );

		$result = $this->instance->add_logo_meta( [ 'company_logo_id' => 505 ] );

		$this->assertSame( 'https://example.org/wp-content/uploads/logo.png', $result['company_logo_meta']['url'] );
	}

	/**
	 * Tests that the company logo and the person logo are handled separately.
	 *
	 * @return void
	 */
	public function test_adds_the_meta_of_the_person_logo() {
		Monkey\Functions\expect( 'is_ssl' )->andReturn( false );

		$person_meta       = self::LOGO_META;
		$person_meta['id'] = 12;

		$this->image_helper
			->expects( 'get_best_attachment_variation' )
			->once()
			->with( 12 )
			->andReturn( $person_meta );

		$result = $this->instance->add_logo_meta(
			[
				'company_logo_id'   => 505,
				'company_logo_meta' => self::LOGO_META,
				'person_logo_id'    => 12,
			],
		);

		$this->assertSame( self::LOGO_META, $result['company_logo_meta'] );
		$this->assertSame( $person_meta, $result['person_logo_meta'] );
	}
}

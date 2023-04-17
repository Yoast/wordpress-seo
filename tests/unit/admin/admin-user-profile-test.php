<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin;

use Brain\Monkey;
use Mockery;
use WPSEO_Admin_User_Profile;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit test class
 *
 * @group MyYoast
 *
 * @coversDefaultClass WPSEO_Admin_User_Profile
 */
class WPSEO_Admin_User_Profile_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var WPSEO_Admin_User_Profile
	 */
	private $instance;

	/**
	 * Set up.
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new WPSEO_Admin_User_Profile();
	}

	/**
	 * Tests process_user_option_update function when no nonce is present.
	 *
	 * @covers ::process_user_option_update
	 */
	public function test_process_user_option_update_no_nonce() {
		Monkey\Functions\expect( 'update_user_meta' )
			->andReturn( true );
		Monkey\Functions\expect( 'check_admin_referer' )
			->with( 'wpseo_user_profile_update', 'wpseo_nonce' )
			->andReturn( false );
		$this->instance->process_user_option_update( 4 );
	}

	/**
	 * Tests process_user_option_update function with a dataprovider.
	 *
	 * @dataProvider process_user_option_update_dataprovider
	 * @covers ::process_user_option_update
	 *
	 * @param array $post_values The values of $_POST.
	 */
	public function test_process_user_option_update_with_dataprovider( $post_values ) {
		Monkey\Functions\expect( 'update_user_meta' )
			->andReturn( true );
		Monkey\Functions\expect( 'check_admin_referer' )
			->with( 'wpseo_user_profile_update', 'wpseo_nonce' )
			->andReturn( true );

		foreach ( $post_values as $key => $value ) {
			$_POST[ $key ] = $value['value'];
			Monkey\Functions\expect( 'update_user_meta' )
				->with( 4, $value['save_as'], ( $value['value'] === null ) ? '' : $value['value'] )
				->andReturn( true );
		}

		$this->instance->process_user_option_update( 4 );
	}

	/**
	 * Dataprovider for test_process_user_option_update_with_dataprovider.
	 *
	 * @return array The data for test_process_user_option_update_with_dataprovider.
	 */
	public function process_user_option_update_dataprovider() {
		$all_set                               = [
			[
				'wpseo_author_title' => [
					'save_as' => 'wpseo_title',
					'value'   => 'bla bla bla',
				],
				'wpseo_author_metadesc' => [
					'save_as' => 'wpseo_metadesc',
					'value'   => 'this is a textfield',
				],
				'wpseo_noindex_author' => [
					'save_as' => 'wpseo_noindex_author',
					'value'   => 'on',
				],
				'wpseo_content_analysis_disable' => [
					'save_as' => 'wpseo_content_analysis_disable',
					'value'   => 'on',
				],
				'wpseo_keyword_analysis_disable' => [
					'save_as' => 'wpseo_keyword_analysis_disable',
					'value'   => 'on',
				],
			],
		];
		$title_not_set                         = [
			[
				'wpseo_author_title' => [
					'save_as' => 'wpseo_title',
					'value'   => null,
				],
				'wpseo_author_metadesc' => [
					'save_as' => 'wpseo_metadesc',
					'value'   => 'this is a textfield',
				],
				'wpseo_noindex_author' => [
					'save_as' => 'wpseo_noindex_author',
					'value'   => 'on',
				],
				'wpseo_content_analysis_disable' => [
					'save_as' => 'wpseo_content_analysis_disable',
					'value'   => 'on',
				],
				'wpseo_keyword_analysis_disable' => [
					'save_as' => 'wpseo_keyword_analysis_disable',
					'value'   => 'on',
				],
			],
		];
		$title_emtpy_string                    = [
			[
				'wpseo_author_title' => [
					'save_as' => 'wpseo_title',
					'value'   => '',
				],
				'wpseo_author_metadesc' => [
					'save_as' => 'wpseo_metadesc',
					'value'   => 'this is a textfield',
				],
				'wpseo_noindex_author' => [
					'save_as' => 'wpseo_noindex_author',
					'value'   => 'on',
				],
				'wpseo_content_analysis_disable' => [
					'save_as' => 'wpseo_content_analysis_disable',
					'value'   => 'on',
				],
				'wpseo_keyword_analysis_disable' => [
					'save_as' => 'wpseo_keyword_analysis_disable',
					'value'   => 'on',
				],
			],
		];
		$metadesc_not_set                      = [
			[
				'wpseo_author_title' => [
					'save_as' => 'wpseo_title',
					'value'   => 'bla bla bla',
				],
				'wpseo_author_metadesc' => [
					'save_as' => 'wpseo_metadesc',
					'value'   => null,
				],
				'wpseo_noindex_author' => [
					'save_as' => 'wpseo_noindex_author',
					'value'   => 'on',
				],
				'wpseo_content_analysis_disable' => [
					'save_as' => 'wpseo_content_analysis_disable',
					'value'   => 'on',
				],
				'wpseo_keyword_analysis_disable' => [
					'save_as' => 'wpseo_keyword_analysis_disable',
					'value'   => 'on',
				],
			],
		];
		$metadesc_empty_string                 = [
			[
				'wpseo_author_title' => [
					'save_as' => 'wpseo_title',
					'value'   => 'bla bla bla',
				],
				'wpseo_author_metadesc' => [
					'save_as' => 'wpseo_metadesc',
					'value'   => '',
				],
				'wpseo_noindex_author' => [
					'save_as' => 'wpseo_noindex_author',
					'value'   => 'on',
				],
				'wpseo_content_analysis_disable' => [
					'save_as' => 'wpseo_content_analysis_disable',
					'value'   => 'on',
				],
				'wpseo_keyword_analysis_disable' => [
					'save_as' => 'wpseo_keyword_analysis_disable',
					'value'   => 'on',
				],
			],
		];
		$noindex_not_set                       = [
			[
				'wpseo_author_title' => [
					'save_as' => 'wpseo_title',
					'value'   => 'bla bla bla',
				],
				'wpseo_author_metadesc' => [
					'save_as' => 'wpseo_metadesc',
					'value'   => 'this is a textfield',
				],
				'wpseo_noindex_author' => [
					'save_as' => 'wpseo_noindex_author',
					'value'   => null,
				],
				'wpseo_content_analysis_disable' => [
					'save_as' => 'wpseo_content_analysis_disable',
					'value'   => 'on',
				],
				'wpseo_keyword_analysis_disable' => [
					'save_as' => 'wpseo_keyword_analysis_disable',
					'value'   => 'on',
				],
			],
		];
		$noindex_empty_string                  = [
			[
				'wpseo_author_title' => [
					'save_as' => 'wpseo_title',
					'value'   => 'bla bla bla',
				],
				'wpseo_author_metadesc' => [
					'save_as' => 'wpseo_metadesc',
					'value'   => 'this is a textfield',
				],
				'wpseo_noindex_author' => [
					'save_as' => 'wpseo_noindex_author',
					'value'   => '',
				],
				'wpseo_content_analysis_disable' => [
					'save_as' => 'wpseo_content_analysis_disable',
					'value'   => 'on',
				],
				'wpseo_keyword_analysis_disable' => [
					'save_as' => 'wpseo_keyword_analysis_disable',
					'value'   => 'on',
				],
			],
		];
		$content_analysis_disable_not_set      = [
			[
				'wpseo_author_title' => [
					'save_as' => 'wpseo_title',
					'value'   => 'bla bla bla',
				],
				'wpseo_author_metadesc' => [
					'save_as' => 'wpseo_metadesc',
					'value'   => 'this is a textfield',
				],
				'wpseo_noindex_author' => [
					'save_as' => 'wpseo_noindex_author',
					'value'   => 'on',
				],
				'wpseo_content_analysis_disable' => [
					'save_as' => 'wpseo_content_analysis_disable',
					'value'   => null,
				],
				'wpseo_keyword_analysis_disable' => [
					'save_as' => 'wpseo_keyword_analysis_disable',
					'value'   => 'on',
				],
			],
		];
		$content_analysis_disable_empty_string = [
			[
				'wpseo_author_title' => [
					'save_as' => 'wpseo_title',
					'value'   => 'bla bla bla',
				],
				'wpseo_author_metadesc' => [
					'save_as' => 'wpseo_metadesc',
					'value'   => 'this is a textfield',
				],
				'wpseo_noindex_author' => [
					'save_as' => 'wpseo_noindex_author',
					'value'   => 'on',
				],
				'wpseo_content_analysis_disable' => [
					'save_as' => 'wpseo_content_analysis_disable',
					'value'   => '',
				],
				'wpseo_keyword_analysis_disable' => [
					'save_as' => 'wpseo_keyword_analysis_disable',
					'value'   => 'on',
				],
			],
		];
		$keyword_analysis_disable_not_set      = [
			[
				'wpseo_author_title' => [
					'save_as' => 'wpseo_title',
					'value'   => 'bla bla bla',
				],
				'wpseo_author_metadesc' => [
					'save_as' => 'wpseo_metadesc',
					'value'   => 'this is a textfield',
				],
				'wpseo_noindex_author' => [
					'save_as' => 'wpseo_noindex_author',
					'value'   => 'on',
				],
				'wpseo_content_analysis_disable' => [
					'save_as' => 'wpseo_content_analysis_disable',
					'value'   => 'on',
				],
				'wpseo_keyword_analysis_disable' => [
					'save_as' => 'wpseo_keyword_analysis_disable',
					'value'   => null,
				],
			],
		];
		$keyword_analysis_disable_empty_string = [
			[
				'wpseo_author_title' => [
					'save_as' => 'wpseo_title',
					'value'   => 'bla bla bla',
				],
				'wpseo_author_metadesc' => [
					'save_as' => 'wpseo_metadesc',
					'value'   => 'this is a textfield',
				],
				'wpseo_noindex_author' => [
					'save_as' => 'wpseo_noindex_author',
					'value'   => 'on',
				],
				'wpseo_content_analysis_disable' => [
					'save_as' => 'wpseo_content_analysis_disable',
					'value'   => 'on',
				],
				'wpseo_keyword_analysis_disable' => [
					'save_as' => 'wpseo_keyword_analysis_disable',
					'value'   => '',
				],
			],
		];
		return [
			'All set'                               => $all_set,
			'Title not set'                         => $title_not_set,
			'Title empty string'                    => $title_emtpy_string,
			'Meta description not set'              => $metadesc_not_set,
			'Meta description empty string'         => $metadesc_empty_string,
			'No index not set'                      => $noindex_not_set,
			'No index empty string'                 => $noindex_empty_string,
			'Content analysis disable not set'      => $content_analysis_disable_not_set,
			'Content analysis disable empty string' => $content_analysis_disable_empty_string,
			'Keyword analysis disable not set'      => $keyword_analysis_disable_not_set,
			'Keyword analysis disable empty string' => $keyword_analysis_disable_empty_string,
		];
	}
}

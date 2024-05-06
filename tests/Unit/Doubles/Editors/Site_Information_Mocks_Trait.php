<?php
namespace Yoast\WP\SEO\Tests\Unit\Doubles\Editors;

use Brain\Monkey;
use stdClass;

trait Site_Information_Mocks_Trait {

	/**
	 * Set expected mocks for unit tests.
	 *
	 * @return void
	 */
	public function set_mocks() {
		$dismissed_alerts        = [ 'the alert' ];
		$promotions              = [ 'the promotion', 'another one' ];
		$short_link              = 'https://expl.c';
		$query_params            = [ 'param', 'param2' ];
		$plugin_url              = '/location';
		$meta_surface            = new stdClass();
		$meta_surface->site_name = 'examepl.com';
		$locale                  = 'nl_NL';

		Monkey\Functions\expect( 'plugins_url' )->andReturn( $plugin_url );
		Monkey\Functions\expect( 'get_current_user_id' )->andReturn( 1 );
		Monkey\Functions\expect( 'get_locale' )->andReturn( $locale );
		Monkey\Functions\expect( 'get_user_locale' )->andReturn( $locale );
		Monkey\Functions\expect( 'is_rtl' )->andReturnFalse();
		Monkey\Functions\expect( 'get_site_icon_url' )->andReturn( 'https://example.org' );

		$this->alert_dismissal_action->expects( 'all_dismissed' )->andReturn( $dismissed_alerts );
		$this->promotion_manager->expects( 'get_current_promotions' )->andReturn( $promotions );
		$this->promotion_manager->expects( 'is' )->andReturnFalse();
		$this->short_link_helper->expects( 'get' )->andReturn( $short_link );
		$this->short_link_helper->expects( 'get_query_params' )->andReturn( $query_params );
		$this->wistia_embed_repo->expects( 'get_value_for_user' )->with( 1 )->andReturnTrue();
		$this->meta_surface->expects( 'for_current_page' )->andReturn( $meta_surface );
		$this->product_helper->expects( 'is_premium' )->andReturnTrue();
	}
}

<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Posts\Default_Template_Resolver;

use Brain\Monkey\Functions;

/**
 * Tests resolve_social_title.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Default_Template_Resolver::resolve_social_title
 */
final class Resolve_Social_Title_Test extends Abstract_Default_Template_Resolver_Test {

	/**
	 * Tests that a non-empty stored value is returned unchanged without touching the options.
	 *
	 * @return void
	 */
	public function test_returns_stored_value_when_not_empty() {
		$this->options_helper->expects( 'get' )->never();
		$this->options_helper->expects( 'get_title_default' )->never();

		$result = $this->instance->resolve_social_title( 7, 'post', 'My explicit social title' );

		$this->assertSame( 'My explicit social title', $result );
	}

	/**
	 * Tests that the user-configured post type template is resolved when the stored value is empty.
	 *
	 * @return void
	 */
	public function test_resolves_from_configured_template_when_stored_value_is_empty() {
		$post = (object) [ 'ID' => 7 ];

		$this->options_helper->expects( 'get' )->with( 'social-title-post', '' )->andReturn( '%%title%%' );
		$this->options_helper->expects( 'get_title_default' )->never();

		Functions\expect( 'get_post' )->once()->with( 7 )->andReturn( $post );
		Functions\expect( 'wpseo_replace_vars' )->once()->with( '%%title%%', $post )->andReturn( 'My post' );

		$result = $this->instance->resolve_social_title( 7, 'post', '' );

		$this->assertSame( 'My post', $result );
	}

	/**
	 * Tests that the installation default is tried when the user has not configured a template.
	 *
	 * @return void
	 */
	public function test_resolves_from_default_template_when_configured_template_is_empty() {
		$post = (object) [ 'ID' => 7 ];

		$this->options_helper->expects( 'get' )->with( 'social-title-page', '' )->andReturn( '' );
		$this->options_helper->expects( 'get_title_default' )->with( 'social-title-page' )->andReturn( '%%title%%' );

		Functions\expect( 'get_post' )->once()->with( 7 )->andReturn( $post );
		Functions\expect( 'wpseo_replace_vars' )->once()->with( '%%title%%', $post )->andReturn( 'A page' );

		$result = $this->instance->resolve_social_title( 7, 'page', '' );

		$this->assertSame( 'A page', $result );
	}

	/**
	 * Tests that an empty string is returned when neither a configured template nor an installation default exists.
	 *
	 * @return void
	 */
	public function test_returns_empty_when_no_template_exists() {
		$this->options_helper->expects( 'get' )->with( 'social-title-post', '' )->andReturn( '' );
		$this->options_helper->expects( 'get_title_default' )->with( 'social-title-post' )->andReturn( '' );

		Functions\expect( 'get_post' )->never();
		Functions\expect( 'wpseo_replace_vars' )->never();

		$result = $this->instance->resolve_social_title( 7, 'post', '' );

		$this->assertSame( '', $result );
	}
}

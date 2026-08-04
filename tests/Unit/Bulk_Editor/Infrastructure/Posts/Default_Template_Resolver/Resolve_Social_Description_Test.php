<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Posts\Default_Template_Resolver;

use Brain\Monkey\Functions;

/**
 * Tests resolve_social_description.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Default_Template_Resolver::resolve_social_description
 */
final class Resolve_Social_Description_Test extends Abstract_Default_Template_Resolver_Test {

	/**
	 * Tests that a non-empty stored value is returned unchanged without touching the options.
	 *
	 * @return void
	 */
	public function test_returns_stored_value_when_not_empty() {
		$this->options_helper->expects( 'get' )->never();

		$result = $this->instance->resolve_social_description( 7, 'post', 'My explicit social description.' );

		$this->assertSame( 'My explicit social description.', $result );
	}

	/**
	 * Tests that the user-configured post type template is resolved when the stored value is empty.
	 *
	 * @return void
	 */
	public function test_resolves_from_configured_template_when_stored_value_is_empty() {
		$post = (object) [ 'ID' => 7 ];

		$this->options_helper->expects( 'get' )->with( 'social-description-post', '' )->andReturn( '%%excerpt%%' );

		Functions\expect( 'get_post' )->once()->with( 7 )->andReturn( $post );
		Functions\expect( 'wpseo_replace_vars' )->once()->with( '%%excerpt%%', $post )->andReturn( 'The post excerpt.' );

		$result = $this->instance->resolve_social_description( 7, 'post', '' );

		$this->assertSame( 'The post excerpt.', $result );
	}

	/**
	 * Tests that an empty string is returned when no template is configured for the post type.
	 *
	 * Unlike social title, there is no installation-level default for social description.
	 *
	 * @return void
	 */
	public function test_returns_empty_when_no_template_is_configured() {
		$this->options_helper->expects( 'get' )->with( 'social-description-page', '' )->andReturn( '' );

		Functions\expect( 'get_post' )->never();
		Functions\expect( 'wpseo_replace_vars' )->never();

		$result = $this->instance->resolve_social_description( 7, 'page', '' );

		$this->assertSame( '', $result );
	}
}

<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Posts\Default_Template_Resolver;

/**
 * Tests resolve_social_title.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Default_Template_Resolver::resolve_social_title
 */
final class Resolve_Social_Title_Test extends Abstract_Default_Template_Resolver_Test {

	/**
	 * Tests that a non-empty stored value is returned unchanged without touching options.
	 *
	 * @return void
	 */
	public function test_returns_stored_value_when_not_empty() {
		$this->options_helper->expects( 'get' )->never();

		$result = $this->instance->resolve_social_title( 7, 'post', 'My explicit social title' );

		$this->assertSame( 'My explicit social title', $result );
	}

	/**
	 * Tests that an empty string is returned when OpenGraph is disabled.
	 *
	 * @return void
	 */
	public function test_returns_empty_when_opengraph_disabled() {
		$this->options_helper->expects( 'get' )->with( 'opengraph', false )->andReturn( false );
		$this->options_helper->expects( 'get_title_default' )->never();

		$result = $this->instance->resolve_social_title( 7, 'post', '' );

		$this->assertSame( '', $result );
	}

	/**
	 * Tests that the raw user-configured template is returned when the stored value is empty.
	 *
	 * @return void
	 */
	public function test_returns_configured_template_when_stored_value_is_empty() {
		$this->options_helper->expects( 'get' )->with( 'opengraph', false )->andReturn( true );
		$this->options_helper->expects( 'get' )->with( 'social-title-post', '' )->andReturn( '%%title%%' );
		$this->options_helper->expects( 'get_title_default' )->never();

		$result = $this->instance->resolve_social_title( 7, 'post', '' );

		$this->assertSame( '%%title%%', $result );
	}

	/**
	 * Tests that an empty string is returned when the configured template has been cleared.
	 *
	 * The post type's template is normally pre-populated with the installation default at install time
	 * (e.g. `%%title%%`), so reaching this point with an empty configured value means it was deliberately
	 * cleared. This must not reintroduce the installation default: Open Graph then correctly falls back
	 * to the fully-resolved SEO title instead, and this resolver should reflect that same emptiness.
	 *
	 * @return void
	 */
	public function test_returns_empty_when_no_template_is_configured() {
		$this->options_helper->expects( 'get' )->with( 'opengraph', false )->andReturn( true );
		$this->options_helper->expects( 'get' )->with( 'social-title-page', '' )->andReturn( '' );
		$this->options_helper->expects( 'get_title_default' )->never();

		$result = $this->instance->resolve_social_title( 7, 'page', '' );

		$this->assertSame( '', $result );
	}
}

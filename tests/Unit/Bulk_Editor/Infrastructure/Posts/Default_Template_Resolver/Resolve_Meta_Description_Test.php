<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Posts\Default_Template_Resolver;

/**
 * Tests resolve_meta_description.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Posts\Default_Template_Resolver::resolve_meta_description
 */
final class Resolve_Meta_Description_Test extends Abstract_Default_Template_Resolver_Test {

	/**
	 * Tests that a non-empty stored value is returned unchanged without touching the options.
	 *
	 * @return void
	 */
	public function test_returns_stored_value_when_not_empty() {
		$this->options_helper->expects( 'get' )->never();

		$result = $this->instance->resolve_meta_description( 7, 'post', 'My explicit description.' );

		$this->assertSame( 'My explicit description.', $result );
	}

	/**
	 * Tests that the raw user-configured template is returned when the stored value is empty.
	 *
	 * @return void
	 */
	public function test_returns_configured_template_when_stored_value_is_empty() {
		$this->options_helper->expects( 'get' )->with( 'metadesc-post', '' )->andReturn( '%%excerpt%%' );

		$result = $this->instance->resolve_meta_description( 7, 'post', '' );

		$this->assertSame( '%%excerpt%%', $result );
	}

	/**
	 * Tests that an empty string is returned when no template is configured for the post type.
	 *
	 * Unlike SEO title, meta description has no installation-level default fallback.
	 *
	 * @return void
	 */
	public function test_returns_empty_when_no_template_is_configured() {
		$this->options_helper->expects( 'get' )->with( 'metadesc-page', '' )->andReturn( '' );

		$result = $this->instance->resolve_meta_description( 7, 'page', '' );

		$this->assertSame( '', $result );
	}
}

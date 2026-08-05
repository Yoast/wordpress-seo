<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Posts\Default_Template_Resolver;

use Brain\Monkey\Filters;
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
	 * Tests that a non-empty stored value is returned unchanged without touching options or filters.
	 *
	 * @return void
	 */
	public function test_returns_stored_value_when_not_empty() {
		$this->options_helper->expects( 'get' )->never();

		$result = $this->instance->resolve_social_description( 7, 'post', 'My explicit social description.' );

		$this->assertSame( 'My explicit social description.', $result );
	}

	/**
	 * Tests that an empty string is returned when OpenGraph is disabled.
	 *
	 * @return void
	 */
	public function test_returns_empty_when_opengraph_disabled() {
		$this->options_helper->expects( 'get' )->with( 'opengraph', false )->andReturn( false );

		Functions\expect( 'apply_filters' )->never();
		Functions\expect( 'wpseo_replace_vars' )->never();

		$result = $this->instance->resolve_social_description( 7, 'post', '' );

		$this->assertSame( '', $result );
	}

	/**
	 * Tests that an empty string is returned when OpenGraph is enabled but the filter returns no template.
	 *
	 * This is the expected behaviour on Free, where no callback is registered for
	 * `wpseo_social_template_post_type` and the filter therefore returns the default empty string.
	 *
	 * @return void
	 */
	public function test_returns_empty_when_filter_returns_empty_template() {
		$this->options_helper->expects( 'get' )->with( 'opengraph', false )->andReturn( true );

		Filters\expectApplied( 'wpseo_social_template_post_type' )
			->once()
			->with( '', 'description', 'post' )
			->andReturn( '' );

		Functions\expect( 'get_post' )->never();
		Functions\expect( 'wpseo_replace_vars' )->never();

		$result = $this->instance->resolve_social_description( 7, 'post', '' );

		$this->assertSame( '', $result );
	}

	/**
	 * Tests that the filter-provided template is resolved when OpenGraph is enabled.
	 *
	 * This is the expected behaviour on Premium, where a callback supplies the configured template.
	 *
	 * @return void
	 */
	public function test_resolves_from_filter_template_when_opengraph_enabled() {
		$post = (object) [ 'ID' => 7 ];

		$this->options_helper->expects( 'get' )->with( 'opengraph', false )->andReturn( true );

		Filters\expectApplied( 'wpseo_social_template_post_type' )
			->once()
			->with( '', 'description', 'post' )
			->andReturn( '%%excerpt%%' );

		Functions\expect( 'get_post' )->once()->with( 7 )->andReturn( $post );
		Functions\expect( 'wpseo_replace_vars' )->once()->with( '%%excerpt%%', $post )->andReturn( 'The post excerpt.' );

		$result = $this->instance->resolve_social_description( 7, 'post', '' );

		$this->assertSame( 'The post excerpt.', $result );
	}
}

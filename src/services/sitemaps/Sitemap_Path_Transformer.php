<?php

namespace Yoast\WP\SEO\Services\Sitemaps;

use Yoast\WP\SEO\Exceptions\Sitemaps\Path_Transformation_Exception;

class Sitemap_Path_Transformer {
	/**
	 * Transforms a WP Core sitemap path to the path for the matching Yoast SEO sitemap.
	 *
	 * @param string $path The original path.
	 *
	 * @return string The path to redirect to.
	 * @throws Path_Transformation_Exception If the given path couldn't be matched to a Yoast SEO sitemap path.
	 */
	public function transform_wp_core_to_yoast_seo( $path ) {

		// TODO Diede - Write unittests
		// TODO Diede - Test: Flush rewrite rules test op fully indexed?

		// Start with the simple string comparison, so we avoid doing unnecessary regexes.
		if ( $path === '/wp-sitemap.xml' ) {
			return '/sitemap_index.xml';
		}

		if ( \preg_match( '/^\/wp-sitemap-(posts|taxonomies)-(\w+)-(\d+)\.xml$/', $path, $matches ) ) {
			$index = ( (int) $matches[3] - 1 );
			$index = ( $index === 0 ) ? '' : (string) $index;

			return '/' . $matches[2] . '-sitemap' . $index . '.xml';
		}

		if ( \preg_match( '/^\/wp-sitemap-users-(\d+)\.xml$/', $path, $matches ) ) {
			$index = ( (int) $matches[1] - 1 );
			$index = ( $index === 0 ) ? '' : (string) $index;

			return '/author-sitemap' . $index . '.xml';
		}

		throw new Path_Transformation_Exception( "No matching Yoast SEO sitemap for " . $path );
	}

	/**
	 * Transforms a Yoast SEO sitemap path to the path for the matching WordPress core sitemap.
	 *
	 * @param string $path The Yoast SEO sitemap path.
	 *
	 * @return string The path of the WordPress core sitemap.
	 * @throws Path_Transformation_Exception If the given path couldn't be matched to a Yoast SEO sitemap path.
	 */
	public function transform_yoast_seo_to_wp_core( $path ) {
		// Start with the simple string comparison, so we avoid doing unnecessary regexes.
		if ( $path === '/sitemap_index.xml' ) {
			return '/wp-sitemap.xml';
		}

		if ( \strpos( $path, '/wp-sitemap' ) === 0 ) {
			throw new Path_Transformation_Exception( 'The path is already a path to a wp core sitemap: ' . $path );
		}
		// TODO diede concern, matchen de pagina nummers by default? en niet by default..?


		\preg_match( '/^\/(\w+)-sitemap(\d*)\.xml$/', $path, $matches );
		if ( count( $matches ) !== 3 ) {
			throw new Path_Transformation_Exception( 'No matching Yoast SEO sitemap for ' . $path );
		}
		list( , $object_type, $page ) = $matches;
		$page = (int) $page + 1;


		if ( $object_type === 'author' ) {
			return sprintf( '/wp-sitemap-users-%d.xml', $page );
		}
		else if ( post_type_exists( $object_type  ) ) {
			return sprintf( '/wp-sitemap-posts-%s-%d.xml', $object_type, $page );
		}
		else if ( taxonomy_exists( $object_type ) ) {
			return sprintf( '/wp-sitemap-taxonomies-%s-%d.xml', $object_type, $page );
		}

		throw new Path_Transformation_Exception( 'No matching Yoast SEO sitemap for ' . $path );
	}
}

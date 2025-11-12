<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map;

use DOMDocument;
use RuntimeException;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Map\Schema_Map_Config;

/**
 * Converts the schema map to an xml representation.
 */
class Schema_Map_Xml_Renderer {

	/**
	 * The schema map configuration.
	 *
	 * @var Schema_Map_Config
	 */
	private $config;

	/**
	 * Constructor.
	 *
	 * @param Schema_Map_Config $config The schema map configuration.
	 */
	public function __construct( Schema_Map_Config $config ) {
		$this->config = $config;
	}

	/**
	 * Converts the schema map to an XML string.
	 *
	 * @param array<array<string>> $schema_map The schema map data.
	 *
	 * @return string The XML representation of the schema map.
	 *
	 * @throws RuntimeException If the input structure is invalid or XML generation fails.
	 */
	public function render( array $schema_map ): string {
		if ( ! isset( $schema_map ) || ! \is_array( $schema_map ) ) {
			throw new RuntimeException( 'Invalid schemamap data structure: missing or invalid "schemamap" key' );
		}

		$dom = new DOMDocument( '1.0', 'UTF-8' );

		$url_set = $dom->createElement( 'urlset' );
		$url_set->setAttribute( 'xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9' );
		$dom->appendChild( $url_set );

		$change_freq = $this->config->get_changefreq();
		$priority    = $this->config->get_priority();

		foreach ( $schema_map as $entry ) {
			if ( ! isset( $entry['url'] ) || ! isset( $entry['lastmod'] ) ) {
				continue;
			}

			$url = $dom->createElement( 'url' );

			$url->setAttribute( 'contentType', 'structuredData/schema.org' );

			$loc = $dom->createElement( 'loc' );
			$loc->appendChild( $dom->createTextNode( $entry['url'] ) );
			$url->appendChild( $loc );

			$last_mod = $dom->createElement( 'lastmod' );
			$last_mod->appendChild( $dom->createTextNode( $entry['lastmod'] ) );
			$url->appendChild( $last_mod );

			$cf = $dom->createElement( 'changefreq' );
			$cf->appendChild( $dom->createTextNode( $change_freq ) );
			$url->appendChild( $cf );

			$prio = $dom->createElement( 'priority' );
			$prio->appendChild( $dom->createTextNode( $priority ) );
			$url->appendChild( $prio );

			$url_set->appendChild( $url );
		}

		$xml = $dom->saveXML();
		if ( $xml === false ) {
			throw new RuntimeException( 'Failed to generate XML from DOMDocument' );
		}

		return $xml;
	}
}

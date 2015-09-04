<?php
/**
 * @package WPSEO\Unittests
 */

/**
 * Class WPSEO_JSON_LD_Test
 */
class WPSEO_JSON_LD_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_JSON_LD
	 */
	private static $class_instance;

	/**
	 * Instantiate our class
	 */
	public static function setUpBeforeClass() {
		self::$class_instance = new WPSEO_JSON_LD();
	}

	/**
	 * @covers WPSEO_JSON_LD::website
	 */
	public function test_website() {
		$this->go_to_home();

		$home_url   = trailingslashit( home_url() );
		$search_url = $home_url . '?s={search_term_string}';
		$json       = WPSEO_Utils::json_encode( array(
			'@context'        => 'http://schema.org',
			'@type'           => 'WebSite',
			'url'             => $home_url,
			'name'            => get_bloginfo( 'name' ),
			'potentialAction' => array(
				'@type'       => 'SearchAction',
				'target'      => $search_url,
				'query-input' => 'required name=search_term_string',
			),
		) );
		$expected   = '<script type=\'application/ld+json\'>' . $json . '</script>' . "\n";
		$this->expectOutput( $expected, self::$class_instance->website() );
	}

	/**
	 * @covers WPSEO_JSON_LD::organization_or_person
	 *
	 * Test having person markup and one social profile
	 */
	public function test_person() {
		$name                                               = 'Joost de Valk';
		$instagram                                          = 'http://instagram.com/yoast';
		self::$class_instance->options['company_or_person'] = 'person';
		self::$class_instance->options['person_name']       = $name;
		self::$class_instance->options['instagram_url']     = $instagram;

		$this->go_to_home();

		$home_url = home_url();
		$json     = WPSEO_Utils::json_encode( array(
			'@context' => 'http://schema.org',
			'@type'    => 'Person',
			'url'      => $home_url,
			'sameAs'   => array( $instagram ),
			'name'     => $name,
		) );
		$expected = '<script type=\'application/ld+json\'>' . $json . '</script>' . "\n";
		$this->expectOutput( $expected, self::$class_instance->organization_or_person() );
	}

	/**
	 * @covers WPSEO_JSON_LD::organization_or_person
	 *
	 * Test having organization markup and two social profiles
	 */
	public function test_organization() {
		$name                                               = 'Yoast';
		$facebook                                           = 'https://www.facebook.com/Yoast';
		$instagram                                          = 'http://instagram.com/yoast';
		self::$class_instance->options['company_or_person'] = 'company';
		self::$class_instance->options['company_name']      = $name;
		self::$class_instance->options['facebook_site']     = $facebook;
		self::$class_instance->options['instagram_url']     = $instagram;

		$this->go_to_home();

		$home_url = home_url();
		$json     = WPSEO_Utils::json_encode( array(
			'@context' => 'http://schema.org',
			'@type'    => 'Organization',
			'url'      => $home_url,
			'sameAs'   => array( $instagram, $facebook, $instagram ),
			'name'     => $name,
			'logo'     => '',
		) );
		$expected = '<script type=\'application/ld+json\'>' . $json . '</script>' . "\n";
		$this->expectOutput( $expected, self::$class_instance->organization_or_person() );
	}
}

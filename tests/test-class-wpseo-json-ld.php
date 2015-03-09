<?php

class WPSEO_JSON_LD_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Frontend
	 */
	private static $class_instance;

	public static function setUpBeforeClass() {
		self::$class_instance = new WPSEO_JSON_LD();
	}

	/**
	 * @covers WPSEO_JSON_LD::internal_search
	 */
	public function test_internal_search() {
		$this->go_to_home();

		$home_url   = trailingslashit( home_url() );
		$search_url = $home_url . '?s={search_term}';
		$expected   = '<script type=\'application/ld+json\'>{ "@context": "http://schema.org","@type": "WebSite","url": "' . $home_url . '","potentialAction": {"@type": "SearchAction","target": "' . $search_url . '","query-input": "required name=search_term"}}</script>' . "\n";
		$this->expectOutput( $expected, self::$class_instance->internal_search() );
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
		$expected = '<script type=\'application/ld+json\'>{ "@context": "http://schema.org","@type": "Person","name": "' . $name . '","url": "' . $home_url . '","sameAs": ["' . $instagram . '"]}</script>' . "\n";
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
		$expected = '<script type=\'application/ld+json\'>{ "@context": "http://schema.org","@type": "Organization","name": "' . $name . '","url": "' . $home_url . '","logo": "","sameAs": ["' . $facebook . '","' . $instagram . '"]}</script>' . "\n";
		$this->expectOutput( $expected, self::$class_instance->organization_or_person() );
	}
}
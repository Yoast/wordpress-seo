<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Class that creates the PHP 5.2 support message.
 */
class WPSEO_Unsupported_PHP_Message implements Whip_Message {

	/**
	 * Composes the body of the message to display.
	 *
	 * @return string The message to display.
	 */
	public function body() {
		$message = array();

		$message[] = Whip_MessageFormatter::strongParagraph( __( 'PHP update required.', 'wordpress-seo' ) ) . '<br />';
		$message[] = Whip_MessageFormatter::paragraph(
			sprintf(
				/* translators: 1: The strong opening tag; 2: The strong closing tag; 3: the Yoast SEO version that is dropping support; 4: The release date of the version of Yoast SEO that is dropping support; 5: The PHP version no longer being supported; */
				__( '%1$sAction is needed%2$s: As of version %3$s, due to be released on %4$s, Yoast SEO will no longer work with PHP %5$s. Unfortunately, your site is running on PHP %5$s right now, so action is needed. Thankfully, you can update your PHP yourself.', 'wordpress-seo' ),
				'<strong>',
				'</strong>',
				'7.7',
				date_i18n( get_option( 'date_format' ), strtotime( '11-06-2018' ) ),
				'5.2'
			)
		) . '<br />';

		$message[] = Whip_MessageFormatter::strongParagraph( __( 'Why?', 'wordpress-seo' ) ) . '<br />';
		$message[] = Whip_MessageFormatter::paragraph(
			sprintf(
				/* translators: 1: the PHP version that will no longer be supported; 2: The year the unsupported PHP version was released; 3: The minimal PHP version that will be supported; 4: The year the minimally supported version of PHP was released; */
				__( 'PHP is the programming language WordPress is developed in and your site runs on. PHP %1$s was released in %2$s and was replaced by PHP %3$s in %4$s. Newer versions of PHP are both faster and more secure, so updating will have a positive effect on your site. Plus, it it enables our developers to use the latest technologies to make Yoast SEO even better.', 'wordpress-seo' ),
				'5.2',
				'2006',
				'5.3',
				'2009'
			)
		) . '<br />';

		$message[] = Whip_MessageFormatter::strongParagraph( __( 'How?', 'wordpress-seo' ) ) . '<br />';
		$message[] = Whip_MessageFormatter::paragraph(
			sprintf(
				/* translators: 1: The link tag to the  WordPress instructions page for upgrading to newer versions of PHP; 2: The link closing tag; 3: The recommended PHP version; 4: The Yoast article about testing plugin compatibility with newer PHP versions; */
				__( 'For any questions you may have about updating your PHP version, WordPress %1$shas a great page with instructions here%2$s. We recommend going up to version %3$s. Not all plugins may be ready for PHP 7 though, so %4$swe wrote an article on how to test them before you update here%2$s.', 'wordpress-seo' ),
				'<a href="https://wordpress.org/support/upgrade-php/" target="_blank" rel="noopener noreferrer">',
				'</a>',
				'7.2',
				'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/wg' ) . '" target="_blank">'
			)
		) . '<br />';

		$message[] = Whip_MessageFormatter::paragraph(
			sprintf(
				/* translators: 1: The link tag to email examples page; 2: The link closing tag; 3: The link tag for the list of recommended WordPress hosting partners; */
				__( 'If you cannot update your PHP yourself, you can send an email to your host. We have %1$sexamples%2$s here. If they don\'t want to upgrade your PHP version, we recommend switching hosts. Take a look at our list of %3$srecommended WordPress hosting partners%2$s, they\'ve been vetted by the Yoast support team and offer all the features a modern host should have.', 'wordpress-seo' ),
				'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/wh' ) . '" target="_blank">',
				'</a>',
				sprintf( '<a href="%1$s" target="_blank">', esc_url( Whip_Host::hostingPageUrl() ) )
			)
		) . '<br />';

		return implode( $message, "\n" );
	}
}

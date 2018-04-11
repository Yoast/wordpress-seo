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

		$upgrade_page_url = esc_attr( 'https://wordpress.org/support/upgrade-php/' );

		$message[] = Whip_MessageFormatter::strongParagraph( __( 'PHP update required.', 'wordpress-seo' ) ) . '<br />';
		$message[] = Whip_MessageFormatter::paragraph( __( 'As of version 7.3, Yoast SEO is going to stop supporting PHP 5.2, which is the PHP version your site is running on. Thankfully, you can update your PHP yourself.', 'wordpress-seo' ) ) . '<br />';
		$message[] = Whip_MessageFormatter::strongParagraph( __( 'Why?', 'wordpress-seo' ) ) . '<br />';
		$message[] = Whip_MessageFormatter::paragraph( __( 'PHP is the programming language WordPress runs on. Newer versions of PHP are both faster and more secure, so updating will have a positive effect on your site. Plus, it it enables our developers to use the latest technologies to make Yoast SEO even better.', 'wordpress-seo' ) ) . '<br />';
		$message[] = Whip_MessageFormatter::strongParagraph( __( 'How?', 'wordpress-seo' ) ) . '<br />';
		$message[] = Whip_MessageFormatter::paragraph( __( 'For any questions you may have about updating your PHP version, WordPress <a href="' . $upgrade_page_url . '" target="_blank" rel="noopener noreferrer">has a great page with instructions here</a>. We recommend going up to version 7.2. Not all plugins may be ready for PHP 7 though, so we wrote an article on how to test them before you update here.', 'wordpress-seo' ) ) . '<br />';
		$message[] = Whip_MessageFormatter::paragraph( __( 'If you cannot update your PHP yourself, you can send an email to your host. We have examples here. If they don\'t want to upgrade your PHP version, we recommend switching hosts. Take a look at our list of recommended WordPress hosting partners, they\'ve been vetted by the Yoast support team and offer all the features a modern host should have.', 'wordpress-seo' ) ) . '<br />';

		return implode( $message, "\n" );
	}
}

<?php

class WPSEO_Unsupported_PHP_Message implements Whip_Message {
	/**
	 * @var string
	 */
	private $textdomain;

	/**
	 * Whip_UpgradePhpMessage constructor.
	 *
	 * @param string $textdomain The text domain to use for the translations.
	 */
	public function __construct( $textdomain ) {
		$this->textdomain = $textdomain;
	}

	/**
	 * Composes the body of the message to display.
	 *
	 * @return string The message to display.
	 */
	public function body() {
		$textdomain = $this->textdomain;

		$message = array();

		$message[] = Whip_MessageFormatter::strongParagraph( __( 'PHP update required.', $textdomain ) ) . '<br />';
		$message[] = Whip_MessageFormatter::paragraph( __( 'As of version 7.3, Yoast SEO is going to stop supporting PHP 5.2, which is the PHP version your site is running on. Thankfully, you can update your PHP yourself.', $textdomain ) ) . '<br />';
		$message[] = Whip_MessageFormatter::strongParagraph( __( 'Why?', $textdomain ) ) . '<br />';
		$message[] = Whip_MessageFormatter::paragraph( __( 'PHP is the programming language WordPress runs on. Newer versions of PHP are both faster and more secure, so updating will have a positive effect on your site. Plus, it it enables our developers to use the latest technologies to make Yoast SEO even better.', $textdomain ) ) . '<br />';
		$message[] = Whip_MessageFormatter::strongParagraph( __( 'How?', $textdomain ) ) . '<br />';
		$message[] = Whip_MessageFormatter::paragraph( __( 'For any questions you may have about updating your PHP version, WordPress has a great page with instructions here. We recommend going up to version 7.2. Not all plugins may be ready for PHP7 though, so we wrote an article on how to test them before you update here.', $textdomain ) ) . '<br />';
		$message[] = Whip_MessageFormatter::paragraph( __( 'If you cannot update your PHP yourself, you can send an email to your host. We have examples here. If they don\'t want to upgrade your PHP version, we recommend switching hosts. Take a look at our list of recommended WordPress hosting partners, they\'ve been vetted by the Yoast support team and offer all the features a modern host should have.', $textdomain ) ) . '<br />';

		return implode( $message, "\n" );
	}
}

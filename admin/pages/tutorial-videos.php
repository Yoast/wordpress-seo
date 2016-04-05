<?php

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

Yoast_Form::get_instance()->admin_header( true );

?>

<h2><?php echo esc_html( __( 'Listen and learn', 'wordpress-seo' ) ) ?></h2>

<p>
	<?php echo esc_html( __( 'In these videos, Joost guides you through all the important features and options of the Yoast SEO for WordPress plugin.', 'wordpress-seo' ) ); ?>
</p>

<p>
	<?php echo sprintf( __( 'Watch them here or visit our <a href="%s" target="_blank">YouTube channel</a> for all our videos.', 'wordpress-seo' ), 'https://www.youtube.com/user/yoastcom' ); ?>
</p>

<iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?list=PL4CtPfBUilirZovJVGPHoMH-JOMWSpWoa"
        frameborder="0" allowfullscreen></iframe>

<p>
	<?php echo sprintf( __( 'Do you want to put your knowledge to the test? Get a <a href="%s" target="_blank">Yoast Academy account</a>, test yourself and earn an official Yoast SEO Badge!', 'wordpress-seo' ), 'https://yoast.com/academy/courses/' ); ?>
</p>

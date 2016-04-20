<?php
/**
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * Display a list of contributors
 *
 * @param array $contributors Contributors' data, associative by GitHub username.
 */
function wpseo_display_contributors( $contributors ) {
	foreach ( $contributors as $username => $dev ) {
		echo '<li class="wp-person" id="wp-person-', $username, '">';
		echo '<a href="https://github.com/', $username, '"><img	src="//gravatar.com/avatar/', $dev->gravatar, '?s=60" class="gravatar" alt="', $dev->name, '"></a>';
		echo '<a class="web" href="https://github.com/', $username, '">', $dev->name, '</a>';
		echo '<span class="title">', $dev->role, '</span></li>';
	}
}

?>

<div class="wrap about-wrap">

	<h1><?php
		/* translators: %1$s expands to Yoast SEO */
		printf( __( 'Thank you for updating %1$s!', 'wordpress-seo' ), 'Yoast SEO' );
		?></h1>

	<p class="about-text">
		Yoast SEO 3.2 has a ton of accessibility and help changes. We've made our help more accessible and included
		support videos for every tab. In Premium we've added a new social previews feature. Much like the snippet
		preview it shows you what your post will look like when shared on Facebook and Twitter.
	</p>

	<div class="wp-badge"></div>

	<h2 class="nav-tab-wrapper" id="wpseo-tabs">
		<a class="nav-tab" href="#top#new" id="new-tab">
			<?php
			/* translators: %s: '3.2' version number */
			echo sprintf( __( 'What’s new in %s', 'wordpress-seo' ), '3.2' );
			?>
		</a>
		<a class="nav-tab" href="#top#integrations"
		   id="integrations-tab"><?php _e( 'Integrations', 'wordpress-seo' ); ?></a>
		<a class="nav-tab" href="#top#credits" id="credits-tab"><?php _e( 'Credits', 'wordpress-seo' ); ?></a>
	</h2>

	<div id="new" class="wpseotab">

		<div class="headline-feature feature-video">
			<?php // @codingStandardsIgnoreStart ?>
			<iframe style="width:1050px;height:591px;" src="https://yoa.st/release-video"
			        frameborder="0" allowfullscreen></iframe>
			<?php // @codingStandardsIgnoreEnd ?>
		</div>

		<div class="feature-section two-col">
			<div class="col">
				<h3>A new help center</h3>

				<p>Every tab now has a help center. In the help center you will find a video explaining the settings on
					that tab.
					On some tabs, there's even more info, like template variables on the Titles &amp; Metas tabs.</p>
				<div class="media-container">
					<img style="margin: 0 0 10px 0;"
					     src="https://yoast-30.s3.amazonaws.com/screenshot-help-center.png" alt="Help Center">
				</div>
			</div>
			<div class="col">
				<h3>Premium: social previews</h3>

				<p>In Yoast SEO Premium we've added a new social previews feature. Much like the snippet
					preview it shows you what your post will look like when shared on Facebook and Twitter.</p>
				<div class="media-container">
					<img style="margin: 0 0 10px 0;" src="https://yoast-30.s3.amazonaws.com/yoast-social-preview.png"
					     alt="Yoast Social Previews">
				</div>
			</div>
		</div>
		<div class="feature-section two-col">
			<div class="col">
				<h3>Improved inline help</h3>

				<p>We've improved our inline help feature everywhere, making it easier to use. In the process we got rid
					of qTip, a JavaScript library that caused a lot of issues.</p>
				<div class="media-container">
					<img style="margin: 0 0 10px 0;" src="https://yoast-30.s3.amazonaws.com/improved-help.png"
					     alt="Improved inline help">
				</div>
			</div>
			<div class="col">
				<h3>Google-</h3>
				<p>We've removed the Google+ functionality from the plugin. Google is slowly deprecating the network. On
					top of that, its metadata was giving conflichts with Facebook, which caused lots of issues. As
					Google+ also uses Facebook metadata, optimizing for Facebook should do what you need for Google+ too.</p>
			</div>
		</div>

		<hr/>

		<div class="changelog">
			<h2>Under the hood</h2>
			<div class="under-the-hood three-col">
				<div class="col">
					<h3>Accessibility improvements everywhere</h3>
					<p>We're not done yet, but we've been busy making all parts of the plugin more accessible. Starting
						with a more accessible metabox amongst other things.</p>
				</div>
				<div class="col">
					<h3>XML Sitemap improvements</h3>
					<p>A ton of work has gone into fixing XML sitemaps related bugs. They should work better on plugin
					activation now, amongst lots of other changes.</p>
				</div>
				<div class="col">
					<h3><code>NOYDIR</code> removed</h3>
					<p>The Yahoo! directory has been dead for a year now and we're sure it's not coming back. Because of
						that we've removed all the <code>NOYDIR</code> options in the plugin.</p>
				</div>
			</div>
			<div class="under-the-hood two-col">
				<div class="col">
					<h3>Remove clean up functionality</h3>
					<p>We've removed the clean up functions we had for the <code>&lt;head&gt;</code>. There simply is
						no SEO benefit and WordPress kept adding more stuff to the <code>&lt;head&gt;</code> anyway.</p>
				</div>
				<div class="col">
					<h3>Primary term functions</h3>
					<p>You can now use <code>%%primary_category%%</code> in your title and description templates. We've
						also added <code>yoast_get_primary_term()</code> and <code>yoast_get_primary_term_id()</code>
						which you can use in your templates.</p>
				</div>
			</div>
		</div>

		<div class="return-to-dashboard">
			<a href="<?php echo esc_url( admin_url( 'admin.php?page=wpseo_dashboard' ) ); ?>"><?php _e( 'Go to the General settings page →', 'wordpress-seo' ); ?></a>
		</div>

	</div>

	<div id="integrations" class="wpseotab">
		<h2>Yoast SEO Integrations</h2>
		<p class="about-description">
			Yoast SEO 3.0 brought a way for theme builders and custom field plugins to integrate with Yoast SEO. These
			integrations make sure that <em>all</em> the data on your page is used for the content analysis. On this
			page, we highlight the frameworks that have nicely working integrations.
		</p>

		<ol>
			<li><a target="_blank" href="https://wordpress.org/plugins/yoast-seo-acf-analysis/">Yoast ACF
					Integration</a> - an integration built by <a href="https://forsberg.ax">Marcus Forsberg</a> and Team
				Yoast
			</li>
			<li><a target="_blank" href="https://www.elegantthemes.com/plugins/divi-builder/">Divi Builder</a></li>
			<li><a target="_blank" href="https://vc.wpbakery.com/">Visual Composer</a></li>
		</ol>

		<h3>Other integrations</h3>
		<p class="about-description">
			We've got another integration we'd like to tell you about:
		</p>

		<ol>
			<li><a target="_blank" href="https://wordpress.org/plugins/glue-for-yoast-seo-amp/">Glue for Yoast SEO &amp;
					AMP</a> - an integration between <a href="https://wordpress.org/plugins/amp/">the WordPress AMP
					plugin</a> and Yoast SEO.
			</li>
			<li>
				<a target="_blank" href="https://wordpress.org/plugins/fb-instant-articles/">Instant Articles for WP</a> - Enable Instant Articles for Facebook on your WordPress site and integrates with Yoast SEO.
			</li>
		</ol>


	</div>

	<div id="credits" class="wpseotab">
		<p class="about-description">
			<?php
			/* translators: %1$s and %2$s expands to anchor tags, %3$s expands to Yoast SEO */
			printf( __( 'While most of the development team is at %1$sYoast%2$s in the Netherlands, %3$s is created by a worldwide team.', 'wordpress-seo' ), '<a target="_blank" href="https://yoast.com/">', '</a>', 'Yoast SEO' );
			echo ' ';
			printf( __( 'Want to help us develop? Read our %1$scontribution guidelines%2$s!', 'wordpress-seo' ), '<a target="_blank" href="https://yoa.st/wpseocontributionguidelines">', '</a>' );
			?>
		</p>

		<h4 class="wp-people-group"><?php _e( 'Project Leaders', 'wordpress-seo' ); ?></h4>
		<ul class="wp-people-group " id="wp-people-group-project-leaders">
			<?php
			$leaders = array(
				'jdevalk'   => (object) array(
					'name'     => 'Joost de Valk',
					'role'     => __( 'Project Lead', 'wordpress-seo' ),
					'gravatar' => 'f08c3c3253bf14b5616b4db53cea6b78',
				),
				'omarreiss' => (object) array(
					'name'     => 'Omar Reiss',
					'role'     => __( 'Lead Architect', 'wordpress-seo' ),
					'gravatar' => '86aaa606a1904e7e0cf9857a663c376e',
				),
				'atimmer'   => (object) array(
					'name'     => 'Anton Timmermans',
					'role'     => __( 'Architect', 'wordpress-seo' ),
					'gravatar' => 'b3acbabfdd208ecbf950d864b86fe968',
				),
				'tacoverdo' => (object) array(
					'name'     => 'Taco Verdonschot',
					'role'     => __( 'QA & Translations Manager', 'wordpress-seo' ),
					'gravatar' => 'd2d3ecb38cacd521926979b5c678297b',
				),
			);

			wpseo_display_contributors( $leaders );
			?>
		</ul>
		<h4 class="wp-people-group"><?php _e( 'Contributing Developers', 'wordpress-seo' ); ?></h4>
		<ul class="wp-people-group " id="wp-people-group-core-developers">
			<?php
			$contributors = array(
				'andizer'       => (object) array(
					'name'     => 'Andy Meerwaldt',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => 'a9b43e766915b48031eab78f9916ca8e',
				),
				'andrea'        => (object) array(
					'name'     => 'Andrea Fercia',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => '074af62ea5ff218b6a6eeab89104f616',
				),
				'terw-dan'      => (object) array(
					'name'     => 'Danny Terwindt',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => '20a04b0736e630e80ce2dbefe3f1d62f',
				),
				'CarolineGeven' => (object) array(
					'name'     => 'Caroline Geven',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => 'f2596a568c3974e35f051266a63d791f',
				),
				'jcomack'       => (object) array(
					'name'     => 'Jimmy Comack',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => '41073ef9e1f3e01b03cbee75cee33bd4',
				),
				'moorscode'     => (object) array(
					'name'     => 'Jip Moors',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => '1751c5afc377ef4ec07a50791db1bc52',
				),
				'rarst'         => (object) array(
					'name'     => 'Andrey Savchenko',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => 'c445c2491f9f55409b2e4dccee357961',
				),
				'boblinthorst'  => (object) array(
					'name'     => 'Bob Linthorst',
					'role'     => __( 'Tester / Developer', 'wordpress-seo' ),
					'gravatar' => '8063b1955f54681ef3a2deb21972faa1',
				),
				'diedexx'       => (object) array(
					'name'     => 'Diede Exterkate',
					'role'     => __( 'Tester / Developer', 'wordpress-seo' ),
					'gravatar' => '59908788f406037240ee011388db29f8',
				),
			);

			wpseo_display_contributors( $contributors );
			?>
		</ul>
		<h4 class="wp-people-group"><?php _e( 'Contributors to this release', 'wordpress-seo' ); ?></h4>
		<?php
		$patches_from = array(
			'Borja Abad'           => 'https://github.com/mines',
			'sun'                  => 'https://github.com/sun',
			'Mark Walker'          => 'https://github.com/mnwalker',
			'Konstantin Kovshenin' => 'https://github.com/kovshenin',
			'Damian Hodgkiss'      => 'https://github.com/damianhodgkiss',
			'Kevin Lisota'         => 'https://github.com/kevinlisota',
			'Felix Arntz'          => 'https://github.com/felixarntz',
			'Thorsten Frommen'     => 'https://github.com/tfrommen',
			'Darren Ethier'        => 'https://github.com/nerrad',
			'Marko Heijnen'        => 'https://github.com/markoheijnen',
			'Jörn Lund'            => 'https://github.com/mcguffin',
		);
		?>
		<p>We're always grateful for patches from non-regular contributors, in Yoast SEO 3.2, patches from
			the
			following people made it in:</p>
		<ul class="ul-square">
			<?php
			foreach ( $patches_from as $patcher => $link ) {
				echo '<li><a href="', esc_url( $link ), '">', $patcher, '</a></li>';
			}
			?>
		</ul>
	</div>
</div>

<?php
/**
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$version = '3.3';

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
		Yoast SEO 3.3 adds a new content tab to the Yoast SEO metabox. In this content tab we'll highlight ways for you
		to make your content more readable. We've also added knowledge base search and a new notification center.
	</p>

	<div class="wp-badge"></div>

	<h2 class="nav-tab-wrapper" id="wpseo-tabs">
		<a class="nav-tab" href="#top#new" id="new-tab">
			<?php
			/* translators: %s: '3.2' version number */
			echo sprintf( __( 'What’s new in %s', 'wordpress-seo' ), $version );
			?>
		</a>
		<a class="nav-tab" href="#top#integrations"
		   id="integrations-tab"><?php _e( 'Integrations', 'wordpress-seo' ); ?></a>
		<a class="nav-tab" href="#top#credits" id="credits-tab"><?php _e( 'Credits', 'wordpress-seo' ); ?></a>
	</h2>

	<div id="new" class="wpseotab">

		<div class="headline-feature feature-video">
			<?php // @codingStandardsIgnoreStart ?>
			<iframe style="width:1050px;height:591px;" src="https://yoa.st/3-3-release-video"
			        frameborder="0" allowfullscreen></iframe>
			<?php // @codingStandardsIgnoreEnd ?>
		</div>

		<div class="feature-section two-col">
			<div class="col">
				<h3>Content checks</h3>

				<p>Because the quality of your content becomes more important every day, this release focuses on helping
					you write more readable copy. We recognize things like passive voice, transition words, sentences
					and paragraphs that are too long.</p>
				<div class="media-container">
					<img style="margin: 0 0 10px 0;"
					     src="https://cdn-images.yoast.com/release/3.3/content-analysis-at-work.png"
					     alt="New content analysis">
				</div>
			</div>
			<div class="col">
				<h3>Highlight content checks</h3>

				<p>Some of the content checks have highlight icons, pressing them highlights the "problem" in your text
					editor.</p>
				<div class="media-container">
					<img style="margin: 0 0 10px 0;"
					     src="https://cdn-images.yoast.com/release/3.3/content-highlight.png"
					     alt="An example of highlighted text">
				</div>
			</div>
		</div>
		<div class="feature-section two-col">
			<div class="col">
				<h3>Knowledge base search</h3>

				<p>The help center we added in 3.2 has been expanded with knowledge base search, so you can search our
					knowledge base straight from the backend.</p>
				<div class="media-container">
					<img style="margin: 0 0 10px 0;"
					     src="https://cdn-images.yoast.com/release/3.3/knowledge-base-search.png"
					     alt="Knowledge base search">
				</div>
			</div>
			<div class="col">
				<h3>Notifications revamped</h3>
				<p>Our plugin has to throw notifications sometimes. How we did that was the cause of some frustration
					and we've now created a new Yoast notification center:</p>
				<div class="media-container">
					<img style="margin: 0 0 10px 0;"
					     src="https://cdn-images.yoast.com/release/3.3/yoast-seo-notifications.png"
					     alt="Yoast notification center">
				</div>
			</div>
		</div>

		<hr/>

		<div class="changelog">
			<h2>Under the hood</h2>
			<div class="under-the-hood two-col">
				<div class="col">
					<h3>Accessible tooltips</h3>
					<p>We've introduced accessible tooltips which we've used for the highlight mark button but will use
						in more places.</p>
				</div>
				<div class="col">
					<h3>Change title width</h3>
					<p>Google updated the width of titles in the search resutls, so we've adapted our snippet preview.
						We've also removed the bolding
						of keywords in the title as keywords are never bold anymore.</p>
				</div>
			</div>
			<div class="under-the-hood three-col">
				<div class="col">
					<h3>Transliteration improvements</h3>
					<p>Transliterated variants of keywords are now also recognised for 25 languages.</p>
				</div>
				<div class="col">
					<h3>XML Sitemap improvements</h3>
					<p>We've improved how we deal with XML sitemaps cache and introduced a hard 50,000 URL limit on
						these sitemaps.</p>
				</div>
				<div class="col">
					<h3>Alexa removed</h3>
					<p>As you can no longer verify your site with Alexa for free, we've removed this functionality.</p>
				</div>
			</div>
		</div>

		<div class="return-to-dashboard">
			<a href="<?php echo esc_url( admin_url( 'admin.php?page=' . WPSEO_Admin::PAGE_IDENTIFIER ) ); ?>"><?php _e( 'Go to the General settings page →', 'wordpress-seo' ); ?></a>
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
				<a target="_blank" href="https://wordpress.org/plugins/fb-instant-articles/">Instant Articles for WP</a>
				- Enable Instant Articles for Facebook on your WordPress site and integrates with Yoast SEO.
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
				'moorscode' => (object) array(
					'name'     => 'Jip Moors',
					'role'     => __( 'Architect', 'wordpress-seo' ),
					'gravatar' => '1751c5afc377ef4ec07a50791db1bc52',
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
				'irenestr'      => (object) array(
					'name'     => 'Irene Strikkers',
					'role'     => __( 'Linguist & Developer', 'wordpress-seo' ),
					'gravatar' => '074d67179d52561e36e57e8e9ea8f8cf',
				),
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
				'diedexx'       => (object) array(
					'name'     => 'Diede Exterkate',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => '59908788f406037240ee011388db29f8',
				),
				'rarst'         => (object) array(
					'name'     => 'Andrey Savchenko',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => 'c445c2491f9f55409b2e4dccee357961',
				),
				'rensw90'       => (object) array(
					'name'     => 'Rens Weerman',
					'role'     => __( 'Developer', 'wordpress-seo' ),
					'gravatar' => 'b0a3b8fed2b5ac66a082f0e915d4ea6f',
				),
			);

			wpseo_display_contributors( $contributors );
			?>
		</ul>
		<h4 class="wp-people-group"><?php _e( 'Contributors to this release', 'wordpress-seo' ); ?></h4>
		<?php
		$patches_from = array(
			'Thorsten Frommen' => 'https://github.com/tfrommen',
			'Jonny Harris'     => 'https://github.com/spacedmonkey',
			'Xavi Ivars'       => 'https://github.com/xavivars',
		);
		?>
		<p><?php printf( __( 'We\'re always grateful for patches from non-regular contributors, in Yoast SEO %s, patches from
			the following people made it in:', 'wordpress-seo' ), $version ); ?></p>
		<ul class="ul-square">
			<?php
			foreach ( $patches_from as $patcher => $link ) {
				echo '<li><a href="', esc_url( $link ), '">', $patcher, '</a></li>';
			}
			?>
		</ul>
	</div>
</div>

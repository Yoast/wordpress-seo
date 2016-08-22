<?php
/**
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$version = '3.4';

/**
 * Display a list of contributors
 *
 * @param array $contributors Contributors' data, associative by GitHub username.
 */
function wpseo_display_contributors( $contributors ) {
	foreach ( $contributors as $username => $dev ) {
		echo '<li class="wp-person" id="wp-person-', $username, '">';
		echo '<a href="https://github.com/', $username, '" class="web"><img src="//gravatar.com/avatar/', $dev->gravatar, '?s=60" class="gravatar" alt="">', $dev->name, '</a>';
		echo '<span class="title">', $dev->role, "</span></li>\n";
	}
}

?>

<div class="wrap about-wrap">

	<h1><?php
		/* translators: %1$s expands to Yoast SEO */
		printf( __( 'Thank you for updating %1$s!', 'wordpress-seo' ), 'Yoast SEO' );
		?></h1>

	<p class="about-text">
		Yoast SEO 3.4 mostly brings a lot of accessibility improvements. After Yoast SEO 3.3 brought a new content tab,
		we brought functionality to you in 3.4 that allows you to disable both the content
		analysis and the SEO analysis, should you be so inclined.
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

		<div class="feature-section two-col">
			<div class="col">
				<h3>Disable SEO &amp; Content analysis</h3>

				<p>If green bullets aren't your thing, you can now disable the SEO analysis, both site wide and per
					user. The same is true for the readability analysis.</p>
			</div>
			<div class="col">
				<h3>New readability check</h3>

				<p>We now warn you if you start 3 or more consecutive sentences with the same word. Works for English,
					German, French and Spanish.</p>
			</div>
		</div>
		<div class="feature-section two-col">
			<div class="col">
				<h3>Accessibility changes</h3>

				<p>A ton of work has been put into improving the accessibility of Yoast SEO. Some of the changes:</p>
				<ul>
					<li>Improved the headings hierarchy on several pages.</li>
					<li>Improved the knowledge base search and admin menu by making it focusable and operable with a
						keyboard.
					</li>
					<li>Adding labels and titles to several fields.</li>
				</ul>
			</div>
			<div class="col">
				<h3>Transliterations</h3>

				<p>Transliteration is the conversion of non-standard latin characters and non-latin characters to
					standard latin characters. It's used, for instance, to convert characters with diacritics to
					characters
					that can be used safely in URLs and analyses.</p>
				<p>On top of the 24 languages we already supported, this release adds support for: Breton, Chamorro,
					Corsican, Kashubian, Welsh,
					Ewe, Estonian, Basque, Fulah, Fijian, Arpitan, Friulian, Frisian, Irish, Scottish Gaelic, Galician,
					Guarani, Swiss German, Haitian Creole, Hawaiian, Croatian, Georgian, Greenlandic, Kinyarwanda,
					Luxembourgish, Limburgish, Lingala, Lithuanian, Malagasy, Macedonian, Maori, Mirandese, Occitan,
					Oromo, Portuguese, Romansh Vallader,Aromanian, Romanian, Slovak, Slovenian, Albanian, Klingon (in
					Latin characters, not KLI PlqaD script, yet), Hungarian, Sardinian, Silesian, Tahitian, Venetian,
					Walloon.</p>
			</div>
		</div>

		<hr/>

		<div class="changelog">
			<h2>Under the hood</h2>
			<div class="under-the-hood two-col">
				<div class="col">
					<h3>Analysis markers</h3>
					<p>We now disable the analysis marker buttons when switching from visual to text view in the editor. Simply because we can't highlight in the text view.</p>
				</div>
				<div class="col">
					<h3>Readability score everywhere</h3>
					<p>We've added the readability score to the post and term overview.</p>
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

		<h3 class="wp-people-group"><?php _e( 'Product Management', 'wordpress-seo' ); ?></h3>
		<ul class="wp-people-group " id="wp-people-group-project-leaders">
			<?php
			$people = array(
				'jdevalk'     => (object) array(
					'name'     => 'Joost de Valk',
					'role'     => __( 'Project Lead', 'wordpress-seo' ),
					'gravatar' => 'f08c3c3253bf14b5616b4db53cea6b78',
				),
				'mariekerakt' => (object) array(
					'name'     => 'Marieke van de Rakt',
					'role'     => __( 'Head R&D', 'wordpress-seo' ),
					'gravatar' => '1d83533e299c379140f9fcc2cb0015cb',
				),
				'irenestr'    => (object) array(
					'name'     => 'Irene Strikkers',
					'role'     => __( 'Linguist', 'wordpress-seo' ),
					'gravatar' => '074d67179d52561e36e57e8e9ea8f8cf',
				),
			);

			wpseo_display_contributors( $people );
			?>
			<h3 class="wp-people-group"><?php _e( 'Development Leaders', 'wordpress-seo' ); ?></h3>
			<ul class="wp-people-group " id="wp-people-group-project-leaders">
				<?php
				$people = array(
					'omarreiss' => (object) array(
						'name'     => 'Omar Reiss',
						'role'     => __( 'CTO', 'wordpress-seo' ),
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
				);

				wpseo_display_contributors( $people );
				?>
			</ul>
			<h3 class="wp-people-group"><?php _e( 'Yoast Developers', 'wordpress-seo' ); ?></h3>
			<ul class="wp-people-group " id="wp-people-group-core-developers">
				<?php
				$people = array(
					'andrea'        => (object) array(
						'name'     => 'Andrea Fercia',
						'role'     => __( 'Developer', 'wordpress-seo' ),
						'gravatar' => '074af62ea5ff218b6a6eeab89104f616',
					),
					'rarst'         => (object) array(
						'name'     => 'Andrey Savchenko',
						'role'     => __( 'Developer', 'wordpress-seo' ),
						'gravatar' => 'c445c2491f9f55409b2e4dccee357961',
					),
					'andizer'       => (object) array(
						'name'     => 'Andy Meerwaldt',
						'role'     => __( 'Developer', 'wordpress-seo' ),
						'gravatar' => 'a9b43e766915b48031eab78f9916ca8e',
					),
					'boblinthorst'  => (object) array(
						'name'     => 'Bob Linthorst',
						'role'     => __( 'Developer', 'wordpress-seo' ),
						'gravatar' => '8063b1955f54681ef3a2deb21972faa1',
					),
					'CarolineGeven' => (object) array(
						'name'     => 'Caroline Geven',
						'role'     => __( 'Developer', 'wordpress-seo' ),
						'gravatar' => 'f2596a568c3974e35f051266a63d791f',
					),
					'terw-dan'      => (object) array(
						'name'     => 'Danny Terwindt',
						'role'     => __( 'Developer', 'wordpress-seo' ),
						'gravatar' => '20a04b0736e630e80ce2dbefe3f1d62f',
					),
					'diedexx'       => (object) array(
						'name'     => 'Diede Exterkate',
						'role'     => __( 'Developer', 'wordpress-seo' ),
						'gravatar' => '59908788f406037240ee011388db29f8',
					),
					'irenestr'      => (object) array(
						'name'     => 'Irene Strikkers',
						'role'     => __( 'Developer', 'wordpress-seo' ),
						'gravatar' => '074d67179d52561e36e57e8e9ea8f8cf',
					),
					'jcomack'       => (object) array(
						'name'     => 'Jimmy Comack',
						'role'     => __( 'Developer', 'wordpress-seo' ),
						'gravatar' => '41073ef9e1f3e01b03cbee75cee33bd4',
					),
					'rensw90'       => (object) array(
						'name'     => 'Rens Weerman',
						'role'     => __( 'Developer', 'wordpress-seo' ),
						'gravatar' => 'b0a3b8fed2b5ac66a082f0e915d4ea6f',
					),
				);

				wpseo_display_contributors( $people );
				?>
			</ul>
			<h3 class="wp-people-group"><?php _e( 'Quality Assurance & Testing', 'wordpress-seo' ); ?></h3>
			<ul class="wp-people-group " id="wp-people-group-project-leaders">
				<?php
				$people = array(
					'tacoverdo'    => (object) array(
						'name'     => 'Taco Verdonschot',
						'role'     => __( 'QA & Translations Manager', 'wordpress-seo' ),
						'gravatar' => 'd2d3ecb38cacd521926979b5c678297b',
					),
					'monbauza'     => (object) array(
						'name'     => 'Ramon Bauza',
						'role'     => __( 'Tester', 'wordpress-seo' ),
						'gravatar' => 'de09b8491ab1d927e770f7519219cfc9',
					),
					'boblinthorst' => (object) array(
						'name'     => 'Bob Linthorst',
						'role'     => __( 'Tester', 'wordpress-seo' ),
						'gravatar' => '8063b1955f54681ef3a2deb21972faa1',
					),
				);

				wpseo_display_contributors( $people );
				?>
			</ul>
			<h3 class="wp-people-group"><?php _e( 'Community contributors', 'wordpress-seo' ); ?></h3>
			<?php
			$patches_from = array(
				'Daniel Bachhuber' => 'https://github.com/tfrommen',
				'Robert Korulczyk' => 'https://github.com/rob006',
				'pawawat'          => 'https://github.com/pawawat',
			);
			?>
			<p><?php printf( __( 'We\'re always grateful for patches from non-regular contributors, in %1$s %2$s, patches from the following people made it in:', 'wordpress-seo' ), 'Yoast SEO', $version ); ?></p>
			<ul class="ul-square">
				<?php
				foreach ( $patches_from as $patcher => $link ) {
					echo '<li><a href="', esc_url( $link ), '">', $patcher, '</a></li>';
				}
				?>
			</ul>
	</div>
</div>

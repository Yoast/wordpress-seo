/* eslint-disable complexity */
/* global wpseoAdminL10n */
import { Fragment, useEffect } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, MultiSelect, RadioButtonGroup, Select, TextInput } from "@yoast/components";
import { LocationConsumer } from "@yoast/externals/contexts";
import { join } from "@yoast/helpers";
import { noop } from "lodash";
import PropTypes from "prop-types";

/**
 * Boolean that tells whether the current object refers to a post or a taxonomy.
 *
 * @returns {Boolean} Whether this is a post or not.
 */
const isPost = () => !! window.wpseoScriptData.isPost;

/**
 * The values that are used for the noIndex field differ for posts and taxonomies. This function returns an array of
 * options that can be used to populate a select field.
 *
 * @param {Object} editorContext An object containing context about this editor.
 *
 * @returns {Object[]} Returns an array of options for the noIndex setting.
 */
const getNoIndexOptions = ( editorContext ) => {
	const translatedNo = __( "No", "wordpress-seo" );
	const translatedYes = __( "Yes", "wordpress-seo" );
	const noIndex = editorContext.noIndex ? translatedNo : translatedYes;

	if ( isPost() ) {
		return [
			{
				name: sprintf(
					/* translators: %1$s translates to "yes" or "no", %2$s translates to the content type label in plural form */
					__( "%1$s (current default for %2$s)", "wordpress-seo" ),
					noIndex,
					editorContext.postTypeNamePlural
				),
				value: "0",
			},
			{ name: translatedNo, value: "1" },
			{ name: translatedYes, value: "2" },
		];
	}
	return [
		{
			name: sprintf(
				/* translators: %1$s translates to "yes" or "no", %2$s translates to the content type label in plural form */
				__( "%1$s (current default for %2$s)", "wordpress-seo" ),
				noIndex,
				editorContext.postTypeNamePlural
			),
			value: "default",
		},
		{ name: translatedYes, value: "index" },
		{ name: translatedNo, value: "noindex" },
	];
};

/**
 * Functional component for the Meta Robots No-Index option.
 *
 * @param {string} noIndex The current noIndex value.
 * @param {function} onNoIndexChange Callback for when the noIndex value changes.
 * @param {Object} editorContext The editor context object.
 * @param {boolean} [isPrivateBlog=false] Whether the blog is private.
 *
 * @returns {JSX.Element} The Meta Robots No-Index.
 */
const MetaRobotsNoIndex = ( {
	noIndex,
	onNoIndexChange,
	editorContext,
	isPrivateBlog = false,
} ) => {
	const metaRobotsNoIndexOptions = getNoIndexOptions( editorContext );

	return <LocationConsumer>
		{ location => {
			return <Fragment>
				{
					isPrivateBlog &&
					<Alert type="warning">
						{ __(
							"Even though you can set the meta robots setting here, the entire site is set to noindex in the sitewide privacy settings, so these settings won't have an effect.",
							"wordpress-seo"
						) }
					</Alert>
				}
				<Select
					label={ __( "Allow search engines to show this content in search results?", "wordpress-seo" ) }
					onChange={ onNoIndexChange }
					id={ join( [ "yoast-meta-robots-noindex", location ] ) }
					options={ metaRobotsNoIndexOptions }
					selected={ noIndex }
					linkTo={ wpseoAdminL10n[ "shortlinks.advanced.allow_search_engines" ] }
					/* translators: Hidden accessibility text. */
					linkText={ __( "Learn more about the no-index setting on our help page.", "wordpress-seo" ) }
				/>
			</Fragment>;
		} }
	</LocationConsumer>;
};

MetaRobotsNoIndex.propTypes = {
	noIndex: PropTypes.string.isRequired,
	onNoIndexChange: PropTypes.func.isRequired,
	editorContext: PropTypes.object.isRequired,
	isPrivateBlog: PropTypes.bool,
};

/**
 * Functional component for the Meta Robots No-Follow option.
 *
 * @param {string} noFollow The current noFollow value.
 * @param {function} onNoFollowChange Callback for when the noFollow value changes.
 *
 * @returns {JSX.Element} The Meta Robots No-Follow option.
 */
const MetaRobotsNoFollow = ( { noFollow, onNoFollowChange } ) => {
	return <LocationConsumer>
		{ location => {
			const id = join( [ "yoast-meta-robots-nofollow", location ] );

			return <RadioButtonGroup
				id={ id }
				options={ [ { value: "0", label: "Yes" }, { value: "1", label: "No" } ] }
				label={ __( "Should search engines follow links on this content?", "wordpress-seo" ) }
				groupName={ id }
				onChange={ onNoFollowChange }
				selected={ noFollow }
				linkTo={ wpseoAdminL10n[ "shortlinks.advanced.follow_links" ] }
				/* translators: Hidden accessibility text. */
				linkText={ __( "Learn more about the no-follow setting on our help page.", "wordpress-seo" ) }
			/>;
		} }
	</LocationConsumer>;
};

MetaRobotsNoFollow.propTypes = {
	noFollow: PropTypes.string.isRequired,
	onNoFollowChange: PropTypes.func.isRequired,
};

/**
 * Functional component for the Meta Robots Advanced field.
 *
 * @param {Array} advanced The selected advanced options.
 * @param {function} onAdvancedChange Callback for when the advanced options change.
 *
 * @returns {JSX.Element} The Meta Robots advanced field.
 */
const MetaRobotsAdvanced = ( { advanced, onAdvancedChange } ) => {
	return <LocationConsumer>
		{ location => {
			const id = join( [ "yoast-meta-robots-advanced", location ] );
			const inputId = `${ id }-input`;

			return <MultiSelect
				label={ __( "Meta robots advanced", "wordpress-seo" ) }
				onChange={ onAdvancedChange }
				id={ id }
				inputId={ inputId }
				options={ [
					{ name: __( "No Image Index", "wordpress-seo" ), value: "noimageindex" },
					{ name: __( "No Archive", "wordpress-seo" ), value: "noarchive" },
					{ name: __( "No Snippet", "wordpress-seo" ), value: "nosnippet" },
				] }
				selected={ advanced }
				linkTo={ wpseoAdminL10n[ "shortlinks.advanced.meta_robots" ] }
				/* translators: Hidden accessibility text. */
				linkText={ __( "Learn more about advanced meta robots settings on our help page.", "wordpress-seo" ) }
			/>;
		} }
	</LocationConsumer>;
};

MetaRobotsAdvanced.propTypes = {
	advanced: PropTypes.array.isRequired,
	onAdvancedChange: PropTypes.func.isRequired,
};

/**
 * Functional component for the Breadcrumbs Title.
 *
 * @param {string} breadcrumbsTitle The breadcrumbs title value.
 * @param {function} onBreadcrumbsTitleChange Callback for when the breadcrumbs title changes.
 *
 * @returns {JSX.Element} The Breadcrumbs title.
 */
const BreadcrumbsTitle = ( { breadcrumbsTitle, onBreadcrumbsTitleChange } ) => {
	return <LocationConsumer>
		{
			location => {
				return <TextInput
					label={ __( "Breadcrumbs Title", "wordpress-seo" ) }
					id={ join( [ "yoast-breadcrumbs-title", location ] ) }
					onChange={ onBreadcrumbsTitleChange }
					value={ breadcrumbsTitle }
					linkTo={ wpseoAdminL10n[ "shortlinks.advanced.breadcrumbs_title" ] }
					/* translators: Hidden accessibility text. */
					linkText={ __( "Learn more about the breadcrumbs title setting on our help page.", "wordpress-seo" ) }
				/>;
			}
		}
	</LocationConsumer>;
};

BreadcrumbsTitle.propTypes = {
	breadcrumbsTitle: PropTypes.string.isRequired,
	onBreadcrumbsTitleChange: PropTypes.func.isRequired,
};

/**
 * Functional component for the Canonical URL.
 *
 * @param {string} canonical The canonical URL value.
 * @param {function} onCanonicalChange Callback for when the canonical URL changes.
 *
 * @returns {JSX.Element} The canonical URL.
 */
const CanonicalURL = ( { canonical, onCanonicalChange } ) => {
	return <LocationConsumer>
		{
			location => {
				return <TextInput
					label={ __( "Canonical URL", "wordpress-seo" ) }
					id={ join( [ "yoast-canonical", location ] ) }
					onChange={ onCanonicalChange }
					value={ canonical }
					linkTo={ "https://yoa.st/canonical-url" }
					/* translators: Hidden accessibility text. */
					linkText={ __( "Learn more about canonical URLs on our help page.", "wordpress-seo" ) }
				/>;
			}
		}
	</LocationConsumer>;
};

CanonicalURL.propTypes = {
	canonical: PropTypes.string.isRequired,
	onCanonicalChange: PropTypes.func.isRequired,
};

/**
 * The Advanced Settings component.
 *
 * @param {string} noIndex The current noIndex value.
 * @param {string} canonical The canonical URL value.
 * @param {function} onNoIndexChange Callback for when the noIndex value changes.
 * @param {function} onCanonicalChange Callback for when the canonical URL changes.
 * @param {function} onLoad Callback for when the component loads.
 * @param {boolean} isLoading Whether the component is loading.
 * @param {Object} editorContext The editor context object.
 * @param {boolean} isBreadcrumbsDisabled Whether breadcrumbs are disabled.
 * @param {Array} [advanced=[]] The selected advanced options.
 * @param {function} [onAdvancedChange=noop] Callback for when the advanced options change.
 * @param {string} [noFollow=""] The current noFollow value.
 * @param {function} [onNoFollowChange=noop] Callback for when the noFollow value changes.
 * @param {string} [breadcrumbsTitle=""] The breadcrumbs title value.
 * @param {function} [onBreadcrumbsTitleChange=noop] Callback for when the breadcrumbs title changes.
 * @param {boolean} [isPrivateBlog=false] Whether the blog is private.
 *
 * @returns {JSX.Element} The AdvancedSettings component.
 */
const AdvancedSettings = ( {
	noIndex,
	canonical,
	onNoIndexChange,
	onCanonicalChange,
	onLoad,
	isLoading,
	editorContext,
	isBreadcrumbsDisabled,
	advanced = [],
	onAdvancedChange = noop,
	noFollow = "",
	onNoFollowChange = noop,
	breadcrumbsTitle = "",
	onBreadcrumbsTitleChange = noop,
	isPrivateBlog = false,
} ) => {
	useEffect( () => {
		setTimeout( () => {
			if ( isLoading ) {
				onLoad();
			}
		} );
	} );

	const noIndexProps = {
		noIndex,
		onNoIndexChange,
		editorContext,
		isPrivateBlog,
	};

	const noFollowProps = {
		noFollow,
		onNoFollowChange,
	};

	const advancedProps = {
		advanced,
		onAdvancedChange,
	};
	const breadcrumbsTitleProps = {
		breadcrumbsTitle,
		onBreadcrumbsTitleChange,
	};

	const canonicalProps = {
		canonical,
		onCanonicalChange,
	};

	if ( isLoading ) {
		return null;
	}

	return (
		<Fragment>
			<MetaRobotsNoIndex { ...noIndexProps } />
			{ editorContext.isPost && <MetaRobotsNoFollow { ...noFollowProps } /> }
			{ editorContext.isPost && <MetaRobotsAdvanced { ...advancedProps } /> }
			{
				! isBreadcrumbsDisabled && <BreadcrumbsTitle { ...breadcrumbsTitleProps } />
			}
			<CanonicalURL { ...canonicalProps } />
		</Fragment>
	);
};

AdvancedSettings.propTypes = {
	noIndex: PropTypes.string.isRequired,
	canonical: PropTypes.string.isRequired,
	onNoIndexChange: PropTypes.func.isRequired,
	onCanonicalChange: PropTypes.func.isRequired,
	onLoad: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired,
	editorContext: PropTypes.object.isRequired,
	isBreadcrumbsDisabled: PropTypes.bool.isRequired,
	isPrivateBlog: PropTypes.bool,
	advanced: PropTypes.array,
	onAdvancedChange: PropTypes.func,
	noFollow: PropTypes.string,
	onNoFollowChange: PropTypes.func,
	breadcrumbsTitle: PropTypes.string,
	onBreadcrumbsTitleChange: PropTypes.func,
};

export default AdvancedSettings;

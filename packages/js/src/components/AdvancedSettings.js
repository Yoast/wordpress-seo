/* global wpseoAdminL10n */
import { Fragment, useEffect } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, MultiSelect, RadioButtonGroup, Select, TextInput } from "@yoast/components";
import { join } from "@yoast/helpers";
import PropTypes from "prop-types";
import { LocationConsumer } from "./contexts/location";

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
					/* Translators: %s translates to "yes" or "no", %s translates to the Post Label in plural form */
					__( "%s (current default for %s)", "wordpress-seo" ),
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
				/* Translators: %s translates to the "yes" or "no" ,%s translates to the Post Label in plural form */
				__( "%s (current default for %s)", "wordpress-seo" ),
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
 * @param {Object} props The props object
 *
 * @returns {JSX.Element} The Meta Robots No-Index.
 */
const MetaRobotsNoIndex = ( { noIndex, onNoIndexChange, editorContext, isPrivateBlog } ) => {
	const metaRobotsNoIndexOptions = getNoIndexOptions( editorContext );

	return <LocationConsumer>
		{ location => {
			return <Fragment>
				{
					isPrivateBlog &&
					<Alert type="warning">
						{ __(
							"Even though you can set the meta robots setting here, " +
							"the entire site is set to noindex in the sitewide privacy settings, " +
							"so these settings won't have an effect.",
							"wordpress-seo"
						) }
					</Alert>
				}
				<Select
					label={
						sprintf(
							/* Translators: %s translates to the Post Label in singular form */
							__( "Allow search engines to show this %s in search results?", "wordpress-seo" ),
							editorContext.postTypeNameSingular
						) }
					onChange={ onNoIndexChange }
					id={ join( [ "yoast-meta-robots-noindex", location ] ) }
					options={ metaRobotsNoIndexOptions }
					selected={ noIndex }
					linkTo={ wpseoAdminL10n[ "shortlinks.advanced.allow_search_engines" ] }
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

MetaRobotsNoIndex.defaultProps = {
	isPrivateBlog: false,
};

/**
 * Functional component for the Meta Robots No-Follow option.
 *
 * @returns {JSX.Element} The Meta Robots No-Follow option.
 */
const MetaRobotsNoFollow = ( { noFollow, onNoFollowChange, postTypeName } ) => {
	return <LocationConsumer>
		{ location => {
			const id = join( [ "yoast-meta-robots-nofollow", location ] );

			return <RadioButtonGroup
				id={ id }
				options={ [ { value: "0", label: "Yes" }, { value: "1", label: "No" } ] }
				label={ sprintf(
					/* Translators: %s translates to the Post Label in singular form */
					__( "Should search engines follow links on this %s", "wordpress-seo" ),
					postTypeName
				) }
				groupName={ id }
				onChange={ onNoFollowChange }
				selected={ noFollow }
				linkTo={ wpseoAdminL10n[ "shortlinks.advanced.follow_links" ] }
				linkText={ __( "Learn more about the no-follow setting on our help page.", "wordpress-seo" ) }
			/>;
		} }
	</LocationConsumer>;
};

MetaRobotsNoFollow.propTypes = {
	noFollow: PropTypes.string.isRequired,
	onNoFollowChange: PropTypes.func.isRequired,
	postTypeName: PropTypes.string.isRequired,
};

/**
 * Functional component for the Meta Robots Advanced field.
 *
 * @param {Object} props The props object
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
 * @param {Object} props The props object
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
 * @param {Object} props The props object
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
 * @param {Object} props The props object
 *
 * @returns {wp.Element} The AdvancedSettings component.
 */
const AdvancedSettings = ( props ) => {
	const {
		noIndex,
		noFollow,
		advanced,
		breadcrumbsTitle,
		canonical,
		onNoIndexChange,
		onNoFollowChange,
		onAdvancedChange,
		onBreadcrumbsTitleChange,
		onCanonicalChange,
		onLoad,
		isLoading,
		editorContext,
		isBreadcrumbsDisabled,
		isPrivateBlog,
	} = props;

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
		postTypeName: editorContext.postTypeNameSingular,
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

AdvancedSettings.defaultProps = {
	advanced: [],
	onAdvancedChange: () => {},
	noFollow: "",
	onNoFollowChange: () => {},
	breadcrumbsTitle: "",
	onBreadcrumbsTitleChange: () => {},
	isPrivateBlog: false,
};

export default AdvancedSettings;

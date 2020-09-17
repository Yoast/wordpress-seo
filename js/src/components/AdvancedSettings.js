import { __, sprintf } from "@wordpress/i18n";
import { MultiSelect, Select } from "@yoast/components";
import { RadioButtonGroup } from "@yoast/components";
import { TextInput } from "@yoast/components";
import { Fragment, useEffect } from "@wordpress/element";
import { Alert } from "@yoast/components";
import PropTypes from "prop-types";

/**
 * Boolean that tells whether the current object refers to a post or a taxonomy.
 *
 * @returns {Boolean} Whether this is a post or not.
 */
const isPost = () => !! window.wpseoScriptData.isPost;

/**
 * If location is not empty, we append it to the id, to keep id's unique.
 *
 * @param {string} id       The id.
 * @param {string} location The location.
 *
 * @returns {string} The hopefully unique id.
 */
const appendLocation = ( id, location ) => {
	if ( location ) {
		return `${ id }_${ location }`;
	}

	return id;
};

/**
 * The values that are used for the noIndex field differ for posts and taxonomies. This function returns an array of
 * options that can be used to populate a select field.
 *
 * @param {Object} editorContext An object containing context about this editor.
 *
 * @returns {void} Array Returns an array of options for the noIndex setting.
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
					editorContext.postTypeNamePlural,
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
				editorContext.postTypeNamePlural,
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
 * @returns {Component} The Meta Robots No-Index component.
 */
const MetaRobotsNoIndex = ( { noIndex, onNoIndexChange, editorContext, isPrivateBlog, location } ) => {
	const metaRobotsNoIndexOptions = getNoIndexOptions( editorContext );
	const id = appendLocation( "yoast_wpseo_meta-robots-noindex-react", location );
	return <Fragment>
		{
			isPrivateBlog &&
			<Alert type="warning">
				{ __(
					"Even though you can set the meta robots setting here, the entire site is set to noindex in the sitewide privacy settings, " +
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
					editorContext.postTypeNameSingular,
				) }
			onChange={ onNoIndexChange }
			name={ "yoast_wpseo_meta-robots-noindex-react" }
			id={ id }
			options={ metaRobotsNoIndexOptions }
			selected={ noIndex }
			linkTo={ "https://yoa.st/allow-search-engines" }
			linkText={ __( "Learn more about the no-index setting on our help page.", "wordpress-seo" ) }
		/>
	</Fragment>;
};

MetaRobotsNoIndex.propTypes = {
	noIndex: PropTypes.string.isRequired,
	onNoIndexChange: PropTypes.func.isRequired,
	editorContext: PropTypes.object.isRequired,
	isPrivateBlog: PropTypes.bool,
	location: PropTypes.string,
};

MetaRobotsNoIndex.defaultProps = {
	isPrivateBlog: false,
	location: "",
};

/**
 * Functional component for the Meta Robots No-Follow option.
 *
 * @returns {Component} The Meta Robots No-Follow option.
 */
const MetaRobotsNoFollow = ( { noFollow, onNoFollowChange, postTypeName } ) => {
	return <RadioButtonGroup
		options={ [ { value: "0", label: "Yes" }, { value: "1", label: "No" } ] }
		label={ sprintf(
			/* Translators: %s translates to the Post Label in singular form */
			__( "Should search engines follow links on this %s", "wordpress-seo" ),
			postTypeName,
		) }
		groupName="yoast_wpseo_meta-robots-nofollow-react"
		onChange={ onNoFollowChange }
		selected={ noFollow }
		linkTo={ "https://yoa.st/follow-links" }
		linkText={ __( "Learn more about the no-follow setting on our help page.", "wordpress-seo" ) }
	/>;
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
 * @returns {Component} The Meta Robots advanced field component.
 */
const MetaRobotsAdvanced = ( { advanced, onAdvancedChange, location } ) => {
	const id = appendLocation( "yoast_wpseo_meta-robots-adv-react", location );
	const inputId = appendLocation( "yoast_wpseo_meta-robots-adv-input", location );

	return <MultiSelect
		label={ __( "Meta robots advanced", "wordpress-seo" ) }
		onChange={ onAdvancedChange }
		name="yoast_wpseo_meta-robots-adv-react"
		id={ id }
		inputId={ inputId }
		options={ [
			{ name: __( "No Image Index", "wordpress-seo" ), value: "noimageindex" },
			{ name: __( "No Archive", "wordpress-seo" ), value: "noarchive" },
			{ name: __( "No Snippet", "wordpress-seo" ), value: "nosnippet" },
		] }
		selected={ advanced }
		linkTo={ "https://yoa.st/meta-robots-advanced" }
		linkText={ __( "Learn more about advanced meta robots settings on our help page.", "wordpress-seo" ) }
	/>;
};

MetaRobotsAdvanced.propTypes = {
	advanced: PropTypes.array.isRequired,
	onAdvancedChange: PropTypes.func.isRequired,
	location: PropTypes.string,
};

MetaRobotsAdvanced.defaultProps = {
	location: "",
};

/**
 * Functional component for the Breadcrumbs Title.
 *
 * @param {Object} props The props object
 *
 * @returns {Component} The Breadcrumbs title component.
 */
const BreadcrumbsTitle = ( { breadcrumbsTitle, onBreadcrumbsTitleChange, location } ) => {
	const id = appendLocation( "yoast_wpseo_bctitle-react", location );

	return <TextInput
		label={ __( "Breadcrumbs Title", "wordpress-seo" ) }
		id={ id }
		name="yoast_wpseo_bctitle-react"
		onChange={ onBreadcrumbsTitleChange }
		value={ breadcrumbsTitle }
		linkTo={ "https://yoa.st/breadcrumbs-title" }
		linkText={ __( "Learn more about the breadcrumbs title setting on our help page.", "wordpress-seo" ) }
	/>;
};

BreadcrumbsTitle.propTypes = {
	breadcrumbsTitle: PropTypes.string.isRequired,
	onBreadcrumbsTitleChange: PropTypes.func.isRequired,
	location: PropTypes.string,
};

BreadcrumbsTitle.defaultProps = {
	location: "",
};

/**
 * Functional component for the Canonical URL.
 *
 * @param {Object} props The props object
 *
 * @returns {Component} The canonical URL component.
 */
const CanonicalURL = ( { canonical, onCanonicalChange, location } ) => {
	const id = appendLocation( "yoast_wpseo_canonical-react", location );

	return <TextInput
		label={ __( "Canonical URL", "wordpress-seo" ) }
		id={ id }
		name="yoast_wpseo_canonical-react"
		onChange={ onCanonicalChange }
		value={ canonical }
		linkTo={ "https://yoa.st/canonical-url" }
		linkText={ __( "Learn more about canonical URLs on our help page.", "wordpress-seo" ) }
	/>;
};

CanonicalURL.propTypes = {
	canonical: PropTypes.string.isRequired,
	onCanonicalChange: PropTypes.func.isRequired,
	location: PropTypes.string,
};

CanonicalURL.defaultProps = {
	location: "",
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
		location,
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
		location,
		editorContext,
		isPrivateBlog,
	};

	const noFollowProps = {
		noFollow,
		onNoFollowChange,
		location,
		postTypeName: editorContext.postTypeNameSingular,
	};

	const advancedProps = {
		advanced,
		onAdvancedChange,
		location,
	};
	const breadcrumbsTitleProps = {
		breadcrumbsTitle,
		onBreadcrumbsTitleChange,
		location,
	};

	const canonicalProps = {
		canonical,
		onCanonicalChange,
		location,
	};

	if ( isLoading ) {
		return null;
	}

	return (
		<Fragment>
			<MetaRobotsNoIndex { ...noIndexProps } />
			{ editorContext.isPost  && <MetaRobotsNoFollow { ...noFollowProps } /> }
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
	location: PropTypes.string,
};

AdvancedSettings.defaultProps = {
	location: "",
	advanced: [],
	onAdvancedChange: () => {},
	noFollow: "",
	onNoFollowChange: () => {},
	breadcrumbsTitle: "",
	onBreadcrumbsTitleChange: () => {},
	isPrivateBlog: false,
};

export default AdvancedSettings;

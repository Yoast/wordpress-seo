import React, { Fragment } from "react";
import styled from "styled-components";
import { Select } from "@yoast/components/src/select/Select";
import { __, sprintf } from "@wordpress/i18n";
import { createPortal } from "react-dom";
import HelpIcon from "@yoast/components/src/help-icon/HelpIcon";
import SidebarCollapsible from "./SidebarCollapsible";
import PropTypes from "prop-types";

const SchemaContainer = styled.div`
	padding: 16px;
`;

const schemaPageOptions = [
	{
		name: __( "Web Page", "wordpress-seo" ),
		value: "option-1",
	},
	{
		name: __( "Item Page", "wordpress-seo" ),
		value: "option-2",
	},
	{
		name: __( "About Page", "wordpress-seo" ),
		value: "option-3",
	},
	{
		name: __( "FAQ Page", "wordpress-seo" ),
		value: "option-4",
	},
	{
		name: __( "QA Page", "wordpress-seo" ),
		value: "option-5",
	},
	{
		name: __( "Profile Page", "wordpress-seo" ),
		value: "option-6",
	},
	{
		name: __( "Contact Page", "wordpress-seo" ),
		value: "option-7",
	},
	{
		name: __( "Medical Web Page", "wordpress-seo" ),
		value: "option-8",
	},
	{
		name: __( "Collection Page", "wordpress-seo" ),
		value: "option-9",
	},
	{
		name: __( "Checkout Page", "wordpress-seo" ),
		value: "option-10",
	},
	{
		name: __( "Real Estate Listing", "wordpress-seo" ),
		value: "option-11",
	},
	{
		name: __( "Search Results Page", "wordpress-seo" ),
		value: "option-12",
	},
	{
		/* translators: %1$s expands to "- " (a hyphen and a space), %2$s expands to " -" (a space and a hyphen) */
		name: sprintf( __( "%1$sNone%2$s", "wordpress-seo" ), "- ", " -" ),
		value: "option-13",
	},
];

const schemaArticleOptions = [
	{
		name: __( "Article", "wordpress-seo" ),
		value: "option-1",
	},
	{
		name: __( "Social Media Posting", "wordpress-seo" ),
		value: "option-2",
	},
	{
		name: __( "News Article", "wordpress-seo" ),
		value: "option-3",
	},
	{
		name: __( "Advertiser Content Article", "wordpress-seo" ),
		value: "option-4",
	},
	{
		name: __( "Satirical Article", "wordpress-seo" ),
		value: "option-5",
	},
	{
		name: __( "Scholary Article", "wordpress-seo" ),
		value: "option-6",
	},
	{
		name: __( "Tech Article", "wordpress-seo" ),
		value: "option-7",
	},
	{
		name: __( "Report", "wordpress-seo" ),
		value: "option-8",
	},
	{
		/* translators: %1$s expands to "- " (a hyphen and a space), %2$s expands to " -" (a space and a hyphen) */
		name: sprintf( __( "%1$sNone%2$s", "wordpress-seo" ), "- ", " -" ),
		value: "option-9",
	},
];

/**
 * Returns the content of the schema tab.
 *
 * @param {object} props Component props.
 *
 * @returns {React.Component} The schema tab content.
 */
const Content = ( props ) => (
	<Fragment>
		<div className="yoast-field-group__title">
			<b>{ props.helpTextTitle }</b>
			<HelpIcon
				linkTo={ props.helpTextLink }
				linkText={ __( "Ultimate structured data guide", "wordpress-seo" ) }
			/>
		</div>
		<p>
			{ props.helpTextDescription }
		</p>
		{ props.showAdditionalHelpText && <div className="yoast-field-group__title" style={ { paddingTop: 16, paddingBottom: 16 } }>
			<b>What type of page or content is this?</b>
			<HelpIcon
				linkTo={ props.additionalHelpTextLink }
				linkText={ __( "Learn more about page or content types", "wordpress-seo" ) }
			/>
		</div> }
		<Select
			id="yoast_wpseo_schema_page_type_react"
			name="schema_page_type"
			options={ schemaPageOptions }
			label={ __( "Page type", "wordpress-seo" ) }
			onChange={ props.schemaPageTypeChange }
			selected={ props.schemaPageTypeSelected }
		/>
		{ props.showArticleTypeInput && <Select
			id="yoast_wpseo_schema_article_type_react"
			name="schema_article_type"
			options={ schemaArticleOptions }
			label={ __( "Article type", "wordpress-seo" ) }
			onChange={ props.schemaArticleTypeChange }
			selected={ props.schemaArticleTypeSelected }
		/> }
		{ props.showFooter && <p>
			You can change the default type for Posts in your
			<a href="/wp-admin/admin.php?page=wpseo_titles#top#post-types"> Search Appearance settings</a>.
		</p> }
	</Fragment>
);

Content.propTypes = {
	showFooter: PropTypes.bool,
	showAdditionalHelpText: PropTypes.bool,
	schemaPageTypeChange: PropTypes.func,
	schemaPageTypeSelected: PropTypes.string,
	schemaArticleTypeChange: PropTypes.func,
	schemaArticleTypeSelected: PropTypes.string,
	showArticleTypeInput: PropTypes.bool.isRequired,
	additionalHelpTextLink: PropTypes.string.isRequired,
	helpTextLink: PropTypes.string.isRequired,
	helpTextTitle: PropTypes.string.isRequired,
	helpTextDescription: PropTypes.string.isRequired,
};

Content.defaultProps = {
	showFooter: true,
	showAdditionalHelpText: true,
	schemaPageTypeChange: () => {},
	schemaPageTypeSelected: null,
	schemaArticleTypeChange: () => {},
	schemaArticleTypeSelected: null,
};

/**
 * Renders the schema tab.
 *
 * @param {object} props The component props.
 *
 * @returns {React.Component} The schema tab.
 */
const SchemaTab = ( props ) => {
	if ( props.isMetabox ) {
		return createPortal(
			<SchemaContainer>
				<Content { ...props } />
			</SchemaContainer>,
			document.getElementById( "wpseo-meta-section-schema" )
		);
	}

	return (
		<SidebarCollapsible
			title={ __( "Schema", "wordpress-seo" ) }
		>
			<Content { ...props } />
		</SidebarCollapsible>
	);
};

SchemaTab.propTypes = {
	showArticleTypeInput: PropTypes.bool,
	articleTypeLabel: PropTypes.string,
	additionalHelpTextLink: PropTypes.string,
	pageTypeLabel: PropTypes.string.isRequired,
	helpTextLink: PropTypes.string.isRequired,
	helpTextTitle: PropTypes.string.isRequired,
	helpTextDescription: PropTypes.string.isRequired,
	isMetabox: PropTypes.bool.isRequired,
};

SchemaTab.defaultProps = {
	showArticleTypeInput: false,
	articleTypeLabel: "",
	additionalHelpTextLink: "",
};

export default SchemaTab;

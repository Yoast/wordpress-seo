import { useSelect } from "@wordpress/data";
import { createInterpolateElement, useCallback, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Section } from "@yoast/admin-ui-toolkit/components";

import { REDUX_STORE_KEY } from "../../constants";
import { parseUrl } from "../../helpers";
import FieldArray from "../field-array";
import ImageSelect from "../image-select";
import Page from "../page";
import RadioButton from "../radio-button";
import Select from "../select";
import TextInput from "../text-input";

/**
 * Renders the organization section.
 *
 * @returns {JSX.Element} The OrganizationSection.
 */
function OrganizationSection() {
	const { showSocialProfiles, isOrganizationInfoMissing, organizationInfoIsMissingLink } = useSelect( select => {
		const { getData, getOption } = select( REDUX_STORE_KEY );
		const hasOrganizationName = Boolean( getData( "schema.siteRepresentation.organizationName", "" ) );
		const hasOrganizationLogo = Boolean( getData( "schema.siteRepresentation.organizationLogo.url", "" ) );
		const link = getOption( "schema.organizationInfoIsMissingLink" );

		return {
			showSocialProfiles: getOption( "schema.socialProfiles" ),
			isOrganizationInfoMissing: ! ( hasOrganizationName && hasOrganizationLogo && link ),
			organizationInfoIsMissingLink: link,
		};
	} );

	const Field = useCallback( ( { item: profile, dataPath } ) => {
		const url = parseUrl( profile );
		const label = url ? url.hostname : __( "Add another profile", "admin-ui" );
		return <TextInput
			dataPath={ dataPath }
			id={ dataPath }
			label={ label }
			placeholder={ __( "E.g. https://youtube.com/user/yoastcom", "admin-ui" ) }
			value={ profile }
		/>;
	}, [] );

	return <>
		<Section
			title={ __( "Organization", "admin-ui" ) }
			description={ __( "Please tell us more about your organization.", "admin-ui" ) }
		>
			{ isOrganizationInfoMissing && <Alert type="warning">
				<p>
					{ __( "An organization name and logo need to be set for structured data to work properly. ", "admin-ui" ) }
					<a
						href={ organizationInfoIsMissingLink }
						className="yst-text-yellow-800 yst-font-medium"
						target="_blank"
						rel="noopener noreferrer"
					>{ __( "Learn more about the importance of structured data.", "admin-ui" ) }</a>
				</p>
			</Alert> }

			<TextInput
				id="organization-name"
				label={ __( "Organization name", "admin-ui" ) }
				dataPath="schema.siteRepresentation.organizationName"
				className="yst-mb-8"
			/>
			<ImageSelect
				label={ __( "Organization logo", "admin-ui" ) }
				id="organization-logo"
				imageAltText=""
				dataPath="schema.siteRepresentation.organizationLogo"
			/>
		</Section>
		{ showSocialProfiles && <Section
			title={ __( "Other profiles", "admin-ui" ) }
			description={ __( "Tell us if you have any other profiles on the web that belong to your organization. This can be any number of profiles, like YouTube, LinkedIn, Pinterest or even Wikipedia.", "admin-ui" ) }
		>
			<TextInput
				label={ __( "Facebook", "admin-ui" ) }
				dataPath="schema.socialProfiles.facebookPageUrl"
				id="facebook-page-url"
				name="facebook-page-url"
				placeholder="https://facebook.com/yoast"
				className="yst-mb-8"
			/>
			<TextInput
				label={ __( "Instagram", "admin-ui" ) }
				dataPath="schema.socialProfiles.instagramUrl"
				id="instagram-url"
				name="instagram-url"
				placeholder="https://instagram.com/yoast"
				className="yst-mb-8"
			/>
			<TextInput
				label={ __( "Twitter", "admin-ui" ) }
				dataPath="schema.socialProfiles.twitterProfileUrl"
				id="twitter-profile-url"
				name="twitter-profile-url"
				placeholder="https://twitter.com/yoast"
				className="yst-mb-8"
			/>
			<FieldArray
				dataPath="schema.socialProfiles.other"
				addButtonChildren={ __( "Add another profile", "admin-ui" ) }
				fieldAs={ Field }
			/>
		</Section> }
	</>;
}

/**
 * Renders the person section.
 *
 * @returns {JSX.Element} The Person Section.
 */
function PersonSection() {
	const { personName, users, currentUserProfileEditLink } = useSelect( select => {
		const { getData, getOption } = select( REDUX_STORE_KEY );
		const person = getData( "schema.siteRepresentation.personName" );
		const usersOption = getOption( "schema.users" );
		const user = usersOption.find( userOption => userOption.value === person );

		return {
			personName: person,
			users: usersOption,
			currentUserProfileEditLink: user ? user.profileEditLink : "",
		};
	} );

	return <Section
		title={ __( "Personal info", "admin-ui" ) }
		description={ __( "Please tell us more about the person this site represents.", "admin-ui" ) }
	>
		<Select
			choices={ users }
			dataPath={ "schema.siteRepresentation.personName" }
			id="user-select"
			label={ __( "Name", "admin-ui" ) }
		/>
		<Alert type="info">
			<p>
				{
					// translators: %s is replaced by a person's name.
					sprintf( __( "You have selected the user %s as the person this site represents. Their user profile information will now be used in search results.", "admin-ui" ), personName ) + " "
				}
				<a
					href={ currentUserProfileEditLink }
					className="yst-text-blue-800 yst-font-medium"
					target="_blank"
					rel="noopener noreferrer"
				>{ __( "Update their profile to make sure the information is correct.", "admin-ui" ) }</a>
			</p>
		</Alert>
		<ImageSelect
			label={ __( "Personal logo or avatar", "admin-ui" ) }
			id="person-avatar"
			imageAltText=""
			dataPath="schema.siteRepresentation.personAvatar"
		/>
	</Section>;
}

/**
 * The Site Representation Page component.
 *
 * @returns {WPElement} The Site Representation Page.
 */
export default function SiteRepresentation() {
	const knowledgeGraphInfoLink = useSelect( select => select( REDUX_STORE_KEY ).getOption( "schema.knowledgeGraphInfoLink" ), [] );
	const hasPersonRepresentation = useSelect( select => select( REDUX_STORE_KEY ).getOption( "schema.hasPersonRepresentation" ), [] );
	const organizationOrPerson = useSelect( select => select( REDUX_STORE_KEY ).getData( "schema.siteRepresentation.organizationOrPerson" ), [] );

	// If personal representation is possible, and the user has selected it, render the PersonSection.
	const RepresentationSection = ( hasPersonRepresentation && organizationOrPerson === "person" ) ? PersonSection : OrganizationSection;

	// translators: %1$s is replaced by an opening anchor tag. %2$s is replaced by a closing anchor tag.
	let pageDescription = __( "This info is intended to appear in %1$sGoogle's Knowledge Graph%2$s.", "admin-ui" );

	// Append a clarification if the user can choose personal representation as well.
	if ( hasPersonRepresentation ) {
		pageDescription += " " + __( "You can be either an organization, or a person.", "admin-ui" );
	}

	pageDescription = useMemo( () => createInterpolateElement(
		sprintf( pageDescription, "<a>", "</a>" ),
		{
			/* eslint-disable-next-line jsx-a11y/anchor-has-content */
			a: <a href={ knowledgeGraphInfoLink } target="_blank" rel="noopener noreferrer" />,
		},
	), [ pageDescription, knowledgeGraphInfoLink ] );

	return (
		<Page
			title={ __( "Site representation", "admin-ui" ) }
			description={ pageDescription }
		>
			{ hasPersonRepresentation && <Section>
				<p className="yst-mb-6">Choose whether your site represents an organization or a person.</p>
				<RadioButton
					id="organization"
					name="organization-person"
					value="organization"
					label={ __( "Organization", "admin-ui" ) }
					dataPath="schema.siteRepresentation.organizationOrPerson"
				/>
				<RadioButton
					id="person"
					name="organization-person"
					value="person"
					label={ __( "Person", "admin-ui" ) }
					dataPath="schema.siteRepresentation.organizationOrPerson"
					className="yst-mt-4"
				/>
			</Section> }
			<RepresentationSection />
		</Page>
	);
}

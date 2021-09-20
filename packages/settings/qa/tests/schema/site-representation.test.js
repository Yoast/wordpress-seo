import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { navigateByNavText } from "@yoast/admin-ui-toolkit/helpers";
import { merge } from "lodash";

import falseConfig from "../../test-configs/false-config";
import trueConfigEmptyData from "../../test-configs/true-config-empty-data";
import trueConfigTestData from "../../test-configs/true-config-test-data";
import { startTheApp } from "../helpers";

/* eslint-disable max-statements */
let testConfig;

describe( "The site representation screen with all options set to false", () => {
	afterEach( cleanup );
	beforeEach( () => {
		// Render the target element.
		render( <div id="app" /> );

		// Reset the test config.
		testConfig = merge( {}, falseConfig );

		// Adjust the falseConfig for testing this test: siteRepresentation needs to be true to render the site representation page.
		testConfig.options.schema.siteRepresentation = true;

		// Reset the route.
		window.location.hash = "#/";
	} );

	it( "cannot be navigated to when options.schema.siteRepresentation is false", () => {
		// Overriding the beforeEach to specifically test the siteRepresentation option set to false.
		testConfig.options.schema.siteRepresentation = false;

		// Start and navigate to the site representation page.
		startTheApp( testConfig );

		expect( () => navigateByNavText( "Site representation" ) ).toThrowError( "Unable to find an element with the text: Site representation" );
	} );

	it( "can be navigated to from a different page when options.schema.siteRepresentation is true", () => {
		// Start and navigate to the site representation page.
		startTheApp( testConfig, "Site defaults" );

		navigateByNavText( "Site representation" );
		// Are we on the Site representation page? The should be an H1 with Site representation at the top.
		const currentH1 = screen.getByRole( "heading", { level: 1 } );
		expect( currentH1.innerHTML ).toEqual( "Site representation" );
	} );

	it( "has an organization section that looks like it should", () => {
		startTheApp( testConfig, "Site representation" );

		// Page description is present.
		const description = screen.getByText( "This info is intended to appear in ", { exact: false } );
		const infoLink = within( description ).getByRole( "link" );
		expect( infoLink.href ).toBe( "http://localhost/" );
		expect( infoLink.target ).toBe( "_blank" );
		expect( infoLink.rel ).toBe( "noopener noreferrer" );

		// Because socialProfiles is set to false, we expect only one H2: that of organization.
		expect( screen.getByRole( "heading", { level: 2 } ).innerHTML ).toEqual( "Organization" );

		// There should be description about this section
		screen.getByText( "Please tell us more about your organization." );

		// Since there is no Organization name and logo set, we should show an alert with a link to an explanation.
		const OrganizationDataMissingAlert = screen.getByText( "An organization name and logo need to be set for structured data to work properly." );
		expect( within( OrganizationDataMissingAlert ).getByRole( "link" ).href ).toEqual( testConfig.options.schema.organizationInfoIsMissingLink );

		// Organization name input
		expect( screen.getByLabelText( "Organization name" ).tagName ).toEqual( "INPUT" );

		// Organization logo input is a button
		const ImageButton = screen.getByLabelText( "Organization logo" );
		expect( ImageButton.tagName ).toEqual( "BUTTON" );

		// Because it's empty, has the SVG with the photograph icon. An id was added to it for easy targeting.
		expect( document.getElementById( "organization-logo-no-image-svg" ) ).toBeInTheDocument();

		// There is also one button with "Select image", no "Remove image button";
		screen.getByText( "Select image" );
		expect( screen.queryByText( "Remove image" ) ).toBeNull();

		// There is a save button
		screen.getByText( "Save changes" );
	} );

	it( "has a person section that looks like it should", () => {
		/*
		 The hasPersonRepresentation option removes the organization/person toggle when set to false.
		 For testing purposes, we set it to true, so that we can make assertions for the person section as well.
		 */
		testConfig.options.schema.hasPersonRepresentation = true;
		startTheApp( testConfig, "Site representation" );

		// Page description is present, including clarification on being a person.
		const description = screen.getByText( "This info is intended to appear in ", { exact: false } );
		expect( description.textContent )
			.toBe( "This info is intended to appear in Google's Knowledge Graph. You can be either an organization, or a person." );
		const infoLink = within( description ).getByRole( "link" );
		expect( infoLink.href ).toBe( "http://localhost/" );
		expect( infoLink.target ).toBe( "_blank" );
		expect( infoLink.rel ).toBe( "noopener noreferrer" );

		// There is an explanation text about the toggle.
		screen.getByText( "Choose whether your site represents an organization or a person." );

		// There are radiobuttons for organization and person representation.
		screen.getByLabelText( "Organization" );
		const PersonToggle = screen.getByLabelText( "Person" );

		// Selecting organization will show the organization section and hide the person section.
		fireEvent.click( PersonToggle );

		// I expect only one H2: that of person. Person has no social profiles section.
		expect( screen.getByRole( "heading", { level: 2 } ).innerHTML ).toEqual( "Personal info" );

		// There should be description about this section
		screen.getByText( "Please tell us more about the person this site represents." );

		// There is a person name that opens a dropdown to select users.
		const SelectButton = screen.getByLabelText( "Name" );

		// No user selected and dropdown not present, so no user should be visible.
		testConfig.options.schema.users.forEach(
			( user ) => {
				expect( screen.queryByText( user.label ) ).toBeNull();
			},
		);

		// After clicking, the users should be visible and selectable as options
		fireEvent.click( SelectButton );
		const userOptions = screen.getAllByRole( "option" );
		testConfig.options.schema.users.forEach(
			( user ) => {
				// For each user, expect there to be an option.
				expect(
					userOptions.find( option => option.firstChild.innerHTML === user.label ),
				).toBeInTheDocument();
			},
		);

		// There is a personal logo or avatar image select.
		const ImageButton = screen.getByLabelText( "Personal logo or avatar" );
		expect( ImageButton.tagName ).toEqual( "BUTTON" );

		// Because it's empty, has the SVG with the photograph icon. An id was added to it for easy targeting.
		expect( document.getElementById( "person-avatar-no-image-svg" ) ).toBeInTheDocument();

		// There is also one button with "Select image", no "Remove image button";
		screen.getByText( "Select image" );
		expect( screen.queryByText( "Remove image" ) ).toBeNull();

		// There is a save button
		screen.getByText( "Save changes" );
	} );

	it( "has no organization/person toggle and description when hasPersonRepresentation is false", () => {
		startTheApp( testConfig, "Site representation" );

		// There is no mention of being able to be a person in the description.
		const description = screen.getByText( "This info is intended to appear in ", { exact: false } );
		const infoLink = within( description ).getByRole( "link" );
		expect( infoLink.href ).toBe( "http://localhost/" );
		expect( infoLink.target ).toBe( "_blank" );
		expect( infoLink.rel ).toBe( "noopener noreferrer" );
		expect( screen.queryByText( "You can be either an organization, or a person." ) ).not.toBeInTheDocument();

		// There are NO radiobuttons for organization and person representation.
		expect( screen.queryByLabelText( "Organization" ) ).not.toBeInTheDocument();
		expect( screen.queryByLabelText( "Person" ) ).not.toBeInTheDocument();
	} );
} );

describe( "The site representation screen with all options set to true, but no data", () => {
	beforeEach( () => {
		// Render the target element.
		render( <div id="app" /> );

		// Reset the test config.
		testConfig = merge( {}, trueConfigEmptyData );

		// Reset the route.
		window.location.hash = "#/";
	} );

	it( "can be navigated to", () => {
		// Start and navigate to the site representation page.
		startTheApp( testConfig, "Site representation" );

		// Did we navigate to the Site representation page? The should be an H1 with Site representation at the top.
		const currentH1 = screen.getByRole( "heading", { level: 1 } );
		expect( currentH1.innerHTML ).toEqual( "Site representation" );
	} );

	it( "has an organization section that looks like it should", () => {
		startTheApp( testConfig, "Site representation" );

		// Page description is present.
		const description = screen.getByText( "This info is intended to appear in ", { exact: false } );
		expect( description.textContent )
			.toBe( "This info is intended to appear in Google's Knowledge Graph. You can be either an organization, or a person." );
		const infoLink = within( description ).getByRole( "link" );
		expect( infoLink.href ).toBe( "http://localhost/" );
		expect( infoLink.target ).toBe( "_blank" );
		expect( infoLink.rel ).toBe( "noopener noreferrer" );

		// There is an explanation text about the toggle.
		screen.getByText( "Choose whether your site represents an organization or a person." );

		// There are radiobuttons for organization and person representation.
		const OrganizationToggle = screen.getByLabelText( "Organization" );
		screen.getByLabelText( "Person" );

		// Selecting organization will show the organization section and hide the person section.
		fireEvent.click( OrganizationToggle );

		// Because socialProfiles is set to true, we expect two H2's: that of organization and that of social profiles.
		const h2list = screen.getAllByRole( "heading", { level: 2 } );
		expect( h2list[ 0 ].innerHTML ).toEqual( "Organization" );
		expect( h2list[ 1 ].innerHTML ).toEqual( "Other profiles" );

		// There should be a description about the organization section
		screen.getByText( "Please tell us more about your organization." );

		// Since there is no Organization name and logo set, we should show an alert with a link to an explanation.
		const OrganizationDataMissingAlert = screen.getByText( "An organization name and logo need to be set for structured data to work properly." );
		expect( within( OrganizationDataMissingAlert ).getByRole( "link" ).href ).toEqual( testConfig.options.schema.organizationInfoIsMissingLink );

		// Organization name input
		const OrganizationNameInput = screen.getByLabelText( "Organization name" );
		expect( OrganizationNameInput.tagName ).toEqual( "INPUT" );

		// Organization logo input is a button
		const ImageButton = screen.getByLabelText( "Organization logo" );
		expect( ImageButton.tagName ).toEqual( "BUTTON" );

		// Because it's empty, has the SVG with the photograph icon. An id was added to it for easy targeting.
		expect( document.getElementById( "organization-logo-no-image-svg" ) ).toBeInTheDocument();

		// There is also one button with "Select image", no "Remove image button";
		screen.getByText( "Select image" );
		expect( screen.queryByText( "Remove image" ) ).toBeNull();

		// Adding a logo and a button should make the alert disappear.
		userEvent.type( OrganizationNameInput, "test organization name" );
		expect( OrganizationNameInput ).toHaveValue( "test organization name" );
		userEvent.click( ImageButton );

		expect( document.getElementById( "organization-logo-no-image-svg" ) ).not.toBeInTheDocument();
		expect( OrganizationDataMissingAlert ).not.toBeInTheDocument();

		// There is an other profiles section with a description and inputs.
		screen.getByText(
			"Tell us if you have any other profiles on the web that belong to your organization. " +
			"This can be any number of profiles, like YouTube, LinkedIn, Pinterest or even Wikipedia.",
		);

		const FacebookInput = screen.getByLabelText( "Facebook" );
		const InstagramInput = screen.getByLabelText( "Instagram" );
		const TwitterInput = screen.getByLabelText( "Twitter" );
		expect( FacebookInput.placeholder ).toEqual( "https://facebook.com/yoast" );
		expect( FacebookInput.value ).toEqual( "" );
		expect( InstagramInput.placeholder ).toEqual( "https://instagram.com/yoast" );
		expect( InstagramInput.value ).toEqual( "" );
		expect( TwitterInput.placeholder ).toEqual( "https://twitter.com/yoast" );
		expect( TwitterInput.value ).toEqual( "" );

		// There is a button to add another profile.
		expect( screen.getByText( "Add another profile" ).tagName ).toEqual( "BUTTON" );

		// There is a save button
		screen.getByText( "Save changes" );
	} );

	it( "has a person section that looks like it should", () => {
		startTheApp( testConfig, "Site representation" );

		// Page description is present, including clarification on being a person.
		const description = screen.getByText( "This info is intended to appear in ", { exact: false } );
		expect( description.textContent )
			.toBe( "This info is intended to appear in Google's Knowledge Graph. You can be either an organization, or a person." );
		const infoLink = within( description ).getByRole( "link" );
		expect( infoLink.href ).toBe( "http://localhost/" );
		expect( infoLink.target ).toBe( "_blank" );
		expect( infoLink.rel ).toBe( "noopener noreferrer" );

		// There is an explanation text about the toggle.
		screen.getByText( "Choose whether your site represents an organization or a person." );

		// There are radiobuttons for organization and person representation.
		screen.getByLabelText( "Organization" );
		const PersonToggle = screen.getByLabelText( "Person" );

		// Selecting organization will show the organization section and hide the person section.
		fireEvent.click( PersonToggle );

		// I expect only one H2: that of person. Person has no social profiles section.
		expect( screen.getByRole( "heading", { level: 2 } ).innerHTML ).toEqual( "Personal info" );

		// There should be description about this section
		screen.getByText( "Please tell us more about the person this site represents." );

		// There is a person name that opens a dropdown to select users.
		const SelectButton = screen.getByLabelText( "Name" );

		// No user selected and dropdown not present, so no user should be visible.
		testConfig.options.schema.users.forEach(
			( user ) => {
				expect( screen.queryByText( user.label ) ).toBeNull();
			},
		);

		// After clicking, the users should be visible and selectable as options
		fireEvent.click( SelectButton );
		const userOptions = screen.getAllByRole( "option" );
		testConfig.options.schema.users.forEach(
			( user ) => {
				// For each user, expect there to be an option.
				expect(
					userOptions.find( option => option.firstChild.innerHTML === user.label ),
				).toBeInTheDocument();
			},
		);

		// There is a personal logo or avatar image select.
		const ImageButton = screen.getByLabelText( "Personal logo or avatar" );
		expect( ImageButton.tagName ).toEqual( "BUTTON" );

		// Because it's empty, has the SVG with the photograph icon. An id was added to it for easy targeting.
		expect( document.getElementById( "person-avatar-no-image-svg" ) ).toBeInTheDocument();

		// There is also one button with "Select image", no "Remove image button";
		screen.getByText( "Select image" );
		expect( screen.queryByText( "Remove image" ) ).toBeNull();

		// There is a save button
		screen.getByText( "Save changes" );
	} );
} );

describe( "The site representation screen with all options set to true, hydrated with data", () => {
	beforeEach( () => {
		// Render the target element.
		render( <div id="app" /> );

		// Reset the test config.
		testConfig = merge( {}, trueConfigTestData );

		// Reset the route.
		window.location.hash = "#/";
	} );

	it( "can be navigated to", () => {
		// Start and navigate to the site representation page.
		startTheApp( testConfig, "Site representation" );

		// Did we navigate to the Site representation page? The should be an H1 with Site representation at the top.
		const currentH1 = screen.getByRole( "heading", { level: 1 } );
		expect( currentH1.innerHTML ).toEqual( "Site representation" );
	} );

	it( "has an organization section that looks like it should", () => {
		startTheApp( testConfig, "Site representation" );

		// Page description is present.
		const description = screen.getByText( "This info is intended to appear in ", { exact: false } );
		expect( description.textContent )
			.toBe( "This info is intended to appear in Google's Knowledge Graph. You can be either an organization, or a person." );
		const infoLink = within( description ).getByRole( "link" );
		expect( infoLink.href ).toBe( "http://localhost/" );
		expect( infoLink.target ).toBe( "_blank" );
		expect( infoLink.rel ).toBe( "noopener noreferrer" );

		// There is an explanation text about the toggle.
		screen.getByText( "Choose whether your site represents an organization or a person." );

		// There are radiobuttons for organization and person representation.
		const OrganizationToggle = screen.getByLabelText( "Organization" );
		screen.getByLabelText( "Person" );

		// Selecting organization will show the organization section and hide the person section.
		fireEvent.click( OrganizationToggle );

		// Because socialProfiles is set to true, we expect two H2's: that of organization and that of social profiles.
		const h2list = screen.getAllByRole( "heading", { level: 2 } );
		expect( h2list[ 0 ].innerHTML ).toEqual( "Organization" );
		expect( h2list[ 1 ].innerHTML ).toEqual( "Other profiles" );

		// There should be description about this section
		screen.getByText( "Please tell us more about your organization." );

		// Because the Organization logo and name are set, no alert should be shown
		/* eslint-disable-next-line require-jsdoc */
		const getOrganizationDataMissingAlert = () => screen.queryByText( "An organization name and logo need to be set for structured data to work properly." );
		expect( getOrganizationDataMissingAlert() ).not.toBeInTheDocument();

		// Organization name input
		const OrganizationInput = screen.getByLabelText( "Organization name" );
		expect( OrganizationInput.value ).toEqual( "test organization" );

		// Organization logo input is a button
		const ImageButton = screen.getByLabelText( "Organization logo" );
		expect( ImageButton.tagName ).toEqual( "BUTTON" );

		// Organization logo matches the provided data
		expect( ImageButton.querySelector( "img" ).src ).toEqual( testConfig.data.schema.siteRepresentation.organizationLogo.url );

		// Because it's not empty, there is no photograph icon svg.
		expect( document.getElementById( "organization-logo-no-image-svg" ) ).not.toBeInTheDocument();

		// There is also one button with "Replace image", not "Select image", and a "Remove image button";
		const RemoveImageButton = screen.getByText( "Remove image" );
		expect( screen.getByText( "Replace image" ).tagName ).toEqual( "BUTTON" );
		expect( RemoveImageButton.tagName ).toEqual( "BUTTON" );
		expect( screen.queryByText( "Select image" ) ).not.toBeInTheDocument();

		// Removing the name and logo makes the alert re-appear.
		userEvent.click( RemoveImageButton );
		userEvent.clear( OrganizationInput );
		expect( OrganizationInput.value ).toEqual( "" );
		expect( document.getElementById( "organization-logo-no-image-svg" ) ).toBeInTheDocument();
		expect( getOrganizationDataMissingAlert() ).toBeInTheDocument();

		// There is an other profiles section with a description and inputs.
		screen.getByText(
			"Tell us if you have any other profiles on the web that belong to your organization. " +
			"This can be any number of profiles, like YouTube, LinkedIn, Pinterest or even Wikipedia.",
		);

		const FacebookInput = screen.getByLabelText( "Facebook" );
		const InstagramInput = screen.getByLabelText( "Instagram" );
		const TwitterInput = screen.getByLabelText( "Twitter" );
		expect( FacebookInput.placeholder ).toEqual( "https://facebook.com/yoast" );
		expect( FacebookInput.value ).toEqual( testConfig.data.schema.socialProfiles.facebookPageUrl );
		expect( InstagramInput.placeholder ).toEqual( "https://instagram.com/yoast" );
		expect( InstagramInput.value ).toEqual( testConfig.data.schema.socialProfiles.instagramUrl );
		expect( TwitterInput.placeholder ).toEqual( "https://twitter.com/yoast" );
		expect( TwitterInput.value ).toEqual( testConfig.data.schema.socialProfiles.twitterProfileUrl );

		// An "other" social profile has been passed. So there should be an input field for it. And a delete button.
		const OtherInput = screen.getByLabelText( "other-test.nl" );
		expect( OtherInput.value ).toEqual( testConfig.data.schema.socialProfiles.other[ 0 ] );
		expect( screen.getByText( "Delete item" ).parentElement.tagName ).toEqual( "BUTTON" );

		// There is a button to add another profile.
		expect( screen.getByText( "Add another profile" ).tagName ).toEqual( "BUTTON" );

		// There is a save button
		screen.getByText( "Save changes" );
	} );

	it( "has a person section that looks like it should", () => {
		startTheApp( testConfig, "Site representation" );

		// Page description is present, including clarification on being a person.
		const description = screen.getByText( "This info is intended to appear in ", { exact: false } );
		expect( description.textContent )
			.toBe( "This info is intended to appear in Google's Knowledge Graph. You can be either an organization, or a person." );
		const infoLink = within( description ).getByRole( "link" );
		expect( infoLink.href ).toBe( "http://localhost/" );
		expect( infoLink.target ).toBe( "_blank" );
		expect( infoLink.rel ).toBe( "noopener noreferrer" );

		// There is an explanation text about the toggle.
		screen.getByText( "Choose whether your site represents an organization or a person." );

		// There are radiobuttons for organization and person representation.
		screen.getByLabelText( "Organization" );
		const PersonToggle = screen.getByLabelText( "Person" );

		// Selecting organization will show the organization section and hide the person section.
		fireEvent.click( PersonToggle );

		// I expect only one H2: that of person. Person has no social profiles section.
		expect( screen.getByRole( "heading", { level: 2 } ).innerHTML ).toEqual( "Personal info" );

		// There should be description about this section
		screen.getByText( "Please tell us more about the person this site represents." );

		// There is a person name that opens a dropdown to select users.
		const SelectButton = screen.getByLabelText( "Name" );

		// A user was selected but the dropdown is not open, so only the selected user should be visible.
		testConfig.options.schema.users.forEach(
			( user ) => {
				if ( user.label === testConfig.data.schema.siteRepresentation.personName ) {
					expect( screen.queryByText( user.label ) ).toBeInTheDocument();
					return;
				}
				expect( screen.queryByText( user.label ) ).toBeNull();
			},
		);

		// After clicking, the users should be visible and selectable as options
		fireEvent.click( SelectButton );
		const userOptions = screen.getAllByRole( "option" );
		testConfig.options.schema.users.forEach(
			( user ) => {
				// For each user, expect there to be an option.
				expect(
					userOptions.find( option => option.firstChild.innerHTML === user.label ),
				).toBeInTheDocument();
			},
		);

		// There is a personal logo or avatar image select.
		const ImageButton = screen.getByLabelText( "Personal logo or avatar" );
		expect( ImageButton.tagName ).toEqual( "BUTTON" );

		// Because it's not empty, there is no photograph icon svg.
		expect( document.getElementById( "person-avatar-no-image-svg" ) ).not.toBeInTheDocument();

		// Instead, there is a button with an image in it, that reflects the config.
		expect( ImageButton.querySelector( "img" ).src ).toEqual( testConfig.data.schema.siteRepresentation.personAvatar.url );

		// There is also one button with "Replace image", not "Select image", and a "Remove image button";
		expect( screen.getByText( "Replace image" ).tagName ).toEqual( "BUTTON" );
		expect( screen.getByText( "Remove image" ).tagName ).toEqual( "BUTTON" );
		expect( screen.queryByText( "Select image" ) ).not.toBeInTheDocument();

		// There is a save button
		screen.getByText( "Save changes" );
	} );
} );

describe( "The image select on the Site Representation page", () => {
	beforeEach( () => {
		// Render the target element.
		render( <div id="app" /> );

		// Reset the test config.
		testConfig = merge( {}, trueConfigEmptyData );

		// Reset the route.
		window.location.hash = "#/";
	} );

	// This is actually sort of a unit test, which seemed silly to throw away.
	it( "functions as intended", () => {
		startTheApp( testConfig, "Site representation" );

		expect( screen.getByRole( "heading", { level: 1 } ).innerHTML ).toEqual( "Site representation" );

		// Organization logo input is a button
		const ImageButton = screen.getByLabelText( "Organization logo" );
		expect( ImageButton.tagName ).toEqual( "BUTTON" );

		// When empty, has the SVG with the photograph icon. An id was added to it for easy targeting.
		expect( document.getElementById( "organization-logo-no-image-svg" ) ).toBeInTheDocument();

		// There is also one button with "Select image", no "Remove image button";
		const SelectImageButton = screen.getByText( "Select image" );
		expect( screen.queryByText( "Remove image" ) ).toBeNull();

		// Clicking the image will set an image (we mocked the imagePickerFunction).
		userEvent.click( ImageButton );

		// The image select button should now read "Replace image", and there should be a "Remove image" button. Also the empty svg is gone.
		expect( document.getElementById( "organization-logo-no-image-svg" ) ).not.toBeInTheDocument();
		expect( SelectImageButton.innerHTML ).toEqual( "Replace image" );
		const RemoveButton = screen.getByText( "Remove image" );

		// Clicking remove will empty the image button and remove the "Remove image" button.
		userEvent.click( RemoveButton );
		expect( document.getElementById( "organization-logo-no-image-svg" ) ).toBeInTheDocument();
		expect( screen.queryByText( "Remove image" ) ).not.toBeInTheDocument();
		expect( SelectImageButton.innerHTML ).toEqual( "Select image" );

		// Clicking the select image button also adds an image.
		fireEvent.click( SelectImageButton );
		expect( document.getElementById( "organization-logo-no-image-svg" ) ).not.toBeInTheDocument();
	} );
} );
/* eslint-enable max-statements */

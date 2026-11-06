// External dependencies.
import { act } from "react";
import { jsx } from "react/jsx-runtime";
import renderer from "react-test-renderer";
import { default as ReactSelect } from "react-select";

// Yoast dependencies.
import { colors } from "@yoast/style-guide";

// Internal dependencies.
import ArticleList from "../src/ArticleList";
import CardBanner from "../src/CardBanner";
import { CollapsibleStateless } from "../src/Collapsible";
import Heading from "../src/Heading";
import Icon from "../src/Icon";
import IconCTAEditButton from "../src/IconCTAEditButton";
import Label from "../src/Label";
import Loader from "../src/Loader";
import Notification from "../src/Notification";
import Paper from "../src/Paper";
import ProgressBar from "../src/ProgressBar";
import ScoreAssessments from "../src/ScoreAssessments";
import Section from "../src/Section";
import StackedProgressBar from "../src/StackedProgressBar";
import StyledSection from "../src/StyledSection";
import SvgIcon from "../src/SvgIcon";
import SynonymsInput from "../src/SynonymsInput";
import WordList from "../src/WordList";
import YouTubeVideo from "../src/YouTubeVideo";
import { Button, ButtonStyledLink } from "../src/button/Button";
import IconButton from "../src/buttons/IconButton";
import IconLabeledButton from "../src/buttons/IconLabeledButton";
import { UpsellButtonBase } from "../src/buttons/UpsellButton";
import { YoastButton, YoastButtonBase } from "../src/buttons/YoastButton";
import { YoastLinkButton } from "../src/buttons/YoastLinkButton";
import Checkbox from "../src/checkbox/Checkbox";
import DataModel from "../src/data-model/DataModel";
import FieldGroup from "../src/field-group/FieldGroup";
import HelpIcon from "../src/help-icon/HelpIcon";
import ImageSelect from "../src/image-select/ImageSelect";
import ImageSelectButtons from "../src/image-select/ImageSelectButtons";
import TextArea from "../src/inputs/TextArea";
import TextInput from "../src/inputs/TextInput";
import NewBadge from "../src/new-badge/NewBadge";
import PremiumBadge from "../src/premium-badge/PremiumBadge";
import RadioButtonGroup from "../src/radiobutton/RadioButtonGroup";
import { MultiSelect, SingleSelect, YoastReactSelect } from "../src/select/Select";
import { CellPrimary } from "../src/table/Cell";
import { Row } from "../src/table/Row";

/*
 * React 19's automatic JSX runtime (`jsx()` from "react/jsx-runtime") no longer applies `defaultProps` to function,
 * forwardRef and styled components. These guards render each migrated component through `jsx()` without the
 * previously defaulted props and assert the default value is still used. Under React 18 `jsx()` still applies
 * `defaultProps`, so only the React 19 test leg proves the migration.
 */

/**
 * Renders a component through the automatic JSX runtime.
 *
 * @param {React.ElementType} type  The component to render.
 * @param {Object}            props The props to pass.
 *
 * @returns {Object} The react-test-renderer instance.
 */
const render = ( type, props = {} ) => {
	let instance;
	act( () => {
		instance = renderer.create( jsx( type, props ) );
	} );
	return instance;
};

const noop = () => {};

beforeEach( () => {
	// Some of the migrated components are deprecated and warn on every render.
	jest.spyOn( console, "warn" ).mockImplementation( noop );
} );

afterEach( () => {
	jest.restoreAllMocks();
} );

describe( "function components keep their defaults under the automatic JSX runtime", () => {
	test( "ArticleList uses its default className", () => {
		const tree = render( ArticleList, { feed: { title: "Feed", link: "https://example.com", items: [] } } ).toJSON();
		expect( tree.props.className ).toContain( "articlelist-feed" );
	} );

	test( "CardBanner uses its default colors", () => {
		const tree = render( CardBanner, {} ).toJSON();
		expect( tree[ 0 ] ).toHaveStyleRule( "background-color", colors.$color_pink_dark );
		expect( tree[ 0 ] ).toHaveStyleRule( "color", colors.$color_white );
	} );

	test( "CollapsibleStateless renders its default Heading", () => {
		const instance = render( CollapsibleStateless, { isOpen: false, onToggle: noop, title: "Title" } );
		expect( instance.root.findAllByType( "h2" ) ).toHaveLength( 1 );
	} );

	test( "Heading renders an h1 by default", () => {
		const instance = render( Heading, { children: "Text" } );
		expect( instance.root.findAllByType( "h1" ) ).toHaveLength( 1 );
	} );

	test( "Icon uses its default size", () => {
		const TestSvg = ( props ) => jsx( "svg", props );
		const tree = render( Icon, { icon: TestSvg } ).toJSON();
		expect( tree ).toHaveStyleRule( "width", "16px" );
		expect( tree ).toHaveStyleRule( "height", "16px" );
	} );

	test( "IconCTAEditButton uses its default colors", () => {
		const tree = render( IconCTAEditButton, { id: "id", ariaLabel: "Edit", onClick: noop, icon: "edit" } ).toJSON();
		expect( tree ).toHaveStyleRule( "background-color", colors.$color_button );
		expect( tree ).toHaveStyleRule( "box-shadow", colors.$color_button_border );
	} );

	test( "Label uses its default className", () => {
		const tree = render( Label, { "for": "id", children: "Label" } ).toJSON();
		expect( tree.props.className ).toBe( "" );
	} );

	test( "Loader renders", () => {
		const tree = render( Loader, {} ).toJSON();
		expect( tree.props.className ).toContain( "yoast-loader" );
	} );

	test( "Notification renders an h3 heading by default", () => {
		const instance = render( Notification, { title: "Title", html: "Text" } );
		expect( instance.root.findAllByType( "h3" ) ).toHaveLength( 1 );
		expect( instance.root.findAllByType( "button" ) ).toHaveLength( 0 );
	} );

	test( "ScoreAssessments uses its default className", () => {
		const tree = render( ScoreAssessments, { items: [] } ).toJSON();
		expect( tree.props.className ).toContain( "score-assessments" );
	} );

	test( "Section renders an h1 heading by default", () => {
		const instance = render( Section, { headingText: "Heading" } );
		expect( instance.root.findAllByType( "h1" ) ).toHaveLength( 1 );
	} );

	test( "StackedProgressBar uses its default className and bar height", () => {
		const tree = render( StackedProgressBar, { items: [ { value: 1, color: "#000" } ] } ).toJSON();
		expect( tree.props.className ).toContain( "stacked-progress-bar" );
		expect( tree ).toHaveStyleRule( "height", "24px" );
	} );

	test( "StyledSection uses its default className, heading level and paper style", () => {
		const instance = render( StyledSection, { headingText: "Heading" } );
		const tree = instance.toJSON();
		expect( tree.props.className ).toContain( "yoast-section" );
		expect( tree ).toHaveStyleRule( "background-color", colors.$color_white );
		expect( instance.root.findAllByType( "h2" ) ).toHaveLength( 1 );
	} );

	test( "SynonymsInput renders a text input by default", () => {
		const instance = render( SynonymsInput, { id: "synonyms" } );
		expect( instance.root.findByType( "input" ).props.type ).toBe( "text" );
	} );

	test( "WordList uses its default classNamePrefix", () => {
		const instance = render( WordList, { words: [ "word" ], title: "Title" } );
		expect( instance.root.findByType( "ol" ).props.className ).toBe( "__list" );
	} );

	test( "YouTubeVideo passes its default iframe attributes", () => {
		const instance = render( YouTubeVideo, { src: "https://example.com", title: "Video" } );
		const iframe = instance.root.findByType( "iframe" );
		expect( iframe.props.width ).toBe( 560 );
		expect( iframe.props.height ).toBe( 315 );
		expect( iframe.props.frameBorder ).toBe( 0 );
		expect( iframe.props.allowFullScreen ).toBe( true );
	} );
} );

describe( "button and form function components keep their defaults under the automatic JSX runtime", () => {
	test( "Button renders a primary button of type button by default", () => {
		const tree = render( Button, { children: "Button" } ).toJSON();
		expect( tree.props.type ).toBe( "button" );
		expect( tree.props.className ).toContain( "yoast-button--primary" );
	} );

	test( "ButtonStyledLink renders a primary link by default", () => {
		const tree = render( ButtonStyledLink, { href: "https://example.com", children: "Link" } ).toJSON();
		expect( tree.props.className ).toContain( "yoast-button--primary" );
	} );

	test( "IconButton uses its default icon color", () => {
		const instance = render( IconButton, { icon: "edit" } );
		expect( instance.root.findByType( SvgIcon ).props.color ).toBe( "#000" );
	} );

	test( "IconLabeledButton uses its default type and colors", () => {
		const tree = render( IconLabeledButton, { icon: "edit", children: "Edit" } ).toJSON();
		expect( tree.props.type ).toBe( "button" );
		expect( tree ).toHaveStyleRule( "color", colors.$color_blue );
		expect( tree ).toHaveStyleRule( "font-size", "inherit" );
	} );

	test( "YoastButtonBase renders a button of type button by default", () => {
		const tree = render( YoastButtonBase, { children: "Button" } ).toJSON();
		expect( tree.props.type ).toBe( "button" );
	} );

	test( "Checkbox is unchecked by default", () => {
		const instance = render( Checkbox, { id: "id", label: "Label", onChange: noop } );
		expect( instance.root.findByType( "input" ).props.checked ).toBe( false );
	} );

	test( "DataModel renders without items", () => {
		const tree = render( DataModel, {} ).toJSON();
		expect( tree.type ).toBe( "ul" );
		expect( tree.children ).toBeNull();
	} );

	test( "FieldGroup uses its default class names and hides an empty label", () => {
		const tree = render( FieldGroup, {} ).toJSON();
		expect( tree.props.className ).toBe( "yoast-field-group" );
		expect( tree.children ).toBeNull();
	} );

	test( "HelpIcon links to an empty href by default", () => {
		const tree = render( HelpIcon, {} ).toJSON();
		expect( tree.props.href ).toBe( "" );
	} );

	test( "ImageSelect renders without warnings and callbacks", () => {
		const instance = render( ImageSelect, { hasPreview: true, label: "Image" } );
		const preview = instance.root.findAllByType( "button" )[ 0 ];
		expect( () => act( () => preview.props.onClick() ) ).not.toThrow();
		expect( instance.root.findAllByProps( { role: "alert" } ) ).toHaveLength( 0 );
	} );

	test( "ImageSelectButtons renders the select button by default", () => {
		const instance = render( ImageSelectButtons, {} );
		const buttons = instance.root.findAllByType( "button" );
		expect( buttons ).toHaveLength( 1 );
		expect( buttons[ 0 ].props.id ).toBe( "" );
		expect( buttons[ 0 ].props.disabled ).toBe( false );
	} );

	test( "TextArea uses its default attributes and onChange", () => {
		const instance = render( TextArea, {} );
		const textarea = instance.root.findByType( "textarea" );
		expect( textarea.props.value ).toBe( "" );
		expect( textarea.props.readOnly ).toBe( false );
		expect( () => textarea.props.onChange( { target: { value: "a" } } ) ).not.toThrow();
	} );

	test( "TextInput renders a text input by default", () => {
		const instance = render( TextInput, {} );
		const input = instance.root.findByType( "input" );
		expect( input.props.type ).toBe( "text" );
		expect( input.props.value ).toBe( "" );
		expect( input.props.readOnly ).toBe( false );
	} );

	test( "NewBadge renders", () => {
		const tree = render( NewBadge, {} ).toJSON();
		expect( tree.props.className ).toBe( "yoast-badge yoast-new-badge" );
	} );

	test( "PremiumBadge renders", () => {
		const tree = render( PremiumBadge, {} ).toJSON();
		expect( tree.props.className ).toBe( "yoast-badge yoast-premium-badge" );
	} );

	test( "RadioButtonGroup renders unselected options and a no-op onChange by default", () => {
		const instance = render( RadioButtonGroup, { groupName: "group", options: [ { value: "a", label: "A" } ] } );
		const input = instance.root.findByType( "input" );
		expect( input.props.checked ).toBe( false );
		expect( () => input.props.onChange( { target: { value: "a" } } ) ).not.toThrow();
	} );

	test.each( [
		[ "YoastReactSelect", YoastReactSelect ],
		[ "SingleSelect", SingleSelect ],
		[ "MultiSelect", MultiSelect ],
	] )( "%s uses its default name and selection", ( name, Component ) => {
		const instance = render( Component, { id: "select", options: [ { name: "A", value: "a" } ] } );
		const select = instance.root.findByType( ReactSelect );
		expect( select.props.name ).toBe( "" );
		expect( select.props.value ).toEqual( [] );
		expect( () => act( () => select.props.onChange( [] ) ) ).not.toThrow();
	} );
} );

describe( "styled components keep their defaults under the automatic JSX runtime", () => {
	test( "Paper uses its default background color and min height", () => {
		const tree = render( Paper, {} ).toJSON();
		expect( tree ).toHaveStyleRule( "background-color", colors.$color_white );
		expect( tree ).toHaveStyleRule( "min-height", "0" );
	} );

	test( "ProgressBar uses its default attributes and colors", () => {
		const tree = render( ProgressBar, {} ).toJSON();
		expect( tree.props.max ).toBe( 1 );
		expect( tree.props.value ).toBe( 0 );
		expect( tree.props[ "aria-hidden" ] ).toBe( "true" );
		expect( tree ).toHaveStyleRule( "background-color", colors.$color_background_light );
		expect( tree ).toHaveStyleRule( "border", `1px solid ${ colors.$color_input_border }` );
	} );

	test( "Row uses its default background", () => {
		const tree = render( Row, {} ).toJSON();
		expect( tree ).toHaveStyleRule( "background", colors.$color_white );
	} );

	test( "CellPrimary renders", () => {
		const tree = render( CellPrimary, { children: "Cell" } ).toJSON();
		expect( tree.type ).toBe( "span" );
	} );

	test( "YoastButton uses its default colors and text shadow", () => {
		const tree = render( YoastButton, { children: "Button" } ).toJSON();
		expect( tree.props.type ).toBe( "button" );
		expect( tree ).toHaveStyleRule( "background", colors.$color_green_medium_light );
		expect( tree ).toHaveStyleRule( "text-shadow", `0 0 2px ${ colors.$color_black }` );
	} );

	test( "YoastLinkButton uses its default colors and text shadow", () => {
		const tree = render( YoastLinkButton, { href: "https://example.com", children: "Link" } ).toJSON();
		expect( tree ).toHaveStyleRule( "background", colors.$color_green_medium_light );
		expect( tree ).toHaveStyleRule( "text-shadow", `0 0 2px ${ colors.$color_black }` );
	} );

	test( "UpsellButtonBase uses its default colors", () => {
		const tree = render( UpsellButtonBase, { children: "Upsell" } ).toJSON();
		expect( tree ).toHaveStyleRule( "background", colors.$color_button_upsell );
		expect( tree ).toHaveStyleRule( "color", colors.$color_black );
	} );
} );

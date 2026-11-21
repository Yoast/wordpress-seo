// External dependencies.
import { jsx } from "react/jsx-runtime";
import { fireEvent, render } from "@testing-library/react";
import { noop } from "lodash";
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
 * @returns {HTMLElement} The container the component is rendered into.
 */
const renderJsx = ( type, props = {} ) => render( jsx( type, props ) ).container;

/**
 * Calls a hook-free function component directly and returns the element tree it renders.
 *
 * Used so the guard checks that the parameter default reached the returned elements regardless of the JSX runtime or
 * the DOM (which cannot tell e.g. `readOnly={ false }` from a missing `readOnly`).
 *
 * @param {Function} component The function component to call.
 * @param {Object}   props     The props to pass.
 *
 * @returns {Object} The returned element tree.
 */
const callComponent = ( component, props = {} ) => component( props );

/**
 * Finds the first element in a returned element tree that matches the predicate, walking `props.children`.
 *
 * @param {*}        node      The element (tree) to search.
 * @param {Function} predicate Returns true for the element to find.
 *
 * @returns {Object|null} The matching element or null.
 */
const findElement = ( node, predicate ) => {
	if ( Array.isArray( node ) ) {
		for ( const child of node ) {
			const found = findElement( child, predicate );
			if ( found ) {
				return found;
			}
		}
		return null;
	}
	if ( ! node || typeof node !== "object" || ! node.props ) {
		return null;
	}
	if ( predicate( node ) ) {
		return node;
	}
	return findElement( node.props.children, predicate );
};

/**
 * Finds the first element of the given type in a returned element tree.
 *
 * @param {*}                 node The element (tree) to search.
 * @param {React.ElementType} type The element type to find.
 *
 * @returns {Object|null} The matching element or null.
 */
const findByType = ( node, type ) => findElement( node, element => element.type === type );

beforeEach( () => {
	// Some of the migrated components are deprecated and warn on every render.
	jest.spyOn( console, "warn" ).mockImplementation( noop );
} );

afterEach( () => {
	jest.restoreAllMocks();
} );

describe( "function components keep their defaults under the automatic JSX runtime", () => {
	test( "ArticleList uses its default className", () => {
		const tree = renderJsx( ArticleList, { feed: { title: "Feed", link: "https://example.com", items: [] } } ).firstChild;
		expect( tree.getAttribute( "class" ) ).toContain( "articlelist-feed" );
	} );

	test( "CardBanner uses its default colors", () => {
		const tree = renderJsx( CardBanner, {} ).firstChild;
		expect( tree ).toHaveStyleRule( "background-color", colors.$color_pink_dark );
		expect( tree ).toHaveStyleRule( "color", colors.$color_white );
	} );

	test( "CollapsibleStateless renders its default Heading", () => {
		const container = renderJsx( CollapsibleStateless, { isOpen: false, onToggle: noop, title: "Title" } );
		expect( container.querySelectorAll( "h2" ) ).toHaveLength( 1 );
	} );

	test( "Heading renders an h1 by default", () => {
		const container = renderJsx( Heading, { children: "Text" } );
		expect( container.querySelectorAll( "h1" ) ).toHaveLength( 1 );
	} );

	test( "Icon uses its default size", () => {
		const TestSvg = ( props ) => jsx( "svg", props );
		const tree = renderJsx( Icon, { icon: TestSvg } ).firstChild;
		expect( tree ).toHaveStyleRule( "width", "16px" );
		expect( tree ).toHaveStyleRule( "height", "16px" );
	} );

	test( "IconCTAEditButton uses its default colors", () => {
		const tree = renderJsx( IconCTAEditButton, { id: "id", ariaLabel: "Edit", onClick: noop, icon: "edit" } ).firstChild;
		expect( tree ).toHaveStyleRule( "background-color", colors.$color_button );
		expect( tree ).toHaveStyleRule( "box-shadow", colors.$color_button_border );
	} );

	test( "Label uses its default className", () => {
		const tree = renderJsx( Label, { "for": "id", children: "Label" } ).firstChild;
		expect( tree.getAttribute( "class" ) ).toBe( "" );
	} );

	test( "Loader renders", () => {
		const tree = renderJsx( Loader, {} ).firstChild;
		expect( tree.getAttribute( "class" ) ).toContain( "yoast-loader" );
	} );

	test( "Notification renders an h3 heading by default", () => {
		const container = renderJsx( Notification, { title: "Title", html: "Text" } );
		expect( container.querySelectorAll( "h3" ) ).toHaveLength( 1 );
		expect( container.querySelectorAll( "button" ) ).toHaveLength( 0 );
	} );

	test( "ScoreAssessments uses its default className", () => {
		const tree = renderJsx( ScoreAssessments, { items: [] } ).firstChild;
		expect( tree.getAttribute( "class" ) ).toContain( "score-assessments" );
	} );

	test( "Section renders an h1 heading by default", () => {
		const container = renderJsx( Section, { headingText: "Heading" } );
		expect( container.querySelectorAll( "h1" ) ).toHaveLength( 1 );
	} );

	test( "StackedProgressBar uses its default className and bar height", () => {
		const tree = renderJsx( StackedProgressBar, { items: [ { value: 1, color: "#000" } ] } ).firstChild;
		expect( tree.getAttribute( "class" ) ).toContain( "stacked-progress-bar" );
		expect( tree ).toHaveStyleRule( "height", "24px" );
	} );

	test( "StyledSection uses its default className, heading level and paper style", () => {
		const container = renderJsx( StyledSection, { headingText: "Heading" } );
		const tree = container.firstChild;
		expect( tree.getAttribute( "class" ) ).toContain( "yoast-section" );
		expect( tree ).toHaveStyleRule( "background-color", colors.$color_white );
		expect( container.querySelectorAll( "h2" ) ).toHaveLength( 1 );
	} );

	test( "SynonymsInput renders a text input by default", () => {
		const container = renderJsx( SynonymsInput, { id: "synonyms" } );
		expect( container.querySelector( "input" ).getAttribute( "type" ) ).toBe( "text" );
	} );

	test( "WordList uses its default classNamePrefix", () => {
		const container = renderJsx( WordList, { words: [ "word" ], title: "Title" } );
		expect( container.querySelector( "ol" ).getAttribute( "class" ) ).toBe( "__list" );
	} );

	test( "YouTubeVideo passes its default iframe attributes", () => {
		const container = renderJsx( YouTubeVideo, { src: "https://example.com", title: "Video" } );
		const iframe = container.querySelector( "iframe" );
		expect( iframe.getAttribute( "width" ) ).toBe( "560" );
		expect( iframe.getAttribute( "height" ) ).toBe( "315" );
		expect( iframe.getAttribute( "frameborder" ) ).toBe( "0" );
		expect( iframe.hasAttribute( "allowfullscreen" ) ).toBe( true );
	} );
} );

describe( "button and form function components keep their defaults under the automatic JSX runtime", () => {
	test( "Button renders a primary button of type button by default", () => {
		const tree = renderJsx( Button, { children: "Button" } ).firstChild;
		expect( tree.getAttribute( "type" ) ).toBe( "button" );
		expect( tree.getAttribute( "class" ) ).toContain( "yoast-button--primary" );
	} );

	test( "ButtonStyledLink renders a primary link by default", () => {
		const tree = renderJsx( ButtonStyledLink, { href: "https://example.com", children: "Link" } ).firstChild;
		expect( tree.getAttribute( "class" ) ).toContain( "yoast-button--primary" );
	} );

	test( "IconButton uses its default icon color", () => {
		const container = renderJsx( IconButton, { icon: "edit" } );
		expect( container.querySelector( "svg" ).getAttribute( "fill" ) ).toBe( "#000" );
	} );

	test( "IconLabeledButton uses its default type and colors", () => {
		const tree = renderJsx( IconLabeledButton, { icon: "edit", children: "Edit" } ).firstChild;
		expect( tree.getAttribute( "type" ) ).toBe( "button" );
		expect( tree ).toHaveStyleRule( "color", colors.$color_blue );
		expect( tree ).toHaveStyleRule( "font-size", "inherit" );
	} );

	test( "YoastButtonBase renders a button of type button by default", () => {
		const tree = renderJsx( YoastButtonBase, { children: "Button" } ).firstChild;
		expect( tree.getAttribute( "type" ) ).toBe( "button" );
	} );

	test( "Checkbox is unchecked by default", () => {
		// Smoke test only: Checkbox uses hooks, so it cannot be called directly, and the DOM cannot tell
		// `checked={ false }` from a missing `checked`.
		const container = renderJsx( Checkbox, { id: "id", label: "Label", onChange: noop } );
		expect( container.querySelector( "input" ).checked ).toBe( false );
	} );

	test( "DataModel renders without items", () => {
		const tree = renderJsx( DataModel, {} ).firstChild;
		expect( tree.tagName ).toBe( "UL" );
		expect( tree.childNodes ).toHaveLength( 0 );
	} );

	test( "FieldGroup uses its default class names and hides an empty label", () => {
		const tree = renderJsx( FieldGroup, {} ).firstChild;
		expect( tree.getAttribute( "class" ) ).toBe( "yoast-field-group" );
		expect( tree.childNodes ).toHaveLength( 0 );
	} );

	test( "HelpIcon links to an empty href by default", () => {
		const tree = renderJsx( HelpIcon, {} ).firstChild;
		expect( tree.getAttribute( "href" ) ).toBe( "" );
	} );

	test( "ImageSelect renders without warnings and callbacks", () => {
		const container = renderJsx( ImageSelect, { hasPreview: true, label: "Image" } );
		const preview = container.querySelectorAll( "button" )[ 0 ];
		expect( () => fireEvent.click( preview ) ).not.toThrow();
		expect( container.querySelectorAll( "[role=\"alert\"]" ) ).toHaveLength( 0 );

		const element = callComponent( ImageSelect, { hasPreview: true, label: "Image" } );
		expect( element.props.onMouseEnter ).toBe( noop );
		expect( element.props.onMouseLeave ).toBe( noop );
		const previewElement = findByType( element, "button" );
		expect( previewElement.props.onClick ).toBe( noop );
		expect( previewElement.props.disabled ).toBe( false );
		const buttons = findByType( element, ImageSelectButtons );
		expect( buttons.props.onClick ).toBe( noop );
		expect( buttons.props.onRemoveImageClick ).toBe( noop );
		expect( buttons.props.isDisabled ).toBe( false );
		expect( buttons.props.imageSelected ).toBe( false );
		expect( buttons.props.selectImageButtonId ).toBe( "" );
	} );

	test( "ImageSelectButtons renders the select button by default", () => {
		const container = renderJsx( ImageSelectButtons, {} );
		// The `disabled` check is a smoke test only: ImageSelectButtons uses hooks, so it cannot be called
		// directly, and the DOM cannot tell `disabled={ false }` from a missing `disabled`.
		const buttons = container.querySelectorAll( "button" );
		expect( buttons ).toHaveLength( 1 );
		expect( buttons[ 0 ].getAttribute( "id" ) ).toBe( "" );
		expect( buttons[ 0 ].disabled ).toBe( false );
	} );

	test( "TextArea uses its default attributes and onChange", () => {
		const container = renderJsx( TextArea, {} );
		const textarea = container.querySelector( "textarea" );
		expect( textarea.value ).toBe( "" );
		expect( textarea.readOnly ).toBe( false );
		expect( () => fireEvent.change( textarea, { target: { value: "a" } } ) ).not.toThrow();

		const element = findByType( callComponent( TextArea ), "textarea" );
		expect( element.props.value ).toBe( "" );
		expect( element.props.readOnly ).toBe( false );
		expect( element.props.onChange ).toBe( noop );
	} );

	test( "TextInput renders a text input by default", () => {
		const container = renderJsx( TextInput, {} );
		const input = container.querySelector( "input" );
		expect( input.getAttribute( "type" ) ).toBe( "text" );
		expect( input.value ).toBe( "" );
		expect( input.readOnly ).toBe( false );

		const element = findByType( callComponent( TextInput ), "input" );
		expect( element.props.value ).toBe( "" );
		expect( element.props.readOnly ).toBe( false );
	} );

	test( "NewBadge renders", () => {
		const tree = renderJsx( NewBadge, {} ).firstChild;
		expect( tree.getAttribute( "class" ) ).toBe( "yoast-badge yoast-new-badge" );
	} );

	test( "PremiumBadge renders", () => {
		const tree = renderJsx( PremiumBadge, {} ).firstChild;
		expect( tree.getAttribute( "class" ) ).toBe( "yoast-badge yoast-premium-badge" );
	} );

	test( "RadioButtonGroup renders unselected options and a no-op onChange by default", () => {
		const container = renderJsx( RadioButtonGroup, { groupName: "group", options: [ { value: "a", label: "A" } ] } );
		const input = container.querySelector( "input" );
		expect( input.checked ).toBe( false );
		expect( () => fireEvent.click( input ) ).not.toThrow();

		// The radio buttons get the defaulted `selected` and an onChange wrapper that calls the defaulted onChange.
		const radios = callComponent( RadioButtonGroup, { groupName: "group", options: [ { value: "a", label: "A" } ] } ).props.children;
		expect( radios.props.selected ).toBeNull();
		expect( () => radios.props.onChange( { target: { value: "a" } } ) ).not.toThrow();
	} );

	test.each( [
		[ "YoastReactSelect", YoastReactSelect ],
		[ "SingleSelect", SingleSelect ],
		[ "MultiSelect", MultiSelect ],
	] )( "%s uses its default name and selection", ( name, Component ) => {
		const container = renderJsx( Component, { id: "select", options: [ { name: "A", value: "a" } ] } );
		// react-select only renders the hidden form input for a non-empty name.
		expect( container.querySelector( "input[type=\"hidden\"]" ) ).toBeNull();
		// The default empty selection renders no selected value.
		expect( container.querySelector( ".yoast-select__single-value, .yoast-select__multi-value" ) ).toBeNull();
		// Selecting an option calls the default onChange.
		fireEvent.keyDown( container.querySelector( "input" ), { key: "ArrowDown", keyCode: 40 } );
		const option = container.querySelector( ".yoast-select__option" );
		expect( option ).not.toBeNull();
		expect( () => fireEvent.click( option ) ).not.toThrow();
	} );

	test( "YoastReactSelect passes its default name, selection and onChange to react-select", () => {
		const select = findByType( callComponent( YoastReactSelect, { id: "select", options: [ { name: "A", value: "a" } ] } ), ReactSelect );
		expect( select.props.name ).toBe( "" );
		expect( select.props.value ).toEqual( [] );
		expect( typeof select.props.onChange ).toBe( "function" );
		expect( () => select.props.onChange( [] ) ).not.toThrow();
	} );
} );

describe( "styled components keep their defaults under the automatic JSX runtime", () => {
	test( "Paper uses its default background color and min height", () => {
		const tree = renderJsx( Paper, {} ).firstChild;
		expect( tree ).toHaveStyleRule( "background-color", colors.$color_white );
		expect( tree ).toHaveStyleRule( "min-height", "0" );
	} );

	test( "ProgressBar uses its default attributes and colors", () => {
		const tree = renderJsx( ProgressBar, {} ).firstChild;
		expect( tree.getAttribute( "max" ) ).toBe( "1" );
		expect( tree.getAttribute( "value" ) ).toBe( "0" );
		expect( tree.getAttribute( "aria-hidden" ) ).toBe( "true" );
		expect( tree ).toHaveStyleRule( "background-color", colors.$color_background_light );
		expect( tree ).toHaveStyleRule( "border", `1px solid ${ colors.$color_input_border }` );
	} );

	test( "Row uses its default background", () => {
		const tree = renderJsx( Row, {} ).firstChild;
		expect( tree ).toHaveStyleRule( "background", colors.$color_white );
	} );

	test( "CellPrimary renders", () => {
		const tree = renderJsx( CellPrimary, { children: "Cell" } ).firstChild;
		expect( tree.tagName ).toBe( "SPAN" );
	} );

	test( "YoastButton uses its default colors and text shadow", () => {
		const tree = renderJsx( YoastButton, { children: "Button" } ).firstChild;
		expect( tree.getAttribute( "type" ) ).toBe( "button" );
		expect( tree ).toHaveStyleRule( "background", colors.$color_green_medium_light );
		expect( tree ).toHaveStyleRule( "text-shadow", `0 0 2px ${ colors.$color_black }` );
	} );

	test( "YoastLinkButton uses its default colors and text shadow", () => {
		const tree = renderJsx( YoastLinkButton, { href: "https://example.com", children: "Link" } ).firstChild;
		expect( tree ).toHaveStyleRule( "background", colors.$color_green_medium_light );
		expect( tree ).toHaveStyleRule( "text-shadow", `0 0 2px ${ colors.$color_black }` );
	} );

	test( "UpsellButtonBase uses its default colors", () => {
		const tree = renderJsx( UpsellButtonBase, { children: "Upsell" } ).firstChild;
		expect( tree ).toHaveStyleRule( "background", colors.$color_button_upsell );
		expect( tree ).toHaveStyleRule( "color", colors.$color_black );
	} );
} );

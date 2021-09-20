import { render, useState, useCallback, unmountComponentAtNode, Fragment, useEffect } from "@wordpress/element";
import { PropTypes } from "prop-types";
import { JsonEditor as Editor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Disclosure } from "@headlessui/react";
import classNames from "classnames";

import initialize from "../src/index";
import exampleConfig from "./example-config";

/**
 * Renders a JSON Editor.
 *
 * @param {Object} props The props object.
 *
 * @returns {JSX.Element} The JsonEditor for QA.
 */
function JsonEditor( { editorMode, config, handleChange } ) {
	return (
		<>
			{ editorMode === "text" && <Editor htmlElementProps={ { className: "yst-h-full" } } mode={ "text" } value={ config } onChange={ handleChange } /> }
			{ editorMode === "tree" && <Editor htmlElementProps={ { className: "yst-h-full" } } mode={ "tree" } value={ config } onChange={ handleChange } /> }
		</>
	);
}

JsonEditor.propTypes = {
	editorMode: PropTypes.string.isRequired,
	config: PropTypes.object.isRequired,
	handleChange: PropTypes.func.isRequired,
};

/**
 * Renders a wrapper, a root div for the app, and a button to render the app.
 *
 * @returns {JSX.Element} The QA Wrapper.
 */
function QAWrapper() {
	const [ config, setConfig ] = useState( exampleConfig );
	const [ editorMode, setEditorMode ] = useState( "text" );
	const [ editorOpen, setEditorOpen ] = useState( false );

	// Initialize the app upon first load.
	useEffect( () => {
		const settingsApp = initialize( config );
		settingsApp.render( document.getElementById( "rest-of-app" ) );
	}, [] );

	// Toggle text direction.
	const toggleTextDirection = useCallback( () => {
		const element = document.querySelector( "html" );
		element.dir = element.dir === "rtl" ? "ltr" : "rtl";
	}, [ document.querySelector( "html" ).dir ] );

	// Toggle editor tree/text.
	const toggleEditorMode = useCallback( () => {
		setEditorMode( editorMode === "text" ? "tree" : "text" );
	}, [ editorMode ] );

	// Open and close the editor.
	const toggleEditor = useCallback( () => {
		setEditorOpen( ! editorOpen );
	}, [ editorOpen ] );

	// Override the config, and re-add the imagePicker (not configurable in the JSON editor).
	const handleChange = useCallback( ( newConfig ) => {
		setConfig( {
			...newConfig,
			imagePicker: exampleConfig.imagePicker,
			handleSave: exampleConfig.handleSave,
		} );
	}, [] );

	// Unmount app. Initialize the app again, using the latest config. Close the JSON editor.
	const reinitialize = useCallback( () => {
		// Unmount the Settings UI App.
		const rootElement = document.getElementById( "rest-of-app" );
		unmountComponentAtNode( rootElement );

		const settingsApp = initialize( config );
		settingsApp.render( document.getElementById( "rest-of-app" ) );
		setEditorOpen( false );
	}, [ config ] );

	return (
		<div id="qa-wrapper" className="yst-h-screen">
			<Disclosure
				as="div"
				dir="ltr"
				className={ ( editorOpen ? "yst-h-full" : "" ) + " yst-fixed yst-flex yst-flex-col yst-w-screen yst-z-50 yst-block yst-bg-white" }
			>
				<Disclosure.Button
					as={ Fragment }
					key={ "config-button" }
					className="yst-flex yst-bg-primary-500 yst-items-center yst-w-full yst-px-3 yst-py-2 yst-text-sm yst-font-medium yst-text-white yst-no-underline yst-group active:yst-no-outline hover:yst-bg-primary-400"
				>
					<button onClick={ toggleEditor }>
						Edit config
						<ChevronDownIcon
							className={ classNames(
								editorOpen ? "yst-text-white yst-transform yst-rotate-180" : "yst-text-white",
								"yst-ml-auto yst-w-5 yst-h-5 yst-text-white group-hover:yst-text-white",
							) }
							aria-hidden="true"
						/>
					</button>
				</Disclosure.Button>
				{ editorOpen && <Disclosure.Panel
					static={ true }
					className="yst-outline-none yst-space-y-1 yst-h-5/6 yst-bg-white"
					as="ul"
				>
					<JsonEditor editorMode={ editorMode } handleChange={ handleChange } config={ config } />
					<div className="yst-flex yst-justify-end yst-gap-4 yst-p-2">
						<button className="yst-button yst-button--secondary" onClick={ toggleTextDirection }>{ "toggle LTR/RTL" }</button>
						<button className="yst-button yst-button--secondary" onClick={ toggleEditorMode }>{ editorMode === "text" ? "show tree" : "show raw" }</button>
						<button className="yst-button yst-button--primary" onClick={ reinitialize }>{ "(re)initialize" }</button>
					</div>
				</Disclosure.Panel> }
			</Disclosure>
			<div id="rest-of-app" className="yst-block yst-pt-9" />
		</div>
	);
}

render( <QAWrapper />, document.getElementById( "app" ) );

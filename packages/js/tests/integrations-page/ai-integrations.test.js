/*
 * The keys below are the script-data keys emitted by Integrations_Page::enqueue_assets(),
 * so they are snake_case by necessity rather than by choice.
 */
/* eslint-disable camelcase */
import { beforeEach, describe, expect, it } from "@jest/globals";

/**
 * Loads the AI integrations with the given script data.
 *
 * The cards read their active state from the window at module scope, so the module has to be
 * re-required after the data is set rather than imported once at the top of the file.
 *
 * The returned elements are inspected rather than rendered: rendering them would pull a second
 * React instance in through the isolated module registry, which breaks the ui-library hooks.
 * The cards' rendering is covered by NlwebIntegration.test.js and AbilitiesIntegration.test.js.
 *
 * @param {Object} data The `wpseoIntegrationsData` to expose on the window.
 *
 * @returns {Array<JSX.Element>} The AI integration cards.
 */
const loadAiIntegrations = ( data ) => {
	window.wpseoIntegrationsData = data;

	let cards = [];
	jest.isolateModules( () => {
		cards = require( "../../src/integrations-page/ai-integrations" ).aiIntegrations;
	} );

	return cards;
};

describe( "aiIntegrations", () => {
	beforeEach( () => {
		jest.resetModules();
	} );

	it( "holds the NLWeb and the Abilities API card, in that order", () => {
		const [ nlweb, abilities ] = loadAiIntegrations( {} );

		expect( nlweb.props.integration.slug ).toBe( "nlweb" );
		expect( abilities.props.integration.slug ).toBe( "abilities" );
	} );

	it( "marks both cards as new", () => {
		const [ nlweb, abilities ] = loadAiIntegrations( {} );

		expect( nlweb.props.integration.isNew ).toBe( true );
		expect( abilities.props.integration.isNew ).toBe( true );
	} );

	it( "offers both cards on multisite and outside of Premium", () => {
		const [ nlweb, abilities ] = loadAiIntegrations( {} );

		expect( nlweb.props.integration.isMultisiteAvailable ).toBe( true );
		expect( nlweb.props.integration.isPremium ).toBe( false );
		expect( abilities.props.integration.isMultisiteAvailable ).toBe( true );
		expect( abilities.props.integration.isPremium ).toBe( false );
	} );

	it( "takes the NLWeb state from schema_aggregation_active", () => {
		const [ active ] = loadAiIntegrations( { schema_aggregation_active: true, abilities_api_active: false } );
		expect( active.props.isActive ).toBe( true );

		const [ inactive ] = loadAiIntegrations( { schema_aggregation_active: false, abilities_api_active: false } );
		expect( inactive.props.isActive ).toBe( false );
	} );

	it( "takes the Abilities API state from abilities_api_active", () => {
		const [ , active ] = loadAiIntegrations( { schema_aggregation_active: false, abilities_api_active: true } );
		expect( active.props.isActive ).toBe( true );

		const [ , inactive ] = loadAiIntegrations( { schema_aggregation_active: false, abilities_api_active: false } );
		expect( inactive.props.isActive ).toBe( false );
	} );

	it( "keeps the two flags independent", () => {
		const [ nlweb, abilities ] = loadAiIntegrations( { schema_aggregation_active: true, abilities_api_active: false } );

		expect( nlweb.props.isActive ).toBe( true );
		expect( abilities.props.isActive ).toBe( false );
	} );

	it( "treats both cards as inactive when the script data is missing the flags", () => {
		const [ nlweb, abilities ] = loadAiIntegrations( {} );

		expect( nlweb.props.isActive ).toBe( false );
		expect( abilities.props.isActive ).toBe( false );
	} );

	it( "wires each card to its own component", () => {
		const [ nlweb, abilities ] = loadAiIntegrations( {} );

		// Compared by name: the isolated module registry hands back its own copy of each component.
		expect( nlweb.type.name ).toBe( "NlwebIntegration" );
		expect( abilities.type.name ).toBe( "AbilitiesIntegration" );
	} );
} );

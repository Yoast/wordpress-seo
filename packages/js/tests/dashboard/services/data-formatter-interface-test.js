import { describe, expect, it } from "@jest/globals";
import { DataFormatterInterface } from "../../../src/dashboard/services/data-formatter-interface";

describe("DataFormatterInterface", () => {
	it( "should throw an error when instantiated directly", () => {
		expect(() => {
			new DataFormatterInterface();
		}).toThrow("DataFormatterInterface cannot be instantiated directly.");
	});

	it( "should throw an error when format method is called directly", () => {
		// eslint-disable-next-line require-jsdoc
		class TestFormatter extends DataFormatterInterface {}
		const formatter = new TestFormatter();
		expect(() => {
			formatter.format();
		}).toThrow("You must implement the format() method before using it.");
	});
});

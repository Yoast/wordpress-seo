import { jest } from "@jest/globals";
import { RemoteCachedDataProvider } from "../../src/services/remote-cached-data-provider";

/**
 * Mock remote cached data provider.
 */
export class MockRemoteCachedDataProvider extends RemoteCachedDataProvider {
	fetchJson = jest.fn().mockResolvedValue( [] );
}

import { jest } from "@jest/globals";
import { RemoteCachedDataProvider } from "@yoast/dashboard-frontend";

/**
 * Mock remote cached data provider.
 */
export class MockRemoteCachedDataProvider extends RemoteCachedDataProvider {
	fetchJson = jest.fn().mockResolvedValue( [] );
}

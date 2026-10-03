import { jest } from "@jest/globals";
import { RemoteDataProvider } from "@yoast/dashboard-frontend";

/**
 * Mock remote data provider.
 */
export class MockRemoteDataProvider extends RemoteDataProvider {
	fetchJson = jest.fn().mockResolvedValue( [] );
}

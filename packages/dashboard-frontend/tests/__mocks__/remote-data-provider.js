import { jest } from "@jest/globals";
import { RemoteDataProvider } from "../../src/services/remote-data-provider";

/**
 * Mock remote data provider.
 */
export class MockRemoteDataProvider extends RemoteDataProvider {
	fetchJson = jest.fn().mockResolvedValue( [] );
}

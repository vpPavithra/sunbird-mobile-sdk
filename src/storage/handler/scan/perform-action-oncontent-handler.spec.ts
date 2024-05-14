import {PerformActoinOnContentHandler} from './perform-actoin-on-content-handler';
import { StorageHandler } from '../storage-handler';
import { ScanContentContext } from '../../def/scan-requests';
import { Device } from '@capacitor/device';

jest.mock('@capacitor/device', () => {
    return {
      ...jest.requireActual('@capacitor/device'),
        Device: {
            getInfo: jest.fn()
        }
    }
})
describe('PerformActoinOnContentHandler', () => {
    let performActoinOnContentHandler: PerformActoinOnContentHandler;
    const mockStorageHandler: Partial<StorageHandler> = {};

    beforeAll(() => {
        performActoinOnContentHandler = new PerformActoinOnContentHandler(
            mockStorageHandler as StorageHandler
        );
    });

    beforeEach(() => {
        Device.getInfo = jest.fn(() => Promise.resolve({ uuid: 'some_uuid', platform:'android' })) as any;
        jest.clearAllMocks();
    });

    it('should be create a instance of PerformActoinOnContentHandler', () => {
        expect(performActoinOnContentHandler).toBeTruthy();
    });

    it('should delete content from DB and add destination content', (done) => {
        // arrange
        const request: ScanContentContext = {
            currentStoragePath: 'SAMPLE_CURRENT_STORAGE_PATH',
            newlyAddedIdentifiers: ['SAMPLE_IDENTIFIER_1', 'SAMPLE_IDENTIFIER_2'],
            deletedIdentifiers: ['delete_content_1']
        };
        mockStorageHandler.deleteContentsFromDb = jest.fn().mockImplementation(() => {});
        mockStorageHandler.addDestinationContentInDb = jest.fn().mockImplementation(() => {});
        // act
        performActoinOnContentHandler.exexute(request).subscribe(() => {
            // assert
            done();
        });
    });
});

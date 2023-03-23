import { loadJsonFromFile, parseRawData, writeJsonToFile } from './utils';

(async function oneTime() {
    await writeJsonToFile(
        'data.json',
        parseRawData(await loadJsonFromFile('raw_data.json'))
    );
})();

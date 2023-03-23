import { promises as fs } from 'fs';
import { ItemType } from '.';

export async function writeJsonToFile(filename: string, data: any) {
    try {
        const jsonString = JSON.stringify(data);
        console.log(jsonString);
        await fs.writeFile(filename, jsonString);
        console.log(`JSON data written to ${filename} file.`);
    } catch (error) {
        console.error(`Error writing JSON data to ${filename} file: `, error);
    }
}
export const parseRawData = (
    rawData: {
        'FULL NAME': string;
        NAME: string;
        COMPANY: string;
        UNIT: string;
        REORDER: '2';
        'ITEM TYPE': string;
        TYPE: string;
    }[]
) => {
    return rawData.map(
        ({ NAME, COMPANY, REORDER, TYPE, 'ITEM TYPE': item_type, UNIT }) => {
            return {
                name: NAME,
                prefix: TYPE,
                type: item_type,
                manufacturer: COMPANY,
                reorder: REORDER,
                dispensible_unit: UNIT,
            };
        }
    ) as ItemType[];
};
export async function loadJsonFromFile(filename: string) {
    try {
        const data = await fs.readFile(filename, 'utf-8');
        const jsonData = JSON.parse(data);
        return jsonData;
    } catch (error) {
        console.error(`Error loading JSON data from ${filename} file: `, error);
    }
}

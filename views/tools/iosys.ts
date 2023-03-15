import * as fs from 'expo-file-system';

/** 
 * Функция для записи в приложение
 * @param props - Объект, содержащий название файла без '.json' и данные в виде объекта
 * @example ```ts
 * setData({fileName: 'Calendar', data: {cards:[]}})
 * setData({fileName: 'Calendar', data: data})
 * ```
*/
export async function setData(props: {fileName: string, data:object}) {
    try {
        await fs.writeAsStringAsync(fs.documentDirectory + props.fileName + '.json', JSON.stringify(props.data));
    } catch(e) {
        console.log(e);        
    }
}

/**
 * Функция для получения содержимого json-файла
 * @param props - Объект, содержайщий название файла с данными без '.json'
 * @example ```ts 
 * getData({fileName: 'Calendar'})
 * ```
 * @returns Объект из файла, либо `null`, если такого файла не существует
 */
export async function getData(props: {fileName: string}) {
    try {
        const isFile = await fs.getInfoAsync(fs.documentDirectory + props.fileName + '.json');
        
        if(!isFile.exists) return null
        else {
            const data = JSON.parse(await fs.readAsStringAsync(fs.documentDirectory + props.fileName + '.json'));            
            if (typeof(data) != typeof({obj: 1})) return null
            return data
        }
    } catch(e) {
        console.log(e);
        return null;        
    }
}
import * as fs from 'expo-file-system';
import {
    category,
    debt,
    history,
    piggyBank,
    calendar,
    account,
    emptyAccount,
    emptyHistory,
    emptyCalendar,
    emptyDebt,
    emptyPiggyBank,
    emptyAccHistory,
    emptyCategories,
} from '../../models/interfaces';

/**
 * Функция для записи в приложение
 * @param props - Объект, содержащий название файла без '.json' и данные в виде объекта
 * @example ```ts
 * setData({fileName: 'Calendar', data: {cards:[]}})
 * setData({fileName: 'Calendar', data: data})
 * ```
 */
export async function setData(props: { fileName: string; data: object }) {
    try {
        await fs.writeAsStringAsync(
            fs.documentDirectory + props.fileName + '.json',
            JSON.stringify(props.data),
        );
    } catch (e) {
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
export async function getData(props: { fileName: string }) {
    try {
        const isFile = await fs.getInfoAsync(fs.documentDirectory + props.fileName + '.json');

        if (!isFile.exists) return null;
        else {
            const data = JSON.parse(
                await fs.readAsStringAsync(fs.documentDirectory + props.fileName + '.json'),
            );
            if (typeof data != typeof { obj: 1 }) return null;
            return data;
        }
    } catch (e) {
        console.log(e);
        return null;
    }
}

/**
 * Функция для добавления элемента в данные, не переписывая полный массив данных в файле
 * @param key - ключ внутри интерфейса хранения данных, например `debts`, `history`
 * @param fileName - название файла, куда сохранять изменения
 * @param item - сам объект для добавления
 * @example ```ts
 * addItem("accounts", "Account", {id: 0, name: "Test", sum: 1000})
 * ```
 */
export async function addItem<
    K extends
        | keyof category
        | keyof debt
        | keyof calendar
        | keyof account
        | keyof piggyBank
        | keyof history,
>(key: K, fileName: string, item: object) {
    const data = await getData({ fileName: fileName });
    data[key].push(item);
    await setData({ fileName: fileName, data: data });
}

/**
 * Функция для удаления элемента в данных, не переписывая полный массив данных в файле
 * @param key - ключ внутри интерфейса хранения данных, например `debts`, `history`
 * @param fileName - название файла, куда сохранять изменения
 * @param index - индекс удаляемого элемента
 * @example ```ts
 * delItem("accounts", "Account", 0)
 * ```
 */
export async function delItem<
    K extends
        | keyof category
        | keyof debt
        | keyof calendar
        | keyof account
        | keyof piggyBank
        | keyof history,
>(key: K, fileName: string, index: number) {
    const data = await getData({ fileName: fileName });
    data[key].splice(index, 1);
    await setData({ fileName: fileName, data: data });
}

export async function editItem<
    K extends
        | keyof category
        | keyof debt
        | keyof calendar
        | keyof account
        | keyof piggyBank
        | keyof history,
>(key: K, fileName: string, index: number, item: object) {
    const data = await getData({ fileName: fileName });
    data[key][index] = item;
    await setData({ fileName: fileName, data: data });
}

export async function removeAllData() {
    await setData({ fileName: 'Account', data: emptyAccount() });

    await setData({ fileName: 'history', data: emptyHistory() });

    await setData({ fileName: 'category', data: emptyCategories() });

    await setData({ fileName: 'Calendar', data: emptyCalendar() });

    await setData({ fileName: 'Debt', data: emptyDebt() });

    await setData({ fileName: 'PiggyBank', data: emptyPiggyBank() });

    await setData({ fileName: 'AccountHistory', data: emptyAccHistory() });
}

export function abbrNum(num: number) {
    if (num >= 1000000000) return `${Math.round((num / 1000000000) * 10) / 10} млрд.`;
    else if (num >= 1000000) return `${Math.round((num / 1000000) * 10) / 10} млн.`;
    else if (num >= 1000) return `${Math.round((num / 1000) * 10) / 10} тыс.`;
    else return num;
}

export function replaceSpace(str: string) {
    return str.replace(/\s+/g, ' ').trim();
}

export function borderBillionMillionThousand(num: number) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

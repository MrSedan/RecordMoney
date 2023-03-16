import {
    account,
    calendar,
    category,
    debt,
    emptyAccount,
    emptyCalendar,
    emptyDebt,
    emptyHistory,
    emptyPiggyBank,
    history,
    piggyBank,
} from '../../models/interfaces';
import { delItem, editItem, getData, setData } from './iosys';

/**
 * Функция получения списка доступных счетов
 * @returns Возвращает массив счетов
 */
export async function getAccounts() {
    let data: account = await getData({ fileName: 'Account' });
    if (data === null) {
        data = emptyAccount();
    }
    return data.accounts;
}

/**
 * Функция работы с деньгами на счете. При невозможности операции (недостаточно средств) вызовет ошибку,
 * которую нужно обрабатывать при помощи `try` и `catch` конструкций.
 * @param count - количество денег, что поступят на счет
 * @param id_account - идентификатор счета, с которым происходит операция
 * @returns Возвращает тип `Boolean`, который равен `true`, если счет был найден и была проведена операция
 * и возвращает `false`, если счет не был найден.
 * @example ```ts
 * try {
 *  addMoney(-900, 0)
 * } catch {
 * console.log("Недостаточно средств")
 * }
 * ```
 */
export async function addMoney(count: number, id_account: string | number) {
    let data: account = await getData({ fileName: 'Account' });
    data.accounts.map(async (item, index) => {
        if (item.id == Number(id_account)) {
            if (item.id == Number(id_account)) {
                if (item.sum + count < 0) throw Error('Не хватает средств!');
                item.sum += count;
                await editItem('accounts', 'Account', index, item);
                return true; // Нашел счет и обработал запрос
            }
        }
    });
    return false; // Не нашел счет
}

export async function removeAccount(id_account: string | number) {
    const accs: account = await getData({ fileName: 'Account' });
    try {
        accs.accounts = accs.accounts.filter((item) => {
            return item.id != id_account;
        });
        await setData({ fileName: 'Account', data: accs });
    } catch {
        await setData({ fileName: 'Account', data: emptyAccount() });
    }
    const hist: history = await getData({ fileName: 'history' });
    try {
        hist.history = hist.history.filter((item) => {
            return item.id_account != id_account;
        });
        await setData({ fileName: 'history', data: hist });
    } catch {
        await setData({ fileName: 'history', data: emptyHistory() });
    }

    try {
        const calend: calendar = await getData({ fileName: 'Calendar' });
        calend.cards = calend.cards.filter((item) => {
            return item.id_account != id_account;
        });
        await setData({ fileName: 'Calendar', data: calend });
    } catch {
        await setData({ fileName: 'Calendar', data: emptyCalendar() });
    }

    try {
        const deb: debt = await getData({ fileName: 'Debt' });
        deb.debts = deb.debts.filter((item) => {
            return item.id_account != id_account;
        });
        await setData({ fileName: 'Debt', data: deb });
    } catch {
        await setData({ fileName: 'Debt', data: emptyDebt() });
    }

    try {
        const pig: piggyBank = await getData({ fileName: 'PiggyBank' });
        pig.piggyBanks = pig.piggyBanks.filter((item) => {
            return item.id_account != id_account;
        });
        await setData({ fileName: 'PiggyBank', data: pig });
    } catch {
        await setData({ fileName: 'PiggyBank', data: emptyPiggyBank() });
    }
}

import {
    account,
    calendar,
    category,
    debt,
    emptyAccount,
    history,
    piggyBank,
} from '../../models/interfaces';
import { delItem, getData, setData } from './iosys';

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
    data.accounts.map((item) => {
        if (item.id == Number(id_account)) {
            if (item.id == Number(id_account)) {
                if (item.sum + count < 0) throw Error('Не хватает средств!');
                item.sum += count;
                return true; // Нашел счет и обработал запрос
            }
        }
    });
    return false; // Не нашел счет
}

// FIXME: неправильно удаляет
export async function removeAccount(id_account: string | number) {
    delItem('accounts', 'Account', +id_account);
    const hist: history = await getData({ fileName: 'history' });
    hist.history = hist.history.filter((item) => {
        return item.id_account != id_account;
    });
    await setData({ fileName: 'history', data: hist });

    const calend: calendar = await getData({ fileName: 'Calendar' });
    calend.cards = calend.cards.filter((item) => {
        return item.id_account != id_account;
    });
    await setData({ fileName: 'Calendar', data: calend });

    const deb: debt = await getData({ fileName: 'Debt' });
    deb.debts = deb.debts.filter((item) => {
        return item.id_account != id_account;
    });
    await setData({ fileName: 'Debt', data: deb });

    const pig: piggyBank = await getData({ fileName: 'PiggyBank' });
    pig.piggyBanks = pig.piggyBanks.filter((item) => {
        return item.id_account != id_account;
    });
    await setData({ fileName: 'PiggyBank', data: pig });
}

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
    accountHistory,
    emptyAccHistory,
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
 * Функция работы с деньгами на счете.
 * @param count - количество денег, что поступят на счет
 * @param id_account - идентификатор счета, с которым происходит операция
 * @returns Возвращает строку, которая содержит `ok` (операция проведена), либо `not-found` (счет не найден), либо `no-money` (недостаточно средств).
 */
export async function addMoney(
    count: number,
    id_operat: string | number,
    id_acc: string | number,
    pageEvent: 'home' | 'calendar' | 'debt' | 'piggyBank',
    onDelete: boolean = false,
    onEdit: boolean = false,
): Promise<'not-found' | 'ok' | 'no-money'> {
    let data: account = JSON.parse(JSON.stringify(await getData({ fileName: 'Account' })));
    let historyAcc: accountHistory = await getData({ fileName: 'AccountHistory' });
    let status: 'not-found' | 'ok' | 'no-money' = 'not-found';
    for (let index = 0; index < data.accounts.length; index++) {
        const item = data.accounts[index];
        if (item.id == Number(id_acc)) {
            if (item.sum + count < 0) {
                status = 'no-money';
                break;
            }
            item.sum += count;
            item.sum = Math.round(item.sum * 100) / 100;
            await editItem('accounts', 'Account', index, item);

            if (historyAcc === null)
                await setData({ fileName: 'AccountHistory', data: emptyAccHistory() });
            else {
                const typeEvent = count > 0 ? '1' : '2';
                if (historyAcc.accHistory.length !== 0) {
                    if (onDelete) {
                        const ind = historyAcc.accHistory.findIndex(
                            (item) => item.page === pageEvent && item.id_operation === id_operat,
                        );
                        historyAcc.accHistory.splice(ind, 1);
                    } else {
                        if (onEdit) {
                            historyAcc.accHistory[
                                historyAcc.accHistory.findIndex(
                                    (item) =>
                                        item.page === pageEvent && item.id_operation === id_operat,
                                )
                            ].id_account = +id_acc;
                            historyAcc.accHistory[
                                historyAcc.accHistory.findIndex(
                                    (item) =>
                                        item.page === pageEvent && item.id_operation === id_operat,
                                )
                            ].sum = +count;
                            historyAcc.accHistory[
                                historyAcc.accHistory.findIndex(
                                    (item) =>
                                        item.page === pageEvent && item.id_operation === id_operat,
                                )
                            ].sum =
                                Math.round(
                                    historyAcc.accHistory[
                                        historyAcc.accHistory.findIndex(
                                            (item) =>
                                                item.page === pageEvent &&
                                                item.id_operation === id_operat,
                                        )
                                    ].sum * 100,
                                ) / 100;
                            historyAcc.accHistory[
                                historyAcc.accHistory.findIndex(
                                    (item) =>
                                        item.page === pageEvent && item.id_operation === id_operat,
                                )
                            ].type = typeEvent;
                        } else {
                            let newDar = {
                                id: historyAcc.accHistory[historyAcc.accHistory.length - 1].id + 1,
                                id_operation: +id_operat,
                                id_account: +id_acc,
                                date: new Date().getTime().toString(),
                                sum: count,
                                type: typeEvent,
                                page: pageEvent,
                            };
                            historyAcc.accHistory.push(newDar);
                        }
                    }
                } else {
                    let newDar = {
                        id: 1,
                        id_operation: +id_operat,
                        id_account: +id_acc,
                        date: new Date().getTime().toString(),
                        sum: count,
                        type: typeEvent,
                        page: pageEvent,
                    };
                    historyAcc.accHistory = [newDar];
                }
                await setData({ fileName: 'AccountHistory', data: historyAcc });
            }
            console.log(await getData({ fileName: 'AccountHistory' }));
            status = 'ok';
            break;
        }
    }
    return status;
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
        const accHist: accountHistory = await getData({ fileName: 'AccountHistory' });
        accHist.accHistory = accHist.accHistory.filter((item) => {
            return item.id_account != id_account;
        });
        await setData({ fileName: 'AccountHistory', data: accHist });
    } catch {
        await setData({ fileName: 'AccountHistory', data: emptyAccHistory() });
    }
}

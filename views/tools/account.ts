import { account, emptyAccount } from '../../models/interfaces';
import { getData } from './iosys';

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
 * которую нужно обрабатывать при помощи `try` и `catch` конструкций
 * @param count - количество денег, что поступят на счет
 * @param id_account - идентификатор счета, с которым происходит операция
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
                return;
            }
        }
    });
}

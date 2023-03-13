import { account, emptyAccount } from "../../models/interfaces";
import { getData } from "./iosys";

export async function getAccounts(){
    let data: account = await getData({fileName: 'Account'});
    if (data === null) {
        data = emptyAccount()
    }
    return data.accounts
}
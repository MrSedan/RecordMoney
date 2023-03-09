export interface category {
    categories: 
        {
            id: number,
            name: string,
            category_icon: number,
            category_type: string,
            color: string,
            value: number,
        }[]
}
export interface history {
    history: 
        {
            id: number,
            id_account: number,
            category: number,
            date: string,
            sum: number,
            comment: string
        }[]
    
}

export function emptyCategories():category {
    let newData: category = {categories:[]};
    return newData
}

export function emptyHistory():history  {
    let newData: history= { history:[]};
    return newData
}


export interface account {
    accounts: 
        {
            id: number,
            name: string,
            sum: number
        }[]
}

export function emptyAccount(): account {
    let newData: account = {accounts: []};
    return newData
}



export interface piggyBank {
    piggyBanks: 
        {
            id: number,
            id_account: number,
            name: string,
            sum_max: number,
            sum_cur: number,
            status: boolean
        }[]
}

export function emptyPiggyBank(): piggyBank {
    let newData: piggyBank = {piggyBanks: []};
    return newData
}




export interface debt {
    debts: 
        {
            id: number,
            id_account: number,
            name: string,
            contact: string,
            type: string,
            sum: number,
            date: string,
            comment: string
        }[]
}

export function emptyDebt(): debt {
    let newData: debt = {debts: []};
    return newData
}




export interface calendar {
    cards: 
        {
        id: number,
        id_account: number,
        date: string,
        name: string,
        type: string,
        sum: number,
        comment: string
        }[]
}

export function emptyCalendar():calendar {
    let newData: calendar = {cards: []};
    return newData
}

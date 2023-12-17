interface itemData {
    textures: string;
    name: string;
    cost: number;
    sell?: number;
    data: number;
    item: string;
}

interface enchantItemData {
    name: string;
    max_level: number;
    cost: number;
    enchant: string;
}

export type OptionalPropertyNames<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never }[keyof T];

export type SpreadProperties<L, R, K extends keyof L & keyof R> = { [P in K]: L[P] | Exclude<R[P], undefined> };

export type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

export type SpreadTwo<L, R> = Id<
    Pick<L, Exclude<keyof L, keyof R>> &
        Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>> &
        Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>> &
        SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
>;

export type Spread<A extends readonly [...any]> = A extends [infer L, ...infer R] ? SpreadTwo<L, Spread<R>> : unknown;

export interface listItemData extends Array<itemData> {}
export interface listEnchantItemData extends Array<enchantItemData> {}

export interface mechaResponse {
    code: number;
    status: string;
    message?: string;
    result?: any;
}

export interface MechaPlayer {
    id: string;
    name: string;
    role: string;
    guildId: number;
    money: number;
    canTpa: boolean;
    guild?: any;
    guildMember?: any;
}

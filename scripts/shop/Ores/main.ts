/*
----------------------------------
Creator: MRHRTZ
----------------------------------
*/

import { shopItem } from "../itemForm";

const itemData = [
    {
        textures: "textures/items/coal.png",
        name: "Coal",
        cost: 128,
        sell: 16,
        data: 0,
        item: "coal",
    },
    {
        textures: "textures/items/copper_ingot.png",
        name: "Copper Ingot",
        cost: 128,
        sell: 16,
        data: 0,
        item: "copper_ingot",
    },
    {
        textures: "textures/items/quartz.png",
        name: "Quartz",
        cost: 128,
        sell: 16,
        data: 0,
        item: "quartz",
    },
    {
        textures: "textures/items/iron_ingot.png",
        name: "Iron Ingot",
        cost: 384,
        sell: 32,
        data: 0,
        item: "iron_ingot",
    },
    {
        textures: "textures/items/gold_ingot.png",
        name: "Gold Ingot",
        cost: 500,
        sell: 250,
        data: 0,
        item: "gold_ingot",
    },
    {
        textures: "textures/items/redstone_dust.png",
        name: "Redstone",
        cost: 64,
        sell: 16,
        data: 0,
        item: "redstone",
    },
    {
        textures: "textures/items/dye_powder_blue.png",
        name: "Lapis Lazuli",
        cost: 96,
        sell: 8,
        data: 0,
        item: "lapis_lazuli",
    },
    {
        textures: "textures/items/emerald.png",
        name: "Emerald",
        cost: 512,
        sell: 128,
        data: 0,
        item: "emerald",
    },
    {
        textures: "textures/items/diamond.png",
        name: "Diamond",
        cost: 512,
        sell: 128,
        data: 0,
        item: "diamond",
    },
    {
        textures: "textures/items/netherite_ingot.png",
        name: "Netherite",
        cost: 1024,
        sell: 384,
        data: 0,
        item: "netherite_ingot",
    },
];

export function Ores(player) {
    shopItem(player, "Ores", itemData);
}

/*
----------------------------------
Creator: MRHRTZ
----------------------------------
*/

import { shopItem } from "../itemForm";

const itemData = [
    {
        textures: "textures/blocks/crafting_table_front",
        name: "Crafting Table",
        cost: 128,
        data: 0,
        item: "crafting_table",
    },
    {
        textures: "textures/blocks/lectern_top",
        name: "Lectern",
        cost: 512,
        data: 0,
        item: "lectern",
    },
    {
        textures: "textures/blocks/stonecutter2_top",
        name: "Stonecutter",
        cost: 512,
        data: 0,
        item: "stonecutter",
    },
    {
        textures: "textures/blocks/cartography_table_top",
        name: "Cartography Table",
        cost: 384,
        data: 0,
        item: "cartography_table",
    },
    {
        textures: "textures/blocks/fletcher_table_top",
        name: "Fletching Table",
        cost: 384,
        data: 0,
        item: "flething_table",
    },
    {
        textures: "textures/blocks/smithing_table_front",
        name: "Smithing Table",
        cost: 640,
        data: 0,
        item: "smithing_table",
    },
    {
        textures: "textures/blocks/grindstone_side",
        name: "Grindstone",
        cost: 512,
        data: 0,
        item: "grindstone",
    },
    {
        textures: "textures/blocks/furnace_front_off",
        name: "Furnace",
        cost: 512,
        data: 0,
        item: "furnace",
    },
    {
        textures: "textures/blocks/smoker_front_off",
        name: "Smoker",
        cost: 512,
        data: 0,
        item: "smoker",
    },
    {
        textures: "textures/blocks/blast_furnace_front_off",
        name: "Blast Furnace",
        cost: 640,
        data: 0,
        item: "blast_furnace",
    },
    {
        textures: "textures/blocks/campfire_log",
        name: "Campfire",
        cost: 384,
        data: 0,
        item: "campfire",
    },
    {
        textures: "textures/blocks/campfire_log",
        name: "Soul Campfire",
        cost: 448,
        data: 0,
        item: "soul_campfire",
    },
    {
        textures: "textures/blocks/anvil_top_damaged_0",
        name: "Anvil",
        cost: 2048,
        data: 0,
        item: "anvil",
    },
    {
        textures: "textures/blocks/composter_side",
        name: "Composter",
        cost: 256,
        data: 0,
        item: "composter",
    },
    {
        textures: "textures/blocks/noteblock",
        name: "Noteblock",
        cost: 640,
        data: 0,
        item: "noteblock",
    },
    {
        textures: "textures/blocks/jukebox_top",
        name: "Jukebox",
        cost: 768,
        data: 0,
        item: "jukebox",
    },
    {
        textures: "textures/blocks/enchanting_table_top",
        name: "Enchanting Table",
        cost: 3072,
        data: 0,
        item: "enchanting_table",
    },
    {
        textures: "textures/ui/ui_upgrade_bench",
        name: "Upgrade Bench",
        cost: 1072,
        data: 0,
        item: "sp:upgrade_bench",
    },
    {
        textures: "textures/blocks/bookshelf",
        name: "Bookshelf",
        cost: 768,
        data: 0,
        item: "bookshelf",
    },
    {
        textures: "textures/blocks/brewing_stand",
        name: "Brewing Stand",
        cost: 1024,
        data: 0,
        item: "brewing_stand",
    },
    {
        textures: "textures/blocks/cauldron_side",
        name: "Cauldron",
        cost: 384,
        data: 0,
        item: "cauldron",
    },
    {
        textures: "textures/blocks/bell_side",
        name: "Bell",
        cost: 1024,
        data: 0,
        item: "bell",
    },
    {
        textures: "textures/blocks/beacon",
        name: "Beacon",
        cost: 5120,
        data: 0,
        item: "beacon",
    },
    {
        textures: "textures/blocks/conduit_open",
        name: "Conduit",
        cost: 2048,
        data: 0,
        item: "conduit",
    },
    {
        textures: "textures/blocks/lodestone_side",
        name: "Lodestone",
        cost: 768,
        data: 0,
        item: "lodestone",
    },
    {
        textures: "textures/blocks/scaffolding_top",
        name: "Scaffolding",
        cost: 128,
        data: 0,
        item: "scaffolding",
    },
    {
        textures: "textures/blocks/barrel_top",
        name: "Barrel",
        cost: 256,
        data: 0,
        item: "barrel",
    },
    {
        textures: "textures/blocks/ender_chest_front",
        name: "Ender Chest",
        cost: 2048,
        data: 0,
        item: "ender_chest",
    },
    {
        textures: "textures/blocks/shulker_top_undyed",
        name: "Shulker Box",
        cost: 2048,
        data: 0,
        item: "shulker_box",
    },
];

export function FunctionalBlocks(player) {
    shopItem(player, "Functional Blocks", itemData);
}

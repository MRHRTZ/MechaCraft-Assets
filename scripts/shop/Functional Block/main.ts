/*
----------------------------------
Creator: MRHRTZ
----------------------------------
*/

import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";

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
    const shop = new ActionFormData();
    shop.title(`Functional Blocks`);
    shop.body(
        `§b------ §6[ Informasi Pemain ] §b------\n\n§fNama§c: §a${player.nameTag}\n§fUang§c: §a${getScore(
            player,
            "money"
        )}\n\n§b-------------------------------`
    );
    for (const item of itemData) shop.button(`${item.name}\n§c${item.cost}`, `${item.textures}`);
    shop.show(player).then((result) => {
        if (result.canceled) return;
        const item = itemData[result.selection!];
        var money = getScore(player, "money");
        let brick = new ModalFormData()
            .title(`${item.name}`)
            .textField(
                `§6-------------------------------\n\nInformasi Pemain:\nNama: §b${player.nameTag}\n§6Uang: §b${money}\n\n§6Item Information:\n§6Buy x1 §b${item.name} §6= §c${item.cost}\n\n§6-------------------------------\n\n§6Amount:`,
                `The Amount you want to Buy`
            );
        brick.show(player).then(async (res) => {
            let dataCost = item.cost * res.formValues![0];
            if (!res.formValues![0])
                return (
                    player.runCommandAsync(
                        `tellraw @s {"rawtext":[{"text":"§cMasukan jumlah item yang akan dibeli"}]}`
                    ) && player.runCommandAsync(`playsound note.bass @s`)
                );
            if (isNaN(res.formValues![0]))
                return (
                    player.runCommandAsync(
                        `tellraw @s {"rawtext":[{"text":"§cKamu hanya bisa memasukan jumlah item memakai angka"}]}`
                    ) && player.runCommandAsync(`playsound note.bass @s`)
                );
            if (!isNaN(res.formValues![0])) {
                let action = await player.runCommandAsync(
                    `scoreboard players remove @s[scores={money=${dataCost}..}] money ${dataCost}`
                );
                if (action.successCount) {
                    player.runCommandAsync(`give @s ${item.item} ${res.formValues![0]} ${item.data}`);
                    player.runCommandAsync(
                        `tellraw @s {"rawtext":[{"text":"§r§l§c[§bM-SHOP§c]§r §aKamu berhasil membeli §cx${
                            res.formValues![0]
                        } §b${item.name} §aDengan total: §e${dataCost}"}]}`
                    );
                    player.runCommandAsync(`playsound random.levelup @s`);
                } else {
                    player.runCommandAsync(
                        `tellraw @s {"rawtext":[{"text":"§r§l§c[§bM-SHOP§c]§r §cUang kamu tidak cukup, butuh §e${dataCost}"}]}`
                    );
                    player.runCommandAsync(`playsound note.bass @s`);
                }
            }
        });
    });
}

function getScore(entity, objective) {
    try {
        return world.scoreboard.getObjective(objective).getScore(entity.scoreboard);
    } catch (error) {
        return 0;
    }
}

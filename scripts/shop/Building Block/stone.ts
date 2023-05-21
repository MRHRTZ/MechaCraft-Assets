import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { BuildingBlocks } from "./main";

const itemData = [
    {
        textures: "textures/blocks/brick",
        name: "Brick Block",
        cost: 64,
        sell: 16,
        data: 0,
        item: "brick_block",
    },
    {
        textures: "textures/blocks/stone",
        name: "Stone",
        cost: 128,
        sell: 32,
        data: 0,
        item: "stone",
    },
    {
        textures: "textures/blocks/gravel",
        name: "Gravel",
        cost: 96,
        sell: 16,
        data: 0,
        item: "gravel",
    },
    {
        textures: "textures/blocks/cobblestone",
        name: "Cobblestone",
        cost: 96,
        sell: 16,
        data: 0,
        item: "cobblestone",
    },
    {
        textures: "textures/blocks/cobblestone_mossy",
        name: "Mossy Cobblestone",
        cost: 96,
        sell: 16,
        data: 0,
        item: "mossy_cobblestone",
    },
    {
        textures: "textures/blocks/stone_slab_top",
        name: "Smooth Stone",
        cost: 160,
        sell: 16,
        data: 0,
        item: "smooth_stone",
    },
    {
        textures: "textures/blocks/stonebrick",
        name: "Stonebrick",
        cost: 256,
        sell: 32,
        data: 0,
        item: "stonebrick",
    },
    {
        textures: "textures/blocks/stonebrick_mossy",
        name: "Mossy Stonebrick",
        cost: 256,
        sell: 32,
        data: 0,
        item: "mossy_stonebrick",
    },
    {
        textures: "textures/blocks/stone_granite",
        name: "Granite",
        cost: 128,
        sell: 16,
        data: 1,
        item: "stone",
    },
    {
        textures: "textures/blocks/stone_diorite",
        name: "Diorite",
        cost: 128,
        sell: 16,
        data: 3,
        item: "stone",
    },
    {
        textures: "textures/blocks/stone_andesite",
        name: "Andesite",
        cost: 128,
        sell: 16,
        data: 5,
        item: "stone",
    },
    {
        textures: "textures/blocks/deepslate/deepslate",
        name: "Deepslate",
        cost: 128,
        sell: 16,
        data: 0,
        item: "deepslate",
    },
    {
        textures: "textures/blocks/deepslate/cobbled_deepslate",
        name: "Cobbled Deepslate",
        cost: 128,
        sell: 16,
        data: 0,
        item: "cobbled_deepslate",
    },
    {
        textures: "textures/blocks/deepslate/deepslate_bricks",
        name: "Deepslate Brick",
        cost: 128,
        sell: 16,
        data: 0,
        item: "deepslate_bricks",
    },
    {
        textures: "textures/blocks/deepslate/deepslate_tiles",
        name: "Deepslate Tiles",
        cost: 128,
        sell: 16,
        data: 0,
        item: "deepslate_tiles",
    },
];

export function Stone(player) {
    const shop = new ActionFormData();
    shop.title(`Stone Block`);
    shop.body(
        `§b------ §6[ Informasi Pemain ] §b------\n\n§fNama§c: §a${player.nameTag}\n§fUang§c: §a${getScore(
            player,
            "money"
        )}\n\n§b-------------------------------`
    );
    for (const item of itemData) shop.button(`${item.name}\n§c${item.cost}`, `${item.textures}`);
    shop.show(player).then((result) => {
        if (result.canceled) return BuildingBlocks(player);
        const item = itemData[result.selection!];
        var money = getScore(player, "money");
        let brick = new ModalFormData()
            .title(`${item.name}`)
            .textField(
                `§6-------------------------------\n\nInformasi Pemain:\nNama: §b${player.nameTag}\n§6Uang: §b${money}\n\n§6Item Information:\n§6Buy x1 §b${item.name} §6= §c${item.cost}\n§6Sell x1 §b${item.name} §6= §c${item.sell}\n\n§6-------------------------------\n\n§6Amount:`,
                `The Amount you want to Buy or Sell`
            )
            .toggle("§6Sell / Buy", true);
        brick.show(player).then(async (res) => {
            let dataCost = item.cost * res.formValues![0];
            let dataSell = item.sell * res.formValues![0];
            if (!res.formValues![0])
                return (
                    player.runCommandAsync(
                        `tellraw @s {"rawtext":[{"text":"§cMasukan jumlah item yang akan dibeli or Sell"}]}`
                    ) && player.runCommandAsync(`playsound note.bass @s`)
                );
            if (isNaN(res.formValues![0]))
                return (
                    player.runCommandAsync(
                        `tellraw @s {"rawtext":[{"text":"§cKamu hanya bisa memasukan jumlah item memakai angka"}]}`
                    ) && player.runCommandAsync(`playsound note.bass @s`)
                );
            if (!isNaN(res.formValues![0])) {
                if (res.formValues![1] == true) {
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
                if (res.formValues![1] == false) {
                    let action = await player.runCommandAsync(
                        `clear @s[hasitem={item=${item.item},quantity=${res.formValues![0]}..}] ${item.item} ${
                            item.data
                        } ${res.formValues![0]}`
                    );
                    if (action.successCount) {
                        player.runCommandAsync(`scoreboard players add @s money ${dataSell}`);
                        player.runCommandAsync(
                            `tellraw @s {"rawtext":[{"text":"§r§l§c[§bM-SHOP§c]§r §aKamu berhasil menjual §cx${
                                res.formValues![0]
                            } §b${item.name} §aDengan total: §e$${dataSell}"}]}`
                        );
                        player.runCommandAsync(`playsound random.levelup @s`);
                    } else {
                        player.runCommandAsync(
                            `tellraw @s {"rawtext":[{"text":"§r§l§c[§bM-SHOP§c]§r §cKamu tidak bisa menjual §cx${
                                res.formValues![0]
                            } §b${item.name} §cKarena tidak cukup atau barang tidak ada"}]}`
                        );
                        player.runCommandAsync(`playsound note.bass @s`);
                    }
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

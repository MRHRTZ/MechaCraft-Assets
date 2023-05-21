/*
----------------------------------
Creator: MRHRTZ
----------------------------------
*/

import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";

const itemData = [
    {
        textures: "textures/items/leather.png",
        name: "Leather",
        cost: 32,
        sell: 8,
        data: 0,
        item: "leather",
    },
    {
        textures: "textures/items/rabbit_hide.png",
        name: "Rabbit Hide",
        cost: 32,
        sell: 8,
        data: 0,
        item: "rabbit_hide",
    },
    {
        textures: "textures/items/rabbit_foot.png",
        name: "Rabbit Foot",
        cost: 32,
        sell: 8,
        data: 0,
        item: "rabbit_foot",
    },
    {
        textures: "textures/items/feather.png",
        name: "Feather",
        cost: 32,
        sell: 16,
        data: 0,
        item: "feather",
    },
    {
        textures: "textures/items/gunpowder.png",
        name: "Gunpowder",
        cost: 32,
        sell: 8,
        data: 0,
        item: "gunpowder",
    },
    {
        textures: "textures/items/string.png",
        name: "String",
        cost: 32,
        sell: 8,
        data: 0,
        item: "string",
    },
    {
        textures: "textures/items/rotten_flesh.png",
        name: "Rotten Flesh",
        cost: 32,
        sell: 8,
        data: 0,
        item: "rotten_flesh",
    },
    {
        textures: "textures/items/bone.png",
        name: "Bone",
        cost: 64,
        sell: 8,
        data: 0,
        item: "bone",
    },
    {
        textures: "textures/items/ender_pearl.png",
        name: "Ender Pearl",
        cost: 64,
        sell: 8,
        data: 0,
        item: "ender_pearl",
    },
    {
        textures: "textures/items/slimeball.png",
        name: "Slimeball",
        cost: 64,
        sell: 16,
        data: 0,
        item: "slime_ball",
    },
    {
        textures: "textures/items/spider_eye.png",
        name: "Spider Eye",
        cost: 32,
        sell: 16,
        data: 0,
        item: "spider_eye",
    },
    {
        textures: "textures/items/spider_eye_fermented.png",
        name: "Fermented Spider Eye",
        cost: 32,
        sell: 16,
        data: 0,
        item: "fermented_spider_eye",
    },
    {
        textures: "textures/items/magma_cream.png",
        name: "Magma Cream",
        cost: 32,
        sell: 8,
        data: 0,
        item: "magma_cream",
    },
    {
        textures: "textures/items/blaze_rod.png",
        name: "Blaze Rod",
        cost: 64,
        sell: 8,
        data: 0,
        item: "blaze_rod",
    },
    {
        textures: "textures/items/dye_powder_glow.png",
        name: "Glow Ink Sac",
        cost: 64,
        sell: 16,
        data: 0,
        item: "glow_ink_sac",
    },
    {
        textures: "textures/items/shulker_shell.png",
        name: "Shulker Shell",
        cost: 128,
        sell: 32,
        data: 0,
        item: "shulker_shell",
    },
];

export function MobDrops(player) {
    const shop = new ActionFormData();
    shop.title(`Mob Drop Loot`);
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

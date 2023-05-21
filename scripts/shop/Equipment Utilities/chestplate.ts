import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { EquipmentsUtilities } from "./main";

const itemData = [
    {
        textures: "textures/items/leather_chestplate",
        name: "Leather Chestplate",
        cost: 384,
        data: 0,
        item: "leather_chestplate",
    },
    {
        textures: "textures/items/chainmail_chestplate",
        name: "Chain Chestplate",
        cost: 768,
        data: 0,
        item: "chainmail_chestplate",
    },
    {
        textures: "textures/items/iron_chestplate",
        name: "Iron Chestplate",
        cost: 3072,
        data: 0,
        item: "iron_chestplate",
    },
    {
        textures: "textures/items/gold_chestplate",
        name: "Gold Chestplate",
        cost: 2304,
        data: 0,
        item: "gold_chestplate",
    },
    {
        textures: "textures/items/diamond_chestplate",
        name: "Diamond Chestplate",
        cost: 3840,
        data: 0,
        item: "diamond_chestplate",
    },
    {
        textures: "textures/items/netherite_chestplate",
        name: "Netherite Chestplate",
        cost: 4800,
        data: 0,
        item: "netherite_chestplate",
    },
];

export function Chestplate(player) {
    const shop = new ActionFormData();
    shop.title(`Chestplate`);
    shop.body(
        `§b------ §6[ Informasi Pemain ] §b------\n\n§fNama§c: §a${player.nameTag}\n§fUang§c: §a${getScore(
            player,
            "money"
        )}\n\n§b-------------------------------`
    );
    for (const item of itemData) shop.button(`${item.name}\n§c${item.cost}`, `${item.textures}`);
    shop.show(player).then((result) => {
        if (result.canceled) return EquipmentsUtilities(player);
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

import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { EquipmentsUtilities } from "./main";

const itemData = [
    {
        textures: "textures/items/wood_pickaxe",
        name: "Wooden Pickaxe",
        cost: 256,
        data: 0,
        item: "wooden_pickaxe",
    },
    {
        textures: "textures/items/stone_pickaxe",
        name: "Stone Pickaxe",
        cost: 512,
        data: 0,
        item: "stone_pickaxe",
    },
    {
        textures: "textures/items/iron_pickaxe",
        name: "Iron Pickaxe",
        cost: 2048,
        data: 0,
        item: "iron_pickaxe",
    },
    {
        textures: "textures/items/gold_pickaxe",
        name: "Golden Pickaxe",
        cost: 1536,
        data: 0,
        item: "golden_pickaxe",
    },
    {
        textures: "textures/items/diamond_pickaxe",
        name: "Diamond Pickaxe",
        cost: 2560,
        data: 0,
        item: "diamond_pickaxe",
    },
    {
        textures: "textures/items/netherite_pickaxe",
        name: "Netherite Pickaxe",
        cost: 3200,
        data: 0,
        item: "netherite_pickaxe",
    },
];

export function Pickaxe(player) {
    const shop = new ActionFormData();
    shop.title(`Pickaxe`);
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

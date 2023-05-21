import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { Potions } from "./main";

const itemData = [
    {
        textures: "textures/items/potion_bottle_nightVision",
        name: "Night Vision (8:00)",
        cost: 512,
        data: 6,
        item: "potion",
    },
    {
        textures: "textures/items/potion_bottle_invisibility",
        name: "Invisibility (8:00)",
        cost: 512,
        data: 8,
        item: "potion",
    },
    {
        textures: "textures/items/potion_bottle_jump",
        name: "Jump Boost (8:00)",
        cost: 512,
        data: 10,
        item: "potion",
    },
    {
        textures: "textures/items/potion_bottle_fireResistance",
        name: "Fire Resistance (8:00)",
        cost: 512,
        data: 13,
        item: "potion",
    },
    {
        textures: "textures/items/potion_bottle_digSpeed",
        name: "Speed (8:00)",
        cost: 512,
        data: 15,
        item: "potion",
    },
    {
        textures: "textures/items/potion_bottle_waterBreathing",
        name: "Water Breathing (8:00)",
        cost: 512,
        data: 20,
        item: "potion",
    },
    {
        textures: "textures/items/potion_bottle_damageBoost",
        name: "Strength (8:00)",
        cost: 512,
        data: 32,
        item: "potion",
    },
    {
        textures: "textures/items/potion_bottle_slowFall",
        name: "Slow Falling (4:00)",
        cost: 512,
        data: 41,
        item: "potion",
    },
    {
        textures: "textures/items/potion_bottle_regeneration",
        name: "Regeneration (2:00)",
        cost: 512,
        data: 29,
        item: "potion",
    },
    {
        textures: "textures/items/potion_bottle_heal",
        name: "Instant Health II",
        cost: 768,
        data: 22,
        item: "potion",
    },
    {
        textures: "textures/items/potion_bottle_harm",
        name: "Instant Damage II",
        cost: 768,
        data: 24,
        item: "potion",
    },
    {
        textures: "textures/items/potion_bottle_digSlowdown",
        name: "Slowness (4:00)",
        cost: 512,
        data: 18,
        item: "potion",
    },
    {
        textures: "textures/items/potion_bottle_weakness",
        name: "Weakness (4:00)",
        cost: 512,
        data: 35,
        item: "potion",
    },
    {
        textures: "textures/items/potion_bottle_poison",
        name: "Poison (2:00)",
        cost: 512,
        data: 26,
        item: "potion",
    },
    {
        textures: "textures/items/potion_bottle_wither",
        name: "Decay (0:40)",
        cost: 512,
        data: 36,
        item: "potion",
    },
];

export function Bottle(player) {
    const shop = new ActionFormData();
    shop.title(`Bottle Potions`);
    shop.body(
        `§b------ §6[ Informasi Pemain ] §b------\n\n§fNama§c: §a${player.nameTag}\n§fUang§c: §a${getScore(
            player,
            "money"
        )}\n\n§b-------------------------------`
    );
    for (const item of itemData) shop.button(`${item.name}\n§c${item.cost}`, `${item.textures}`);
    shop.show(player).then((result) => {
        if (result.canceled) return Potions(player);
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

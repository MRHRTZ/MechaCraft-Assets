import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { Enchantments } from "./main";

const enchantData = [
    {
        name: "Aqua Affinity",
        max_level: 1,
        cost: 25000,
        enchant: "aqua_affinity",
    },
    {
        name: "Blast Protection",
        max_level: 4,
        cost: 40000,
        enchant: "blast_protection",
    },
    {
        name: "Curse of Binding",
        max_level: 1,
        cost: 15000,
        enchant: "binding",
    },
    {
        name: "Depth Strider",
        max_level: 3,
        cost: 25000,
        enchant: "depth_strider",
    },
    {
        name: "Feather Falling",
        max_level: 4,
        cost: 30000,
        enchant: "feather_falling",
    },
    {
        name: "Fire Protection",
        max_level: 4,
        cost: 45000,
        enchant: "fire_protection",
    },
    {
        name: "Frost Walker",
        max_level: 2,
        cost: 30000,
        enchant: "frost_walker",
    },
    {
        name: "Projectile Protection",
        max_level: 4,
        cost: 40000,
        enchant: "projectile_protection",
    },
    {
        name: "Protection",
        max_level: 4,
        cost: 55000,
        enchant: "protection",
    },
    {
        name: "Respiration",
        max_level: 3,
        cost: 35000,
        enchant: "respiration",
    },
    {
        name: "Soul Speed",
        max_level: 3,
        cost: 25000,
        enchant: "soul_speed",
    },
    {
        name: "Thorns",
        max_level: 3,
        cost: 50000,
        enchant: "thorns",
    },
];

export function Armor(player) {
    const shop = new ActionFormData();
    shop.title(`Armor`);
    shop.body(
        `§6-------------------------------\n\nInformasi Pemain:\nNama: §b${player.nameTag}\n§6Uang: §b$${getScore(
            player,
            "money"
        )}\n\nNote:\n§6Pastikan anda telah memegang item, gunakan perintah §c.vshop\n\n§6-------------------------------`
    );
    for (const enchant of enchantData) shop.button(`${enchant.name}\n§b$${enchant.cost}`);
    shop.show(player).then((result) => {
        if (result.canceled) return Enchantments(player);
        const enchant = enchantData[result.selection!];
        var money = getScore(player, "money");
        let brick = new ModalFormData()
            .title(`${enchant.name}`)
            .slider(
                `§6-------------------------------\n\nInformasi Pemain:\nNama: §b${player.nameTag}\n§6Uang: §b${money}\n\n§6Enchant Information:\n§6Buy x1 Level §b${enchant.name} §6= §b$${enchant.cost}\n\nNote:\n§6Pastikan anda telah memegang item, gunakan perintah §c.vshop\n\n§6-------------------------------\n\n§6Level`,
                1,
                enchant.max_level,
                1
            );
        brick.show(player).then(async (res) => {
            let dataCost = enchant.cost * res.formValues![0];
            if (res.formValues![0]) {
                let action = await player.runCommandAsync(
                    `scoreboard players remove @s[scores={money=${dataCost}..}] money ${dataCost}`
                );
                if (action.successCount) {
                    player.runCommandAsync(`enchant @s ${enchant.enchant} ${res.formValues![0]}`);
                    player.runCommandAsync(
                        `tellraw @s {"rawtext":[{"text":"§r§l§c[§bM-SHOP§c]§r §aSuccessfully purchased enchanted §b${
                            enchant.name
                        } ${res.formValues![0]} §aDengan total: §e${dataCost}"}]}`
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

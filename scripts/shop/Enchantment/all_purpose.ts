import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import * as utils from "../../libs/utils";
import { Enchantments } from "./main";
const enchantData = [
    {
        name: "Mending",
        max_level: 1,
        cost: 60000,
        enchant: "mending",
    },
    {
        name: "Unbreaking",
        max_level: 3,
        cost: 35000,
        enchant: "unbreaking",
    },
    {
        name: "Curse of Vanishing",
        max_level: 1,
        cost: 30000,
        enchant: "vanishing",
    },
];

export function AllPurpose(player) {
    const shop = new ActionFormData();
    shop.title(`All Purpose`);
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

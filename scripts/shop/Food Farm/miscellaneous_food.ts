import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { FoodsFarms } from "./main";

const itemData = [
    {
        textures: "textures/items/bread.png",
        name: "Bread",
        cost: 64,
        data: 0,
        item: "bread",
    },
    {
        textures: "textures/items/mushroom_stew.png",
        name: "Mushroom Stew",
        cost: 64,
        data: 0,
        item: "mushroom_stew",
    },
    {
        textures: "textures/items/beetroot_soup.png",
        name: "Beetroot Soup",
        cost: 64,
        data: 0,
        item: "beetroot_soup",
    },
    {
        textures: "textures/items/rabbit_stew.png",
        name: "Rabbit Stew",
        cost: 96,
        data: 0,
        item: "rabbit_stew",
    },
    {
        textures: "textures/items/potato_baked.png",
        name: "Baked Potato",
        cost: 64,
        data: 0,
        item: "baked_potato",
    },
    {
        textures: "textures/items/pumpkin_pie.png",
        name: "Pumpkin Pie",
        cost: 64,
        data: 0,
        item: "pumpkin_pie",
    },
    {
        textures: "textures/items/cookie.png",
        name: "Cookie",
        cost: 32,
        data: 0,
        item: "cookie",
    },
    {
        textures: "textures/items/cake.png",
        name: "Cake",
        cost: 96,
        data: 0,
        item: "cake",
    },
    {
        textures: "textures/items/apple_golden",
        name: "Golden Apple",
        cost: 512,
        data: 0,
        item: "golden_apple",
    },
    {
        textures: "textures/items/apple_golden",
        name: "Ecnhanted Golden Apple",
        cost: 1024,
        data: 0,
        item: "enchanted_golden_apple",
    },
];

export function MiscellaneousFood(player) {
    const shop = new ActionFormData();
    shop.title(`Miscellaneous Food`);
    shop.body(
        `§b------ §6[ Informasi Pemain ] §b------\n\n§fNama§c: §a${player.nameTag}\n§fUang§c: §a${getScore(
            player,
            "money"
        )}\n\n§b-------------------------------`
    );
    for (const item of itemData) shop.button(`${item.name}\n§c${item.cost}`, `${item.textures}`);
    shop.show(player).then((result) => {
        if (result.canceled) return FoodsFarms(player);
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

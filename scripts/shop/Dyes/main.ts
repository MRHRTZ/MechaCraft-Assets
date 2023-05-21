/*
----------------------------------
Creator: MRHRTZ
----------------------------------
*/

import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";

const itemData = [
    {
        textures: "textures/items/dye_powder_white.png",
        name: "White Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "white_dye",
    },
    {
        textures: "textures/items/dye_powder_orange.png",
        name: "Orange Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "orange_dye",
    },
    {
        textures: "textures/items/dye_powder_magenta.png",
        name: "Magenta Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "magenta_dye",
    },
    {
        textures: "textures/items/dye_powder_light_blue.png",
        name: "Light Blue Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "light_blue_dye",
    },
    {
        textures: "textures/items/dye_powder_yellow.png",
        name: "Yellow Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "yellow_dye",
    },
    {
        textures: "textures/items/dye_powder_lime.png",
        name: "Lime Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "lime_dye",
    },
    {
        textures: "textures/items/dye_powder_pink.png",
        name: "Pink Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "pink_dye",
    },
    {
        textures: "textures/items/dye_powder_gray.png",
        name: "Gray Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "gray_dye",
    },
    {
        textures: "textures/items/dye_powder_silver.png",
        name: "Light Gray Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "light_gray_dye",
    },
    {
        textures: "textures/items/dye_powder_cyan.png",
        name: "Cyan Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "cyan_dye",
    },
    {
        textures: "textures/items/dye_powder_purple.png",
        name: "Purple Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "purple_dye",
    },
    {
        textures: "textures/items/dye_powder_blue_new.png",
        name: "Blue Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "blue_dye",
    },
    {
        textures: "textures/items/dye_powder_brown_new.png",
        name: "Brown Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "brown_dye",
    },
    {
        textures: "textures/items/dye_powder_green.png",
        name: "Green Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "green_dye",
    },
    {
        textures: "textures/items/dye_powder_red.png",
        name: "Red Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "red_dye",
    },
    {
        textures: "textures/items/dye_powder_black_new.png",
        name: "Black Dye",
        cost: 48,
        sell: 4,
        data: 0,
        item: "black_dye",
    },
];

export function Dyes(player) {
    const shop = new ActionFormData();
    shop.title(`Dyes`);
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

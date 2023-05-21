import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { BuildingBlocks } from "./main";

const itemData = [
    {
        textures: "textures/blocks/hardened_clay_stained_white",
        name: "White Terracotta",
        cost: 128,
        sell: 16,
        data: 0,
        item: "stained_hardened_clay",
    },
    {
        textures: "textures/blocks/hardened_clay_stained_orange",
        name: "Orange Terracotta",
        cost: 128,
        sell: 16,
        data: 1,
        item: "stained_hardened_clay",
    },
    {
        textures: "textures/blocks/hardened_clay_stained_magenta",
        name: "Magenta Terracotta",
        cost: 128,
        sell: 16,
        data: 2,
        item: "stained_hardened_clay",
    },
    {
        textures: "textures/blocks/hardened_clay_stained_light_blue",
        name: "Light Blue Terracotta",
        cost: 128,
        sell: 16,
        data: 3,
        item: "stained_hardened_clay",
    },
    {
        textures: "textures/blocks/hardened_clay_stained_yellow",
        name: "Yellow Terracotta",
        cost: 128,
        sell: 16,
        data: 4,
        item: "stained_hardened_clay",
    },
    {
        textures: "textures/blocks/hardened_clay_stained_lime",
        name: "Lime Terracotta",
        cost: 128,
        sell: 16,
        data: 5,
        item: "stained_hardened_clay",
    },
    {
        textures: "textures/blocks/hardened_clay_stained_pink",
        name: "Pink Terracotta",
        cost: 128,
        sell: 16,
        data: 6,
        item: "stained_hardened_clay",
    },
    {
        textures: "textures/blocks/hardened_clay_stained_gray",
        name: "Gray Terracotta",
        cost: 128,
        sell: 16,
        data: 7,
        item: "stained_hardened_clay",
    },
    {
        textures: "textures/blocks/hardened_clay_stained_silver",
        name: "Light Gray Terracotta",
        cost: 128,
        sell: 16,
        data: 8,
        item: "stained_hardened_clay",
    },
    {
        textures: "textures/blocks/hardened_clay_stained_cyan",
        name: "Cyan Terracotta",
        cost: 128,
        sell: 16,
        data: 9,
        item: "stained_hardened_clay",
    },
    {
        textures: "textures/blocks/hardened_clay_stained_purple",
        name: "Purple Terracotta",
        cost: 128,
        sell: 16,
        data: 10,
        item: "stained_hardened_clay",
    },
    {
        textures: "textures/blocks/hardened_clay_stained_blue",
        name: "Blue Terracotta",
        cost: 128,
        sell: 16,
        data: 11,
        item: "stained_hardened_clay",
    },
    {
        textures: "textures/blocks/hardened_clay_stained_brown",
        name: "Brown Terracotta",
        cost: 128,
        sell: 16,
        data: 12,
        item: "stained_hardened_clay",
    },
    {
        textures: "textures/blocks/hardened_clay_stained_green",
        name: "Green Terracotta",
        cost: 128,
        sell: 16,
        data: 13,
        item: "stained_hardened_clay",
    },
    {
        textures: "textures/blocks/hardened_clay_stained_red",
        name: "Red Terracotta",
        cost: 128,
        sell: 16,
        data: 14,
        item: "stained_hardened_clay",
    },
    {
        textures: "textures/blocks/hardened_clay_stained_black",
        name: "Black Terracotta",
        cost: 128,
        sell: 16,
        data: 15,
        item: "stained_hardened_clay",
    },
];

export function Terracotta(player) {
    const shop = new ActionFormData();
    shop.title(`Terracotta Block`);
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

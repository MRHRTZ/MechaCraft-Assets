import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { FoodsFarms } from "./main";

const itemData = [
    {
        textures: "textures/blocks/sapling_oak.png",
        name: "Oak Sapling",
        cost: 32,
        sell: 8,
        data: 0,
        item: "sapling",
    },
    {
        textures: "textures/blocks/sapling_spruce.png",
        name: "Spruce Sapling",
        cost: 32,
        sell: 8,
        data: 1,
        item: "sapling",
    },
    {
        textures: "textures/blocks/sapling_birch.png",
        name: "Birch Sapling",
        cost: 32,
        sell: 8,
        data: 2,
        item: "sapling",
    },
    {
        textures: "textures/blocks/sapling_jungle.png",
        name: "Jungle Sapling",
        cost: 32,
        sell: 8,
        data: 3,
        item: "sapling",
    },
    {
        textures: "textures/blocks/sapling_acacia.png",
        name: "Acacia Sapling",
        cost: 32,
        sell: 8,
        data: 4,
        item: "sapling",
    },
    {
        textures: "textures/blocks/sapling_roofed_oak.png",
        name: "Dark Oak Sapling",
        cost: 32,
        sell: 8,
        data: 5,
        item: "sapling",
    },
    {
        textures: "textures/items/mangrove_propagule.png",
        name: "Mangrove Propagule",
        cost: 32,
        sell: 8,
        data: 0,
        item: "mangrove_propagule",
    },
    {
        textures: "textures/blocks/warped_fungus.png",
        name: "Warped Fungus",
        cost: 32,
        sell: 8,
        data: 0,
        item: "warped_fungus",
    },
    {
        textures: "textures/blocks/crimson_fungus.png",
        name: "Crimson Fungus",
        cost: 32,
        sell: 8,
        data: 0,
        item: "crimson_fungus",
    },
];

export function FarmSapling(player) {
    const shop = new ActionFormData();
    shop.title(`Farm Sapling`);
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

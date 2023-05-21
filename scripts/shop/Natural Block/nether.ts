import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { NaturalBlocks } from "./main";

const itemData = [
    {
        textures: "textures/blocks/netherrack",
        name: "Netherrack",
        cost: 32,
        sell: 4,
        data: 0,
        item: "netherrack",
    },
    {
        textures: "textures/blocks/crimson_nylium_side",
        name: "Crimson Nylium",
        cost: 32,
        sell: 8,
        data: 0,
        item: "crimson_nylium",
    },
    {
        textures: "textures/blocks/warped_nylium_side",
        name: "Warped Nylium",
        cost: 32,
        sell: 8,
        data: 0,
        item: "warped_nylium",
    },
    {
        textures: "textures/blocks/nether_wart_block",
        name: "Nether Wart Block",
        cost: 32,
        sell: 8,
        data: 0,
        item: "nether_wart_block",
    },
    {
        textures: "textures/blocks/warped_wart_block",
        name: "Warped Wart Block",
        cost: 32,
        sell: 8,
        data: 0,
        item: "warped_wart_block",
    },
    {
        textures: "textures/blocks/weeping_vines_base",
        name: "Weeping Vines",
        cost: 32,
        sell: 4,
        data: 0,
        item: "weeping_vines",
    },
    {
        textures: "textures/blocks/twisting_vines_base",
        name: "Twisting Vines",
        cost: 32,
        sell: 4,
        data: 0,
        item: "twisting_vines",
    },
    {
        textures: "textures/blocks/shroomlight",
        name: "Shroomlight",
        cost: 48,
        sell: 4,
        data: 0,
        item: "shroomlight",
    },
    {
        textures: "textures/blocks/soul_sand",
        name: "Soul Sand",
        cost: 64,
        sell: 4,
        data: 0,
        item: "soul_sand",
    },
    {
        textures: "textures/blocks/soul_soil",
        name: "Soul Soil",
        cost: 64,
        sell: 4,
        data: 0,
        item: "soul_soil",
    },
    {
        textures: "textures/blocks/magma",
        name: "Magma",
        cost: 64,
        sell: 4,
        data: 0,
        item: "magma",
    },
    {
        textures: "textures/blocks/blackstone",
        name: "Blackstone",
        cost: 64,
        sell: 4,
        data: 0,
        item: "blackstone",
    },
    {
        textures: "textures/blocks/basalt_top",
        name: "Basalt",
        cost: 64,
        sell: 4,
        data: 0,
        item: "basalt",
    },
    {
        textures: "textures/blocks/smooth_basalt",
        name: "Smooth Basalt",
        cost: 64,
        sell: 4,
        data: 0,
        item: "smooth_basalt",
    },
];

export function Nether(player) {
    const shop = new ActionFormData();
    shop.title(`Nether Block`);
    shop.body(
        `§b------ §6[ Informasi Pemain ] §b------\n\n§fNama§c: §a${player.nameTag}\n§fUang§c: §a${getScore(
            player,
            "money"
        )}\n\n§b-------------------------------`
    );
    for (const item of itemData) shop.button(`${item.name}\n§c${item.cost}`, `${item.textures}`);
    shop.show(player).then((result) => {
        if (result.canceled) return NaturalBlocks(player);
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

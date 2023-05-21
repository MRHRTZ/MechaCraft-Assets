import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { NaturalBlocks } from "./main";

const itemData = [
    {
        textures: "textures/blocks/grass_side_carried",
        name: "Grass Block",
        cost: 128,
        sell: 16,
        data: 0,
        item: "grass",
    },
    {
        textures: "textures/blocks/dirt",
        name: "Dirt",
        cost: 64,
        sell: 8,
        data: 0,
        item: "dirt",
    },
    {
        textures: "textures/blocks/grass_path_side",
        name: "Dirt Path",
        cost: 64,
        sell: 8,
        data: 0,
        item: "dirt_path",
    },
    {
        textures: "textures/blocks/coarse_dirt",
        name: "Coarse Dirt",
        cost: 96,
        sell: 8,
        data: 1,
        item: "dirt",
    },
    {
        textures: "textures/blocks/dirt_with_roots",
        name: "Rooted Dirt",
        cost: 64,
        sell: 8,
        data: 0,
        item: "dirt_with_roots",
    },
    {
        textures: "textures/blocks/dirt_podzol_side",
        name: "Podzol",
        cost: 64,
        sell: 8,
        data: 0,
        item: "podzol",
    },
    {
        textures: "textures/blocks/mycelium_side",
        name: "Mycelium",
        cost: 128,
        sell: 8,
        data: 0,
        item: "mycelium",
    },
    {
        textures: "textures/blocks/mud",
        name: "Mud",
        cost: 64,
        sell: 8,
        data: 0,
        item: "mud",
    },
    {
        textures: "textures/blocks/mud_bricks",
        name: "Mud Brick",
        cost: 64,
        sell: 8,
        data: 0,
        item: "mud_brick",
    },
    {
        textures: "textures/blocks/packed_mud",
        name: "Packed Mud",
        cost: 64,
        sell: 8,
        data: 0,
        item: "packed_mud",
    },
    {
        textures: "textures/blocks/clay",
        name: "Clay",
        cost: 64,
        sell: 8,
        data: 0,
        item: "clay",
    },
    {
        textures: "textures/blocks/sand",
        name: "Sand",
        cost: 96,
        sell: 8,
        data: 0,
        item: "sand",
    },
    {
        textures: "textures/blocks/sandstone_top",
        name: "Sandstone",
        cost: 64,
        sell: 8,
        data: 0,
        item: "sandstone",
    },
    {
        textures: "textures/blocks/red_sand",
        name: "Red Sand",
        cost: 96,
        sell: 8,
        data: 0,
        item: "red_sand",
    },
    {
        textures: "textures/blocks/red_sandstone_top",
        name: "Red Sandstone",
        cost: 64,
        sell: 8,
        data: 0,
        item: "red_sandstone",
    },
    {
        textures: "textures/blocks/amethyst_block",
        name: "Amethyst Block",
        cost: 196,
        sell: 32,
        data: 0,
        item: "amethyst_block",
    },
    {
        textures: "textures/blocks/calcite",
        name: "Calcite",
        cost: 96,
        sell: 8,
        data: 0,
        item: "",
    },
    {
        textures: "textures/blocks/tuff",
        name: "Tuff",
        cost: 64,
        sell: 8,
        data: 0,
        item: "tuff",
    },
    {
        textures: "textures/blocks/dripstone_block",
        name: "Dripstone",
        cost: 64,
        sell: 8,
        data: 0,
        item: "dripstone_block",
    },
    {
        textures: "textures/blocks/pointed_dripstone_down_tip",
        name: "Pointed Dripstone",
        cost: 96,
        sell: 8,
        data: 0,
        item: "pointed_dripstone",
    },
    {
        textures: "textures/blocks/moss_block",
        name: "Moss Block",
        cost: 64,
        sell: 8,
        data: 0,
        item: "moss_block",
    },
    {
        textures: "textures/blocks/ice",
        name: "Ice",
        cost: 64,
        sell: 8,
        data: 0,
        item: "ice",
    },
    {
        textures: "textures/blocks/ice_packed",
        name: "Packed Ice",
        cost: 64,
        sell: 8,
        data: 0,
        item: "packed_ice",
    },
    {
        textures: "textures/blocks/blue_ice",
        name: "Blue Ice",
        cost: 64,
        sell: 8,
        data: 0,
        item: "blue_ice",
    },
    {
        textures: "textures/blocks/snow",
        name: "Snow Block",
        cost: 64,
        sell: 8,
        data: 0,
        item: "snow",
    },
    {
        textures: "textures/blocks/obsidian",
        name: "Obsidian",
        cost: 256,
        sell: 32,
        data: 0,
        item: "obsidian",
    },
    {
        textures: "textures/blocks/crying_obsidian",
        name: "Crying Obsidian",
        cost: 196,
        sell: 16,
        data: 0,
        item: "crying_obsidian",
    },
    {
        textures: "textures/blocks/prismarine_bricks",
        name: "Prismarine",
        cost: 128,
        sell: 8,
        data: 0,
        item: "prismarine",
    },
    {
        textures: "textures/blocks/sponge",
        name: "Sponge",
        cost: 128,
        sell: 8,
        data: 0,
        item: "sponge",
    },
];

export function Overworld(player) {
    const shop = new ActionFormData();
    shop.title(`Overworld Block`);
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

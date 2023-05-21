/*
----------------------------------
Creator: MRHRTZ
----------------------------------
*/

import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { viewObj } from "../../libs/utils";

const itemData = [
    {
        textures: "textures/items/redstone_dust",
        name: "Redstone",
        cost: 64,
        data: 0,
        item: "redstone",
    },
    {
        textures: "textures/blocks/redstone_torch_on",
        name: "Redstone Torch",
        cost: 96,
        data: 0,
        item: "redstone_torch",
    },
    {
        textures: "textures/blocks/redstone_block",
        name: "Redstone Block",
        cost: 576,
        data: 0,
        item: "redstone_block",
    },
    {
        textures: "textures/blocks/repeater_on",
        name: "Redstone Repeater",
        cost: 96,
        data: 0,
        item: "repeater",
    },
    {
        textures: "textures/blocks/comparator_on",
        name: "Redstone Comparator",
        cost: 96,
        data: 0,
        item: "comparator",
    },
    {
        textures: "textures/blocks/target_top",
        name: "Target Block",
        cost: 256,
        data: 0,
        item: "target",
    },
    {
        textures: "textures/blocks/lever",
        name: "Lever",
        cost: 64,
        data: 0,
        item: "lever",
    },
    {
        textures: "textures/blocks/sculk_sensor_top",
        name: "Sculk Sensor",
        cost: 5120,
        data: 0,
        item: "sculk_sensor",
    },
    {
        textures: "textures/blocks/trip_wire_source",
        name: "Tripwire Hook",
        cost: 64,
        data: 0,
        item: "tripwire_hook",
    },
    {
        textures: "textures/blocks/daylight_detector_top",
        name: "Daylight Detector",
        cost: 256,
        data: 0,
        item: "daylight_detector",
    },
    {
        textures: "textures/blocks/piston_top_normal",
        name: "Piston",
        cost: 256,
        data: 0,
        item: "piston",
    },
    {
        textures: "textures/blocks/piston_top_sticky",
        name: "Sticky Piston",
        cost: 256,
        data: 0,
        item: "sticky_piston",
    },
    {
        textures: "textures/blocks/slime",
        name: "Slime Block",
        cost: 1152,
        data: 0,
        item: "slime",
    },
    {
        textures: "textures/blocks/honey_top",
        name: "Honey Block",
        cost: 1152,
        data: 0,
        item: "honey_block",
    },
    {
        textures: "textures/blocks/dispenser_front_horizontal",
        name: "Dispenser",
        cost: 256,
        data: 0,
        item: "dispenser",
    },
    {
        textures: "textures/blocks/dropper_front_horizontal",
        name: "Droper",
        cost: 256,
        data: 0,
        item: "dropper",
    },
    {
        textures: "textures/blocks/hopper_top",
        name: "Hopper",
        cost: 256,
        data: 0,
        item: "hopper",
    },
    {
        textures: "textures/blocks/observer_front",
        name: "Observer",
        cost: 256,
        data: 0,
        item: "observer",
    },
    {
        textures: "textures/blocks/redstone_lamp_on",
        name: "Redstone Lamp",
        cost: 256,
        data: 0,
        item: "redstone_lamp",
    },
];

export function RedstoneTools(player) {
    const shop = new ActionFormData();
    shop.title(`Redstone Tools`);
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

/*
----------------------------------
Creator: MRHRTZ
----------------------------------
*/

import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { shopItem } from "../itemForm";

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
    shopItem(player, "Redstone Tools", itemData);
}

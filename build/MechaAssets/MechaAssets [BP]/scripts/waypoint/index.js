import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import * as utils from "../libs/utils";
// Functions
export function addWaypoint(player, name) {
    let coor = Object.values(player.location)
        .map((v) => Math.ceil(v))
        .join(" ");
    let dimension = player.dimension.id.replace("minecraft:", "");
    player.addTag(`waypoint:${coor}|${dimension}|${name}`);
    return coor;
}
export function listWaypoint(player) {
    let waypointList = [];
    // Self Waypoints
    if (player.getTags().join("|").includes("waypoint:")) {
        const waypoints = player.getTags().filter((v) => v.includes("waypoint:"));
        for (const waypoint of waypoints) {
            const waypointObj = waypoint.replace("waypoint:", "").split("|");
            let coor = waypointObj[0];
            let dimension = waypointObj[1];
            let name = waypointObj[2];
            let wpObj = {
                coor: coor,
                dimension: dimension,
                name: name,
            };
            waypointList.push(wpObj);
        }
    }
    // Other waypoints if available and can be read
    for (let otherPlayer of world.getPlayers()) {
        if (otherPlayer.getTags().join("|").includes("waypoint_global") &&
            otherPlayer.getTags().join("|").includes("waypoint:")) {
            const waypoints = player.getTags().filter((v) => v.includes("waypoint:"));
            for (const waypoint of waypoints) {
                const waypointObj = waypoint.replace("waypoint:", "").split("|");
                let coor = waypointObj[0];
                let dimension = waypointObj[1];
                let name = waypointObj[2];
                let wpObj = {
                    owner: otherPlayer.nameTag,
                    coor: coor,
                    dimension: dimension,
                    name: name,
                };
                waypointList.push(wpObj);
            }
        }
    }
    return waypointList;
}
export function deleteWaypoint(player, wpName) {
    if (player.getTags().join("|").includes("waypoint:")) {
        const waypoints = player.getTags().filter((v) => v.includes("waypoint:"));
        for (const waypoint of waypoints) {
            const waypointObj = waypoint.replace("waypoint:", "").split("|");
            let coor = waypointObj[0];
            let dimension = waypointObj[1];
            let name = waypointObj[2];
            if (wpName.toLowerCase() == name.toLowerCase()) {
                player.removeTag(`waypoint:${coor}|${dimension}|${name}`);
                return true;
            }
        }
        return false;
    }
    else {
        return false;
    }
}
export function getViewerWaypoint(player) {
    return player.getTags().join("|").includes("waypoint_global");
}
export function setViewerWaypoint(player, viewAsPublic) {
    if (viewAsPublic) {
        if (!player.getTags().join("|").includes("waypoint_global"))
            player.addTag("waypoint_global");
    }
    else {
        if (player.getTags().join("|").includes("waypoint_global"))
            player.removeTag("waypoint_global");
    }
}
// Forms
export function WaypointForm(player, isMenu) {
    let form = new ActionFormData();
    form.title(`§l§cMecha §2Waypoint`);
    form.body(`§6Teleportasi cepat menggunakan waypoint`);
    form.button("Pergi ke Waypoint", "textures/ui/warning_alex");
    form.button("Tambah Waypoint", "textures/ui/village_hero_effect");
    form.button("Hapus Waypoint", "textures/ui/redX1");
    form.button("Pengaturan Waypoint", "textures/ui/settings_glyph_color_2x");
    form.show(player).then((result) => {
        if (!result.canceled) {
            if (result.selection == 0)
                WaypointSection(player);
            if (result.selection == 1)
                WaypointAddForm(player);
            if (result.selection == 2)
                WaypointDeleteForm(player);
            if (result.selection == 3)
                WaypointSettings(player);
        }
    });
}
export function WaypointAddForm(player) {
    let form = new ModalFormData().title(`Tambah Waypoint`).textField(`§6Nama Waypoint:`, "Input Text");
    form.show(player).then((result) => {
        if (!result.canceled) {
            let wpname = result.formValues[0];
            let coor = addWaypoint(player, wpname);
            player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§r§l§e[§bWAYPOINT§e]§r §aBerhasil menambah waypoint §c${wpname} §apada §e${coor}"}]}`);
            player.playSound("random.toast");
        }
    });
}
export function WaypointDeleteForm(player) {
    try {
        let waypoints = listWaypoint(player);
        if (waypoints.length > 0) {
            let form = new ActionFormData();
            form.title(`§l§cHapus §2Waypoint`);
            form.body(`§bPilih Waypoint yang akan dihapus`);
            for (let wpObj of waypoints) {
                if (!wpObj.owner)
                    form.button(`${wpObj.name}\n${wpObj.coor}`);
            }
            form.show(player).then((result) => {
                if (!result.canceled) {
                    let wayObj = waypoints[result.selection];
                    deleteWaypoint(player, wayObj.name);
                    player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§r§l§e[§bWAYPOINT§e]§r §aBerhasil menghapus waypoint §c${wayObj.name}"}]}`);
                    player.runCommandAsync("playsound random.toast @s");
                }
            });
        }
        else {
            player.runCommandAsync("playsound note.bass @s");
            player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§r§l§e[§bWAYPOINT§e]§r §cMaaf, Waypoint belum tersedia, silahkan tambah terlebih dahulu."}]}`);
        }
    }
    catch (error) {
        player.sendMessage(utils.viewObj(error));
    }
}
export function WaypointSettings(player) {
    let currentViewer = getViewerWaypoint(player);
    let form = new ModalFormData();
    form.title(`§l§cPengaturan §2Waypoint`);
    form.toggle("§6Perlihatkan waypoint saya oleh §f(§aHanya Saya§f/§cSemua§f)", currentViewer);
    form.show(player).then(async (result) => {
        if (!result.canceled) {
            let aksesWp = result.formValues[0];
            setViewerWaypoint(player, aksesWp);
            player.sendMessage(`§r§l§e[§bWAYPOINT§e]§r §eWaypoint di set untuk ${aksesWp ? "§cSemua" : "§aHanya Saya"}`);
            player.playSound("random.toast");
        }
    });
}
export function WaypointSection(player) {
    try {
        let waypoints = listWaypoint(player);
        if (waypoints.length > 0) {
            let form = new ActionFormData();
            form.title(`§l§cMecha §2Waypoint`);
            form.body(`§bPilih Teleportasi Waypoint`);
            for (let wpObj of waypoints) {
                form.button(`${wpObj.name} ${wpObj.owner ? `(${wpObj.owner})` : `(Kamu)`}\n${wpObj.coor}`);
            }
            form.show(player).then(async (result) => {
                if (!result.canceled) {
                    let wayObj = waypoints[result.selection];
                    player.runCommandAsync(`execute in ${wayObj.dimension} run tp @s ${wayObj.coor}`);
                    player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§r§l§e[§bWAYPOINT§e]§r §aKamu telah diteleportasi ke §c${wayObj.name}"}]}`);
                }
            });
        }
        else {
            player.runCommandAsync("playsound note.bass @s");
            player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§r§l§e[§bWAYPOINT§e]§r §cMaaf, Waypoint belum tersedia, silahkan tambah terlebih dahulu."}]}`);
        }
    }
    catch (error) {
        player.sendMessage(utils.viewObj(error));
    }
}
//# sourceMappingURL=index.js.map
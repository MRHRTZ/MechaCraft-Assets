import { world, system, Player } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";

import * as shop from "./shop/index";
import * as tpa from "./tpa/index";
import * as chat from "./chatrank/index";
import * as score from "./scoreboard/index";
import * as waypoint from "./waypoint/index";

export function MenuForm(player: Player | any) {
    let form = new ActionFormData();
    form.title(`§l§cMecha §2MainMenu`);
    form.body(
        `§b------ §6[ Informasi Pemain ] §b------\n\n§fName §c: §a${player.nameTag}\n\n§b-------------------------------`
    );
    form.button("Toko", "textures/items/diamond");
    form.button("Teleportasi ke Pemain", "textures/items/ender_pearl");
    const isOp = player.isOp() || player.hasTag("paradoxOpped") || player.hasTag("admin") || player.hasTag("worldedit");
    if (isOp) form.button("Tampilan Pesan", "textures/ui/freeze_heart");
    if (isOp) form.button("Pesan Berjalan", "textures/ui/comment");
    form.button("Papan Info", "textures/ui/icon_sign");
    form.button("Waypoint", "textures/ui/MashupIcon");

    form.show(player).then((result) => {
        if (!result.canceled) {
            if (isOp) {
                if (result.selection == 0) {
                    shop.ShopUI(player, true);
                }
                if (result.selection == 1) {
                    tpa.TpaUiForm(player, true);
                }
                if (result.selection == 2) {
                    chat.ChatManageForm(player, true);
                }
                if (result.selection == 3) {
                    score.RunningTextForm(player, true);
                }
                if (result.selection == 4) {
                    score.ScoreboardManager(player, true);
                }
                if (result.selection == 5) {
                    waypoint.WaypointForm(player, true);
                }
            } else {
                if (result.selection == 0) {
                    shop.ShopUI(player, true);
                }
                if (result.selection == 1) {
                    tpa.TpaUiForm(player, true);
                }
                if (result.selection == 2) {
                    score.ScoreboardManager(player, true);
                }
                if (result.selection == 3) {
                    waypoint.WaypointForm(player, true);
                }
            }
        }
    });
}

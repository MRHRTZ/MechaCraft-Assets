import { world, system, Player } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";

import { ShopUI } from "./shop/index";
import { TpaUiForm } from "./tpa/index";
import { ChatManageForm } from "./chatrank/index";
import { RunningTextForm, ScoreboardManager, NotesManager } from "./scoreboard/index";
import { WaypointForm } from "./waypoint/index";

export async function MenuForm(player: Player | any) {
    let form = new ActionFormData();
    form.title(`§l§cMecha §2MainMenu`);
    form.body(
        `§b------ §6[ Informasi Pemain ] §b------\n\n§fNama §c: §a${player.nameTag}\n\n§b-------------------------------`
    );
    form.button("Toko", "textures/ui/Scaffolding");
    form.button("Teleportasi ke Pemain", "textures/ui/warning_alex");
    const isOp = player.isOp() || player.hasTag("paradoxOpped") || player.hasTag("admin") || player.hasTag("worldedit");
    if (isOp) form.button("Tampilan Pesan", "textures/ui/multiplayer_glyph_color");
    if (isOp) form.button("Catatan Server", "textures/ui/tiny_agnes");
    if (isOp) form.button("Pesan Berjalan", "textures/ui/comment");
    form.button("Papan Info", "textures/ui/storageIconColor");
    form.button("Waypoint", "textures/ui/world_glyph_color");
    form.show(player).then((result) => {
        if (!result.canceled) {
            if (isOp) {
                if (result.selection == 0) {
                    ShopUI(player);
                }
                if (result.selection == 1) {
                    TpaUiForm(player);
                }
                if (result.selection == 2) {
                    ChatManageForm(player);
                }
                if (result.selection == 3) {
                    NotesManager(player);
                }
                if (result.selection == 4) {
                    RunningTextForm(player);
                }
                if (result.selection == 5) {
                    ScoreboardManager(player);
                }
                if (result.selection == 6) {
                    WaypointForm(player);
                }
            } else {
                if (result.selection == 0) {
                    ShopUI(player);
                }
                if (result.selection == 1) {
                    TpaUiForm(player);
                }
                if (result.selection == 2) {
                    ScoreboardManager(player);
                }
                if (result.selection == 3) {
                    WaypointForm(player);
                }
            }
        }
    });
}

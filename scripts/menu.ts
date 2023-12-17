import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

import { ShopUI } from "./shop/index";
import { TpaForm } from "./tpa/index";
import { ChatManageForm, checkRole } from "./chatrole/index";
import { RunningTextForm, ScoreboardManager, NotesManager } from "./scoreboard/index";
import { WaypointForm } from "./waypoint/index";
import { VoicePageAdmin, VoicePageUser } from "./voice/index";
import { ServerMenu } from "./server/index";
import MechAPI from "./libs/mechapi";
import { getPlayersRole } from "./libs/utils";
import { MechaPlayer } from "./libs/types";

export async function MenuForm(player: Player | any) {
    const resp = await MechAPI.getUser(player);
    const userRole = checkRole(player);
    if (!resp.status) {
        if (!["USER", "VIP"].includes(userRole)) {
            let form = new ActionFormData()
                .title(`§l§cMecha §2MainMenu`)
                .body(
                    `\n           §¶[  §l§cMecha§aCraft §6Menu §r ]
                
§cServer tidak tersambung. Harap siapkan server mecha terlebih dahulu!\n
`
                )
                .button("Pengaturan Server", "textures/ui/settings_glyph_color_2x.png");
            form.show(player).then((result) => {
                if (!result.canceled) {
                    if (result.selection == 0) {
                        ServerMenu(player);
                    }
                }
            });
        } else {
            new ActionFormData()
                .title(`§l§cMecha §2MainMenu`)
                .body(
                    `\n           §¶[  §l§cMecha§aCraft §6Menu §r ]
                
§cServer mecha belum disiapkan. Silahkan hubungi admin!\n
`
                )
                .button("Notify Admin", "textures/items/lantern")
                .show(player)
                .then((result) => {
                    if (!result.canceled) {
                        if (result.selection == 0) {
                            let adminCount = 0;
                            for (let op of getPlayersRole(["OPERATOR", "MODERATOR", "BUILDER", "STAFF"])) {
                                adminCount += 1;
                                op.sendMessage(
                                    `§r§l§e[§bNOTIFY§e]§r §6Untuk para admin harap persiapkan server mecha agar dapat berjalan.`
                                );
                            }
                            if (adminCount > 0) {
                                player.sendMessage(
                                    `§r§l§e[§bNOTIFY§e]§r §aBerhasil notify ke §c${adminCount} §aadmin.`
                                );
                            } else {
                                player.sendMessage(
                                    `§r§l§e[§bNOTIFY§e]§r §6Tidak ada admin yang aktif, silahkan kontak melalui whatsapp 6285559038021`
                                );
                            }
                        }
                    }
                });
        }
        return;
    }

    let user: MechaPlayer = resp.result;
    let form = new ActionFormData();
    form.title(`§l§cMecha §2MainMenu`);
    form.body(
        `\n           §¶[  §l§cMecha§aCraft §6Menu §r ]
        
    §fNameTag §c: §b${player.nameTag}
    §fUang    §c: §a${user.money}
    §fGuild   §c: §f${user?.guild ? user.guild.name : "-"}\n
`
    );
    form.button("Toko", "textures/ui/Scaffolding");
    form.button("Teleportasi ke Pemain", "textures/ui/warning_alex");
    form.button("Pengaturan Voice", "textures/ui/sound_glyph_color_2x.png");
    form.button("Waypoint", "textures/ui/world_glyph_color");
    form.button("Papan Info", "textures/ui/storageIconColor");

    // MENU ROLES
    if (["OPERATOR", "ADMIN"].includes(userRole)) {
        form.button("Pengaturan Server", "textures/ui/settings_glyph_color_2x.png");
        form.button("Ubah Role", "textures/ui/multiplayer_glyph_color");
        form.button("Catatan Server", "textures/ui/tiny_agnes");
        form.button("Pesan Berjalan", "textures/ui/comment");
    } else if (userRole == "MODERATOR") {
        form.button("Pengaturan Server", "textures/ui/settings_glyph_color_2x.png");
        form.button("Catatan Server", "textures/ui/tiny_agnes");
        form.button("Pesan Berjalan", "textures/ui/comment");
    } else if (["STAFF", "BUILDER"].includes(userRole)) {
        form.button("Pengaturan Server", "textures/ui/settings_glyph_color_2x.png");
    }

    form.show(player).then((result) => {
        if (!result.canceled) {
            if (["OPERATOR", "ADMIN"].includes(userRole)) {
                switch (result.selection) {
                    case 0:
                        ShopUI(player);
                        break;
                    case 1:
                        TpaForm(player);
                        break;
                    case 2:
                        VoicePageAdmin(player);
                        break;
                    case 3:
                        WaypointForm(player);
                        break;
                    case 4:
                        ScoreboardManager(player);
                        break;
                    case 5:
                        ServerMenu(player);
                        break;
                    case 6:
                        ChatManageForm(player);
                        break;
                    case 7:
                        NotesManager(player);
                        break;
                    case 8:
                        RunningTextForm(player);
                        break;
                    default:
                        break;
                }
            } else if (userRole == "MODERATOR") {
                switch (result.selection) {
                    case 0:
                        ShopUI(player);
                        break;
                    case 1:
                        TpaForm(player);
                        break;
                    case 2:
                        VoicePageUser(player);
                        break;
                    case 3:
                        WaypointForm(player);
                        break;
                    case 4:
                        ScoreboardManager(player);
                        break;
                    case 5:
                        ServerMenu(player);
                        break;
                    case 6:
                        NotesManager(player);
                        break;
                    case 7:
                        RunningTextForm(player);
                        break;
                    default:
                        break;
                }
            } else if (["STAFF", "BUILDER"].includes(userRole)) {
                switch (result.selection) {
                    case 0:
                        ShopUI(player);
                        break;
                    case 1:
                        TpaForm(player);
                        break;
                    case 2:
                        VoicePageUser(player);
                        break;
                    case 3:
                        WaypointForm(player);
                        break;
                    case 4:
                        ScoreboardManager(player);
                        break;
                    case 5:
                        ServerMenu(player);
                        break;
                    case 6:
                        ScoreboardManager(player);
                        break;
                    case 7:
                        WaypointForm(player);
                        break;
                    case 8:
                        VoicePageAdmin(player);
                        break;
                    default:
                        break;
                }
            } else {
                switch (result.selection) {
                    case 0:
                        ShopUI(player);
                        break;
                    case 1:
                        TpaForm(player);
                        break;
                    case 2:
                        VoicePageUser(player);
                        break;
                    case 3:
                        WaypointForm(player);
                        break;
                    case 4:
                        ScoreboardManager(player);
                        break;
                    default:
                        break;
                }
            }
        }
    });
}

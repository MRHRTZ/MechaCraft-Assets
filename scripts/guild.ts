import { Player, world } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";
import MechAPI from "./libs/mechapi";
import { MechaPlayer } from "./libs/types";
import { getPlayerByName, showErrorToOP, viewObj } from "./libs/utils";

export const GUILD_ROLE: string[] = ["LEADER", "MODERATOR", "MEMBER"];

// TODO: create guild user tag

export async function GuildMenu(player: Player) {
    const resp = await MechAPI.getUser(player);
    if (!resp.status) {
        player.sendMessage(`§r§l§e[§GUILD§e]§r §c${resp.message}`);
        player.playSound("note.bass");
    }

    const user: MechaPlayer = resp.result;

    if (user.guild) {
        const resp_guild = await MechAPI.getGuild(player, user.guildId);
        if (!resp_guild.status) {
            player.sendMessage(`§r§l§e[§GUILD§e]§r §c${resp_guild.message}`);
            player.playSound("note.bass");
        }

        const guildRole = user.guildMember.memberRole;
        const guild = resp_guild.result;
        const guildText = `
    §fGuild        §c: §f${user?.guild ? user.guild.name : "-"}
    §fTotal Member §c: §b${guild.members.length} §f/ §b${guild.maxMembers}
    §fRole kamu    §c: §d${guildRole}
    `;
        let form = new ActionFormData();
        form.body(`\n               §¶[ §l§cGuild §6Menu §r ]\n${guildText}`);
        form.button("Member Guild", "textures/ui/multiplayer_glyph_color");
        if (["LEADER", "OFFICER"].includes(guildRole)) {
            form.button("Pengaturan Guild", "textures/ui/gear");
        }
        if (guildRole == "LEADER") {
            form.button("Hapus Guild", "textures/ui/realms_red_x");
        }
        form.show(player).then((result) => {
            if (result.canceled) return;
            if (result.selection == 0) GuildMember(player, guild.name, guild.members);
            // TODO: form guild settings & member
            // if (result.selection == 1) GuildSettings(player);
            // if (result.selection == 2) GuildDelete(player);
        });
    } else {
        const guildText = `\n§6Kamu belum memiliki guild. Silahkan buat atau bergabung pada guild yang tersedia!\n\n`;
        let form = new ActionFormData();
        form.body(`\n               §¶[ §l§cGuild §6Menu §r ]\n${guildText}`);
        form.button("Buat Guild", "textures/ui/xbox_dpad");
        form.button("Cari Guild", "textures/ui/glyph_realms");
        form.show(player).then((result) => {
            if (!result.canceled) {
                if (result.selection == 0) GuildCreate(player, user);
                if (result.selection == 1) GuildSearch(player);
            }
        });
    }
}

export async function GuildCreate(player: Player, user: MechaPlayer) {
    const resp = await MechAPI.getGuildMemberCost(player);
    if (!resp.status) {
        player.sendMessage(`§r§l§e[§GUILD§e]§r §c${resp.message}`);
        player.playSound("note.bass");
    }

    const cost_member: number = resp.result.cost_member;

    let modal = new ModalFormData();
    modal.title("§l§cBuat §6Guild");
    modal.textField(
        `§a-------------------------------

§6Informasi Pemain:
§fNama: §b${player.nameTag}
§fUang: §a${user.money}

§3Note:\n§6Pembuatan guild akan dikenakan biaya §a${cost_member} §6untuk setiap membernya.

§a-------------------------------

§fNama guild:`,
        "Masukan nama guild ..."
    );
    modal.textField("§fDeskripsi guild:", "Masukan deskripsi guild ...");
    modal.textField("§fMaks member guild:", "Masukan angka maksimal member", "10");
    modal.toggle("§fGuild publik", true);
    modal.show(player).then(async (res) => {
        if (res.canceled) return;

        if (!res.formValues![0]) {
            player.sendMessage(`§r§l§e[§GUILD§e]§r §cNama guild tidak valid!`);
            player.playSound(`note.bass`);
            return;
        }
        const namaGuild = res.formValues![0] as string;

        if (!res.formValues![1]) {
            player.sendMessage(`§r§l§e[§GUILD§e]§r §cDeskripsi guild tidak valid!`);
            player.playSound(`note.bass`);
            return;
        }
        const deskripsiGuild = res.formValues![1] as string;

        if (!res.formValues![2]) {
            player.sendMessage(`§r§l§e[§GUILD§e]§r §cMasukan maksimal member!`);
            player.playSound(`note.bass`);
            return;
        }
        if (isNaN(res.formValues![2] as number)) {
            player.sendMessage(`§r§l§e[§GUILD§e]§r §cKamu hanya bisa memasukan level memakai angka`);
            player.playSound(`note.bass`);
            return;
        }
        let maksMember = res.formValues![2] as number;

        const guildPublik = res.formValues![3] as boolean;

        let guild_cost = maksMember * cost_member;
        if (user.money < guild_cost) {
            player.sendMessage(
                `§r§l§e[§GUILD§e]§r §cUang anda saat ini §a${user.money} §ctidak cukup untuk membuat guild dengan §b${maksMember} member §cdan total biaya §a${guild_cost}`
            );
            player.playSound(`note.bass`);
            return;
        }

        const resp_create = await MechAPI.createGuild(player, namaGuild, deskripsiGuild, maksMember, guildPublik);
        if (!resp_create.status) {
            if (resp_create.not_enough_money) {
                player.sendMessage(
                    `§r§l§e[§GUILD§e]§r §cUang anda saat ini §a${user.money} §ctidak cukup untuk membuat guild dengan §b${maksMember} member §cdan total biaya §a${guild_cost}`
                );
            } else {
                player.sendMessage(`§r§l§e[§GUILD§e]§r §c${resp_create.message}`);
            }
            player.playSound("note.bass");
            return;
        }

        player.sendMessage(
            `§r§l§e[§GUILD§e]§r §aKamu berhasil membuat guild §b${namaGuild} §adengan maksimal member §c${maksMember}`
        );
        player.playSound("random.levelup");
    });
}

export async function GuildSearch(player: Player | any) {
    try {
        const resp = await MechAPI.getPublicGuilds(player);
        if (!resp.status) {
            player.sendMessage(`§r§l§e[§bGUILD§e]§r §c${resp.message}`);
            player.playSound("note.bass");
        }

        let form = new ActionFormData();
        form.title(`§l§cGuild §2Publik`);
        form.body(`§6Pilih guild untuk bergabung.`);

        const guilds = resp.result;
        if (guilds.length == 0) {
            player.sendMessage(`§r§l§e[§bTPA§e]§r §6Tidak ada guild publik yang tersedia untuk saat ini.`);
            player.playSound("note.bass");
            return;
        }

        for (const guild of guilds) {
            form.button(`${guild.name}\n${guild.description}`);
        }

        form.show(player).then(async (result) => {
            if (result.canceled) return;
            const guild = guilds[result.selection!];
        });
    } catch (error) {
        player.sendMessage(`§r§l§e[§bGUILD§e]§r §cGagal mendapatkan player aktif, silahkan hubungi admin.`);
        player.playSound("note.bass");
        showErrorToOP(viewObj(error));
    }
}

export async function GuildMember(player: Player, guildName: string, members: any) {
    try {
        let form = new ActionFormData();
        form.title(`§l§cMember Guild §r${guildName}`);

        if (members.length == 0) {
            player.sendMessage(`§r§l§e[§bGUILD§e]§r §6Tidak ada member disini.`);
            player.playSound("note.bass");
            return;
        }

        for (const member of members) {
            const isGuildStaff = ["LEADER", "OFFICER"].includes(member.memberRole);
            form.button(member.member.name, isGuildStaff ? "textures/ui/op" : "textures/ui/permissions_member_star");
        }

        form.show(player).then(async (result) => {
            if (result.canceled) return;
            const member = members[result.selection!];
            MemberSettings(player, guildName, member);
        });
    } catch (error) {
        player.sendMessage(`§r§l§e[§bGUILD§e]§r §cGagal mendapatkan player aktif, silahkan hubungi admin.`);
        player.playSound("note.bass");
        showErrorToOP(viewObj(error));
    }
}

export async function MemberSettings(player: Player, guildName: string, member: any) {
    let form = new ActionFormData();
    player.sendMessage(viewObj(member));
    form.body(`\n               §¶[ §l§cMember §6Settings §r ]
    
    §fNama: §b${member.member.name}
    §fRole: §d${member.memberRole}
  `);

    form.button("Promote member", "textures/ui/accessibility_glyph_color");
    form.button("Tendang dari guild", "textures/ui/realms_red_x");
    form.show(player).then((result) => {
        if (result.canceled) return;
        if (result.selection == 0) MemberPromote(player, member);
        if (result.selection == 1) MemberKick(player, guildName, member);
    });
}

export async function MemberPromote(player: Player, member: any) {
    let form = new ModalFormData();
    const guildRole = ["STAFF", "MEMBER"];
    form.dropdown(
        `\n               §¶[ §l§cMember §6Promote §r ]
  
  §fNama: §b${member.member.name}
  §fRole: §d${member.memberRole}
`,
        guildRole,
        guildRole.findIndex((v) => v == member.memberRole)
    );

    form.show(player).then((result) => {
        if (result.canceled) return;
        let values = result.formValues as number[];
        let role = guildRole[values![0]];
        //TODO: change member role
    });
}

export async function MemberKick(player: Player, guildName: string, member: any) {
    new MessageFormData()
        .body(
            `\n               §¶[ §l§cMember §6Kick ]
  
    §fNama: §b${member.member.name}
    §fRole: §d${member.memberRole}

§6Yakin kick member ini dari guild?
`
        )
        .button1("§l§cTidak, Biarkan saja.")
        .button2("§l§2Ya, tendang!")
        .show(player)
        .then((result) => {
            if (result.canceled) return;
            if (result.selection == 1) {
                // Terima
                // TODO: kick player
                const kickPlayer = getPlayerByName(member.member.name);
                if (kickPlayer) {
                    kickPlayer.sendMessage(`§r§l§e[§bGUILD§e]§r §6Anda telah dikeluarkan dari guild §r${guildName}`);
                    kickPlayer.playSound("horn.call.7");
                }
                player.sendMessage(`§r§l§e[§bGUILD§e]§r §b${member.member.name} §aBerhasil dikeluarkan.`);
                player.playSound("horn.call.7");
            }
        });
}

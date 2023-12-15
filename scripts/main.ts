import { world, system, Vector } from "@minecraft/server";
import { MenuForm } from "./menu";
import { ShopUI } from "./shop/index";
import { TpaUI } from "./tpa/index";
import { checkRank } from "./chatrank/index";
import { commands, prefix } from "./commands/index";
import { showScoreboard, giftPlayer, messageInfo } from "./scoreboard/index";
import { showErrorToOP, viewObj } from "./libs/utils";
import { getRequest } from "./libs/net-utils";
import { Network } from "./libs/voice-net";

let tickIndex = 0;
let timeIndex = 0;

function mainTick() {
    try {
        tickIndex++;
        timeIndex = world.getTimeOfDay();

        if (tickIndex === 100) {
            world.getDimension("overworld").runCommandAsync("say §aMecha Asset Active");
            world.scoreboard.addObjective("money", "money");
        }

        for (let player of world.getPlayers()) {
            const rankObj = checkRank(player).split("|");
            let rankName = rankObj[0];
            let rankColor = rankObj[1];
            let rankFormat = rankObj[2];

            const nametagFormat = `${rankColor}${rankFormat}[${rankName}]§r §3${player.name}`;
            player.nameTag = nametagFormat;

            if (player.hasTag("shop_ui")) {
                ShopUI(player);
                player.runCommandAsync(`tag @s remove shop_ui`);
            }

            if (player.hasTag("tpa_ui")) {
                let fromPlayer = player
                    .getTags()
                    .filter((v) => v.includes("tpa:"))[0]
                    ?.split(":")[1];
                if (fromPlayer) TpaUI(player, fromPlayer);
                player.removeTag("tpa_ui");
            }

            if (tickIndex % 4 == 0) {
                showScoreboard(player, timeIndex);
            }

            if (tickIndex % 10000 == 0) {
                messageInfo(player);
            }

            if (timeIndex == 0) {
                giftPlayer(player);
            }
        }
    } catch (e) {
        showErrorToOP(e);
    }

    system.run(mainTick);
}

world.afterEvents.itemUse.subscribe(async (eventData) => {
    try {
        let item = eventData.itemStack;
        let player = eventData.source;
        if (item.typeId == "ms:menu_ui") {
            await MenuForm(player);
        }
    } catch (e) {
        showErrorToOP(e);
    }
});

world.beforeEvents.chatSend.subscribe(async (msg) => {
    try {
        const message = msg.message;
        const cmd = message.toLowerCase().split(/ +/g)[0] || "";
        if (cmd.startsWith(prefix)) {
            msg.cancel = true;
            commands(msg);
        } else {
            if (world.getDynamicProperty("textProximityChat")) {
                msg.setTargets(
                    world
                        .getAllPlayers()
                        .filter(
                            (x) =>
                                x.dimension.id === msg.sender.dimension.id &&
                                Vector.distance(x.location, msg.sender.location) <=
                                    Number(world.getDynamicProperty("textProximityDistance"))
                        )
                );
                msg.sendToTargets = true;
            }
            const player = msg.sender;
            const rankObj = checkRank(player).split("|");
            let rankName = rankObj[0];
            let rankColor = rankObj[1];
            let rankFormat = rankObj[2];
            msg.cancel = true;
            const chatFormat = `${rankColor}${rankFormat}[${rankName}]§r §3${player.name}§c: §r${message}`;
            player.runCommandAsync(`tellraw @a {"rawtext":[{"text":"${chatFormat}"}]}`);
        }
    } catch (e) {
        showErrorToOP(e);
    }
});

world.afterEvents.entityDie.subscribe((ev) => {
    if (ev.deadEntity.typeId == "minecraft:player") {
        Network.DeadPlayers.push(ev.deadEntity.id as never);
    }
});

world.afterEvents.playerSpawn.subscribe(async (ev) => {
    let player = ev.player;

    if (ev.initialSpawn) {
        player.sendMessage(
            `Halo §6${player.nameTag}§f Selamat datang di §aMecha§cCraft §f Gunakan perintah §b!help §funtuk membuka bantuan perintah.`
        );
    }

    if (ev.initialSpawn && Network.IsConnected) {
        var hasTag = ev.player.getTags().find((x) => x.includes("VCAutoBind:"));
        if (hasTag) {
            var key = hasTag.replace("VCAutoBind:", "");
            ev.player.sendMessage(`§2Koneksi Otomasi Nyala. §eMenyambung dengan kunci: ${key}`);
            Network.RequestBinding(key, ev.player);
        }
    }

    for (let i = 0; i < Network.DeadPlayers.length; i++) {
        if (Network.DeadPlayers[i] == ev.player.id) {
            Network.DeadPlayers.splice(i, 1);
        }
    }
});

world.afterEvents.playerJoin.subscribe(async (player) => {
    let id = player.playerId;
    let name = player.playerName;
});

world.afterEvents.playerLeave.subscribe(async (player) => {
    let id = player.playerId;
    let name = player.playerName;
});

system.run(mainTick);

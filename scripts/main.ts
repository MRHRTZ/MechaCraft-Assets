import { world, system } from "@minecraft/server";
import { MenuForm } from "./menu";
import { ShopUI } from "./shop/index";
import { TpaUI } from "./tpa/index";
import { checkRank } from "./chatrank/index";
import { commands } from "./commands/index";
import { showScoreboard, giftPlayer, messageInfo } from "./scoreboard/index";
import { showErrorToOP } from "./libs/utils";

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
        if (cmd.startsWith(".")) {
            msg.cancel = true;
            commands(msg);
        } else {
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

world.afterEvents.playerSpawn.subscribe(async (obj) => {
    let player = obj.player;

    if (obj.initialSpawn) {
        player.sendMessage(
            `Halo §6${player.nameTag}§f Selamat datang di §aMecha§cCraft §f Gunakan perintah §b.help §funtuk membuka bantuan perintah.`
        );
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

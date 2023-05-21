import { world, system } from "@minecraft/server";
import * as menu from "./menu";
import * as shop from "./shop/index";
import * as tpa from "./tpa/index";
import * as chat from "./chatrank/index";
import * as command from "./commands/index";
import * as score from "./scoreboard/index";
import * as waypoint from "./waypoint/index";
import * as utils from "./libs/utils";

let tickIndex = 0;
let timeIndex = 0;

function mainTick() {
    try {
        tickIndex++;
        timeIndex = world.getTime();

        if (tickIndex === 100) {
            world.getDimension("overworld").runCommandAsync("say Mecha Asset Active");
        }

        for (let player of world.getPlayers()) {
            if (player.hasTag("shop_ui")) {
                shop.ShopUI(player, false);
                player.runCommandAsync(`tag @s remove shop_ui`);
            }

            if (player.hasTag("tpa_ui")) {
                let fromPlayer = player
                    .getTags()
                    .filter((v) => v.includes("tpa:"))[0]
                    ?.split(":")[1];
                if (fromPlayer) tpa.TpaUI(player, fromPlayer);
                player.removeTag("tpa_ui");
            }

            if (tickIndex % 4 == 0) {
                score.showScoreboard(player, timeIndex);
            }

            if (tickIndex % 10000 == 0) {
                score.messageInfo(player);
            }

            if (timeIndex == 0) {
                score.giftPlayer(player);
            }
        }
    } catch (e) {
        utils.showErrorToOP(e);
    }

    system.run(mainTick);
}

world.events.beforeItemUse.subscribe((eventData) => {
    try {
        let item = eventData.item;
        let player = eventData.source;
        if (item.typeId == "ms:menu_ui") {
            menu.MenuForm(player);
        }
    } catch (e) {
        utils.showErrorToOP(e);
    }
});

world.events.beforeChat.subscribe(async (msg) => {
    try {
        const message = msg.message;
        const cmd = message.toLowerCase().split(/ +/g)[0] || "";
        if (cmd.startsWith(".")) {
            msg.cancel = true;
            command.commands(msg);
        } else {
            const player = msg.sender;
            const rankObj = chat.checkRank(player).split("|");
            let rankName = rankObj[0];
            let rankColor = rankObj[1];
            let rankFormat = rankObj[2];
            msg.cancel = true;
            const chatFormat = `${rankColor}${rankFormat}[${rankName}]§r §3${player.name}§c: §r${message}`;
            player.runCommandAsync(`tellraw @a {"rawtext":[{"text":"${chatFormat}"}]}`);
        }
    } catch (e) {
        utils.showErrorToOP(e);
    }
});

system.run(mainTick);

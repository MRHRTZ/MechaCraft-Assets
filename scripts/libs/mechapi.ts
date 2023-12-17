import { world, system, Player, Vector } from "@minecraft/server";

import * as mcnet from "@minecraft/server-net";
import { isEmptyOrSpaces, serialize, showErrorToOP, viewObj } from "./utils";
import { MessageFormData } from "@minecraft/server-ui";
import { mechaResponse } from "./types";
import { changeRole } from "../chatrole/index";

interface Config {
    auth: string | any;
    host: string | any;
    port: string | any;
    baseurl: string | any;
}

class MechAPI {
    static setConfig(auth: string, host: string, port: string) {
        world.setDynamicProperty("mechaServerAuth", auth);
        world.setDynamicProperty("mechaServerHost", host);
        world.setDynamicProperty("mechaServerPort", port);
    }

    static getConfig(player: Player, ignore = false): Config | any {
        const auth = world.getDynamicProperty("mechaServerAuth")?.toString();
        const host = world.getDynamicProperty("mechaServerHost")?.toString();
        const port = world.getDynamicProperty("mechaServerPort")?.toString();

        if (!ignore) {
            if (isEmptyOrSpaces(auth) || isEmptyOrSpaces(host) || isEmptyOrSpaces(port)) {
                if (player.hasOwnProperty("sendMessage")) {
                    player.sendMessage("§cKonfigurasi server mecha belum dipersiapkan!");
                }
                return;
            }
        }

        return {
            auth,
            host,
            port,
            baseurl: `http://${host}:${port}`,
        };
    }

    static async getRequest(player: Player, endpoint: string = ""): Promise<mcnet.HttpResponse> {
        return new Promise<mcnet.HttpResponse>((resolve, reject) => {
            const config = this.getConfig(player);
            const req = new mcnet.HttpRequest(config.baseurl + endpoint);
            req.method = mcnet.HttpRequestMethod.Get;
            req.headers = [
                new mcnet.HttpHeader("Content-Type", "application/json"),
                new mcnet.HttpHeader("auth", config.auth),
            ];
            mcnet.http.request(req).then(resolve).catch(reject);
        });
    }

    static async postRequest(player: Player, endpoint: string = "", data: any = {}): Promise<mcnet.HttpResponse> {
        return new Promise<mcnet.HttpResponse>((resolve, reject) => {
            const config = this.getConfig(player);
            const req = new mcnet.HttpRequest(config.baseurl + endpoint);
            req.body = JSON.stringify(data);
            req.method = mcnet.HttpRequestMethod.Post;
            req.headers = [
                new mcnet.HttpHeader("Content-Type", "application/json"),
                new mcnet.HttpHeader("auth", config.auth),
            ];
            mcnet.http.request(req).then(resolve).catch(reject);
        });
    }

    static async putRequest(player: Player, endpoint: string = "", data: any = {}): Promise<mcnet.HttpResponse> {
        return new Promise<mcnet.HttpResponse>((resolve, reject) => {
            const config = this.getConfig(player);
            const req = new mcnet.HttpRequest(config.baseurl + endpoint);
            req.body = JSON.stringify(data);
            req.method = mcnet.HttpRequestMethod.Put;
            req.headers = [
                new mcnet.HttpHeader("Content-Type", "application/json"),
                new mcnet.HttpHeader("auth", config.auth),
            ];
            mcnet.http.request(req).then(resolve).catch(reject);
        });
    }

    static async deleteRequest(player: Player, endpoint: string = "", data: any = {}): Promise<mcnet.HttpResponse> {
        return new Promise<mcnet.HttpResponse>((resolve, reject) => {
            const config = this.getConfig(player);
            const req = new mcnet.HttpRequest(config.baseurl + endpoint);
            req.body = JSON.stringify(data);
            req.method = mcnet.HttpRequestMethod.Delete;
            req.headers = [
                new mcnet.HttpHeader("Content-Type", "application/json"),
                new mcnet.HttpHeader("auth", config.auth),
            ];
            mcnet.http.request(req).then(resolve).catch(reject);
        });
    }

    static async testServer(player: Player) {
        this.getRequest(player)
            .then((response) => {
                new MessageFormData()
                    .title(`§l§1Server Test`)
                    .body(viewObj(response))
                    .button1("§l§2Done")
                    .button2("§l§cClose")
                    .show(player);
            })
            .catch((err) => {
                new MessageFormData()
                    .title(`§l§1Server Test §l§cFailed`)
                    .body(viewObj(JSON.parse(err)))
                    .button1("§l§2Done")
                    .button2("§l§cClose")
                    .show(player);
            });
    }

    // USERS
    static async getUsers(player: Player) {
        const response = await this.getRequest(player, "/api/v1/users");
        if (response.status == 200) {
            const resp: mechaResponse = JSON.parse(response.body);
            if (resp.code == 200) {
                return { status: true, result: resp.result };
            } else {
                return { status: false, message: "Gagal mendapatkan player" };
            }
        } else {
            showErrorToOP("Galat:" + viewObj(response));
            return { status: false, message: "Gagal mendapatkan player" };
        }
    }

    static async getUser(player: Player) {
        const response = await this.getRequest(player, "/api/v1/user/" + player.id);
        if (response.status == 200) {
            const resp: mechaResponse = JSON.parse(response.body);
            if (resp.code == 200) {
                return { status: true, result: resp.result };
            } else {
                return { status: false, message: "Gagal mendapatkan player" };
            }
        } else {
            showErrorToOP("Galat:" + viewObj(response));
            return { status: false, message: "Gagal mendapatkan player" };
        }
    }

    static registerUser(player: Player) {
        const data = { xuid: player.id, name: player.name };
        this.postRequest(player, "/api/v1/user", data)
            .then((response) => {
                if (response.status == 200) {
                    const resp: mechaResponse = JSON.parse(response.body);
                    changeRole(player, resp.result.role);
                } else {
                    showErrorToOP("Galat:" + viewObj(response));
                }
            })
            .catch((e) => {
                showErrorToOP(viewObj(e));
            });
    }

    static changeRole(player: Player, role: string): void {
        const data = { xuid: player.id, role };
        this.putRequest(player, "/api/v1/user", data)
            .then((response) => {
                if (response.status == 200) {
                    const resp: mechaResponse = JSON.parse(response.body);
                } else {
                    showErrorToOP("Galat:" + viewObj(response));
                }
            })
            .catch((e) => {
                showErrorToOP(viewObj(e));
            });
    }

    // WAYPOINTS
    static async publicWaypoint(player: Player) {
        const response = await this.getRequest(player, "/api/v1/waypoints");
        if (response.status == 200) {
            const resp: mechaResponse = JSON.parse(response.body);
            if (resp.code == 200) {
                return { status: true, result: resp.result };
            } else {
                return { status: false, message: "Gagal mendapatkan waypoint" };
            }
        } else {
            showErrorToOP("Galat:" + viewObj(response));
            return { status: false, message: "Gagal mendapatkan waypoint" };
        }
    }

    static async selfWaypoint(player: Player) {
        const response = await this.getRequest(player, "/api/v1/waypoint/" + player.id);
        if (response.status == 200) {
            const resp: mechaResponse = JSON.parse(response.body);
            if (resp.code == 200) {
                return { status: true, result: resp.result };
            } else {
                return { status: false, message: "Gagal mendapatkan waypoint" };
            }
        } else {
            showErrorToOP("Galat:" + viewObj(response));
            return { status: false, message: "Gagal mendapatkan waypoint" };
        }
    }

    static async addWaypoint(player: Player, name: string, isPublic: boolean) {
        let dimension = player.dimension.id.replace("minecraft:", "");
        const x = player.location.x;
        const y = player.location.y;
        const z = player.location.z;
        const data = {
            ownerId: player.id,
            name,
            x,
            y,
            z,
            dimension,
            isPublic,
        };
        const response = await this.postRequest(player, "/api/v1/waypoint", data);
        if (response.status == 200) {
            const resp: mechaResponse = JSON.parse(response.body);
            if (resp.code == 200) {
                return { status: true, message: `${Math.round(x)} ${Math.round(y)} ${Math.round(z)}` };
            } else if (resp.code == 1001) {
                return { status: false, message: "Waypoint dengan nama " + name + " sudah ada." };
            } else {
                return { status: false, message: "Gagal menambah waypoint" };
            }
        } else {
            showErrorToOP("Galat:" + viewObj(response));
            return { status: false, message: "Gagal menambah waypoint" };
        }
    }

    static async changePublicWaypoint(player: Player, waypointId: number, isPublic: boolean) {
        const data = { id: waypointId, isPublic };
        const response = await this.putRequest(player, "/api/v1/waypoint", data);
        if (response.status == 200) {
            const resp: mechaResponse = JSON.parse(response.body);
            if (resp.code == 200) {
                return { status: true, result: resp.result };
            } else {
                return { status: false, message: "Gagal mengubah waypoint" };
            }
        } else {
            showErrorToOP("Galat:" + viewObj(response));
            return { status: false, message: "Gagal mengubah waypoint" };
        }
    }

    static async deleteWaypoint(player: Player, waypointId: number) {
        const response = await this.deleteRequest(player, "/api/v1/waypoint/" + waypointId);
        if (response.status == 200) {
            const resp: mechaResponse = JSON.parse(response.body);
            if (resp.code == 200) {
                return { status: true, result: resp.result };
            } else {
                return { status: false, message: "Gagal menghapus waypoint" };
            }
        } else {
            showErrorToOP("Galat:" + viewObj(response));
            return { status: false, message: "Gagal menghapus waypoint" };
        }
    }

    // TPA
    static async changePublicTpa(player: Player, canTpa: boolean) {
        const data = { xuid: player.id, canTpa };
        const response = await this.putRequest(player, "/api/v1/user", data);
        if (response.status == 200) {
            const resp: mechaResponse = JSON.parse(response.body);
            if (resp.code == 200) {
                return { status: true, result: resp.result };
            } else {
                return { status: false, message: "Gagal mengubah status TPA" };
            }
        } else {
            showErrorToOP("Galat:" + viewObj(response));
            return { status: false, message: "Gagal mengubah status TPA" };
        }
    }

    static async requestTpa(fromPlayer: Player, targetPlayer: Player) {
        const data = {
            fromName: fromPlayer.name,
            targetName: targetPlayer.name,
        };
        const response = await this.postRequest(fromPlayer, "/api/v1/tpa", data);
        if (response.status == 200) {
            const resp: mechaResponse = JSON.parse(response.body);
            if (resp.code == 200) {
                return { status: true, result: resp.result };
            } else {
                return { status: false, message: "Gagal membuat permintaan TPA" };
            }
        } else {
            showErrorToOP("Galat:" + viewObj(response));
            return { status: false, message: "Gagal membuat permintaan TPA" };
        }
    }

    static async removeTpa(fromPlayer: Player, targetPlayer: Player) {
        const data = {
            fromName: fromPlayer.name,
            targetName: targetPlayer.name,
        };
        const response = await this.deleteRequest(fromPlayer, "/api/v1/tpa", data);
        if (response.status == 200) {
            const resp: mechaResponse = JSON.parse(response.body);
            if (resp.code == 200) {
                return { status: true, result: resp.result };
            } else {
                return { status: false, message: "Gagal menghapus permintaan TPA" };
            }
        } else {
            showErrorToOP("Galat:" + viewObj(response));
            return { status: false, message: "Gagal menghapus permintaan TPA" };
        }
    }

    static async getRequestTpa(fromPlayer: Player, targetPlayer: Player) {
        const params = serialize({
            fromName: fromPlayer.name,
            targetName: targetPlayer.name,
        });
        const response = await this.getRequest(fromPlayer, "/api/v1/tpa/request?" + params);
        if (response.status == 200) {
            const resp: mechaResponse = JSON.parse(response.body);
            if (resp.code == 200) {
                return { status: true, result: resp.result };
            } else {
                return { status: false, message: "Gagal mengambil data permintaan TPA" };
            }
        } else {
            showErrorToOP("Galat:" + viewObj(response));
            return { status: false, message: "Gagal mengambil data permintaan TPA" };
        }
    }

    static async getListTpa(player: Player) {
        const params = serialize({ name: player.name });
        const response = await this.getRequest(player, "/api/v1/tpa/list?" + params);
        if (response.status == 200) {
            const resp: mechaResponse = JSON.parse(response.body);
            if (resp.code == 200) {
                return { status: true, result: resp.result };
            } else {
                return { status: false, message: "Gagal mengambil data TPA" };
            }
        } else {
            showErrorToOP("Galat:" + viewObj(response));
            return { status: false, message: "Gagal mengambil data TPA" };
        }
    }

    // SHOP
    static async getShopCategory(player: Player) {
        const response = await this.getRequest(player, "/api/v1/shop/category");
        if (response.status == 200) {
            const resp: mechaResponse = JSON.parse(response.body);
            if (resp.code == 200) {
                return { status: true, result: resp.result };
            } else {
                return { status: false, message: "Gagal mengambil data kategori toko" };
            }
        } else {
            showErrorToOP("Galat:" + viewObj(response));
            return { status: false, message: "Gagal mengambil data kategori toko" };
        }
    }

    static async getShopItems(player: Player, categoryID: number) {
        const params = serialize({ category: categoryID });
        const response = await this.getRequest(player, "/api/v1/shop/items?" + params);
        if (response.status == 200) {
            const resp: mechaResponse = JSON.parse(response.body);
            if (resp.code == 200) {
                return { status: true, result: resp.result };
            } else {
                return { status: false, message: "Gagal mengambil data item toko" };
            }
        } else {
            showErrorToOP("Galat:" + viewObj(response));
            return { status: false, message: "Gagal mengambil data item toko" };
        }
    }

    static async getShopItem(player: Player, itemID: number) {
        const response = await this.getRequest(player, "/api/v1/shop/item/" + itemID);
        if (response.status == 200) {
            const resp: mechaResponse = JSON.parse(response.body);
            if (resp.code == 200) {
                return { status: true, result: resp.result };
            } else {
                return { status: false, message: "Gagal mengambil data item toko" };
            }
        } else {
            showErrorToOP("Galat:" + viewObj(response));
            return { status: false, message: "Gagal mengambil data item toko" };
        }
    }

    static async buyItem(player: Player, itemID: number, qty: number) {
        const data = {
            xuid: player.id,
            itemId: itemID,
            qty: Number(qty),
        };
        const response = await this.postRequest(player, "/api/v1/shop/buy", data);
        if (response.status == 200) {
            const resp: mechaResponse = JSON.parse(response.body);
            if (resp.code == 200) {
                return { status: true, result: resp.result };
            } else if (resp.code == 1002) {
                return { status: false, message: "Item tidak ada" };
            } else if (resp.code == 1003) {
                return { status: false, message: "Uang tidak cukup", not_enough_money: true };
            } else {
                return { status: false, message: "Gagal mengambil data item toko" };
            }
        } else {
            showErrorToOP("Galat:" + viewObj(response));
            return { status: false, message: "Gagal mengambil data item toko" };
        }
    }

    static async sellItem(player: Player, itemID: number, qty: number) {
        const data = {
            xuid: player.id,
            itemId: itemID,
            qty: Number(qty),
        };
        const response = await this.postRequest(player, "/api/v1/shop/sell", data);
        if (response.status == 200) {
            const resp: mechaResponse = JSON.parse(response.body);
            if (resp.code == 200) {
                return { status: true, result: resp.result };
            } else if (resp.code == 1002) {
                return { status: false, message: "Item tidak ada" };
            } else if (resp.code == 1003) {
                return { status: false, message: "Uang tidak cukup", not_sell: true };
            } else {
                return { status: false, message: "Gagal mengambil data item toko" };
            }
        } else {
            showErrorToOP("Galat:" + viewObj(response));
            return { status: false, message: "Gagal mengambil data item toko" };
        }
    }

    static async transfer(player: Player, targetPlayerID: string, amount: number) {
        const data = {
            xuid: player.id,
            targetXuid: targetPlayerID,
            amount: Number(amount),
        };
        const response = await this.postRequest(player, "/api/v1/transaction/transfer", data);
        if (response.status == 200) {
            const resp: mechaResponse = JSON.parse(response.body);
            if (resp.code == 200) {
                return { status: true, result: resp.result };
            } else if (resp.code == 1002) {
                return { status: false, message: "Target pemain tidak ada" };
            } else if (resp.code == 1003) {
                return { status: false, message: "Uang tidak cukup", not_enough_money: true };
            } else {
                return { status: false, message: "Gagal transfer uang" };
            }
        } else {
            showErrorToOP("Galat:" + viewObj(response));
            return { status: false, message: "Gagal transfer uang" };
        }
    }
}

export default MechAPI;

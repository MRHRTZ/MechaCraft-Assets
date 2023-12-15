import { HttpRequestMethod, HttpHeader, HttpRequest, http } from "@minecraft/server-net";
import { world, system, Player, Vector } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

class Network {
    static IsConnected = false;
    static IP = "";
    static Key = "";
    static Port = 0;

    //External Server Settings
    static ProximityDistance = 0;
    static ProximityEnabled = true;
    static VoiceEffectEnabled = true;

    //Dead player detector
    static DeadPlayers = [];

    /**
     * @argument {string} Ip
     * @argument {Number} Port
     * @argument {string} Key
     * @argument {Player} PlayerObject
     */
    static Connect(Ip: string, Port: number, Key: string, PlayerObject: Player) {
        PlayerObject.sendMessage("§eSedang menyambung ke server...");

        this.IP = Ip;
        this.Port = Port;
        this.Key = Key;

        const packet = new LoginPacket();
        packet.LoginKey = Key;

        const request = new HttpRequest(`http://${this.IP}:${this.Port}/`);
        request.setTimeout(5);
        request.setBody(JSON.stringify(packet));
        request.setMethod(HttpRequestMethod.Post);
        request.setHeaders([new HttpHeader("Content-Type", "application/json")]);
        http.request(request).then((response) => {
            if (response.status == 200) {
                this.IsConnected = true;
                PlayerObject.sendMessage("§aLogin Diterima. Server terkoneksi!");
            } else if (response.status == 403) {
                this.IsConnected = false;
                PlayerObject.sendMessage("§cLogin Ditolak. Gagal koneksi server!");
            } else {
                this.IsConnected = false;
                PlayerObject.sendMessage("§cTidak dapat mengakses server. Cek IP dan PORT agar sesuai!");
            }
        });
    }

    /**
     * @argument {string} Key
     * @argument {Player} PlayerObject
     */
    static RequestBinding(Key, PlayerObject) {
        if (!Network.IsConnected) {
            PlayerObject.sendMessage(
                "§cTidak bisa mendapatkan kunci sesi. Server tidak terkoneksi, jika masalah ini terus berlanjut hubungi admin!"
            );
            return;
        }

        const packet = new BindingPacket();
        packet.LoginKey = this.Key;
        packet.Gamertag = PlayerObject.name;
        packet.PlayerKey = Key;
        packet.PlayerId = PlayerObject.id;

        const request = new HttpRequest(`http://${this.IP}:${this.Port}/`);
        request.setTimeout(5);
        request.setBody(JSON.stringify(packet));
        request.setMethod(HttpRequestMethod.Post);
        request.setHeaders([new HttpHeader("Content-Type", "application/json")]);
        http.request(request).then((response) => {
            // PlayerObject.sendMessage(response.status.toString());
            if (response.status == 202) {
                PlayerObject.sendMessage("§2Voice tersambung!");
                if (world.getDynamicProperty("sendBindedMessage"))
                    world.sendMessage(`§b${PlayerObject.name} §2telah masuk world voice!`);
            } else {
                PlayerObject.sendMessage("§cGagal menyambung. Kunci salah atau telah tersambung sebelumnya!");
            }
        });
    }

    /**
     * @argument {Player} PlayerObject
     * @argument {number} ProximityDistance
     * @argument {boolean} ProximityToggle
     * @argument {boolean} VoiceEffects
     */
    static UpdateSettings(PlayerObject, ProximityDistance, ProximityToggle, VoiceEffects) {
        if (!Network.IsConnected) {
            PlayerObject.sendMessage("§cGagal mengubah pengaturan. Tidak terkoneksi server!");
            return;
        }

        const packet = new UpdateSettingsPacket();
        packet.LoginKey = this.Key;
        packet.Settings.ProximityDistance = ProximityDistance;
        packet.Settings.ProximityToggle = ProximityToggle;
        packet.Settings.VoiceEffects = VoiceEffects;

        const request = new HttpRequest(`http://${this.IP}:${this.Port}/`);
        request.setTimeout(5);
        request.setBody(JSON.stringify(packet));
        request.setMethod(HttpRequestMethod.Post);
        request.setHeaders([new HttpHeader("Content-Type", "application/json")]);
        http.request(request).then((response) => {
            if (response.status == 200) {
                PlayerObject.sendMessage("§2Berhasil menyimpan pengaturan eksternal server!");
            } else {
                PlayerObject.sendMessage("§cTerdapat error, gagal mengubah pengaturan!");
            }
        });
    }

    /**
     * @argument {Player} PlayerObject
     */
    static ShowSettings(PlayerObject) {
        if (!Network.IsConnected) {
            PlayerObject.sendMessage("§cGagal mengambil data pengaturan. Server tidak tersambung!");
            return;
        }

        const packet = new GetSettingsPacket();
        packet.LoginKey = this.Key;

        const request = new HttpRequest(`http://${this.IP}:${this.Port}/`);
        request.setTimeout(5);
        request.setBody(JSON.stringify(packet));
        request.setMethod(HttpRequestMethod.Post);
        request.setHeaders([new HttpHeader("Content-Type", "application/json")]);
        http.request(request).then((response) => {
            if (response.status == 200) {
                const json = JSON.parse(response.body);
                const settings = new ServerSettings();
                settings.ProximityDistance = json.Settings.ProximityDistance;
                settings.ProximityToggle = json.Settings.ProximityToggle;
                settings.VoiceEffects = json.Settings.VoiceEffects;

                new ModalFormData()
                    .title("Pengaturan Server Eksternal")
                    .slider("Jarak Proximity", 1, 60, 1, settings.ProximityDistance)
                    .toggle("Nyalakan Proximity", settings.ProximityToggle)
                    .toggle("Efek Suara", settings.VoiceEffects)
                    .show(PlayerObject)
                    .then((response) => {
                        if (response.canceled) return;
                        this.UpdateSettings(
                            PlayerObject,
                            response.formValues![0],
                            response.formValues![1],
                            response.formValues![2]
                        );
                    });
            } else {
                PlayerObject.sendMessage("§cTerdapat kesalahan!");
            }
        });
    }
}

class LoginPacket {
    public Type: number;
    public LoginKey: string;

    constructor() {
        this.Type = 0;
        this.LoginKey = "";
    }
}

class BindingPacket {
    public Type: number;
    public LoginKey: string;
    public PlayerId: string;
    public PlayerKey: number;
    public Gamertag: string;

    constructor() {
        this.Type = 1;
        this.LoginKey = "";
        this.PlayerId = "";
        this.PlayerKey = 0;
        this.Gamertag = "";
    }
}

class UpdatePlayersPacket {
    public Type: number;
    public LoginKey: string;
    public Players: Array<any>;

    constructor() {
        this.Type = 2;
        this.LoginKey = "";
        this.Players = [];
    }
}

class UpdateSettingsPacket {
    public Type: number;
    public LoginKey: string;
    public Settings: ServerSettings;

    constructor() {
        this.Type = 3;
        this.LoginKey = "";
        this.Settings = new ServerSettings();
    }
}

class GetSettingsPacket {
    public Type: number;
    public LoginKey: string;

    constructor() {
        this.Type = 4;
        this.LoginKey = "";
    }
}

class ServerSettings {
    public ProximityDistance: number;
    public ProximityToggle: boolean;
    public VoiceEffects: boolean;

    constructor() {
        this.ProximityDistance = 30;
        this.ProximityToggle = true;
        this.VoiceEffects = true;
    }
}

/**
 * @argument {Player} player
 */
function GetCaveDensity(player) {
    if (!Network.VoiceEffectEnabled && Network.IsConnected) return 0.0;
    const caveBlocks = [
        "minecraft:stone",
        "minecraft:diorite",
        "minecraft:granite",
        "minecraft:deepslate",
        "minecraft:tuff",
    ];

    const dimension = world.getDimension("overworld");
    const block1 = caveBlocks.includes(
        dimension.getBlockFromRay(player.getHeadLocation(), Vector.up, { maxDistance: 50 })!?.block.type.id
    )
        ? 1
        : 0;
    const block2 = caveBlocks.includes(
        dimension.getBlockFromRay(player.getHeadLocation(), Vector.left, { maxDistance: 20 })!?.block.type.id
    )
        ? 1
        : 0;
    const block3 = caveBlocks.includes(
        dimension.getBlockFromRay(player.getHeadLocation(), Vector.right, { maxDistance: 20 })!?.block.type.id
    )
        ? 1
        : 0;
    const block4 = caveBlocks.includes(
        dimension.getBlockFromRay(player.getHeadLocation(), Vector.forward, { maxDistance: 20 })!?.block.type.id
    )
        ? 1
        : 0;
    const block5 = caveBlocks.includes(
        dimension.getBlockFromRay(player.getHeadLocation(), Vector.back, { maxDistance: 20 })!?.block.type.id
    )
        ? 1
        : 0;
    const block6 = caveBlocks.includes(
        dimension.getBlockFromRay(player.getHeadLocation(), Vector.down, { maxDistance: 50 })!?.block.type.id
    )
        ? 1
        : 0;
    return (block1 + block2 + block3 + block4 + block5 + block6) / 6;
}

system.runInterval(() => {
    if (Network.IsConnected) {
        const playerList = world.getAllPlayers().map((plr) => ({
            PlayerId: plr.id,
            DimensionId: plr.dimension.id,
            Location: {
                x: plr.getHeadLocation().x,
                y: plr.getHeadLocation().y,
                z: plr.getHeadLocation().z,
            },
            Rotation: plr.getRotation().y,
            CaveDensity: plr.dimension.id == "minecraft:overworld" ? GetCaveDensity(plr) : 0.0,
            IsDead: Network.DeadPlayers.includes(plr.id as never),
            InWater: plr.dimension.getBlock(plr.getHeadLocation())?.isLiquid,
        }));
        const packet = new UpdatePlayersPacket();
        packet.LoginKey = Network.Key;
        packet.Players = playerList;

        const request = new HttpRequest(`http://${Network.IP}:${Network.Port}/`);
        request.setTimeout(5);
        request.setBody(JSON.stringify(packet));
        request.setMethod(HttpRequestMethod.Post);
        request.setHeaders([new HttpHeader("Content-Type", "application/json")]);

        http.request(request).then((response) => {
            if (response.status != 200) {
                Network.IsConnected = false;
                http.cancelAll("Lost Connection From VOIP Server");
            }
        });
    }
    // try {
    //     if (world.getDynamicProperty("serverSettingsHudDisplay"))
    //         world
    //             .getDimension("minecraft:overworld")
    //             .runCommandAsync(
    //                 `title @a actionbar §bServer Connection: ${
    //                     Network.IsConnected ? "§aConnected" : "§cDisconnected"
    //                 }` +
    //                     `\n§bVoice Proximity: ${Network.ProximityEnabled ? "§2Enabled" : "§cDisabled"}` +
    //                     `\n§bVoice Effects: ${Network.VoiceEffectEnabled ? "§2Enabled" : "§cDisabled"}` +
    //                     `\n§bVoice Proximity Distance: §e${Network.ProximityDistance}` +
    //                     `\n\n§bText Proximity: ${
    //                         world.getDynamicProperty("textProximityChat") ? "§2Enabled" : "§cDisabled"
    //                     }` +
    //                     `\n§bText Proximity Distance: §e${world.getDynamicProperty("textProximityDistance")}` +
    //                     `${
    //                         world.getDynamicProperty("displayServerAddressOnHud")
    //                             ? `\n\n§bServer Address: ${Network.IP}:${Network.Port}`
    //                             : ""
    //                     }`
    //             );
    // } catch {}
});

system.runInterval(() => {
    if (Network.IsConnected) {
        const packet = new GetSettingsPacket();
        packet.LoginKey = Network.Key;

        const request = new HttpRequest(`http://${Network.IP}:${Network.Port}/`);
        request.setTimeout(5);
        request.setBody(JSON.stringify(packet));
        request.setMethod(HttpRequestMethod.Post);
        request.setHeaders([new HttpHeader("Content-Type", "application/json")]);
        http.request(request).then((response) => {
            if (response.status == 200) {
                const json = JSON.parse(response.body);
                const settings = new ServerSettings();
                settings.ProximityDistance = json.Settings.ProximityDistance;
                settings.ProximityToggle = json.Settings.ProximityToggle;
                settings.VoiceEffects = json.Settings.VoiceEffects;

                Network.ProximityDistance = settings.ProximityDistance;
                Network.ProximityEnabled = settings.ProximityToggle;
                Network.VoiceEffectEnabled = settings.VoiceEffects;
            }
        });
    }
}, 20 * 5);

export { Network };
const gulp = require("gulp");
const fs = require("fs-extra");
const logger = require("gulplog");
const os = require("os");
const uuid = require("uuid");
const zipper = require("zip-local");
const { execSync } = require("child_process");

// === CONFIGURABLE VARIABLES

const addonsName = "MechaAssets";
const thirdMaxVersion = 30;
const secondMaxVersion = 99;

// === END CONFIGURABLE VARIABLES

function update_version() {
    let = pathGlovalVersion = "assets/version_update.json";
    let addonsVersion = JSON.parse(fs.readFileSync(pathGlovalVersion));

    let first = addonsVersion.all_version[0];
    let second = addonsVersion.all_version[1];
    let third = addonsVersion.all_version[2];

    third += 1;

    if (third > thirdMaxVersion) {
        third = 0;
        second += 1;
    }

    if (second > secondMaxVersion) {
        second = 0;
        first = 1;
    }

    const BP_UUID = uuid.v4();
    const RP_UUID = uuid.v4();

    addonsVersion.all_version = [first, second, third];
    addonsVersion.bp.uuid = BP_UUID;
    addonsVersion.rp.uuid = RP_UUID;

    let pathManifestBP = "assets/BehaviorPack/manifest.json";
    let pathManifestRP = "assets/ResourcePack/manifest.json";

    let manifestBP = JSON.parse(fs.readFileSync(pathManifestBP));
    let manifestRP = JSON.parse(fs.readFileSync(pathManifestRP));

    manifestBP.header.min_engine_version = addonsVersion.min_engine_version;
    manifestRP.header.min_engine_version = addonsVersion.min_engine_version;

    manifestBP.header.uuid = BP_UUID;
    manifestRP.header.uuid = RP_UUID;

    manifestBP.header.version = [first, second, third];
    manifestRP.header.version = [first, second, third];

    manifestBP.header.description = `§6Behavior Pack §a${first}.${second}.${third}`;
    manifestRP.header.description = `§6Resource Pack §a${first}.${second}.${third}`;

    fs.writeFileSync(pathManifestBP, JSON.stringify(manifestBP, null, 4));
    fs.writeFileSync(pathManifestRP, JSON.stringify(manifestRP, null, 4));

    fs.writeFileSync(pathGlovalVersion, JSON.stringify(addonsVersion, null, 4));
}

function copy(source, destination) {
    fs.copySync(source, destination), { overwrite: true };
}

function clean_build() {
    let buildfolder = `build/${addonsName}`;
    if (fs.existsSync(buildfolder)) fs.rmSync(buildfolder, { recursive: true, force: true });
    logger.info("clean build");
}

function create_folder(foldername) {
    if (!fs.existsSync(foldername)) {
        logger.info("create folder " + foldername);
        fs.mkdirSync(foldername);
    }
}

function copy_behavior_packs() {
    create_folder(`build/${addonsName}`);
    create_folder(`build/${addonsName}/${addonsName} [BP]`);
    logger.info("copy behavior pack");
    fs.copySync("assets/BehaviorPack/", `build/${addonsName}/${addonsName} [BP]`, { overwrite: true });
}

function copy_resource_packs() {
    create_folder(`build/${addonsName}`);
    create_folder(`build/${addonsName}/${addonsName} [RP]`);
    logger.info("copy resource pack");
    fs.copySync("assets/ResourcePack/", `build/${addonsName}/${addonsName} [RP]`, { overwrite: true });
}

function compile_scripts() {
    logger.info("compiling scripts");
    execSync(`tsc --outDir "build\\${addonsName}\\${addonsName}\ \[BP\]"`);
}

function packAddons() {
    let = pathGlovalVersion = "assets/version_update.json";
    let addonsVersion = JSON.parse(fs.readFileSync(pathGlovalVersion));
    create_folder("dist");
    zipper.sync
        .zip(`build/${addonsName}`)
        .compress()
        .save(`dist/${addonsName} v${addonsVersion.all_version.join(".")}.mcaddon`);
}

function packBP() {
    let = pathGlovalVersion = "assets/version_update.json";
    let addonsVersion = JSON.parse(fs.readFileSync(pathGlovalVersion));
    create_folder("dist");
    zipper.sync
        .zip(`build/${addonsName}/${addonsName} [BP]`)
        .compress()
        .save(`dist/${addonsName} [BP] v${addonsVersion.all_version.join(".")}.mcpack`);
}

function packRP() {
    let = pathGlovalVersion = "assets/version_update.json";
    let addonsVersion = JSON.parse(fs.readFileSync(pathGlovalVersion));
    create_folder("dist");
    zipper.sync
        .zip(`build/${addonsName}/${addonsName} [BP]`)
        .compress()
        .save(`dist/${addonsName} [BP] v${addonsVersion.all_version.join(".")}.mcpack`);
}

gulp.task("default", async function () {
    update_version();
    clean_build();
    create_folder("build");
    copy_behavior_packs();
    copy_resource_packs();
    compile_scripts();
    packAddons();
    logger.info("Done.");
});

gulp.task("bp", async function () {
    update_version();
    clean_build();
    create_folder("build");
    copy_behavior_packs();
    compile_scripts();
    packBP();
    logger.info("Done.");
});

gulp.task("rp", async function () {
    update_version();
    clean_build();
    create_folder("build");
    copy_resource_packs();
    packRP();
    logger.info("Done.");
});

gulp.task("bp-dev", async function () {
    update_version();
    clean_build();
    create_folder("build");
    copy_behavior_packs();
    compile_scripts();
    let copy_source = "build/MechaAssets/";
    let copy_target =
        os.homedir() +
        "\\AppData\\Local\\Packages\\Microsoft.MinecraftUWP_8wekyb3d8bbwe\\LocalState\\games\\com.mojang\\development_behavior_packs";
    copy(copy_source, copy_target);
    logger.info("Done.");
});

const sites = require("./registry_mirror_sites.json");
const fs = require("fs");
const { spawnSync, execSync } = require("child_process");
const { off } = require("process");
const outputfile = "dest/registry_mirrors_status.json";
const image = "library/busybox:1.36.1";

function encodeUnicode(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        if (code > 127) {
            let unic = code.toString(16);
            while (unic.length < 4) {
                unic = "0" + unic;
            }
            result += "\\u" + unic;
        } else {
            result += str[i];
        }
    }
    return result.replaceAll("/", "\\/");
}

for (site of sites) {
    for (registry of site.registries) {
        try {
            execSync(
                "docker pull " + registry.url + "/" + image,
                { stdio: "inherit" }
            );
            registry.status = 0;
            console.log("status:", registry.status );
        } catch (error) {
            registry.status = error.status;
            console.log("status:", error.status);
            console.log("message:", error.message);
        }
    }
}

fs.writeFileSync(outputfile, encodeUnicode(JSON.stringify(sites)));
console.log("saved to " + outputfile);

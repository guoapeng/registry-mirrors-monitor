const registries = require("./registry_mirrors.json");
const fs = require("fs");
const { spawnSync, execSync } = require("child_process");
const outputfile = "dest/registry_mirrors_status.json";
const image="library/busybox:1.36.1"

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

for (registry of registries) {

    try {
        const stdout = execSync('docker pull '+registry.registry+"/"+image, {stdio: 'inherit'});
        registry.status = 0;
    } catch (error) {
        registry.status = error.status;
        console.log('status:', error.status);
        console.log('message:', error.message);
    }
    
}

fs.writeFileSync(outputfile, encodeUnicode(JSON.stringify(registries)));
console.log("saved to " + outputfile);

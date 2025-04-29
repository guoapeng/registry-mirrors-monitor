const sites = require("./registry_mirror_sites.json");
const fs = require("fs");
const { execSync } = require("child_process");
const outputfile = "dest/registry_mirrors_status.json";
const imageMap = new Map();

// Set images map
imageMap.set("dockerhub", ["library/busybox:latest","library/busybox:1.30",
    "library/busybox:1.31","library/busybox:1.32","library/busybox:1.33",
    "library/busybox:1.34",
    "library/busybox:1.35","library/busybox:1.36","library/busybox:1.37",
    "library/busybox:stable","library/busybox:musl","library/busybox:ubuntu","library/busybox:glibc",
    "library/busybox:uclibc","library/busybox:1.36.1","library/busybox:1.33.1","library/busybox:1.32.1"
]);
imageMap.set("gcr", ["google-containers/pause:latest"]);
imageMap.set("ghcr", ["google-containers/pause:latest"]);
imageMap.set("quay", ["prometheus/busybox:latest"]);
imageMap.set("k8s", ["pause:3.9"]);
imageMap.set("k8sgcr", ["pause:3.9"]);
imageMap.set("nvcr", ["nvidia/l4t-base:r32.3.1"]);
imageMap.set("elastic", ["beats/metricbeat-wolfi:9.0.0"]);
imageMap.set("mcr", ["dotnet/runtime-deps:9.0"]);

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

function getImage(registry) {
    //根据 registry.type 获取对应的镜像列表
    const images = imageMap.get(registry.type);
    if (images) {
        //随机选择一个
        const randomIndex = Math.floor(Math.random() * images.length);
        return registry.url + "/" + images[randomIndex];
        
    } else {
        return null;
    }

}

for (site of sites) {
    for (registry of site.registries) {
        try {
            exampleImage = getImage(registry);
            execSync(
                "docker pull " + exampleImage,
                { stdio: "inherit" }
            );
            registry.status = 0;
            const lastChecked = new Date(); 
            registry.lastChecked = lastChecked.toISOString();
            console.log("status:", registry.status );
            
            try {
                console.log("clean image:", exampleImage);
                execSync(
                    "docker rmi " + exampleImage,
                    { stdio: "inherit" }
                );
            } catch (error) {
                console.log("clean image error :", error);
            }
            
        } catch (error) {
            registry.status = error.status;
            const lastChecked = new Date(); 
            registry.lastChecked = lastChecked.toISOString();
            console.log("status:", error.status);
            console.log("message:", error.message);
        } 
    }
}

fs.writeFileSync(outputfile, encodeUnicode(JSON.stringify(sites)));
console.log("saved to " + outputfile);

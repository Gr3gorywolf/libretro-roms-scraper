const fs = require("fs");
const { VALID_COMPRESSED_EXTENSIONS } = require("../../constants/files");


const OWNER = 'TapiocaFox'
const ROOT_REPO = 'Daijishou'
const token = process.env.GITHUB_TOKEN
const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'libretro-thumb-scraper',
  ...(token ? { Authorization: `Bearer ${token}` } : {})
}

async function gh(url) {
  const res = await fetch(url, { headers })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`${res.status} ${res.statusText}: ${txt}`)
  }
  return res.json()
}

function parseAmArguments(am) {
  const lines = am.split("\n").map(l => l.trim()).filter(Boolean);

  let payload = {
    package: null,
    activity: null,
    action: null,
    data: null,
    extras: {}
  };

  for (const line of lines) {
    // -n <package>/<activity>
    if (line.startsWith("-n ")) {
      const comp = line.replace("-n ", "").trim();
      const [pkg, activity] = comp.split("/");
      payload.package = pkg;
      payload.activity = comp.includes("/") ? comp : null;
    }

    // -a <intent action>
    else if (line.startsWith("-a ")) {
      payload.action = line.replace("-a ", "").trim();
    }

    // -d <data>
    else if (line.startsWith("-d ")) {
      payload.data = line.replace("-d ", "").trim();
    }

    // -e <key> <value>
    else if (line.startsWith("-e ")) {
      const parts = line.split(" ");
      const key = parts[1];
      const value = parts.slice(2).join(" ");
      payload.extras[key] = value;
    }
  }

  return payload;
}

function build(fileContent) {
  const json = JSON.parse(fileContent);

  const platformId = json.platform.uniqueId;
  const result = { [platformId]: [] };

  for (const player of json.playerList) {
    const parsed = parseAmArguments(player.amStartArguments);
    const requireExtraction = !VALID_COMPRESSED_EXTENSIONS.some(ext => player.acceptedFilenameRegex.includes(ext));
    result[platformId].push({
      uniqueId: player.uniqueId,
      package: parsed.package,
      activity: parsed.activity,
      action: parsed.action || "android.intent.action.VIEW",
      data: parsed.data,
      extras: parsed.extras,
      requireExtraction: requireExtraction,
      acceptedFilenameRegex: player.acceptedFilenameRegex
    });
  }

  return result;
}

async function Scrape(){ 

     const platformsThree = await gh(
    `https://api.github.com/repos/${OWNER}/${ROOT_REPO}/contents/platforms?ref=main`
    )
    console.log("platformsThree:", platformsThree);
    const forbiddenFiles = [".py","index.json"]
    var results = {};
    for (const platform of platformsThree) {
        if(forbiddenFiles.some(ext => platform.name.endsWith(ext))) continue;
        const fileContent = await gh(
            `https://api.github.com/repos/${OWNER}/${ROOT_REPO}/contents/platforms/${platform.name}?ref=main`
        )
        const buff = Buffer.from(fileContent.content, 'base64');
        const text = buff.toString('utf-8');
        results = {...results, ...build(text)};
    }
    console.log("results:", results);
    return results;
}

module.exports = {
  Scrape,
   meta: {
    name: "Daijishou Intents",
    author: "gr3",
  },
}
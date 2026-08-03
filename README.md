# logseq-autolink-plugin

![Version](https://img.shields.io/github/v/release/benjypng/logseq-autolink-plugin?style=flat-square&color=0969da) ![Downloads](https://img.shields.io/github/downloads/benjypng/logseq-autolink-plugin/total?style=flat-square&color=orange) ![License](https://img.shields.io/github/license/benjypng/logseq-autolink-plugin?style=flat-square)

> Automatically wrap mentions of existing pages in `[[...]]` as you write, so your graph stays connected without manual linking.

---

## ✨ Features

- **Automatic Linking:** When you press Enter to start a new block, the previous block is scanned for any text that matches an existing page in your graph and rewritten with `[[Page Name]]` wiki links.
- **Multi-word Titles:** Handles both single-word pages (`Syncope`) and multi-word phrases (`Machine Learning`). Longer titles always win over shorter overlapping ones.
- **Safe Replacements:** Skips text that is already inside `[[wiki links]]`, `` `inline code` ``, fenced code blocks, and URLs — so existing markup and code stay untouched.
- **Case-insensitive Matching:** `syncope`, `Syncope`, and `SYNCOPE` in your text all link to the same page; the casing you typed is preserved inside the link.
- **Indexed Lookup:** Candidate matching is pushed into Logseq's own datascript store via `:block/name`, so no client-side page cache or invalidation logic is needed.

### How it works

1. On every block insertion, the plugin reads the previous sibling block's content.
2. It generates candidate n-grams (1 to 5 words) from that content, skipping any masked regions.
3. A single datascript query returns the subset of candidates that exist as page names in the graph.
4. Surviving matches are spliced back into the block as `[[...]]` links, longest-first.

### Requirements

- **Logseq DB version.** This plugin uses DB-graph APIs and will refuse to run on a file-based graph (you'll see an error toast on load).

## 📸 Screenshots / Demo

![](./demo.gif)

## ⚙️ Installation

1. Open Logseq.
2. Go to the **Marketplace** (Plugins > Marketplace).
3. Search for **logseq-autolink**.
4. Click **Install**.

## 🛠 Usage & Settings

#### Using the Plugin

There is no command to run — once the plugin is loaded, autolinking happens passively:

1. Type a block containing any text that matches an existing page name (e.g. `meeting on Quantum Mechanics`).
2. Press Enter to start a new block.
3. The previous block is rewritten with the appropriate `[[...]]` links (e.g. `meeting on [[Quantum Mechanics]]`).

#### What gets skipped

Inside the same block, the plugin will **not** touch text that is already inside:

- existing wiki links — `[[Foo]]`
- inline code — `` `Foo` ``
- fenced code blocks — ` ```...``` `
- URLs — `https://foo.example/Foo`

#### Settings

This plugin currently has no user-facing settings. Configurable behavior (e.g. n-gram length, exclusion patterns) may be added in future releases.

## ☕️ Support

If you enjoy this plugin, please consider supporting the development.

<div align="center">
  <a href="https://github.com/sponsors/benjypng"><img src="https://img.shields.io/badge/Sponsor-GitHub-ea4aaa?style=for-the-badge&logo=github" alt="Sponsor on Github" /></a>&nbsp;<a href="https://buymeacoffee.com/hkgnp.dev"><img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee" /></a>
</div>

## 🤝 Contributing

Issues are welcome. If you find a bug, please open an issue. Pull requests are not accepted at the moment as I am not able to commit to reviewing them in a timely fashion.

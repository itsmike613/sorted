const langs = ["en", "es", "ru"];
const cap = 4;

const state = {
    page:"home",
    lang:"en",
    theme:"light",
    set:{ palette:"classic", style:"liquid" },
    form:{ colors:6, empty:2, scramble:5 },
    board:[],
    origin:[],
    history:[],
    future:[],
    selected:null,
    start:0,
    elapsed:0,
    timer:null,
    ready:false,
    done:false,
    run:null,
    last:null
};

const el = id => document.getElementById(id);
const local = value => value[state.lang];
const text = key => words[state.lang][key] || key;
const fill = (key, vars = {}) => Object.entries(vars).reduce((value, pair) => value.replace(`{${pair[0]}}`, pair[1]), text(key));
const clone = board => board.map(tube => [...tube]);
const code = board => board.map(tube => tube.join("")).join("/");

function shuffle(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function same(a, b) {
    return code(a) === code(b);
}

function clear() {
    if (state.timer !== null) cancelAnimationFrame(state.timer);
    state.timer = null;
}

function reset() {
    clear();
    state.board = [];
    state.origin = [];
    state.history = [];
    state.future = [];
    state.selected = null;
    state.start = 0;
    state.elapsed = 0;
    state.ready = false;
    state.done = false;
    state.run = null;
}

function show(page) {
    clear();
    state.page = page;
    document.querySelectorAll(".page").forEach(node => node.classList.toggle("active", node.id === page));
    window.scrollTo({ top:0, behavior:"auto" });
    paint();
}

function theme() {
    document.documentElement.dataset.theme = state.theme;
    const dark = state.theme === "dark";
    el("theme").querySelector("i").className = dark ? "ph ph-moon" : "ph ph-sun";
    el("theme").querySelector("span").textContent = dark ? "DM" : "LM";
    document.querySelector('meta[name="theme-color"]').content = dark ? "#151715" : "#f4f4f1";
}

function menus() {
    const palette = el("palette");
    palette.innerHTML = choices.map(value => `<option value="${value}">${text(value)}</option>`).join("");
    palette.value = state.set.palette;
    const style = el("style");
    style.innerHTML = styles.map(value => `<option value="${value}">${text(value)}</option>`).join("");
    style.value = state.set.style;
}

function translate() {
    document.documentElement.lang = state.lang;
    document.title = game;
    document.querySelectorAll("[data-title]").forEach(node => node.textContent = game);
    document.querySelectorAll("[data-logo]").forEach(node => node.innerHTML = `<span>${game.slice(0, 2)}</span>${game.slice(2)}`);
    document.querySelectorAll("[data-t]").forEach(node => node.textContent = text(node.dataset.t));
    el("lang").querySelector("span").textContent = state.lang.toUpperCase();
    el("theme").setAttribute("aria-label", text("theme"));
    el("lang").setAttribute("aria-label", text("language"));
    document.querySelectorAll("[data-go='home']").forEach(node => node.setAttribute("aria-label", text("home")));
    el("quit").setAttribute("aria-label", text("home"));
    el("board").setAttribute("aria-label", text("board"));
    menus();
}

function paint() {
    translate();
    theme();
    if (state.page === "setup") setup();
    if (state.page === "play") play();
    if (state.page === "results") scores();
    if (state.page === "help") guide();
}

function setup() {
    const box = el("options");
    const spec = [["colors",3,10],["empty",1,3],["scramble",1,10]];
    box.innerHTML = spec.map(row => {
        const key = row[0];
        const value = state.form[key];
        return `<div class="cat"><span>${text(key)}</span><div class="stepper"><button data-key="${key}" data-step="-1" aria-label="-"${value <= row[1] ? " disabled" : ""}>−</button><b>${value}</b><button data-key="${key}" data-step="1" aria-label="+"${value >= row[2] ? " disabled" : ""}>+</button></div></div>`;
    }).join("");
    el("total").textContent = state.form.colors + state.form.empty;
}

function group(tube) {
    if (!tube.length) return 0;
    const color = tube[tube.length - 1];
    let count = 0;
    for (let i = tube.length - 1; i >= 0 && tube[i] === color; i--) count++;
    return count;
}

function pour(board, from, to) {
    if (from === to || !board[from].length || board[to].length >= cap) return null;
    const color = board[from][board[from].length - 1];
    if (board[to].length && board[to][board[to].length - 1] !== color) return null;
    const count = Math.min(group(board[from]), cap - board[to].length);
    const next = clone(board);
    for (let i = 0; i < count; i++) next[to].push(next[from].pop());
    return next;
}

function shift(board, from, to, count) {
    if (count < 1 || board[from].length < count || board[to].length + count > cap) return null;
    const color = board[from][board[from].length - 1];
    for (let i = 1; i <= count; i++) if (board[from][board[from].length - i] !== color) return null;
    const next = clone(board);
    for (let i = 0; i < count; i++) next[to].push(next[from].pop());
    return next;
}

function reverse(board, from, to, count) {
    const next = shift(board, from, to, count);
    if (!next) return null;
    const check = pour(next, to, from);
    return check && same(check, board) ? next : null;
}

function solved(board = state.board) {
    return board.every(tube => !tube.length || (tube.length === cap && tube.every(color => color === tube[0])));
}

function mixed(board) {
    return board.some(tube => tube.some((color, index) => index && color !== tube[index - 1]));
}

function make(colors, empty, scramble) {
    let board = Array.from({ length:colors }, (_, color) => Array(cap).fill(color));
    board.push(...Array.from({ length:empty }, () => []));
    const fresh = shuffle(Array.from({ length:colors }, (_, index) => index));
    let gap = colors + Math.floor(Math.random() * empty);
    const ops = [];
    const cycles = 1 + Math.round((scramble - 1) * (colors - 2) / 9);

    for (let turn = 0; turn < cycles; turn++) {
        let from;
        if (!turn) from = fresh.pop();
        else {
            const pool = shuffle(board.map((tube, index) => ({ tube, index })).filter(item => item.index !== gap && !fresh.includes(item.index) && item.tube.length === cap && group(item.tube) >= 2));
            from = pool[0].index;
        }
        const donor = fresh.pop();
        const limit = !turn ? 3 : Math.min(3, group(board[from]) - 1);
        const count = 1 + Math.floor(Math.random() * limit);
        const plan = [[from,gap,count],[donor,from,count],[donor,gap,cap - count]];

        for (const move of plan) {
            const next = reverse(board, move[0], move[1], move[2]);
            if (!next) return null;
            board = next;
            ops.push([move[1], move[0]]);
        }
        gap = donor;
    }
    return { board, path:ops.reverse() };
}

function verify(item, colors, empty) {
    if (!item || item.board.length !== colors + empty || solved(item.board) || !mixed(item.board)) return false;
    if (item.board.filter(tube => !tube.length).length !== empty || item.board.some(tube => tube.length > cap)) return false;
    const counts = Array(colors).fill(0);
    item.board.forEach(tube => tube.forEach(color => {
        if (color >= 0 && color < colors) counts[color]++;
    }));
    if (counts.some(count => count !== cap)) return false;
    let board = clone(item.board);
    for (const move of item.path) {
        const next = pour(board, move[0], move[1]);
        if (!next) return false;
        board = next;
    }
    return solved(board);
}

function build(colors, empty, scramble) {
    let item = null;
    for (let pass = 0; pass < 80; pass++) {
        item = make(colors, empty, scramble);
        if (!verify(item, colors, empty)) continue;
        const key = code(item.board);
        if (key !== state.last || pass === 79) {
            state.last = key;
            return item;
        }
    }
    return item;
}

function format(value) {
    const time = Math.max(0, Math.floor(value));
    const min = String(Math.floor(time / 60000)).padStart(2, "0");
    const sec = String(Math.floor(time / 1000) % 60).padStart(2, "0");
    const ms = String(time % 1000).padStart(3, "0");
    return `${min}:${sec}.${ms}`;
}

function tick() {
    if (!state.ready || state.done) return;
    state.elapsed = performance.now() - state.start;
    el("time").textContent = format(state.elapsed);
    state.timer = requestAnimationFrame(tick);
}

function clock() {
    state.ready = false;
    state.elapsed = 0;
    el("time").textContent = format(0);
    requestAnimationFrame(() => {
        if (state.page !== "play" || state.done) return;
        state.ready = true;
        state.start = performance.now();
        tick();
    });
}

function buttons() {
    el("undo").disabled = !state.history.length || state.done;
    el("redo").disabled = !state.future.length || state.done;
}

function render() {
    const box = el("board");
    if (!state.run || !state.board.length) {
        box.innerHTML = "";
        return;
    }
    const colors = palettes[state.run.palette];
    box.className = `board ${state.run.style}`;
    box.innerHTML = "";
    state.board.forEach((tube, index) => {
        const button = document.createElement("button");
        button.className = `tube${state.selected === index ? " selected" : ""}`;
        button.dataset.index = index;
        button.setAttribute("aria-pressed", state.selected === index ? "true" : "false");
        button.setAttribute("aria-label", `${text("tube")} ${index + 1}`);
        const glass = document.createElement("span");
        glass.className = "glass";
        tube.forEach((color, slot) => {
            const unit = document.createElement("span");
            unit.className = "unit";
            unit.style.setProperty("--color", colors[color]);
            unit.style.setProperty("--slot", slot);
            glass.append(unit);
        });
        button.append(glass);
        box.append(button);
    });
    buttons();
}

function play() {
    if (!state.run) return;
    el("moves").textContent = state.history.length;
    el("time").textContent = format(state.elapsed);
    render();
}

function begin(config = null) {
    clear();
    const source = config || { colors:state.form.colors, empty:state.form.empty, scramble:state.form.scramble, palette:state.set.palette, style:state.set.style };
    const item = build(source.colors, source.empty, source.scramble);
    state.run = { colors:source.colors, empty:source.empty, scramble:source.scramble, palette:source.palette, style:source.style, time:0, moves:0, path:item.path };
    state.origin = clone(item.board);
    state.board = clone(item.board);
    state.history = [];
    state.future = [];
    state.selected = null;
    state.elapsed = 0;
    state.ready = false;
    state.done = false;
    show("play");
    clock();
}

function choose(index) {
    if (!state.ready || state.done) return;
    if (state.selected === null) {
        if (!state.board[index].length) return;
        state.selected = index;
        render();
        return;
    }
    if (state.selected === index) {
        state.selected = null;
        render();
        return;
    }
    const next = pour(state.board, state.selected, index);
    if (!next) return;
    state.history.push(clone(state.board));
    state.future = [];
    state.board = next;
    state.selected = null;
    el("moves").textContent = state.history.length;
    if (solved()) finish();
    else render();
}

function undo() {
    if (!state.ready || state.done || !state.history.length) return;
    state.future.push(clone(state.board));
    state.board = state.history.pop();
    state.selected = null;
    el("moves").textContent = state.history.length;
    render();
}

function redo() {
    if (!state.ready || state.done || !state.future.length) return;
    state.history.push(clone(state.board));
    state.board = state.future.pop();
    state.selected = null;
    el("moves").textContent = state.history.length;
    render();
}

function restart() {
    if (!state.run) return;
    clear();
    state.board = clone(state.origin);
    state.history = [];
    state.future = [];
    state.selected = null;
    state.run.time = 0;
    state.run.moves = 0;
    state.done = false;
    play();
    clock();
}

function fresh() {
    if (!state.run) return;
    const run = state.run;
    begin({ colors:run.colors, empty:run.empty, scramble:run.scramble, palette:run.palette, style:run.style });
}

function finish() {
    if (state.done) return;
    state.elapsed = performance.now() - state.start;
    clear();
    state.ready = false;
    state.done = true;
    state.selected = null;
    state.run.moves = state.history.length;
    state.run.time = state.elapsed;
    el("time").textContent = format(state.elapsed);
    render();
    burst();
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => {
        if (state.page === "play" && state.done) show("results");
    }, reduce ? 0 : 350);
}

function scores() {
    if (!state.run) return;
    const run = state.run;
    const rows = [["completion",format(run.time)],["moves",run.moves]];
    const config = [["colors",run.colors],["empty",run.empty],["scramble",run.scramble],["palette",text(run.palette)],["style",text(run.style)]];
    const box = el("scores");
    box.innerHTML = rows.map(row => `<div class="score"><div><b>${text(row[0])}</b></div><strong>${row[1]}</strong></div>`).join("");
    box.innerHTML += `<div class="score config"><div><b>${text("configuration")}</b></div></div>`;
    box.innerHTML += config.map(row => `<div class="score config"><div><b>${text(row[0])}</b></div><strong>${row[1]}</strong></div>`).join("");
}

function burst() {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof confetti !== "function") return;
    confetti({ particleCount:65, angle:270, spread:80, startVelocity:22, gravity:1.1, ticks:60, origin:{ y:.02 } });
}

function guide() {
    const box = el("helpcopy");
    const list = steps.map(step => `<li>${local(step)}</li>`).join("");
    box.innerHTML = `<div class="topic"><p>${fill("helpintro", { game })}</p></div><div class="topic"><h3>${text("how")}</h3><ol>${list}</ol><p>${text("scramblehelp")}</p></div><div class="topic"><h3>${text("stats")}</h3><p>${text("timerhelp")}</p><p class="gap">${text("moveshelp")}</p></div>` + topics.map(topic => `<div class="topic"><h3>${local(topic.title)}</h3><p>${local(topic.text)}</p></div>`).join("");
}

function settings() {
    state.set.palette = el("palette").value;
    state.set.style = el("style").value;
}

document.addEventListener("click", event => {
    const go = event.target.closest("[data-go]");
    if (go) {
        const page = go.dataset.go;
        if (page === "home" && state.page !== "home") reset();
        show(page);
        return;
    }

    const step = event.target.closest("[data-step]");
    if (step) {
        const key = step.dataset.key;
        const change = Number(step.dataset.step);
        const range = { colors:[3,10], empty:[1,3], scramble:[1,10] }[key];
        state.form[key] = Math.max(range[0], Math.min(range[1], state.form[key] + change));
        setup();
        return;
    }

    const tube = event.target.closest("#board [data-index]");
    if (tube) choose(Number(tube.dataset.index));
});

el("theme").addEventListener("click", () => {
    state.theme = state.theme === "light" ? "dark" : "light";
    theme();
});

el("lang").addEventListener("click", () => {
    state.lang = langs[(langs.indexOf(state.lang) + 1) % langs.length];
    paint();
});

el("palette").addEventListener("change", settings);
el("style").addEventListener("change", settings);
el("start").addEventListener("click", () => begin());
el("quit").addEventListener("click", () => { reset(); show("home"); });
el("undo").addEventListener("click", undo);
el("redo").addEventListener("click", redo);
el("restart").addEventListener("click", restart);
el("new").addEventListener("click", fresh);
el("replay").addEventListener("click", fresh);

paint();
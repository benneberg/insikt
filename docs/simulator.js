export function runDemo({ log, warn, error, info }) {

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  async function run() {

    log("[DEMO] session started");

    log({ event: "init", system: "insikt-demo" });
    await delay(500);

    warn("This is a warning example");
    await delay(500);

    info("System metadata loaded");
    await delay(500);

    fetch("https://jsonplaceholder.typicode.com/posts/1")
      .then(r => r.json())
      .then(data => log("fetch result", data));

    await delay(700);

    try {
      throw new Error("Simulated runtime crash");
    } catch (e) {
      error(e);
    }

    await delay(500);

    Promise.reject("Simulated async failure")
      .catch(error);

    await delay(500);

    log("[DEMO] session complete");
  }

  run();
}

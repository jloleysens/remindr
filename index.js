#! /usr/bin/env node

const fs = require("fs");

async function main() {
  const [, , ...rest] = process.argv;
  const input = rest.join(" ");
  const [naturalParsed] = require("chrono-node").parse(input);
  if (!naturalParsed) {
    console.log(`Could not parse ${input}`);
    process.nextTick(() => process.exit(1));
    return;
  }
  const { index: startIdxOfParsed } = naturalParsed;
  const date = naturalParsed.start.date();
  const reminderName = input.slice(0, startIdxOfParsed).trim();

  const ics = require("ics");
  const createEvent = require("util").promisify(ics.createEvent);
  const event = await createEvent({
    start: [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes()
    ],
    duration: { hours: 0, minutes: 0 },
    title: reminderName,
    description: "",
    status: "CONFIRMED",
    alarms: [
      {
        action: "audio",
        trigger: { hours: 1, minutes: 30, before: true },
        repeat: 1,
        attachType: "VALUE=URI",
        attach: "Submarine"
      }
    ]
  });

  fs.writeFileSync("./tmp.ics", event);
}

main();

import TelegramBot from "node-telegram-bot-api";
import fs from "fs";
import axios from "axios";

export function initBot() {
  const token = "8017852247:AAEKvbZM5wdUMiWTlbGnddrvjzHqkofC6hU";

  const bot = new TelegramBot(token, { polling: true });
  // Listen for any kind of message. There are different kinds of
  // messages.
  if (!fs.existsSync("music")) fs.mkdirSync("music");
  bot.on("message", async function (msg) {
    try {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, "Received your message");
      if (!msg.audio) throw new Error("This is not an audio file");
      if (!msg.audio.title) throw new Error("Unable to find the title name");
      const fileLInk = await bot.getFileLink(msg.audio.file_id);
      const filePath = "music/" + (msg.audio as any)["file_name"];
      pushToTheQueue(msg, fileLInk, filePath);
    } catch (error) {
      console.log("🚀 ~ error:", error);
    }
  });
}

function pushToTheQueue(
  msg: TelegramBot.Message,
  fileLInk: string,
  filePath: string
) {
  console.log("hello");
}
async function downloader() {
  const writer = fs.createWriteStream(
    "" // update path here
  );
  const resp = await axios({
    url: "fileLInk", // update link here
    method: "GET",
    responseType: "stream",
  });
  await resp.data.pipe(writer);
  console.log("wrote to the file");

  writer.on("finish", () => {
    console.log("downloaded");
  });
  writer.on("error", () => {
    console.log("error writing");
  });
}

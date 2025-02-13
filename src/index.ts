import chalk from "chalk";
import fs from "fs";
import { getRandomProxy, loadProxies } from "./classes/proxy";
import { sosoValuRefferal } from "./classes/sosoValue";
import { generatePassword } from "./utils/generate";
import { logMessage, prompt, rl } from "./utils/logger";

async function main(): Promise<void> {
  console.log(
    chalk.cyan(`
░█▀▀░█▀█░█▀▀░█▀█░░░█░█░█▀█░█░░░█░█░█▀▀
░▀▀█░█░█░▀▀█░█░█░░░▀▄▀░█▀█░█░░░█░█░█▀▀
░▀▀▀░▀▀▀░▀▀▀░▀▀▀░░░░▀░░▀░▀░▀▀▀░▀▀▀░▀▀▀
        By : El Puqus Airdrop
        github.com/ahlulmukh
      Use it at your own risk
  `)
  );

  const refCode = await prompt(chalk.yellow("Enter Referral Code: "));
  const count = parseInt(await prompt(chalk.yellow("How many do you want? ")));
  const captchaMethod = await prompt(
    chalk.yellow(`Choose Captcha Metode \n1.2Captcha\n2.Puppeteer (Free) :`)
  );
  const proxiesLoaded = loadProxies();
  if (!proxiesLoaded) {
    console.log(chalk.yellow("No proxy available. Using default IP."));
  }
  let successful = 0;

  const sosoValueaccount = fs.createWriteStream("accounts.txt", { flags: "a" });

  for (let i = 0; i < count; i++) {
    console.log(chalk.white("-".repeat(85)));
    logMessage(i + 1, count, "Process", "debug");
    const currentProxy = await getRandomProxy();
    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0'
    ];
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    console.log(chalk.blue(`Using User-Agent: ${randomUserAgent}`));
    // Menggunakan User-Agent ini dalam request
    const sosoValue = new sosoValuRefferal(refCode, currentProxy, captchaMethod);


    try{
      const email = sosoValue.generateTempEmail();
      const password = generatePassword() 
      const registered = await sosoValue.registerAccount(email, password.encodedPassword);
      if(registered){

        // Tambahkan delay acak antara 5-15 menit sebelum membuat akun berikutnya
        if (count > 1 && i < count - 1) {
            let waitTime = Math.floor(Math.random() * (300 - 60 + 1) + 60) * 1000; // 60-300 detik
            console.log(chalk.blue(`Waiting ${waitTime / 60000} minutes before creating the next account...`));
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
                successful++;
        sosoValueaccount.write(`Email Address : ${email}\n`);
        sosoValueaccount.write(`Password : ${password.password}\n`);
        sosoValueaccount.write(`Invitation Code : ${registered.invitationCode}\n`);
        sosoValueaccount.write(`===================================================================\n`);
      }
    } catch(err){
      logMessage(i + 1, count, `Error: `, "error");
    }
  }

  sosoValueaccount.end();

  console.log(chalk.magenta("\n[*] Dono bang!"));
  console.log(chalk.green(`[*] Account dono ${successful} dari ${count} akun`));
  console.log(chalk.magenta("[*] Result in accounts.txt"));
  rl.close(); 
}

main().catch((err) => {
  console.error(chalk.red("Error occurred:"), err);
  process.exit(1);
});

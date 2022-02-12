import puppeteer from "puppeteer";
import * as dappeteer from "@chainsafe/dappeteer";
import config from "../keys";
import * as fs from "fs";

export default class OpenSeaRobot {
  constructor() {
    this.createAssetURL = `https://opensea.io/collection/${config.COLLECTION_NAME}/assets/create`;
  }

  async connectWallet(page, metamask) {
    console.log("Connecting to Metamask...");
    const moreButton = await page.$x(
      '//button[contains(.,"Show more options")]'
    );
    await moreButton[0].click();
    await page.waitForTimeout(5000);
    const metaMaskButton = await page.$x(
      '//button[.//span[contains(text(),"MetaMask")]]'
    );
    await metaMaskButton[0].click();
    await page.waitForTimeout(5000);
    await metamask.approve();
    console.log("Wallet connected");
  }

  async uploadImage(page, filepath) {
    console.log("Uploading image to OpenSea...");
    const elementHandle = await page.$("#media");
    await elementHandle.uploadFile(filepath);
    console.log("Uploaded image to OpenSea...");
  }

  async fillFields(page, name, description, link) {
    console.log("Writing metadata into fields...");
    await page.focus("#name");
    await page.keyboard.type(name, { delay: 25 });
    // Get and fill in the description
    await page.focus("#description");
    await page.keyboard.type(description, { delay: 25 });
    await page.focus("#external_link");
    await page.keyboard.type(link, { delay: 25 });
    console.log("writing metadata into fields completed...");
  }

  async run(imageFilePath, metadata) {
    console.log("OpenSeaRobot waking up...");
    console.log("Launching Dappeteer...");
    const browser = await dappeteer.launch(puppeteer, {
      metamaskVersion: config.METAMASK_VERSION,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    console.log("Setting up MetaMask...");
    const metamask = await dappeteer.setupMetamask(browser, {
      seed: config.METAMASK_MNEMONIC_PHRASE,
      password: config.METAMASK_PASSWORD,
    });
    await metamask.addNetwork({
      networkName: "Polygon Mainnet",
      rpc: "https://polygon-rpc.com/",
      chainId: 137,
      symbol: "MATIC",
      explorer: "https://polygonscan.com/",
    });
    await metamask.switchNetwork("Polygon Mainnet");
    console.log("Launching OpenSea...");
    const page = await browser.newPage();
    await page.goto(this.createAssetURL, { waitUntil: "networkidle0" });
    await page.bringToFront();

    const tabs = await browser.pages();
    await tabs[0].close();

    await this.connectWallet(page, metamask);
    await page.waitForTimeout(2000);

    console.log("Sign initial request...");
    await metamask.sign();
    await page.bringToFront();
    await page.waitForTimeout(5000);

    console.log("Creating new asset...");
    await page.bringToFront();
    await page.goto(this.createAssetURL);
    await page.waitForSelector("#media");

    await this.uploadImage(page, imageFilePath);
    await page.waitForTimeout(5000);

    await this.fillFields(
      page,
      metadata.name,
      metadata.description,
      metadata.tweetURL
    );

    console.log(`Minting NFT: ${metadata.name}...`);
    const createButton = await page.$x('//button[contains(., "Create")]');
    await createButton[0].click();

    console.log("Waiting for success popup...");
    await page.waitForSelector(
      "div.AssetSuccessModalContentreact__DivContainer-sc-1vt1rp8-1"
    );
    await page.waitForTimeout(10000);
    console.log("Successfully minted the NFT...");
    await browser.close();
    console.log("Dappeteer closed...");
    this.cleanUp(imageFilePath);
    console.log("OpenSeaRobot going to sleep now...");
  }

  cleanUp(imageFilePath) {
    fs.rmSync(imageFilePath);
  }
}

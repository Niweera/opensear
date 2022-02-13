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
    await page.waitForXPath('//button[contains(.,"Show more options")]');
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
    await page.focus("#description");
    await page.keyboard.type(description, { delay: 25 });
    await page.focus("#external_link");
    await page.keyboard.type(link, { delay: 25 });
    console.log("Writing metadata into fields completed...");
  }

  getSideNTries(base, value) {
    const side =
      value - base > 0 ? "ArrowUp" : value - base < 0 ? "ArrowDown" : "";
    const times = Math.abs(value - base);
    return {
      side,
      times,
    };
  }

  async fillLevels(page, tries) {
    console.log("Writing levels...");
    const levelsButton = await page.$x(
      '//*[@id="main"]/div/div/section/div[2]/form/section/div[2]/div/div[2]/button'
    );
    await levelsButton[0].click();

    await page.waitForSelector('input[placeholder="Speed"]');
    await page.focus('input[placeholder="Speed"]');
    await page.keyboard.type("Tries", { delay: 25 });

    await page.waitForTimeout(2000);
    const maxInputs = await page.$$('input[placeholder="Max"]');
    await maxInputs[0].focus();
    await page.keyboard.press("ArrowUp");

    await page.waitForTimeout(2000);
    const minInputs = await page.$$('input[placeholder="Min"]');
    await minInputs[0].focus();

    const { side, times } = this.getSideNTries(3, parseInt(tries));
    const promises = [...Array(times).keys()].map(() =>
      page.keyboard.press(side)
    );
    await Promise.all(promises);

    await page.waitForTimeout(2000);
    const saveButton = await page.$x(
      '//button[@type="button" and contains(.,"Save")]'
    );
    await saveButton[0].click();
    console.log("Writing levels completed...");
  }

  async fillStats(page, statistics) {
    console.log("Writing statistics...");
    const levelsButton = await page.$x(
      '//*[@id="main"]/div/div/section/div[2]/form/section/div[3]/div/div[2]/button'
    );
    await levelsButton[0].click();

    await page.waitForSelector('input[placeholder="Speed"]');
    const addMore = await page.$x(
      '//button[@type="button" and contains(.,"Add more")]'
    );
    await addMore[0].click();
    await addMore[0].click();

    await page.waitForTimeout(2000);
    const nameInputs = await page.$$('input[placeholder="Speed"]');
    await nameInputs[0].focus();
    await page.keyboard.type("Black", { delay: 25 });
    await nameInputs[1].focus();
    await page.keyboard.type("Green", { delay: 25 });
    await nameInputs[2].focus();
    await page.keyboard.type("Yellow", { delay: 25 });

    await page.waitForTimeout(2000);
    const maxInputs = await page.$$('input[placeholder="Max"]');
    await maxInputs[0].focus();
    const promisesOne = [...Array(25).keys()].map(() =>
      page.keyboard.press("ArrowUp")
    );
    await Promise.all(promisesOne);
    await maxInputs[1].focus();
    const promisesTwo = [...Array(25).keys()].map(() =>
      page.keyboard.press("ArrowUp")
    );
    await Promise.all(promisesTwo);
    await maxInputs[2].focus();
    const promiseThree = [...Array(25).keys()].map(() =>
      page.keyboard.press("ArrowUp")
    );
    await Promise.all(promiseThree);

    await page.waitForTimeout(2000);
    const minInputs = await page.$$('input[placeholder="Min"]');
    await minInputs[0].focus();
    const blackSides = this.getSideNTries(3, parseInt(statistics.blackBlocks));
    const promiseOne = [...Array(blackSides.times).keys()].map(() =>
      page.keyboard.press(blackSides.side)
    );
    await Promise.all(promiseOne);
    await minInputs[1].focus();
    const greenSides = this.getSideNTries(3, parseInt(statistics.greenBlocks));
    const promiseTwo = [...Array(greenSides.times).keys()].map(() =>
      page.keyboard.press(greenSides.side)
    );
    await Promise.all(promiseTwo);
    await minInputs[2].focus();
    const yellowSide = this.getSideNTries(3, parseInt(statistics.yellowBlocks));
    const promisesThree = [...Array(yellowSide.times).keys()].map(() =>
      page.keyboard.press(yellowSide.side)
    );
    await Promise.all(promisesThree);

    await page.waitForTimeout(2000);
    const saveButton = await page.$x(
      '//button[@type="button" and contains(.,"Save")]'
    );
    await saveButton[0].click();
    console.log("Writing statistics completed...");
  }

  getLevelsList(trait) {
    return {
      trait: trait.split("\n").at(0),
      values: trait.split("\n").at(-1).split(" of "),
    };
  }

  async checkNumericTraits(page, tries, statistics) {
    const numericTraits = await page.$$('div[class="NumericTrait--label"]');
    const promises = numericTraits.map((element) => {
      return page.evaluate((el) => el.innerText, element);
    });
    const numericTexts = await Promise.all(promises);

    if (numericTexts.length !== 4)
      throw new Error("One of numeric traits are missing");

    const tryLevels = this.getLevelsList(numericTexts[0]);
    const black = this.getLevelsList(numericTexts[1]);
    const green = this.getLevelsList(numericTexts[2]);
    const yellow = this.getLevelsList(numericTexts[3]);

    if (
      tryLevels.trait !== "Tries" ||
      tryLevels.values[0] !== tries ||
      tryLevels.values[1] !== "6"
    )
      throw new Error(`Tries do not match`);

    if (
      black.trait !== "Black" ||
      black.values[0] !== statistics.blackBlocks ||
      black.values[1] !== "30"
    )
      throw new Error(`Black blocks do not match`);

    if (
      green.trait !== "Green" ||
      green.values[0] !== statistics.greenBlocks ||
      green.values[1] !== "30"
    )
      throw new Error(`Green blocks do not match`);

    if (
      yellow.trait !== "Yellow" ||
      yellow.values[0] !== statistics.yellowBlocks ||
      yellow.values[1] !== "30"
    )
      throw new Error(`Yellow blocks do not match`);

    console.log(`Numeric traits metadata check completed...`);
  }

  async run(imageFilePath, metadata) {
    console.log("OpenSeaRobot waking up...");
    console.log("Launching Dappeteer...");
    console.log(`imageFilePath: ${imageFilePath}`);
    console.log(`metadata: ${JSON.stringify(metadata)}`);
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
    await this.fillLevels(page, metadata.tries);
    await this.fillStats(page, metadata.statistics);
    await this.checkNumericTraits(page, metadata.tries, metadata.statistics);

    console.log(`Minting NFT: ${metadata.name}...`);
    const createButton = await page.$x('//button[contains(., "Create")]');
    await createButton[0].click();

    console.log("Waiting for success popup...");
    await page.waitForSelector(
      "div.AssetSuccessModalContentreact__DivContainer-sc-1vt1rp8-1"
    );
    await page.waitForTimeout(10000);
    console.log("Successfully minted the NFT...");

    const assetURL = page.url();
    await browser.close();
    console.log("Dappeteer closed...");
    this.cleanUp(imageFilePath);
    console.log("OpenSeaRobot going to sleep now...");
    return assetURL;
  }

  cleanUp(imageFilePath) {
    fs.rmSync(imageFilePath);
  }
}

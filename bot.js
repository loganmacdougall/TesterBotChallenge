import puppeteer from 'puppeteer';

let bot_running = false
const options = process.env.SYSTEM == "DOCKER" ?
{ headless: true,
  defaultViewport: null,
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox'] }
: {headless: true}

function is_bot_running() {
  return bot_running
}

function try_bot_launch(onRunning, onNotRunning) {
  if (bot_running) {
    return false
  }

  bot_launch(onRunning, onNotRunning)
  return true
}

async function bot_launch(onRunning, onNotRunning) {
  bot_running = true
  onRunning()
  let browser

  try {
    browser = await puppeteer.launch(options)
    const page = await browser.newPage();

    const type_message = async (msg) => {
      await page.locator('#chatbox').fill(msg);
      await page.click('#chatsend');
    }

    await page.goto(`http://localhost:3000?key=${process.env.KEY}`);

    await delay(2000)
    await type_message("Hello, I am tester bot.")
    await delay(2000)
    await type_message("I'm connected to the website just like you are.")
    await delay(2000)
    await type_message("Except the difference is, I have the real flag, unlike the fake flag on your page.")
    await delay(2000)
    await type_message("A flag so close and yet so far, it must be difficult for you.")
    await delay(2000)
    await type_message("Anyway, I'm off now. Best of luck or whatever.")
    await delay(2000)

  } catch (err) {
    console.log(err)
  } finally {
    await browser.close();
    bot_running = false
    onNotRunning()
  }
}

function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}


export {
  is_bot_running, try_bot_launch
}
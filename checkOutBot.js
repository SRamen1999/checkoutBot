const puppeteer = require('puppeteer')
const nodemailer = require('nodemailer');
const prompt = require("prompt-sync")();

// varibales that hold the users checkout info
let rand_url = '';
let notificationEmail= '';
let notificationEmail_password = '';
let firstName = '';
let lastName = '';
let address = '';
let city = '';
let state = '';
let zipcode = '';
let emailAddress = '';
let phoneNumber = '';
let credit_or_debit_number= '';
let credit_or_debit_expiration_date = '';
let credit_or_debit_expiration_year = '';
let credit_or_debit_security_code = '';

//https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p?skuId=6426149;
//https://www.bestbuy.com/site/marvels-spider-man-miles-morales-standard-launch-edition-playstation-5/6430146.p?skuId=6430146;


async function initBrowser(){
    //const browser = await puppeteer.launch({headless: false, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
    //const browser = await puppeteer.launch({headless: false});
    const browser = await puppeteer.launch(
        {
            defaultViewport: null,
            headless: false
        });
    const page = await browser.newPage();
    await page.goto(rand_url);
    return page;
}

async function sendEmail() {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: notificationEmail,
        pass: notificationEmail_password    
        }
    });

    var mailOptions = {
        from: notificationEmail,
        to: notificationEmail,
        subject: 'Just purchased the product!',
        text: 'That was easy!',
        html: `<a href=\"${rand_url}\">Link</a>`
      };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

async function checkStock(page){
    //"availability":"http://schema.org/InStock" string that tells if the item is in stock 
    await page.reload();

    //grab the content of the page
    let ourSubstring = "availability\":\"http://schema.org/InStock"

    // get the html data from the page
    let content = await page.evaluate(() => document.body.innerHTML);

    // check if it is in stock
    if (content.includes(ourSubstring)) {
        console.log("In Stock!")
        checkout(page)
        return true;

    } else {
        console.log("Not In Stock.");
        await page.waitForTimeout(15000)
        return false;
    }
    
}

async function monitor(){
    const page = await initBrowser();
    var InStock = false;

    while(!InStock){
        InStock = await checkStock(page);
    }

}

async function addToCart(page){
    // add to cart button
    await page.$eval("button[class='c-button c-button-primary c-button-lg c-button-block c-button-icon c-button-icon-leading add-to-cart-button']", elem => elem.click());
    await page.waitForTimeout(2000)

    // go to cart button
    await page.$eval("[class='c-button c-button-secondary c-button-sm c-button-block ']", elem => elem.click());
    await page.waitForTimeout(5000)

    // check out button
    await page.$eval("button[class='btn btn-lg btn-block btn-primary']", elem => elem.click());
    await page.waitForTimeout(5000)

    // continue as guest button
    await page.$eval("button[class='c-button c-button-secondary c-button-lg cia-guest-content__continue guest']", elem => elem.click());
    await page.waitForTimeout(5000)
}

async function delivery(page){
    await page.waitForTimeout(5000)
    //first name
    await page.type("input[autocomplete='given-name'", firstName);

    //last name
    await page.type("input[autocomplete='family-name'", lastName);

    // address
    await page.type("input[autocomplete='address-line1'", address);

    // city
    await page.type("input[autocomplete='address-level2'", city);

    // state
    await page.select("select[autocomplete='address-level1'", state);

    // zipcode
    await page.type("input[autocomplete='postal-code'", zipcode);

    // email address
    await page.type("input[id='user.emailAddress'", emailAddress);

    // phone number
    await page.type("input[id='user.phone'", phoneNumber);

    // text me notification button
    const textMe = await page.$("input[id='text-updates'");
    textMe.click();

    // continue to payment
    await page.$eval("button[class='btn btn-lg btn-block btn-secondary']", elem => elem.click());

    // enter credit or debit card
    await page.waitForTimeout(5000)
    await page.type("[autocomplete='cc-number'", credit_or_debit_number);

    //expiration Date
    await page.select("[name='expiration-month'", credit_or_debit_expiration_date);

    // year
    await page.select("[name='expiration-year'", credit_or_debit_expiration_year);

    // security code
    await page.type("[id='credit-card-cvv'", credit_or_debit_security_code);

    //place your order button
    await page.$eval("button[class='btn btn-lg btn-block btn-primary']", elem => elem.click());
}

async function checkout(page){
    await addToCart(page);
    await delivery(page);
    await sendEmail();
    await page.waitForTimeout(15000)
    process.exit(1);
}

function main() {
    rand_url = prompt("What is the url of the product?");
    notificationEmail = prompt("What is the email address you want to use to send notifcations?");
    notificationEmail_password = prompt("What is email address password?");
    console.log("Enter the following checkout information.")
    firstName = prompt("What is your first name? ");
    lastName = prompt("What is your last name? ");
    address = prompt("What is your address? ");
    city = prompt("What city do you live in? ");
    state = prompt("What state are you in? ");
    zipcode = prompt("What is your zipcode? "); 
    emailAddress = prompt("What is your email address? ");
    phoneNumber = prompt("What is your phone number? ");
    credit_or_debit_number = prompt("What is your credit/debit card number? ");
    credit_or_debit_expiration_date = prompt("What is your credit/debit card expiration date? ");
    credit_or_debit_expiration_year = prompt("What is your credit/debit card expiration year? ");
    credit_or_debit_security_code = prompt("What is your credit/debit card security code? "); 
    monitor();
}
  
main();

# checkoutBot

# packages you need to install

puppeteer\
nodemailer\
prompt-sync\

you can install them by writing npm install <package_name> on your terminal

# How to use the program
This program only works with items found in Best Buy.\
the program will as you to enter some crucial information before checking out the item\

you need to enter the url of the product found on Best Buy.\
you need to enter a gmail address and the gmail's password so nodemailer can send\
you emails notifing if the product is purchased.\

the rest of the information that needs to be entered is the users checkout info. \
These include\

firstName\
lastName\
address\
city\
state\
zipcode\
emailAddress\
phoneNumber\
credit or debit card number\
credit or debit card expiration month\
credit or debit card expiration year\
credit or debit card security code\

After entering all this information the program will check if the product is in stock. If it is then it will\
procede to buy it. If it is not in stock it will continously check to see if the product is in stock\
after every 15 seconds.

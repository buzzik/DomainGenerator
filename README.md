# DomainGenerator
Created to generate banch of domains from two word-lists. And check those domains via Godaddy API for aviability and price.
It takes as input two txt files with '\n' separated word-lists.

Optionaly you can choose in CLI:
 - Maximum domain length (without domain zone e.g. .com)
 - Maximum first part length (by default its flexible and limited only with domain length option)
 - Domain Zone
 - Recursive generation. By default app takes words from input_1.txt and put it as first part of the domain. With this option you can also get domains with "main" word in the end


## Installing
It's simple. Just clone the repository:

```
git clone https://github.com/buzzik/DomainGenerator`
```
Install app
```
cd DomainGenerator
npm install
```
Rename credentials.js.sample to credentials.js 
```
cp credentials.js.sample credentials.js
```
and fill it with you credentials to [Godaddy API](https://developer.godaddy.com/keys) (secret and key)

## Usage
Fill txt files input_1.txt and input_2.txt with your words list and run app
```
node app.js
```
After app finishes you can find your result in /result/ folder

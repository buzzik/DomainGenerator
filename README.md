# DomainGenerator
Created to generate banch of domains from two word-lists. And check those domains via Godaddy API for aviability and price.
It takes as input two txt files with '\n' separated word-lists.

Optionaly you can choose in CLI:
 - Maximum domain length (without domain zone e.g. ".com")
 - Maximum first part length (by default it's flexible and limited only with domain length option minus one)
 - Domain Zone
 - Recursive concatination. By default app takes words from input_1.txt and put it as first part of the domain. With this option you can also get domains with "main-word" in the end


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

## Usage
Fill txt files input_1.txt and input_2.txt with your words list and run app
```
node app.js
```
if you decide to check domains with GoDaddy in process of generation, you will want to provide your credentials from  [Godaddy API](https://developer.godaddy.com/keys) (secret and key).
After app finishes you can find your result in /result/ folder

const fs = require('fs')
const http = require('http')
const qs = require('querystring')
const cache = {}

// Function that takes a letter, and filters all animals from animals.txt to the ones that start with animalLetter
// Then writes to a newfile including all of those animals
function selectAnimals(animalString, animalLetter) {
  return animalString
    .split('\n')
    .filter(animal => animal.startsWith(animalLetter))
    .join('\n')
}
//
// const animalLetter = process.argv[2].toUpperCase()
//
// fs.readFile('./animals.txt', 'utf-8', (err, data) => {
//   if (err) {
//     console.log(err)
//     return
//   }
//   const animals = selectAnimals(data, animalLetter)
//
//   fs.writeFile(`${animalLetter}_animals.txt`, animals, err => {
//     if (err) {
//       console.log(err)
//       return
//     }
//     console.log(`successfully created ${animalLetter}_animals.txt`)
//   })
// })

// Nodemon Server code
const server = http.createServer((req, res) => {
  const query = req.url.split('?')[1];
  console.log(query)
  if (query !== undefined) {
    const animalLetter = qs.parse(query).letter.toUpperCase();

    if (cache[animalLetter] !== undefined) {
      res.end(cache[animalLetter]);
    }

    if (animalLetter !== undefined) {
      fs.readFile('./animals.txt', 'utf-8', (err, data) => {
        if (err) {
          console.error(err)
          res.end('Sorry, there was an error processing your request');
          return
        }
        const animals = selectAnimals(data, animalLetter);
        cache[animalLetter] = animals;
        res.end(animals);
      });
    } else {
      if (cache['animals'] !== undefined) {
        res.end(cache['animals']);
      }
      fs.readfile('./animals.txt', 'utf-8', (err, data) => {
        if (err) {
          console.log(err)
          res.end("Sorry, there was an error processing your request");
          return
        }
        cache['animals'] = data
        res.end(data);
      })
    }
  }
});


server.listen(8000, () => console.log("I'm listening on port 8000!"));

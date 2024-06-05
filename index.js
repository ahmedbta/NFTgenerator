const basePath = process.cwd();
const { startCreating, buildSetup } = require(`${basePath}/src/main.js`);
var express = require('express');
var cors = require('cors');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var generatorRouter = require('./routes/GeneratorRouter');
var path = require('path');
const { specs, swaggerUi } = require('./swagger'); 


var app = express();
app.use(cors()) ;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use('/', generatorRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/generate-unique-nft', generatorRouter); 


app.post('/generate-nfts', async (req, res) => {
  console.log('Received request body:', req.body);

  const desiredEditionSize = parseInt(req.body.growEditionSizeTo);

  if (isNaN(desiredEditionSize) || desiredEditionSize <= 0) {
    return res.status(400).json({ message: 'Invalid edition size. Please provide a positive integer.' });
  }

  try {
    const idList = await startCreating(desiredEditionSize);
    return res.json({ message: 'Generation has been done successfully!', idlist: idList });
  } catch (error) {
    console.error('Error generating NFTs:', error);
    return res.status(500).json({ message: 'Error generating NFTs. Please try again later.' });
  }
});







const port = 3000;


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
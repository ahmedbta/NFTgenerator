    var express = require('express');
    var router = express.Router();
    const basePath = process.cwd();
    const { startCreating, buildSetup } = require(`${basePath}/src/main.js`);

    /**
     * @swagger
     * /:
     *   get:
     *     summary: Start generating and return the list of generated IDs.
     *     description: Initiates the generation process and returns the list of generated IDs.
     *     responses:
     *       200:
     *         description: Generation has been done successfully. Returns the list of generated IDs.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   description: A success message.
     *                 idlist:
     *                   type: array
     *                   items:
     *                     type: string
     *                   description: List of generated IDs.
     *       500:
     *         description: An error occurred during generation.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   description: An error message.
     * 
     * */

    router.get('/', async function(req, res) {
        try {
          const editionSize = parseInt(req.query.growEditionSizeTo);
          const defaultEditionSize = 50;
          const desiredEditionSize = isNaN(editionSize) ? defaultEditionSize : editionSize;
          await buildSetup();
          const idlist = await startCreating(desiredEditionSize);
          return res.status(200).send({ message: "Generation has been done successfully!", idlist });
        } catch (error) {
          return res.status(500).send({ message: "An error has occurred!" });
        }
      });


    /**
     * @swagger
     * /generate-nfts:
     *   post:
     *     summary: Generate NFTs with desired edition size.
     *     description: Initiates the generation process and returns the list of generated IDs for the desired edition size.
     *     parameters:
     *       - in: query
     *         name: growEditionSizeTo
     *         required: true
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: The desired edition size for generating NFTs.
     *     responses:
     *       200:
     *         description: Generation has been done successfully. Returns the list of generated IDs.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   description: A success message.
     *                 idlist:
     *                   type: array
     *                   items:
     *                     type: string
     *                   description: List of generated IDs.
     *       400:
     *         description: Invalid edition size. Please provide a positive integer.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   description: An error message.
     *       500:
     *         description: An error occurred during generation.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   description: An error message.
     * 
     * */

    router.post('/generate-nfts', async function(req, res){
        try {
            const editionSize = parseInt(req.query.growEditionSizeTo);
            console.log('Received edition size:', editionSize); 
    
            if (isNaN(editionSize) || editionSize <= 0) {
                return res.status(400).send({ message: "Invalid edition size. Please provide a positive integer." });
            }
            await buildSetup();
            const idlist = await startCreating(editionSize); 
            return res.status(200).send({ message: "Generation has been done successfully!", idlist });
        } catch (error) {
            return res.status(500).send({ message: "An error has occurred!" });
        }
    });


/**
 * @swagger
 * /generate-unique-nft:
 *   get:
 *     summary: Generate a unique NFT with the desired layers.
 *     description: Generates a unique NFT with the specified layers (Background, LeftEye, RightEye, Mouth).
 *     parameters:
 *       - name: Background
 *         in: query
 *         description: The name of the background layer image (PNG).
 *         required: true
 *         schema:
 *           type: string
 *         example: background.png
 *       - name: LeftEye
 *         in: query
 *         description: The name of the LeftEye layer image (PNG).
 *         required: true
 *         schema:
 *           type: string
 *         example: left_eye.png
 *       - name: RightEye
 *         in: query
 *         description: The name of the RightEye layer image (PNG).
 *         required: true
 *         schema:
 *           type: string
 *         example: right_eye.png
 *       - name: Mouth
 *         in: query
 *         description: The name of the Mouth layer image (PNG).
 *         required: true
 *         schema:
 *           type: string
 *         example: M2.png
 *     responses:
 *       200:
 *         description: Generation has been done successfully. Returns the generated NFT image.
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid layer names. Please provide valid PNG image names for all layers.
 *       500:
 *         description: An error occurred during generation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 * 
 */
router.get('/generate-unique-nft', async function (req, res) {
    try {
      const background = req.query.Background;
      const leftEye = req.query.LeftEye;
      const rightEye = req.query.RightEye;
      const mouth = req.query.Mouth;
  
      if (!background || !leftEye || !rightEye || !mouth) {
        return res.status(400).json({ message: 'Please provide all layer names: Background, LeftEye, RightEye, Mouth' });
      }
        const layersOrder = [
        { name: 'Background', selectedElement: `${basePath}/layers/Background/${background}` },
        { name: 'LeftEye', selectedElement: `${basePath}/layers/LeftEye/${leftEye}` },
        { name: 'RightEye', selectedElement: `${basePath}/layers/RightEye/${rightEye}` },
        { name: 'Mouth', selectedElement: `${basePath}/layers/Mouth/${mouth}` },
      ];
      await buildSetup();
      const idList = await startCreating(layersOrder); 
      return res.status(200).json({ message: 'Generation has been done successfully!', idlist: idList });
    } catch (error) {
      console.error('Error generating NFTs:', error);
      return res.status(500).json({ message: 'Error generating NFTs. Please try again later.' });
    }
  });
  
  
    module.exports = router;

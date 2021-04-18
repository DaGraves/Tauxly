const functions = require('firebase-functions');
const Verifier = require('google-play-billing-validator');
const credentials = require('./credentials.json');

exports.validateReceiptAndroid = functions.https.onRequest(
  async (request, response) => {
    try {
      if (request.method !== 'POST') {
        return response
          .status(405)
          .send('HTTP Method ' + request.method + ' not allowed');
      }

      console.log(request.body);

      const {purchaseToken} = JSON.parse(request.body.purchaseToken);
      if (purchaseToken) {
        const options = {
          email: credentials.client_email,
          key: credentials.private_key,
        };

        const verifier = new Verifier(options);

        let receipt = {
          packageName: 'com.taully',
          productId: 'photo_submission_100',
          purchaseToken,
        };

        console.log('RECEIPT', receipt);

        const data = await verifier.verifyINAPP(receipt);
        console.log(data);
        if (data.isSuccessful) {
          return response.status(200).send({isSuccessful: true});
        }
      }

      return response
        .status(500)
        .send({error: 'Validation failed!', isSuccessful: false});
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  },
);

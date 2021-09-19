
const path = require("path")
var FormData = require('form-data');
var fs = require('fs');
var QRReader = require('qrcode-reader');
var jimp = require("jimp");

module.exports = (on, config) => {
  on("task", {
    readQRCode: readQRCode
  });
  on("task", {
    generateOTP: require("cypress-otp")
  });
  
  
  return config;
}

function axiosSingleFileUpload() {
  const filePath = path.join(__dirname, "../fixtures/Yey.jpg")
  var data = new FormData();
  data.append('operations', '{"query":"mutation($file:Upload!) {singleUploadFile(file: $file){url}}"}');
  data.append('map', '{"0": ["variables.file"]}');
  data.append('0', fs.createReadStream(filePath));

  var config = {
    method: 'post',
    url: 'http://localhost:4000/graphql',
    headers: {
      ...data.getHeaders()
    },
    data: data
  };

  return new Promise(async (resolve, reject) => {
    const response = await axios(config)
    const respBody = await JSON.stringify(response.data)
    resolve(respBody);
  })
}

const readQRCode = async (filePath) => {
  const fp = path.join(__dirname, filePath)
  try {
    if (fs.existsSync(fp)) {
      const img = await jimp.read(fs.readFileSync(fp));
      const qr = new QRReader();
      const value = await new Promise((resolve, reject) => {
        qr.callback = (err, v) => err != null ? reject(err) : resolve(v);
        qr.decode(img.bitmap);
      });
      return value.result;
    }
  } catch (error) {
    return error.message
  }
}

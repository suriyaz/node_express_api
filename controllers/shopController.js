const fs = require("fs");
const path = require("path");
const uuidv4 = require("uuid");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);
const { Storage } = require("@google-cloud/storage");
const stream = require("stream");
const config = require("../config/index");

const Shop = require("../models/shop");
const Menu = require("../models/menu");

exports.index = async (req, res, next) => {
  // get data ที่จะเอา
  const shops = await Shop.find()
    .select("name photo location")
    .sort({ _id: -1 });

  const shopWithPhotoDomain = await shops.map((shop, index) => {
    return {
      id: shop._id,
      name: shop.name,
      photo: config.DOMAIN + "/images/" + shop.photo, //localhost
      // photo: config.DOMAIN_GOOGLE_STORAGE + '/' + shop.photo, //Google
      location: shop.location,
    };
  });

  res.status(200).json({
    data: shopWithPhotoDomain,
  });
};

// Get menu
exports.menu = async (req, res, next) => {
  // const menu = await Menu.find();
  // const menu = await Menu.find().select(' +name -price '); // 1.
  // const menu = await Menu.find().where('price').gte(200).sort('_id'); // 2/
  // const menu = await Menu.find({ price: {$gte:200} }); // 3.

  const menu = await Menu.find()
    .populate("shop", "name location -_id")
    .sort("-_id");

  res.status(200).json({
    data: menu,
  });
};

// Get shop by id with menu
exports.getShopWithMenu = async (req, res, next) => {
  const { id } = req.params;

  const shopWithMenu = await Shop.findById(id).populate("menus");

  res.status(200).json({
    data: shopWithMenu,
  });
};

// create shop
exports.createShop = async (req, res, next) => {
  const { name, location, photo } = req.body;

  let shop = new Shop({
    name: name,
    location: location,
    photo: await saveImageToDisk(photo),
    // photo: await saveImageToGoogle(photo)
  });

  await shop.save();

  res.status(201).json({
    message: "success",
  });
};

async function saveImageToDisk(baseImage) {
  //หา path จริงของโปรเจค
  const projectPath = path.resolve("./");
  //โฟลเดอร์และ path ของการอัปโหลด
  const uploadPath = `${projectPath}/public/images/`;

  //หานามสกุลไฟล์
  const ext = baseImage.substring(
    baseImage.indexOf("/") + 1,
    baseImage.indexOf(";base64")
  );

  //สุ่มชื่อไฟล์ใหม่ พร้อมนามสกุล
  let filename = "";
  if (ext === "svg+xml") {
    filename = `${uuidv4.v4()}.svg`;
  } else {
    filename = `${uuidv4.v4()}.${ext}`;
  }

  //Extract base64 data ออกมา
  let image = decodeBase64Image(baseImage);

  //เขียนไฟล์ไปไว้ที่ path
  await writeFileAsync(uploadPath + filename, image.data, "base64");
  //return ชื่อไฟล์ใหม่ออกไป
  return filename;
}

async function saveImageToGoogle(baseImage) {
  //หา path จริงของโปรเจค
  const projectPath = path.resolve("./");

  //หานามสกุลไฟล์
  const ext = baseImage.substring(
    baseImage.indexOf("/") + 1,
    baseImage.indexOf(";base64")
  );
  // console.log(ext);

  //สุ่มชื่อไฟล์ใหม่ พร้อมนามสกุล
  let filename = "";
  if (ext === "svg+xml") {
    filename = `${uuidv4.v4()}.svg`;
  } else {
    filename = `${uuidv4.v4()}.${ext}`;
  }

  //Extract base64 data ออกมา
  let image = decodeBase64Image(baseImage);

  const bufferStream = new stream.PassThrough();
  bufferStream.end(Buffer.from(image.data, "base64"));

  // Creates a client and upload to storage
  const storage = new Storage({
    projectId: "enhanced-idiom-112215",
    keyFilename: `${projectPath}/key.json`,
  });

  const myBucket = storage.bucket("node_api_file");
  var newFilename = myBucket.file(filename);
  bufferStream.pipe(
    newFilename
      .createWriteStream({
        gzip: true,
        contentType: image.type,
        metadata: {
          // Enable long-lived HTTP caching headers
          // Use only if the contents of the file will never change
          // (If the contents will change, use cacheControl: 'no-cache')
          cacheControl: "public, max-age=31536000",
        },
        public: true,
        validation: "md5",
      })
      .on("error", (err) => {
        console.log("err =>" + err);
      })
      .on("finish", () => {
        console.log("upload successfully...");
      })
  );

  //return ชื่อไฟล์ใหม่ออกไป
  return filename;
}

function decodeBase64Image(base64Str) {
  var matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var image = {};
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string");
  }

  image.type = matches[1];
  image.data = matches[2];

  return image;
}

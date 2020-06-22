const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Contact = require("../../models/Contact");
const multer = require("multer");
//save image in node server

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploadsContact/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  //   fileFilter: (req, file, cb) => {
  //     if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
  //       cb(null, true);
  //     }
  //     return cb(null, false, new Error("fjzefzfze"));
  //   },
});

var upload = multer({ storage: storage }).single("file");

router.post("/add", [ check("name", "veuillez saisir votre nom").not().isEmpty(),
check("email", "veuillez entrer le nom de votre email").not().isEmpty(),
check("sujet", "veuillez entrer le nom de votre   sujet").not().isEmpty(),

check("message", "veuillez saisir la message").not().isEmpty(),],(req, res) => {
const errors = validationResult(req)
if(!errors.isEmpty()){
  return res.json({errors:errors.array()})
}
const {name,email,sujet,file,message,date} = req.body
const newcontact = new Contact({
  name,email,sujet,file,message,date
})
newcontact.save()
.then((name)=> res.json(name))
.catch(err=>console.log(err.message))
});
router.get("/",  (req, res) => {
  Contact.find({})
    .then((contact) => res.json(contact))
    
});
module.exports = router;
router.delete("/:id", (req, res) => {
  Contact.findById(req.params.id)
    .then((contact) => {
      if (!contact) {
        return res.json({ msg: "event not find" });
      }  else {
        Contact.findByIdAndDelete(
          req.params.id,

          { useFindAndModify: false },
          (err, data) => {
            res.json({ msg: "contact deleted" });
          }
        );
      }
    })
    .catch((err) => console.log(err.message));
});